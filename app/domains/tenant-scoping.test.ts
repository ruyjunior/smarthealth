import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/*
 * These tests read the source of the data layer instead of running it.
 *
 * Tenant isolation in this app is enforced by hand in every query and every
 * server action, which means a single forgotten `idclinic` predicate silently
 * reopens a cross-tenant hole that no unit test of a pure function would ever
 * catch. Parsing the files lets us assert the invariant for all of them at once.
 *
 * Server actions are public HTTP endpoints, so they must derive the clinic from
 * the session instead of accepting it as an argument.
 */

const ROOT = process.cwd();
const DOMAINS = join(ROOT, 'app/domains');

const READ_WRITE_SQL = /(INSERT INTO\s+smarthealth|UPDATE\s+smarthealth|DELETE FROM\s+smarthealth)/;
const SESSION_GUARD =
  /await\s+(requireManagerClinicId|requireManager|getCurrentClinicId|requireSessionUser)\(/;
const BINDS_CLINIC = /\$\{(idclinic|manager\.id)\}/;
const VALIDATES_CLIENT = /fetchClientById\(idclinic/;

/**
 * Consultas sem escopo de clínica por decisão explícita. Cada uma precisa de um
 * motivo — a allowlist existe para que a exceção seja visível, não para dar
 * margem a esquecimento.
 */
const GLOBAL_QUERY_ALLOWLIST: Record<string, string> = {
  // página inicial pública: vitrine dos clientes da plataforma, só título e logo
  fetchPublicClinicLogos: 'public landing page listing',
};

function walk(dir: string, match: (file: string) => boolean): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full, match);
    return match(full) ? [full] : [];
  });
}

function sourceFiles() {
  return walk(join(ROOT, 'app'), (file) => /\.tsx?$/.test(file) && !file.endsWith('.test.ts'));
}

function domainFiles(fileName: string) {
  return readdirSync(DOMAINS)
    .map((dir) => join(DOMAINS, dir, fileName))
    .filter((file) => existsSync(file));
}

function exportedFunctions(source: string) {
  return source
    .split(/\n(?=export (?:async )?function )/)
    .map((body) => ({
      name: /export (?:async )?function (\w+)/.exec(body)?.[1] ?? '',
      body,
    }))
    .filter((fn) => fn.name.length > 0);
}

const relative = (file: string) => file.slice(ROOT.length + 1);

describe('tenant isolation in server actions', () => {
  const actions = domainFiles('actions.ts');

  it('finds the action modules it is supposed to guard', () => {
    expect(actions.length).toBeGreaterThanOrEqual(9);
  });

  it('every mutation derives the clinic from the session', () => {
    const offenders: string[] = [];

    for (const file of actions) {
      for (const fn of exportedFunctions(readFileSync(file, 'utf8'))) {
        if (!READ_WRITE_SQL.test(fn.body)) continue;
        if (!SESSION_GUARD.test(fn.body)) offenders.push(`${relative(file)}::${fn.name}`);
      }
    }

    expect(offenders, 'mutations without a session-derived clinic guard').toEqual([]);
  });

  it('every mutation scopes the statement to that clinic', () => {
    const offenders: string[] = [];

    for (const file of actions) {
      for (const fn of exportedFunctions(readFileSync(file, 'utf8'))) {
        if (!READ_WRITE_SQL.test(fn.body)) continue;
        if (!BINDS_CLINIC.test(fn.body) && !VALIDATES_CLIENT.test(fn.body)) {
          offenders.push(`${relative(file)}::${fn.name}`);
        }
      }
    }

    expect(offenders, 'mutations that never bind the clinic').toEqual([]);
  });

  it('never trusts a clinic id submitted by the browser', () => {
    const offenders = sourceFiles()
      .filter(
        (file) =>
          readFileSync(file, 'utf8').includes("get('idclinic')") ||
          readFileSync(file, 'utf8').includes('name="idclinic"'),
      )
      .map(relative);

    expect(offenders, 'a form-supplied idclinic is forgeable').toEqual([]);
  });
});

describe('tenant isolation in queries', () => {
  it('every exported query takes the clinic, except the documented allowlist', () => {
    const offenders: string[] = [];

    for (const file of domainFiles('queries.ts')) {
      for (const fn of exportedFunctions(readFileSync(file, 'utf8'))) {
        if (GLOBAL_QUERY_ALLOWLIST[fn.name]) continue;
        const signature = fn.body.slice(0, fn.body.indexOf('{'));
        if (!signature.includes('idclinic')) offenders.push(`${relative(file)}::${fn.name}`);
      }
    }

    expect(offenders).toEqual([]);
  });

  it('keeps the allowlist honest', () => {
    const exported = domainFiles('queries.ts').flatMap((file) =>
      exportedFunctions(readFileSync(file, 'utf8')).map((fn) => fn.name),
    );

    for (const allowed of Object.keys(GLOBAL_QUERY_ALLOWLIST)) {
      expect(exported, `${allowed} está na allowlist mas não existe mais`).toContain(allowed);
    }
  });

  it('every by-id lookup actually constrains by clinic in its SQL', () => {
    const offenders: string[] = [];

    for (const file of domainFiles('queries.ts')) {
      for (const fn of exportedFunctions(readFileSync(file, 'utf8'))) {
        if (!fn.name.endsWith('ById')) continue;

        const signature = fn.body.slice(0, fn.body.indexOf('{'));
        const expectsId = /\bid: string/.test(signature);

        // A row fetched by primary key must also be constrained by the clinic,
        // and both parameters have to be used, not merely accepted.
        const scoped = fn.body.includes('${idclinic}') && (!expectsId || fn.body.includes('${id}'));

        if (!scoped) offenders.push(`${relative(file)}::${fn.name}`);
      }
    }

    expect(offenders, 'by-id lookups reachable with a URL-supplied id').toEqual([]);
  });

  it('uses the clinic parameter instead of accepting and ignoring it', () => {
    // A parameter that is declared but never bound into the SQL is how the
    // pagination and search bugs went unnoticed for so long.
    const offenders: string[] = [];

    for (const file of domainFiles('queries.ts')) {
      for (const fn of exportedFunctions(readFileSync(file, 'utf8'))) {
        const signature = fn.body.slice(0, fn.body.indexOf('{'));
        if (!signature.includes('idclinic')) continue;
        if (!fn.body.includes('${idclinic}')) offenders.push(`${relative(file)}::${fn.name}`);
      }
    }

    expect(offenders, 'queries with a dead clinic parameter').toEqual([]);
  });
});

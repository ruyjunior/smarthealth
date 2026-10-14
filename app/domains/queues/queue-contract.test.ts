import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { QUEUE_STATUSES } from './types';

/*
 * O DDL é aplicado à mão (o repositório não tem runner de migration), então o
 * CHECK de `queues.status` e a const `QUEUE_STATUSES` podem divergir sem que
 * nenhum teste de função pura perceba: o status novo passa nos testes e é
 * rejeitado pelo banco em produção. Estes testes leem o fonte das actions e o
 * SQL da migração para comparar os dois lados.
 */

const ROOT = process.cwd();
const QUEUES = join(ROOT, 'app/domains/queues');
const DDL = join(ROOT, 'db/migrations/0001_attendance.sql');
const PAIRING_DDL = join(ROOT, 'db/migrations/0002_device_pairing_codes.sql');
const SCOPED_TABLES = ['devices', 'queuecounters', 'queues', 'queueevents'];

const ddl = readFileSync(DDL, 'utf8');

const quotedLiterals = (text: string) => [...text.matchAll(/'([^']*)'/g)].map((match) => match[1]);

/** Literals handed to `status = '...'`, written or matched in a query. */
function assignedStatuses(source: string): string[] {
  return [...source.matchAll(/status\s*=\s*'([^']*)'/g)].map((match) => match[1]);
}

/**
 * Literals inside the VALUES of an INSERT into the given table. The status is
 * the only quoted value in those statements — the rest is `${...}` — and the
 * template literal ends at the first backtick, so the slice stops there.
 */
function insertedStatuses(source: string, table: string): string[] {
  return source
    .split(`INSERT INTO smarthealth.${table}`)
    .slice(1)
    .flatMap((chunk) => {
      const end = chunk.indexOf('`');
      return quotedLiterals(end < 0 ? chunk : chunk.slice(0, end));
    });
}

function referencedStatuses(): string[] {
  const sources = readdirSync(QUEUES)
    .filter((file) => file.endsWith('.ts') && !file.endsWith('.test.ts'))
    .map((file) => readFileSync(join(QUEUES, file), 'utf8'));

  return sources.flatMap((source) => [
    ...assignedStatuses(source),
    ...insertedStatuses(source, 'queues'),
    ...insertedStatuses(source, 'queueevents'),
  ]);
}

function createTableBlock(table: string): string {
  const block = new RegExp(
    `CREATE TABLE IF NOT EXISTS smarthealth\\.${table} \\(([\\s\\S]*?)\\n\\);`,
  ).exec(ddl);

  expect(block, `CREATE TABLE de ${table} não encontrado no DDL`).not.toBeNull();

  return block![1];
}

/** Values of the CHECK constraint on `queues.status`. */
function checkedQueueStatuses(): string[] {
  const check = /status\s+IN\s*\(([\s\S]*?)\)/.exec(createTableBlock('queues'));

  expect(check, 'CHECK de queues.status não encontrado no DDL').not.toBeNull();

  return quotedLiterals(check![1]);
}

describe('queue status contract', () => {
  it('finds the statuses the actions write', () => {
    const found = [...new Set(referencedStatuses())];

    expect(found).toContain('Aguardando');
    expect(found).toContain('Cancelada');
  });

  it('only writes statuses declared in QUEUE_STATUSES', () => {
    const declared = new Set<string>(QUEUE_STATUSES);
    const orphans = [...new Set(referencedStatuses())].filter((status) => !declared.has(status));

    expect(orphans, 'status gravado pelas actions e ausente de QUEUE_STATUSES').toEqual([]);
  });

  it('keeps the CHECK constraint and QUEUE_STATUSES as the same set', () => {
    expect(new Set(checkedQueueStatuses())).toEqual(new Set(QUEUE_STATUSES));
  });
});

describe('attendance migration', () => {
  it('creates every table the module needs', () => {
    for (const table of SCOPED_TABLES) {
      expect(ddl).toContain(`CREATE TABLE IF NOT EXISTS smarthealth.${table} (`);
    }
  });

  it('scopes every table by clinic', () => {
    for (const table of SCOPED_TABLES) {
      expect(createTableBlock(table), `${table} sem coluna idclinic`).toMatch(
        /idclinic\s+uuid\s+NOT NULL/,
      );
    }
  });

  it('types every id column as uuid, like the rest of the schema', () => {
    // As colunas equivalentes do schema existente (clients.id, types.id,
    // offices.id, users.id, *.idclinic) são uuid: uma coluna `text` aqui faz o
    // LEFT JOIN da fila falhar em produção com
    // "operator does not exist: text = uuid".
    const offenders = [...ddl.matchAll(/^\s*(\w*id\w*)\s+(text|integer|bigint)\b/gim)].map(
      (match) => match[0].trim(),
    );

    expect(offenders, 'coluna de id que não é uuid').toEqual([]);
  });

  it('keys the daily counter by clinic, day and prefix', () => {
    expect(createTableBlock('queuecounters')).toMatch(/PRIMARY KEY \(idclinic, day, prefix\)/);
  });

  it('is idempotent: no CREATE without IF NOT EXISTS', () => {
    const offenders = [
      ...ddl.matchAll(/CREATE\s+(?:UNIQUE\s+)?(?:TABLE|INDEX)\s+(?!IF NOT EXISTS)/g),
    ];

    expect(offenders, 'DDL reaplicado à mão precisa de IF NOT EXISTS em todo CREATE').toEqual([]);
  });
});

describe('device pairing code migration', () => {
  const pairingDdl = readFileSync(PAIRING_DDL, 'utf8');

  it('splits the short pairing code from the session token', () => {
    // O código curto é digitável num controle remoto; a credencial de sessão
    // continua sendo um token de 32 bytes, criado só no pareamento.
    expect(pairingDdl).toMatch(/ADD COLUMN IF NOT EXISTS pairingcodehash text/);
    expect(pairingDdl).toMatch(/ADD COLUMN IF NOT EXISTS pairingexpiresat timestamptz/);
    expect(pairingDdl).toMatch(/ALTER COLUMN token_hash DROP NOT NULL/);
    expect(pairingDdl).toMatch(
      /CREATE INDEX IF NOT EXISTS devices_pairingcodehash_idx[\s\S]*\(pairingcodehash\)/,
    );
  });

  it('is idempotent: every ADD COLUMN and CREATE guards itself', () => {
    const offenders = [
      ...pairingDdl.matchAll(/ALTER TABLE\s+\S+\s+ADD\s+COLUMN\s+(?!IF NOT EXISTS)/g),
      ...pairingDdl.matchAll(/CREATE\s+(?:UNIQUE\s+)?(?:TABLE|INDEX)\s+(?!IF NOT EXISTS)/g),
    ];

    expect(offenders, 'a migração é reaplicada à mão').toEqual([]);
  });

  it('indexes the pairing lookup by hash, never by the code itself', () => {
    // O código em texto claro não pode ser persistido nem indexado.
    expect(pairingDdl).not.toMatch(/ADD COLUMN IF NOT EXISTS pairingcode\b/);
  });
});

import { describe, expect, it } from 'vitest';
import {
  formatUpdatedAt,
  hasPendingLegalData,
  jurisdictionVenue,
  legalInfo,
  supplierIdentification,
  type LegalInfo,
} from './legal-info';

const FALLBACK_VENUE = 'o foro da comarca do domicílio do contratante';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Cópia dos dados reais com os campos opcionais preenchidos, sem mutar `legalInfo`. */
function withOptionalFields(fields: Partial<LegalInfo>): LegalInfo {
  return { ...legalInfo, ...fields };
}

describe('hasPendingLegalData', () => {
  it('não deixa nenhum placeholder TODO: chegar às páginas públicas', () => {
    expect(hasPendingLegalData()).toBe(false);

    const pending = Object.values(legalInfo).filter(
      (value) => typeof value === 'string' && value.startsWith('TODO:'),
    );
    expect(pending).toEqual([]);
  });
});

describe('supplierIdentification', () => {
  it('identifica o fornecedor com os dados reais, sem CNPJ nem endereço', () => {
    expect(supplierIdentification()).toBe('Autoric Automation');
    expect(supplierIdentification(legalInfo)).toBe('Autoric Automation');
  });

  it('não vaza undefined, TODO: nem pontuação solta nos dados reais', () => {
    const text = supplierIdentification();

    expect(text).not.toContain('undefined');
    expect(text).not.toContain('TODO:');
    expect(text).not.toContain('CNPJ');
    expect(text).not.toContain(',,');
    expect(text).not.toContain(', ,');
    expect(text.startsWith(',')).toBe(false);
    expect(text.endsWith(',')).toBe(false);
  });

  it('inclui CNPJ e endereço na ordem nome, CNPJ, endereço', () => {
    const info = withOptionalFields({
      cnpj: '12.345.678/0001-90',
      address: 'Av. Paulista 1000 - São Paulo/SP',
    });
    const text = supplierIdentification(info);

    expect(text).toBe(
      'Autoric Automation, CNPJ 12.345.678/0001-90, Av. Paulista 1000 - São Paulo/SP',
    );
    expect(text.indexOf('Autoric Automation')).toBeLessThan(text.indexOf('CNPJ'));
    expect(text.indexOf('CNPJ')).toBeLessThan(text.indexOf('Av. Paulista 1000'));
    expect(text.split(', ')).toHaveLength(3);
  });

  it('não deixa lacuna nem separador dobrado quando só o CNPJ está preenchido', () => {
    const info = withOptionalFields({ cnpj: '12.345.678/0001-90' });
    const text = supplierIdentification(info);

    expect(text).toBe('Autoric Automation, CNPJ 12.345.678/0001-90');
    expect(text).not.toContain('undefined');
    expect(text).not.toContain(',,');
    expect(text).not.toContain(', ,');
    expect(text.endsWith(',')).toBe(false);
  });

  it('não duplica o separador quando só o endereço está preenchido', () => {
    const info = withOptionalFields({ address: 'Av. Paulista 1000 - São Paulo/SP' });

    expect(supplierIdentification(info)).toBe(
      'Autoric Automation, Av. Paulista 1000 - São Paulo/SP',
    );
  });

  it('trata campos opcionais vazios ou undefined como ausentes', () => {
    expect(supplierIdentification(withOptionalFields({ cnpj: '', address: '' }))).toBe(
      'Autoric Automation',
    );
    expect(
      supplierIdentification(withOptionalFields({ cnpj: undefined, address: undefined })),
    ).toBe('Autoric Automation');
  });

  it('mantém o valor renderizado quando o campo opcional só tem espaços (comportamento atual)', () => {
    // Limite conhecido: uma string só com espaços é truthy e não é aparada.
    const info = withOptionalFields({ cnpj: '   ' });

    expect(supplierIdentification(info)).toBe('Autoric Automation, CNPJ    ');
  });

  it('não muta os dados exportados ao montar a identificação', () => {
    const before = { ...legalInfo };

    supplierIdentification(withOptionalFields({ cnpj: '00.000.000/0000-00', address: 'Rua X 1' }));
    supplierIdentification(withOptionalFields({ cnpj: '' }));

    expect(legalInfo).toEqual(before);
  });
});

describe('jurisdictionVenue', () => {
  it('usa o domicílio do contratante quando não há comarca eleita', () => {
    expect(jurisdictionVenue()).toBe(FALLBACK_VENUE);
    expect(jurisdictionVenue(legalInfo)).toBe(FALLBACK_VENUE);
  });

  it('usa a comarca informada quando ela existe', () => {
    const info = withOptionalFields({ jurisdiction: 'São Paulo/SP' });

    expect(jurisdictionVenue(info)).toBe('o foro da comarca de São Paulo/SP');
  });

  it('cai no fallback quando a comarca é uma string vazia', () => {
    expect(jurisdictionVenue(withOptionalFields({ jurisdiction: '' }))).toBe(FALLBACK_VENUE);
  });
});

describe('formatUpdatedAt', () => {
  it('formata a data de publicação em dd/MM/yyyy (pt-BR)', () => {
    const formatted = formatUpdatedAt();

    expect(formatted).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    expect(formatted).toBe('13/10/2026');
  });

  it('reflete a data declarada em legalInfo.updatedAt', () => {
    const [year, month, day] = legalInfo.updatedAt.split('-');

    expect(formatUpdatedAt()).toBe(`${day}/${month}/${year}`);
  });
});

describe('canais de contato', () => {
  it('expõe e-mails de suporte e privacidade em formato válido', () => {
    expect(legalInfo.supportEmail).toMatch(EMAIL_PATTERN);
    expect(legalInfo.privacyEmail).toMatch(EMAIL_PATTERN);
  });

  it('não deixa espaços nas pontas nem placeholder nos canais de contato', () => {
    for (const email of [legalInfo.supportEmail, legalInfo.privacyEmail]) {
      expect(email).toBe(email.trim());
      expect(email).not.toContain('TODO:');
      expect(email).not.toContain('undefined');
    }
  });
});

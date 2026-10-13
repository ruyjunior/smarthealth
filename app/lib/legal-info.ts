import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type LegalInfo = {
  serviceName: string;
  website: string;
  supplierName: string;
  supplierWebsite: string;
  supportEmail: string;
  privacyEmail: string;
  /** Preencher quando o CNPJ existir: o trecho é omitido enquanto ficar vazio. */
  cnpj?: string;
  /** Preencher quando o endereço existir: o trecho é omitido enquanto ficar vazio. */
  address?: string;
  /** Comarca do foro eleito. Vazio usa o domicílio do contratante. */
  jurisdiction?: string;
  updatedAt: string;
};

/**
 * Dados do fornecedor/controlador exibidos nas páginas legais públicas
 * (Política de Privacidade e Termos de Uso): a empresa desenvolvedora do
 * Smart Health App.
 *
 * Um campo obrigatório com o prefixo `TODO:` é renderizado literalmente para o
 * público e faz `hasPendingLegalData()` retornar `true`, mantendo visível o aviso
 * de revisão pendente em `LegalPage`. Os campos opcionais não geram trecho no
 * documento enquanto estiverem vazios.
 */
export const legalInfo: LegalInfo = {
  serviceName: 'Smart Health App',
  website: 'https://smarthealth.app.br',
  supplierName: 'Autoric Automation',
  supplierWebsite: 'https://www.autoric.com.br',
  supportEmail: 'autoricbr@gmail.com',
  privacyEmail: 'autoricbr@gmail.com',
  updatedAt: '2026-10-13',
};

const PENDING_PREFIX = 'TODO:';

/** True enquanto algum dado do fornecedor/controlador ainda for um `TODO:`. */
export function hasPendingLegalData(): boolean {
  return Object.values(legalInfo).some(
    (value) => typeof value === 'string' && value.startsWith(PENDING_PREFIX),
  );
}

/** Identificação do fornecedor sem lacunas visíveis: CNPJ e endereço só entram quando existirem. */
export function supplierIdentification(info: LegalInfo = legalInfo): string {
  const parts = [info.supplierName];

  if (info.cnpj) {
    parts.push(`CNPJ ${info.cnpj}`);
  }

  if (info.address) {
    parts.push(info.address);
  }

  return parts.join(', ');
}

/** Cláusula de foro: usa a comarca informada ou, na falta dela, o domicílio do contratante. */
export function jurisdictionVenue(info: LegalInfo = legalInfo): string {
  return info.jurisdiction
    ? `o foro da comarca de ${info.jurisdiction}`
    : 'o foro da comarca do domicílio do contratante';
}

/** Data de publicação dos documentos legais, no formato `dd/MM/yyyy` (pt-BR). */
export function formatUpdatedAt(): string {
  return format(parseISO(legalInfo.updatedAt), 'dd/MM/yyyy', { locale: ptBR });
}

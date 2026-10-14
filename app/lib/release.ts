/**
 * Novidades exibidas no aviso de nova versão.
 *
 * Módulo de dados puro (sem react/next) para poder ser testado em node e lido
 * tanto pelo aviso dentro do app quanto por qualquer outra tela que precise
 * anunciar a versão.
 *
 * Ao publicar uma versão nova, acrescente os dados aqui: a chave de dispensa
 * inclui a versão, então quem já fechou o aviso da versão anterior volta a vê-lo
 * — é o que faz o aviso "voltar" para sinalizar que algo mudou.
 */
export type ReleaseHighlight = {
  title: string;
  description: string;
};

export type Release = {
  version: string;
  title: string;
  summary: string;
  highlights: ReleaseHighlight[];
  /** Tela nova relacionada, quando existe. */
  path?: string;
  pathLabel?: string;
  /** Guia da Central de Ajuda que explica a novidade. */
  helpSlug?: string;
  helpLabel?: string;
  /** Data de publicação (AAAA-MM-DD). */
  date: string;
};

export const CURRENT_RELEASE: Release = {
  version: '1.1',
  title: 'Atendimento presencial: fila, totem e telão',
  summary:
    'A recepção agora organiza a espera do começo ao fim: o paciente tira a própria senha, a equipe chama pelo painel e o telão avisa quem foi chamado.',
  highlights: [
    { title: 'Totem', description: 'O paciente digita o CPF e escolhe o serviço.' },
    { title: 'Fila', description: 'Chame o próximo respeitando a preferência legal.' },
    { title: 'Telão', description: 'Senha, nome e sala, com aviso sonoro.' },
  ],
  path: '/fila',
  pathLabel: 'Abrir a fila',
  helpSlug: 'totem-e-telao',
  helpLabel: 'Como funciona',
  date: '2026-10-14',
};

/**
 * Chave de dispensa do aviso. Leva a versão no nome para que o fechamento valha
 * apenas para a versão anunciada: na próxima, o aviso reaparece.
 */
export function releaseStorageKey(release: Pick<Release, 'version'>): string {
  return `sh-release-${release.version}`;
}

/**
 * Conteúdo da Central de Ajuda.
 *
 * Módulo de dados puro (sem imports de react/next/domínios) para poder ser
 * testado em ambiente node e reutilizado no hub e nas páginas de tópico.
 */
export type HelpIconKey =
  | 'rocket'
  | 'dashboard'
  | 'calendar'
  | 'patients'
  | 'notes'
  | 'budget'
  | 'profile'
  | 'settings'
  | 'users'
  | 'finance';

export type HelpSection = {
  heading: string;
  body: string;
  steps?: string[];
  tips?: string[];
};

export type HelpTopic = {
  slug: string;
  title: string;
  summary: string;
  icon: HelpIconKey;
  /** Tópicos 'manager' aparecem apenas para usuários com perfil Gerente. */
  audience: 'all' | 'manager';
  /** Tela do app documentada pelo tópico, quando existe. */
  path?: string;
  sections: HelpSection[];
};

export const HELP_TOPICS: HelpTopic[] = [
  {
    slug: 'primeiros-passos',
    title: 'Primeiros passos',
    summary: 'Conheça o menu lateral e o que preparar antes do primeiro atendimento.',
    icon: 'rocket',
    audience: 'all',
    path: '/dashboard',
    sections: [
      {
        heading: 'Como o app está organizado',
        body: 'Tudo o que você usa no dia a dia fica no menu lateral, à esquerda: Dashboard, Orçamento, Agenda, Pacientes e Ajuda. Quem tem perfil Gerente vê também a área Gerência, onde ficam as configurações da clínica.',
        tips: [
          'Em telas pequenas o menu aparece recolhido: os itens ficam apenas com os ícones.',
          'O cartão do topo mostra a clínica ativa e a data/hora atual.',
        ],
      },
      {
        heading: 'Antes do primeiro atendimento',
        body: 'Uma clínica recém-criada precisa de alguns cadastros básicos para que Agenda, Fichas e Orçamento funcionem por completo.',
        steps: [
          'Cadastre os pacientes em Pacientes.',
          'Confira os produtos (especialidades e valores) em Gerência > Produtos.',
          'Cadastre os consultórios em Gerência > Consultórios.',
          'Monte os modelos de ficha em Gerência > Fichas.',
          'Libere o acesso da equipe em Gerência > Usuários.',
        ],
        tips: [
          'Os quatro últimos passos ficam na área Gerência e precisam do perfil Gerente.',
          'Cadastrar a clínica primeiro mantém os valores e as fichas consistentes.',
        ],
      },
      {
        heading: 'Dicas de navegação',
        body: 'Cada tela tem um título, uma trilha de navegação no topo e, quando faz sentido, um botão de ação à direita do cabeçalho.',
        tips: [
          'Use a trilha no topo para voltar a uma lista sem passar pelo menu.',
          'O cartão de usuário no rodapé do menu abre a tela Meu perfil.',
          'O botão Sair encerra a sessão — use-o em computadores compartilhados.',
        ],
      },
    ],
  },
  {
    slug: 'dashboard',
    title: 'Dashboard',
    summary: 'Acompanhe os atendimentos do dia, da semana e do mês em um só lugar.',
    icon: 'dashboard',
    audience: 'all',
    path: '/dashboard',
    sections: [
      {
        heading: 'Visão do dia, semana e mês',
        body: 'O Dashboard resume a agenda da clínica em três períodos: o dia de hoje, a semana atual e o mês atual. Os cartões de resumo trazem os totais e os gráficos mostram a distribuição dos atendimentos.',
      },
      {
        heading: 'Como usar no dia a dia',
        body: 'Use o Dashboard como ponto de partida da manhã para saber o que a clínica tem pela frente.',
        steps: [
          'Confira o cartão do dia para ver os atendimentos de hoje.',
          'Compare com a semana e o mês para entender o volume.',
          'Abra a Agenda quando precisar criar, editar ou concluir um atendimento.',
        ],
        tips: [
          'Se o período aparecer vazio, confira se os atendimentos foram registrados na Agenda.',
        ],
      },
    ],
  },
  {
    slug: 'agenda',
    title: 'Agenda e atendimentos',
    summary: 'Registre, visualize e edite os atendimentos da clínica.',
    icon: 'calendar',
    audience: 'all',
    path: '/services',
    sections: [
      {
        heading: 'Registrar um atendimento',
        body: 'O atendimento é o registro central do app: ele alimenta a Agenda, o Dashboard e o financeiro.',
        steps: [
          'Abra Agenda no menu lateral.',
          'Clique no botão de novo atendimento.',
          'Selecione o paciente, o produto/especialidade e o consultório.',
          'Escolha o profissional responsável e informe data e horários.',
          'Salve para o atendimento aparecer na agenda da clínica.',
        ],
      },
      {
        heading: 'Lista ou calendário',
        body: 'A tela Agenda alterna entre as abas Lista, ideal para conferir e editar registros, e Calendário, ideal para enxergar a distribuição dos horários na semana.',
        tips: ['Use a aba Calendário para encontrar horários livres antes de agendar.'],
      },
      {
        heading: 'Buscar, editar e concluir',
        body: 'Cada atendimento pode ser aberto para ajustes.',
        steps: [
          'Use o campo de busca para localizar por paciente ou descrição.',
          'Clique no atendimento na lista ou no calendário.',
          'Atualize os dados, mude o status ou exclua o registro.',
        ],
      },
    ],
  },
  {
    slug: 'pacientes',
    title: 'Pacientes',
    summary: 'Cadastre pacientes e acompanhe o histórico de cada um.',
    icon: 'patients',
    audience: 'all',
    path: '/clients',
    sections: [
      {
        heading: 'Cadastrar um paciente',
        body: 'O cadastro é a base para agendar atendimentos e preencher fichas clínicas.',
        steps: [
          'Abra Pacientes no menu lateral.',
          'Clique no botão de criar paciente.',
          'Preencha nome, contato e demais dados.',
          'Salve o cadastro.',
        ],
        tips: ['O paciente cadastrado fica disponível na Agenda, nas Fichas e no Orçamento.'],
      },
      {
        heading: 'Histórico do paciente',
        body: 'A tela de visualização reúne os dados cadastrais e o histórico de atendimentos, útil para responder dúvidas sobre a evolução clínica.',
        steps: [
          'Localize o paciente pelo campo de busca.',
          'Abra a visualização do paciente.',
          'Consulte o histórico de atendimentos e fichas vinculadas.',
        ],
      },
    ],
  },
  {
    slug: 'fichas',
    title: 'Fichas e prontuário',
    summary: 'Use os modelos da clínica para registrar a evolução clínica e gerar PDF.',
    icon: 'notes',
    audience: 'all',
    path: '/notes',
    sections: [
      {
        heading: 'Escolher o modelo de ficha',
        body: 'As fichas seguem os modelos cadastrados pela clínica em Gerência > Fichas. Cada modelo define quais campos e marcações aparecem no preenchimento.',
        tips: [
          'Se faltar um campo, ajuste o modelo na área Gerência, em vez de anotar fora do app.',
        ],
      },
      {
        heading: 'Preencher uma ficha',
        body: 'A ficha fica vinculada ao paciente, o que mantém o prontuário organizado.',
        steps: [
          'Abra Fichas clínicas no menu lateral.',
          'Clique no botão de criar ficha.',
          'Escolha o paciente e o modelo de ficha.',
          'Preencha os campos e as marcações do atendimento.',
          'Salve a ficha.',
        ],
      },
      {
        heading: 'Gerar o PDF',
        body: 'Qualquer ficha pode ser exportada em PDF, pelo botão de PDF da própria ficha, para imprimir ou entregar ao paciente.',
        tips: [
          'Confira o preenchimento antes de gerar o PDF: o documento reflete o que está salvo.',
        ],
      },
    ],
  },
  {
    slug: 'orcamento',
    title: 'Orçamento',
    summary: 'Monte um orçamento com os itens da clínica e entregue o PDF ao paciente.',
    icon: 'budget',
    audience: 'all',
    path: '/budget',
    sections: [
      {
        heading: 'Montar o orçamento',
        body: 'O orçamento usa os produtos da clínica, com valores já cadastrados, para montar a proposta do paciente.',
        steps: [
          'Abra Orçamento no menu lateral.',
          'Adicione os itens que farão parte da proposta.',
          'Ajuste quantidades e valores, se necessário.',
          'Confira o total calculado.',
        ],
      },
      {
        heading: 'Gerar o PDF',
        body: 'Com o orçamento pronto, o botão de PDF gera o documento para enviar ou imprimir para o paciente.',
        tips: [
          'Preencha os dados do paciente antes de gerar o PDF, para o documento sair identificado.',
          'Mantenha os valores em Gerência > Produtos atualizados para o orçamento não usar preço antigo.',
        ],
      },
    ],
  },
  {
    slug: 'meu-perfil',
    title: 'Meu perfil',
    summary: 'Atualize seus dados de acesso e informações pessoais.',
    icon: 'profile',
    audience: 'all',
    path: '/user',
    sections: [
      {
        heading: 'Atualizar meus dados',
        body: 'Seus dados ficam no cartão de usuário, no rodapé do menu lateral.',
        steps: [
          'Abra Meu perfil pelo cartão de usuário ou pela rota /user.',
          'Edite nome, contato e demais informações.',
          'Salve para aplicar as mudanças.',
        ],
      },
      {
        heading: 'Acesso e segurança',
        body: 'O e-mail cadastrado é o seu login no app, e a senha pode ser alterada na tela de perfil.',
        tips: [
          'Nunca compartilhe sua senha: cada pessoa da equipe deve ter o próprio acesso.',
          'Ao terminar em um computador compartilhado, clique em Sair.',
        ],
      },
    ],
  },
  {
    slug: 'configuracoes',
    title: 'Configurações da clínica',
    summary: 'Organize produtos, consultórios, fichas, usuários e informações financeiras.',
    icon: 'settings',
    audience: 'manager',
    path: '/manager',
    sections: [
      {
        heading: 'Onde configurar',
        body: 'A área Gerência reúne tudo que a clínica precisa: Clínica, Produtos, Consultórios, Fichas, Usuários, Pagamentos, Ganhos e Conta. Esses atalhos ficam em Gerência, no menu lateral.',
      },
      {
        heading: 'Ordem sugerida',
        body: 'Fazer os cadastros nesta ordem evita retrabalho, porque as telas do dia a dia dependem desses dados.',
        steps: [
          'Comece por Clínica, com os dados cadastrais e a logo.',
          'Cadastre Produtos, com especialidades e valores.',
          'Cadastre os Consultórios.',
          'Monte os modelos de Ficha clínica.',
          'Libere os acessos em Usuários.',
        ],
        tips: [
          'As mudanças em Gerência refletem na Agenda, nas Fichas e no Orçamento.',
          'Mantenha especialidades e valores atualizados para os orçamentos saírem corretos.',
        ],
      },
    ],
  },
  {
    slug: 'usuarios',
    title: 'Usuários e acessos',
    summary: 'Cadastre a equipe e defina o que cada perfil pode acessar.',
    icon: 'users',
    audience: 'manager',
    path: '/manager/users',
    sections: [
      {
        heading: 'Cadastrar um usuário',
        body: 'Cada pessoa da equipe deve ter o próprio acesso ao app.',
        steps: [
          'Abra Gerência > Usuários.',
          'Crie o usuário com nome e e-mail de acesso.',
          'Defina o perfil Gerente ou Funcionário.',
          'Salve para liberar o acesso.',
        ],
      },
      {
        heading: 'Perfis de acesso',
        body: 'O perfil define o que a pessoa vê. O Gerente configura a clínica e acessa as áreas financeiras; o Funcionário trabalha com Dashboard, Orçamento, Agenda, Pacientes e Fichas.',
        tips: [
          'Somente usuários com perfil Gerente enxergam a área Gerência.',
          'Ajuste ou remova o acesso quando alguém sair da equipe.',
        ],
      },
    ],
  },
  {
    slug: 'financeiro',
    title: 'Pagamentos e ganhos',
    summary: 'Lance os pagamentos dos atendimentos e estime os ganhos por profissional.',
    icon: 'finance',
    audience: 'manager',
    path: '/manager/payments',
    sections: [
      {
        heading: 'Pagamentos',
        body: 'Em Gerência > Pagamentos ficam os lançamentos financeiros ligados aos atendimentos, com valor e forma de pagamento.',
        steps: [
          'Abra Gerência > Pagamentos.',
          'Crie o lançamento do atendimento.',
          'Informe o valor e os demais dados do pagamento.',
          'Salve para atualizar o resumo financeiro.',
        ],
      },
      {
        heading: 'Ganhos',
        body: 'Em Gerência > Ganhos você estima quanto cada atendimento rende ao profissional, útil para combinar repasses.',
        tips: [
          'Confira os lançamentos antes de fechar o mês, para não deixar atendimento sem pagamento.',
        ],
      },
    ],
  },
];

/** Tópicos visíveis para o perfil atual, preservando a ordem de leitura. */
export function listHelpTopics(canManage: boolean): HelpTopic[] {
  return HELP_TOPICS.filter((topic) => topic.audience === 'all' || canManage);
}

export function findHelpTopic(slug: string, canManage: boolean): HelpTopic | undefined {
  return listHelpTopics(canManage).find((topic) => topic.slug === slug);
}

/** Tópicos anterior e seguinte dentro da lista visível, para a navegação de rodapé. */
export function helpTopicNeighbours(
  slug: string,
  canManage: boolean,
): { previous?: HelpTopic; next?: HelpTopic } {
  const topics = listHelpTopics(canManage);
  const index = topics.findIndex((topic) => topic.slug === slug);

  if (index < 0) {
    return {};
  }

  return {
    previous: index > 0 ? topics[index - 1] : undefined,
    next: index < topics.length - 1 ? topics[index + 1] : undefined,
  };
}

/** Guias de uso diário destacados na home pública, na ordem em que aparecem. */
const SITE_GUIDE_SLUGS = [
  'primeiros-passos',
  'dashboard',
  'agenda',
  'pacientes',
  'fichas',
  'orcamento',
  'meu-perfil',
];

/**
 * Guias exibidos na home antes do login. Parte sempre do recorte do perfil
 * Funcionário, então nenhum tópico exclusivo de gestão chega à página pública.
 */
export function listSiteGuides(): HelpTopic[] {
  const visible = listHelpTopics(false);

  return SITE_GUIDE_SLUGS.map((slug) => visible.find((topic) => topic.slug === slug)).filter(
    (topic): topic is HelpTopic => Boolean(topic),
  );
}

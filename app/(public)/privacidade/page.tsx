import { Metadata } from 'next';
import LegalPage, { LegalSection, LegalSectionInfo } from '@/app/components/ui/legal-page';
import { legalInfo, supplierIdentification } from '@/app/lib/legal-info';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description:
    'Saiba como o Smart Health App coleta, usa, compartilha e protege dados pessoais e dados de saúde das clínicas e dos pacientes, conforme a LGPD.',
  alternates: { canonical: '/privacidade' },
};

const sections: LegalSectionInfo[] = [
  { id: 'quem-somos', title: '1. Quem somos' },
  { id: 'definicoes', title: '2. Definições' },
  { id: 'dados-coletados', title: '3. Dados que coletamos' },
  { id: 'papeis', title: '4. Papéis no tratamento' },
  { id: 'bases-legais', title: '5. Bases legais' },
  { id: 'como-usamos', title: '6. Como usamos os dados' },
  { id: 'compartilhamento', title: '7. Compartilhamento com terceiros' },
  { id: 'cookies', title: '8. Cookies e tecnologias semelhantes' },
  { id: 'seguranca', title: '9. Segurança da informação' },
  { id: 'retencao', title: '10. Retenção e eliminação' },
  { id: 'direitos', title: '11. Direitos do titular' },
  { id: 'criancas-adolescentes', title: '12. Crianças e adolescentes' },
  { id: 'alteracoes', title: '13. Alterações desta política' },
  { id: 'contato-anpd', title: '14. Contato e ANPD' },
];

export default function PrivacidadePage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Política de Privacidade"
      subtitle="Como o Smart Health App trata dados pessoais e dados de saúde das clínicas e dos seus pacientes, em conformidade com a Lei Geral de Proteção de Dados (LGPD)."
      sections={sections}
    >
      <LegalSection id="quem-somos" heading="1. Quem somos">
        <p>
          O {legalInfo.serviceName} é um software como serviço (SaaS) para gestão de clínicas,
          disponível em <a href={legalInfo.website}>{legalInfo.website}</a>.
        </p>
        <p>
          O fornecedor responsável pela plataforma é {supplierIdentification()}, empresa
          desenvolvedora do {legalInfo.serviceName} e responsável pelo site{' '}
          <a href={legalInfo.supplierWebsite}>{legalInfo.supplierWebsite}</a>.
        </p>
        <p>
          O canal de contato do encarregado pelo tratamento de dados pessoais (DPO) é o e-mail{' '}
          <a href={`mailto:${legalInfo.privacyEmail}`}>{legalInfo.privacyEmail}</a>.
        </p>
      </LegalSection>

      <LegalSection id="definicoes" heading="2. Definições">
        <ul>
          <li>
            <strong>Titular:</strong> pessoa natural a quem se referem os dados pessoais tratados.
          </li>
          <li>
            <strong>Dados pessoais:</strong> informação relacionada a pessoa natural identificada ou
            identificável, como nome, e-mail, telefone e documento.
          </li>
          <li>
            <strong>Dados pessoais sensíveis:</strong> entre outros, dados sobre a saúde, dados
            genéticos ou biométricos, origem racial ou étnica e convicção religiosa (art. 5º, II, da
            LGPD).
          </li>
          <li>
            <strong>Controlador:</strong> pessoa natural ou jurídica a quem competem as decisões
            sobre o tratamento de dados pessoais.
          </li>
          <li>
            <strong>Operador:</strong> quem realiza o tratamento de dados pessoais em nome do
            controlador.
          </li>
          <li>
            <strong>LGPD:</strong> Lei nº 13.709/2018, Lei Geral de Proteção de Dados Pessoais.
          </li>
          <li>
            <strong>ANPD:</strong> Autoridade Nacional de Proteção de Dados, órgão responsável por
            fiscalizar o cumprimento da LGPD no Brasil.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="dados-coletados" heading="3. Dados que coletamos">
        <p>
          Dependendo de como a plataforma é utilizada, tratamos as seguintes categorias de dados:
        </p>
        <ul>
          <li>
            <strong>Dados de cadastro e contrato:</strong> nome, e-mail, telefone, cargo e dados da
            clínica contratante (razão social, CNPJ, endereço e informações de contato).
          </li>
          <li>
            <strong>Dados de pacientes inseridos pelos usuários do aplicativo:</strong> nome,
            contato, dados do atendimento e informações clínicas registradas na agenda, no
            prontuário e na receita digital. Esses registros podem incluir{' '}
            <strong>dados pessoais sensíveis de saúde</strong>, na forma do art. 5º, II, e do art.
            11 da LGPD, e são inseridos pela clínica titular do atendimento.
          </li>
          <li>
            <strong>Dados de pagamento:</strong> dados de cobrança e identificadores da assinatura
            processados pela Stripe. Não armazenamos o número completo do cartão de crédito nos
            nossos servidores.
          </li>
          <li>
            <strong>Dados técnicos de uso:</strong> registros de acesso (logs), endereço IP,
            identificadores de dispositivo e navegador, data e hora das requisições e eventos de
            erro.
          </li>
          <li>
            <strong>Dados de navegação e cookies:</strong> páginas visitadas, tempo de permanência e
            métricas de audiência coletadas por ferramentas de análise, conforme a seção 8.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="papeis" heading="4. Papéis no tratamento">
        <p>
          <strong>Dados de pacientes:</strong> a clínica contratante é a{' '}
          <strong>controladora</strong>, pois decide quais dados são coletados e para quais
          finalidades. O {legalInfo.serviceName} atua como <strong>operador</strong> e trata esses
          dados apenas conforme as instruções da clínica, para viabilizar a prestação do serviço.
        </p>
        <p>
          <strong>Dados da conta e do contrato:</strong> em relação aos dados de cadastro, cobrança,
          suporte e uso da plataforma, o {legalInfo.serviceName} atua como{' '}
          <strong>controlador</strong>.
        </p>
        <p>
          Quando contratado, o instrumento de tratamento de dados entre a clínica e o fornecedor
          detalha essas responsabilidades e as medidas de segurança aplicáveis.
        </p>
      </LegalSection>

      <LegalSection id="bases-legais" heading="5. Bases legais">
        <p>Tratamos dados pessoais com fundamento nas seguintes hipóteses legais da LGPD:</p>
        <ul>
          <li>
            <strong>Execução de contrato</strong> (art. 7º, V): para fornecer a plataforma, cobrar a
            assinatura e prestar suporte aos usuários da clínica.
          </li>
          <li>
            <strong>Cumprimento de obrigação legal ou regulatória</strong> (art. 7º, II): para
            atender exigências fiscais, contábeis, regulatórias e de guarda de documentos.
          </li>
          <li>
            <strong>Consentimento</strong> (art. 11, I): para o tratamento de dados pessoais
            sensíveis, quando essa for a base aplicável indicada pela clínica controladora.
          </li>
          <li>
            <strong>Tutela da saúde</strong> (art. 11, II, alínea f): quando o tratamento é
            realizado por profissionais de saúde, serviços de saúde ou autoridade sanitária para
            procedimentos de assistência à saúde.
          </li>
          <li>
            <strong>Legítimo interesse</strong> (art. 7º, IX): para melhoria do serviço, segurança
            da plataforma e prevenção a fraudes, sempre com avaliação dos direitos e liberdades
            fundamentais dos titulares.
          </li>
          <li>
            <strong>Proteção do crédito e prevenção à fraude</strong>: para cobrança, verificação de
            identidade e segurança das transações.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="como-usamos" heading="6. Como usamos os dados">
        <p>Os dados tratados são utilizados para:</p>
        <ul>
          <li>criar e administrar contas, clínicas e usuários vinculados;</li>
          <li>
            operar as funcionalidades contratadas, como agenda, cadastro de pacientes, prontuário e
            receita digital, gráficos e relatórios;
          </li>
          <li>processar pagamentos, emitir documentos fiscais e gerenciar a assinatura;</li>
          <li>prestar suporte técnico e responder a solicitações;</li>
          <li>manter a segurança da plataforma, prevenir fraudes e registrar acessos;</li>
          <li>medir o uso e aprimorar a experiência, o desempenho e as funcionalidades;</li>
          <li>cumprir obrigações legais, regulatórias e ordens de autoridades competentes.</li>
        </ul>
      </LegalSection>

      <LegalSection id="compartilhamento" heading="7. Compartilhamento com terceiros">
        <p>
          Não vendemos dados pessoais nem dados de pacientes. O compartilhamento ocorre apenas com
          os operadores necessários à prestação do serviço:
        </p>
        <ul>
          <li>
            <strong>Vercel</strong>: hospedagem da aplicação e métricas de desempenho e audiência.
          </li>
          <li>
            <strong>Neon</strong>: banco de dados PostgreSQL gerenciado em nuvem, onde os dados da
            plataforma são armazenados.
          </li>
          <li>
            <strong>Stripe</strong>: processamento de pagamentos e gestão da assinatura.
          </li>
          <li>
            <strong>Google Analytics</strong>: medição de audiência do site público.
          </li>
          <li>
            <strong>Provedores de e-mail transacional</strong>: envio de mensagens de verificação,
            recuperação de acesso e avisos operacionais.
          </li>
        </ul>
        <p>
          Alguns desses fornecedores podem manter servidores fora do Brasil, o que caracteriza{' '}
          <strong>transferência internacional de dados</strong> (art. 33 da LGPD). Nesses casos,
          buscamos fornecedores que ofereçam garantias contratuais e técnicas de proteção
          compatíveis com a LGPD e com as demais normas aplicáveis.
        </p>
        <p>
          Também podemos compartilhar dados para cumprir obrigação legal, atender requisição de
          autoridade competente ou exercer direitos em processo judicial, administrativo ou
          arbitral.
        </p>
      </LegalSection>

      <LegalSection id="cookies" heading="8. Cookies e tecnologias semelhantes">
        <p>
          Utilizamos cookies e tecnologias semelhantes para manter a sessão autenticada, registrar
          preferências e medir a audiência do site. As ferramentas de análise utilizadas são o{' '}
          <strong>Google Analytics</strong> e o <strong>Vercel Analytics</strong>.
        </p>
        <p>
          Você pode bloquear ou excluir cookies nas configurações do seu navegador e, quando
          oferecido, usar mecanismos de desativação das ferramentas de análise. O bloqueio de
          cookies estritamente necessários pode impedir o funcionamento de partes do serviço.
        </p>
      </LegalSection>

      <LegalSection id="seguranca" heading="9. Segurança da informação">
        <p>
          Adotamos medidas técnicas e administrativas para proteger os dados pessoais, incluindo:
        </p>
        <ul>
          <li>
            <strong>Senhas com hash bcrypt</strong>, sem armazenamento de senhas em texto legível;
          </li>
          <li>
            <strong>isolamento dos dados por clínica</strong> (arquitetura multi-tenant), garantindo
            que cada clínica acesse apenas os próprios registros;
          </li>
          <li>
            <strong>controle de acesso por papéis</strong>, limitando as funcionalidades conforme a
            função do usuário;
          </li>
          <li>
            <strong>criptografia em trânsito</strong> por HTTPS em todas as comunicações;
          </li>
          <li>
            <strong>registros de acesso</strong> e monitoramento para apoiar auditorias e
            investigação de incidentes.
          </li>
        </ul>
        <p>
          Em relação a prontuários e registros de atendimento, orientamos as clínicas a observar os
          prazos de guarda previstos na legislação e nas normas aplicáveis, como as normas do
          Conselho Federal de Medicina (CFM) e dos demais conselhos profissionais quando aplicáveis,
          incluindo a referência de 20 anos contados do último registro estabelecida pela legislação
          e pelas normas pertinentes, como a Resolução CFM nº 1.821/2007 e a Lei nº 13.787/2018.
        </p>
        <p>
          Nenhuma medida de segurança é absoluta. Caso ocorra incidente relevante, adotaremos as
          providências cabíveis e as comunicações previstas na LGPD.
        </p>
      </LegalSection>

      <LegalSection id="retencao" heading="10. Retenção e eliminação">
        <p>
          Mantemos os dados pessoais pelo tempo necessário ao cumprimento das finalidades desta
          política, à execução do contrato, ao exercício regular de direitos e ao atendimento de
          obrigações legais, regulatórias, fiscais e de guarda de prontuário.
        </p>
        <p>
          Encerrado o contrato, os dados podem ser eliminados ou anonimizados, respeitadas as
          hipóteses legais de conservação — por exemplo, obrigações fiscais e prazos legais e
          normativos de guarda de prontuário. A clínica controladora pode solicitar a exportação dos
          dados antes do encerramento.
        </p>
      </LegalSection>

      <LegalSection id="direitos" heading="11. Direitos do titular">
        <p>
          Nos termos do art. 18 da LGPD, o titular pode solicitar, em relação aos seus dados
          pessoais:
        </p>
        <ul>
          <li>confirmação da existência de tratamento;</li>
          <li>acesso aos dados;</li>
          <li>correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>
            anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em
            desconformidade com a LGPD;
          </li>
          <li>portabilidade a outro fornecedor de serviço, mediante requisição expressa;</li>
          <li>informação sobre entidades com as quais compartilhamos dados;</li>
          <li>
            informação sobre a possibilidade de não fornecer consentimento e suas consequências;
          </li>
          <li>revogação do consentimento; e</li>
          <li>
            oposição a tratamentos realizados sem o seu consentimento, quando houver descumprimento
            da LGPD.
          </li>
        </ul>
        <p>
          Para exercer esses direitos, escreva para o encarregado pelo tratamento de dados pelo
          e-mail <a href={`mailto:${legalInfo.privacyEmail}`}>{legalInfo.privacyEmail}</a>. Podemos
          solicitar informações adicionais para confirmar a identidade do solicitante. Responderemos
          no prazo de até 15 dias, contado da data do pedido, sem prejuízo de prazos menores
          previstos na LGPD.
        </p>
        <p>
          Quando a clínica é a controladora dos dados de pacientes, a solicitação pode ser
          encaminhada diretamente a ela; atuando como operador, apoiamos a clínica no atendimento do
          pedido.
        </p>
      </LegalSection>

      <LegalSection id="criancas-adolescentes" heading="12. Crianças e adolescentes">
        <p>
          A plataforma é destinada a profissionais, clínicas e seus colaboradores, não sendo
          direcionada a crianças ou adolescentes como usuários.
        </p>
        <p>
          Quando dados de menores de idade são inseridos no prontuário ou na agenda, o registro é
          feito pela clínica ou pelo profissional de saúde, sob responsabilidade deles, com base
          legal própria e observância do melhor interesse do menor, do consentimento de pelo menos
          um dos pais ou responsável legal e das demais normas aplicáveis.
        </p>
      </LegalSection>

      <LegalSection id="alteracoes" heading="13. Alterações desta política">
        <p>
          Esta política pode ser atualizada para refletir mudanças na legislação, no serviço ou nas
          nossas práticas de tratamento. A data da última atualização é sempre exibida no topo desta
          página.
        </p>
        <p>
          Em caso de alteração relevante, comunicaremos os usuários por e-mail ou por aviso na
          plataforma. Recomendamos a leitura periódica deste documento.
        </p>
      </LegalSection>

      <LegalSection id="contato-anpd" heading="14. Contato e ANPD">
        <p>
          Dúvidas, solicitações e reclamações sobre privacidade e proteção de dados podem ser
          enviadas ao encarregado pelo tratamento de dados pelo e-mail{' '}
          <a href={`mailto:${legalInfo.privacyEmail}`}>{legalInfo.privacyEmail}</a>
          {legalInfo.address ? ` ou pelo endereço de ${legalInfo.address}` : ''}.
        </p>
        <p>
          Você também pode peticionar à Autoridade Nacional de Proteção de Dados (ANPD) pelo site{' '}
          <a href="https://www.gov.br/anpd/pt-br">https://www.gov.br/anpd/pt-br</a>.
        </p>
        <p>
          Na condição de controladora dos dados dos pacientes, a clínica deve disponibilizar aos
          seus pacientes o próprio aviso de privacidade, conforme as informações que lhes forem
          aplicáveis.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

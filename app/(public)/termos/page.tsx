import { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { LegalSection, LegalSectionInfo } from '@/app/components/ui/legal-page';
import { jurisdictionVenue, legalInfo, supplierIdentification } from '@/app/lib/legal-info';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description:
    'Condições de contratação e uso do Smart Health App: planos e pagamento, obrigações do usuário, responsabilidades do profissional de saúde, cancelamento e suporte.',
  alternates: { canonical: '/termos' },
};

const sections: LegalSectionInfo[] = [
  { id: 'aceitacao', title: '1. Aceitação dos termos' },
  { id: 'definicoes', title: '2. Definições' },
  { id: 'descricao-servico', title: '3. Descrição do serviço' },
  { id: 'cadastro-conta', title: '4. Cadastro e conta' },
  { id: 'planos-pagamento', title: '5. Planos, preços e pagamento' },
  { id: 'cancelamento-reembolso', title: '6. Cancelamento e reembolso' },
  { id: 'obrigacoes-usuario', title: '7. Obrigações do usuário' },
  { id: 'responsabilidades-profissional', title: '8. Responsabilidades do profissional de saúde' },
  { id: 'propriedade-intelectual', title: '9. Propriedade intelectual' },
  { id: 'disponibilidade-suporte', title: '10. Disponibilidade e suporte' },
  { id: 'suspensao-rescisao', title: '11. Suspensão e rescisão' },
  { id: 'limitacao-responsabilidade', title: '12. Limitação de responsabilidade' },
  { id: 'privacidade-dados', title: '13. Privacidade e proteção de dados' },
  { id: 'alteracoes-termos', title: '14. Alterações destes termos' },
  { id: 'lei-foro', title: '15. Lei aplicável e foro' },
  { id: 'contato', title: '16. Contato' },
];

export default function TermosPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Termos de Uso"
      subtitle="Condições para contratar e utilizar o Smart Health App, plataforma de gestão de clínicas operada em nuvem."
      sections={sections}
    >
      <LegalSection id="aceitacao" heading="1. Aceitação dos termos">
        <p>
          Estes Termos de Uso regem o acesso e a utilização do {legalInfo.serviceName} e são
          aplicáveis à clínica contratante e a todos os usuários vinculados a ela. Ao criar uma
          conta, contratar um plano ou utilizar a plataforma, você declara que leu, entendeu e
          concorda com estas condições e com a{' '}
          <Link href="/privacidade">Política de Privacidade</Link>.
        </p>
        <p>
          Caso não concorde com estes termos, o serviço não deve ser utilizado. Se você utiliza a
          plataforma em nome de uma clínica, declara ter poderes para aceitar estas condições por
          ela.
        </p>
      </LegalSection>

      <LegalSection id="definicoes" heading="2. Definições">
        <ul>
          <li>
            <strong>Plataforma ou Serviço:</strong> o software como serviço {legalInfo.serviceName},
            acessado pela internet.
          </li>
          <li>
            <strong>Fornecedor:</strong> {supplierIdentification()}, responsável pelo
            desenvolvimento e pela operação da plataforma.
          </li>
          <li>
            <strong>Cliente ou Clínica:</strong> pessoa jurídica que contrata o serviço.
          </li>
          <li>
            <strong>Usuário:</strong> pessoa física autorizada pela clínica a acessar a plataforma,
            como gestores e profissionais de saúde.
          </li>
          <li>
            <strong>Conteúdo do cliente:</strong> dados, registros, prontuários, imagens e demais
            informações inseridas na plataforma pela clínica e pelos seus usuários.
          </li>
          <li>
            <strong>Assinatura:</strong> plano contratado, com cobrança recorrente conforme os
            valores e a periodicidade informados na contratação.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="descricao-servico" heading="3. Descrição do serviço">
        <p>
          O {legalInfo.serviceName} é um software como serviço (SaaS) para gestão de clínicas, com
          recursos de agenda, cadastro de pacientes, prontuário e receita digital, gráficos e
          relatórios. Os dados são hospedados em nuvem, em infraestrutura de terceiros contratados
          pelo fornecedor.
        </p>
        <p>
          A plataforma é uma ferramenta de gestão e registro. Ela não realiza diagnósticos, não
          indica tratamentos e não substitui o julgamento clínico do profissional de saúde nem os
          sistemas oficiais exigidos por lei ou pelos conselhos profissionais.
        </p>
        <p>
          O fornecedor pode evoluir, alterar ou descontinuar funcionalidades, comunicando as
          mudanças relevantes com antecedência razoável.
        </p>
      </LegalSection>

      <LegalSection id="cadastro-conta" heading="4. Cadastro e conta">
        <p>
          Para usar a plataforma é necessário criar uma conta vinculada a uma clínica. O usuário
          deve fornecer informações verdadeiras, completas e atualizadas, mantendo-as corretas
          durante a vigência do contrato.
        </p>
        <ul>
          <li>as credenciais de acesso são pessoais e intransferíveis;</li>
          <li>
            o usuário é responsável pela guarda da senha e pelas atividades realizadas com a sua
            conta;
          </li>
          <li>
            o vínculo do usuário a uma clínica é administrado pelos gestores da própria clínica;
          </li>
          <li>
            qualquer uso não autorizado ou suspeita de comprometimento da conta deve ser comunicado
            imediatamente ao fornecedor.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="planos-pagamento" heading="5. Planos, preços e pagamento">
        <p>
          Os planos, valores e limites de uso são apresentados no momento da contratação. A
          contratação pode ser mensal ou anual, conforme a opção escolhida.
        </p>
        <ul>
          <li>
            a cobrança é recorrente e processada pela <strong>Stripe</strong>, que recebe os dados
            de pagamento diretamente; o fornecedor não armazena o número completo do cartão;
          </li>
          <li>
            os valores podem ser reajustados, com aviso prévio, na forma da legislação aplicável;
          </li>
          <li>
            a inadimplência pode acarretar restrição de acesso e, persistindo, a suspensão ou o
            encerramento da conta;
          </li>
          <li>
            os documentos fiscais são emitidos eletronicamente e disponibilizados ao contratante.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="cancelamento-reembolso" heading="6. Cancelamento e reembolso">
        <p>
          O cancelamento pode ser solicitado a qualquer momento pelo canal de suporte informado na
          seção 16. A assinatura permanece ativa até o fim do período já pago, salvo disposição
          diversa.
        </p>
        <p>
          Nas contratações em que o Código de Defesa do Consumidor for aplicável, o consumidor pode
          exercer o <strong>direito de arrependimento</strong> no prazo de 7 dias contados da
          contratação (art. 49 do CDC), com devolução dos valores pagos na forma da lei.
        </p>
        <p>
          Encerrada a assinatura, o acesso à plataforma é desativado ao final do período contratado.
          A clínica é responsável por exportar os dados que precisar manter, respeitados os prazos
          legais de guarda de prontuário e as obrigações de retenção descritas na Política de
          Privacidade.
        </p>
      </LegalSection>

      <LegalSection id="obrigacoes-usuario" heading="7. Obrigações do usuário">
        <p>Ao utilizar a plataforma, a clínica e os seus usuários se comprometem a:</p>
        <ul>
          <li>
            não usar o serviço para fins ilícitos ou contrários à legislação e à ética profissional;
          </li>
          <li>manter corretos e atualizados os dados clínicos e cadastrais que inserirem;</li>
          <li>
            obter dos pacientes o consentimento ou outra base legal aplicável para a coleta e o
            tratamento dos dados inseridos na plataforma;
          </li>
          <li>não compartilhar credenciais nem permitir acesso de terceiros não autorizados;</li>
          <li>
            não tentar burlar mecanismos de segurança, nem copiar, decompilar ou explorar
            indevidamente a plataforma;
          </li>
          <li>
            utilizar o serviço em conformidade com a LGPD e com as normas dos conselhos
            profissionais.
          </li>
        </ul>
      </LegalSection>

      <LegalSection
        id="responsabilidades-profissional"
        heading="8. Responsabilidades do profissional de saúde"
      >
        <p>
          O julgamento clínico, as decisões de tratamento e o conteúdo do prontuário são de
          responsabilidade exclusiva do profissional de saúde que realizou o atendimento. O
          fornecedor disponibiliza apenas a ferramenta de registro e gestão.
        </p>
        <p>
          O profissional deve observar o sigilo profissional, as normas dos conselhos profissionais
          aplicáveis (como CFM e COFFITO) e as exigências da LGPD quanto ao tratamento de dados de
          saúde, incluindo a guarda de prontuários pelos prazos legais e normativos vigentes.
        </p>
      </LegalSection>

      <LegalSection id="propriedade-intelectual" heading="9. Propriedade intelectual">
        <p>
          O software, o código-fonte, a marca, os textos, os materiais de apoio e a documentação da
          plataforma pertencem ao fornecedor ou aos seus licenciantes. Estes termos concedem apenas
          uma licença de uso <strong>limitada, não exclusiva e não transferível</strong>, restrita
          às funcionalidades contratadas e à vigência da assinatura.
        </p>
        <p>
          O <strong>conteúdo do cliente</strong> — incluindo os dados de pacientes e os registros
          clínicos — permanece de titularidade da clínica e dos usuários que o inseriram, que são
          responsáveis por sua licitude. O fornecedor trata esse conteúdo apenas para viabilizar a
          prestação do serviço e conforme as instruções da clínica.
        </p>
      </LegalSection>

      <LegalSection id="disponibilidade-suporte" heading="10. Disponibilidade e suporte">
        <p>
          O fornecedor adota esforços comercialmente razoáveis para manter a plataforma disponível,
          podendo haver <strong>janelas de manutenção</strong> programadas ou emergenciais, além de
          indisponibilidades causadas por terceiros, falhas de internet ou eventos fora do seu
          controle.
        </p>
        <p>
          O suporte é prestado pelos canais informados na seção 16, em dias úteis, com prazos de
          resposta definidos pelo plano contratado.
        </p>
      </LegalSection>

      <LegalSection id="suspensao-rescisao" heading="11. Suspensão e rescisão">
        <p>O acesso pode ser suspenso, temporária ou definitivamente, nas seguintes hipóteses:</p>
        <ul>
          <li>inadimplência do plano contratado;</li>
          <li>violação destes termos ou da legislação aplicável;</li>
          <li>uso indevido que coloque em risco a segurança ou a integridade da plataforma;</li>
          <li>determinação de autoridade competente.</li>
        </ul>
        <p>
          Sempre que possível, a suspensão é precedida de comunicação e de prazo para regularização.
          Em caso de encerramento, a clínica pode solicitar a exportação dos seus dados antes do fim
          do acesso, observados os prazos legais de guarda.
        </p>
      </LegalSection>

      <LegalSection id="limitacao-responsabilidade" heading="12. Limitação de responsabilidade">
        <p>
          A plataforma é fornecida <strong>“como está”</strong>, conforme as funcionalidades
          disponíveis na contratação. Na extensão máxima permitida pela legislação brasileira, o
          fornecedor não responde por lucros cessantes, perda de oportunidade ou danos decorrentes
          de uso indevido da plataforma, de dados inseridos incorretamente pelos usuários ou de
          indisponibilidades causadas por terceiros.
        </p>
        <p>
          Nada nestes termos afasta ou limita direitos do consumidor previstos na legislação
          aplicável, nem a responsabilidade do fornecedor nos casos em que não é possível excluí-la.
        </p>
      </LegalSection>

      <LegalSection id="privacidade-dados" heading="13. Privacidade e proteção de dados">
        <p>
          O tratamento de dados pessoais realizado na plataforma é descrito na{' '}
          <Link href="/privacidade">Política de Privacidade</Link>, que integra estes termos. Em
          relação aos dados de pacientes, a clínica é <strong>controladora</strong> e o fornecedor
          atua como <strong>operador</strong>, seguindo as instruções da clínica.
        </p>
        <p>
          Quando aplicável e contratado, um aditivo de tratamento de dados detalha as obrigações das
          partes, as medidas de segurança e as condições de transferência internacional de dados.
        </p>
      </LegalSection>

      <LegalSection id="alteracoes-termos" heading="14. Alterações destes termos">
        <p>
          Estes termos podem ser atualizados para refletir mudanças no serviço, na legislação ou nas
          práticas comerciais do fornecedor. A data da última atualização é exibida no topo desta
          página.
        </p>
        <p>
          Mudanças relevantes são comunicadas por e-mail ou por aviso na plataforma, com
          antecedência razoável. O uso do serviço após a vigência da nova versão implica
          concordância com as condições atualizadas.
        </p>
      </LegalSection>

      <LegalSection id="lei-foro" heading="15. Lei aplicável e foro">
        <p>
          Estes termos são regidos pela legislação brasileira. Fica eleito {jurisdictionVenue()}{' '}
          para dirimir controvérsias decorrentes desta contratação, ressalvado o foro do domicílio
          do consumidor quando a legislação assim determinar.
        </p>
      </LegalSection>

      <LegalSection id="contato" heading="16. Contato">
        <p>
          Dúvidas sobre estes termos ou sobre a contratação podem ser enviadas para{' '}
          <a href={`mailto:${legalInfo.supportEmail}`}>{legalInfo.supportEmail}</a>. Solicitações
          relacionadas a dados pessoais devem ser encaminhadas ao encarregado pelo tratamento pelo
          e-mail <a href={`mailto:${legalInfo.privacyEmail}`}>{legalInfo.privacyEmail}</a>.
        </p>
        <p>
          Fornecedor: {supplierIdentification()}. Site do produto:{' '}
          <a href={legalInfo.website}>{legalInfo.website}</a>. Canal do desenvolvedor:{' '}
          <a href={legalInfo.supplierWebsite}>{legalInfo.supplierWebsite}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

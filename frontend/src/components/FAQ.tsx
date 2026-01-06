import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Como funciona o VITAS?",
    answer: "O VITAS é uma plataforma que conecta você ao profissional certo em apenas 1 clique. Você descreve seu problema, nossa inteligência artificial faz a triagem automática e recomenda os melhores profissionais disponíveis. Depois é só escolher, agendar e pronto!"
  },
  {
    question: "Como faço para encontrar um profissional?",
    answer: "É muito simples: 1) Clique em 'Criar Chamado', 2) Descreva seu problema ou necessidade, 3) O sistema analisa e recomenda profissionais qualificados, 4) Escolha o profissional e horário ideal, 5) Confirme o agendamento. Tudo em menos de 2 minutos!"
  },
  {
    question: "O que é a triagem automática?",
    answer: "A triagem automática é nossa inteligência que analisa sua descrição e identifica automaticamente o tipo de serviço necessário (ex: encanador, eletricista, advogado) e o nível de urgência. Isso garante que você receba recomendações precisas dos profissionais mais adequados."
  },
  {
    question: "Posso usar o VITAS no celular?",
    answer: "Sim! O VITAS é um Progressive Web App (PWA). Você pode instalá-lo na tela inicial do seu celular Android ou iOS como se fosse um aplicativo nativo. Basta acessar pelo navegador Chrome/Safari e clicar em 'Instalar' quando aparecer a opção. Funciona offline e envia notificações!"
  },
  {
    question: "Como instalar o app no meu celular?",
    answer: "No Android: Abra http://31.97.64.250 no Chrome, toque no menu (três pontos) e selecione 'Instalar app' ou 'Adicionar à tela inicial'. No iPhone: Abra no Safari, toque no botão compartilhar e selecione 'Adicionar à Tela de Início'."
  },
  {
    question: "O app funciona sem internet?",
    answer: "Sim, parcialmente. Você pode visualizar seus chamados anteriores e informações já carregadas mesmo offline. Para criar novos chamados ou atualizar informações, você precisará estar conectado à internet."
  },
  {
    question: "Como funciona o agendamento?",
    answer: "Após o sistema recomendar profissionais, você vê os horários disponíveis de cada um. Escolha o dia e horário que preferir, confirme o agendamento e pronto! Você e o profissional recebem confirmação instantânea."
  },
  {
    question: "Posso cancelar um agendamento?",
    answer: "Sim, você pode cancelar agendamentos diretamente pelo app ou site. Acesse 'Meus Chamados', selecione o agendamento e clique em 'Cancelar'. Recomendamos cancelar com antecedência para respeitar o tempo do profissional."
  },
  {
    question: "Como acompanho meus chamados?",
    answer: "Na seção 'Meus Chamados' você vê o histórico completo: chamados abertos, em andamento e concluídos. Cada chamado mostra detalhes, status atual, profissional designado e todo o histórico de interações."
  },
  {
    question: "O sistema é seguro?",
    answer: "Sim! Usamos criptografia JWT para proteger seus dados, conexão HTTPS segura e armazenamento em servidores seguros. Suas informações pessoais e histórico de chamados são privados e protegidos."
  },
  {
    question: "Quais tipos de profissionais posso encontrar?",
    answer: "O VITAS oferece profissionais em diversas áreas: Residencial (encanador, eletricista, pedreiro), Saúde (médico, fisioterapeuta, psicólogo), Jurídico (advogado, despachante), Automotivo (mecânico, funileiro), Beleza (cabeleireiro, esteticista) e muito mais!"
  },
  {
    question: "Como sei se o profissional é qualificado?",
    answer: "Todos os profissionais passam por verificação. Você pode ver a avaliação média (taxa de satisfação), número de atendimentos realizados e comentários de outros clientes antes de escolher."
  },
  {
    question: "Posso avaliar o profissional depois?",
    answer: "Sim! Após a conclusão do serviço, você pode avaliar o profissional de 1 a 5 estrelas e deixar um comentário. Isso ajuda outros usuários e mantém a qualidade da plataforma."
  },
  {
    question: "Quanto custa usar o VITAS?",
    answer: "O cadastro e busca de profissionais são 100% gratuitos. Você paga apenas pelo serviço contratado diretamente ao profissional. Não cobramos taxa de intermediação dos usuários."
  },
  {
    question: "Preciso criar uma conta?",
    answer: "Sim, para garantir segurança e personalização. O cadastro é rápido: nome, email e senha. Com sua conta você pode acompanhar histórico, salvar profissionais favoritos e gerenciar agendamentos."
  },
  {
    question: "O que são os atalhos na tela inicial?",
    answer: "Se você instalou o app no celular, ao pressionar longamente o ícone aparecem atalhos rápidos: 'Criar Chamado' (abre direto a tela de novo chamado) e 'Meus Chamados' (vê seus chamados ativos). Economiza cliques!"
  },
  {
    question: "Recebo notificações?",
    answer: "Sim! Você recebe notificações quando: um profissional aceita seu chamado, há mudança de status, chegou a hora do agendamento, e quando o serviço é concluído. Pode ativar/desativar nas configurações."
  },
  {
    question: "E se eu tiver um problema urgente?",
    answer: "O sistema detecta urgência automaticamente pela sua descrição (palavras como 'emergência', 'urgente', 'vazamento'). Chamados urgentes têm prioridade na triagem e você recebe recomendações de profissionais com disponibilidade imediata."
  },
  {
    question: "Posso usar em tablet ou computador?",
    answer: "Sim! O VITAS funciona em qualquer dispositivo com navegador: smartphone, tablet, notebook ou computador. A interface se adapta automaticamente ao tamanho da tela."
  },
  {
    question: "Como entro em contato com suporte?",
    answer: "Você pode acessar a seção 'Ajuda' no menu do app/site, enviar email para suporte@vitas.com ou usar o chat ao vivo (ícone no canto inferior direito). Respondemos em até 24 horas."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-gray-600">
            Tire suas dúvidas sobre como usar o VITAS na web e no aplicativo
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {item.question}
                </span>
                <svg
                  className={`w-5 h-5 text-blue-600 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4 pt-2 text-gray-600 leading-relaxed animate-slide-down">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Ainda tem dúvidas?
          </p>
          <a
            href="mailto:suporte@vitas.com"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Fale com o Suporte
          </a>
        </div>
      </div>
    </section>
  );
}

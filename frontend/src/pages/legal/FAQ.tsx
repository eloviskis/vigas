import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BackButton } from '../../components/BackButton';
import './FAQ.css';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: { category: string; items: FAQItem[] }[] = [
  {
    category: '💡 Como Funciona',
    items: [
      {
        question: 'O que é o VITAS?',
        answer: 'O VITAS é uma plataforma que conecta você aos melhores profissionais de serviços para sua casa. Você descreve o que precisa, recebe orçamentos de profissionais verificados e escolhe o melhor custo-benefício.',
      },
      {
        question: 'Como faço para contratar um profissional?',
        answer: '1. Crie um chamado descrevendo o serviço que precisa\n2. Aguarde orçamentos de profissionais próximos\n3. Compare preços, avaliações e prazos\n4. Aprove o orçamento desejado\n5. Pague com segurança via PIX\n6. O profissional realiza o serviço\n7. Avalie a experiência',
      },
      {
        question: 'Quanto tempo leva para receber orçamentos?',
        answer: 'Geralmente você recebe os primeiros orçamentos em até 24 horas. Profissionais têm até 48 horas para enviar propostas.',
      },
      {
        question: 'Posso negociar o valor do orçamento?',
        answer: 'Não diretamente pela plataforma. Se desejar, você pode recusar o orçamento e aguardar outras propostas. O profissional pode enviar um novo orçamento com valor ajustado.',
      },
    ],
  },
  {
    category: '👷 Para Profissionais',
    items: [
      {
        question: 'Como me cadastro como profissional?',
        answer: 'Clique em "Sou Profissional" no menu, preencha o formulário com seus dados, especialidades e localização. Após análise dos documentos (até 48h), você poderá receber chamados e enviar orçamentos.',
      },
      {
        question: 'Quais documentos preciso enviar?',
        answer: 'Você precisa enviar:\n• RG ou CNH (foto legível)\n• Comprovante de residência (últimos 3 meses)\n• Certificados ou licenças (se aplicável)\n• Fotos de trabalhos realizados (opcional, mas recomendado)',
      },
      {
        question: 'Como funciona a comissão do VITAS?',
        answer: 'O VITAS cobra 12% sobre o valor total de cada serviço realizado. Você recebe 88% do valor pago pelo cliente. A cobrança é automática no momento do pagamento.',
      },
      {
        question: 'Posso escolher quais chamados atender?',
        answer: 'Sim! Você recebe notificações de chamados compatíveis com suas especialidades e localização. Você decide se quer enviar orçamento ou não.',
      },
      {
        question: 'Como recebo o pagamento?',
        answer: 'O pagamento é liberado automaticamente após a conclusão do serviço e aprovação do cliente. O valor é transferido para sua conta bancária cadastrada em até 2 dias úteis.',
      },
    ],
  },
  {
    category: '💳 Pagamentos',
    items: [
      {
        question: 'Quais formas de pagamento são aceitas?',
        answer: 'Atualmente aceitamos PIX (aprovação instantânea). Em breve teremos cartão de crédito e boleto bancário.',
      },
      {
        question: 'É seguro pagar pelo VITAS?',
        answer: 'Sim! Todos os pagamentos são processados com criptografia SSL/TLS. Usamos gateways de pagamento certificados e não armazenamos dados bancários. Seu pagamento fica retido até a conclusão do serviço.',
      },
      {
        question: 'Quando o pagamento é liberado para o profissional?',
        answer: 'O pagamento é liberado após a conclusão do serviço e sua confirmação. Isso garante que você só pague por serviços realizados satisfatoriamente.',
      },
      {
        question: 'Posso parcelar o pagamento?',
        answer: 'Com PIX não há parcelamento. Quando implementarmos cartão de crédito, será possível parcelar em até 12x (sujeito a aprovação).',
      },
      {
        question: 'O que acontece se eu já paguei e o profissional não aparecer?',
        answer: 'Entre em contato com nosso suporte imediatamente. Reembolsaremos 100% do valor e aplicaremos penalidades ao profissional, incluindo possível banimento da plataforma.',
      },
    ],
  },
  {
    category: '🔒 Segurança e Verificação',
    items: [
      {
        question: 'Como sei se o profissional é confiável?',
        answer: 'Todos os profissionais passam por:\n• Verificação de documentos\n• Checagem de antecedentes\n• Sistema de avaliações de clientes anteriores\n• Badge "Verificado" no perfil',
      },
      {
        question: 'Posso cancelar um serviço agendado?',
        answer: 'Sim, mas há regras de cancelamento:\n• Mais de 24h antes: reembolso de 100%\n• Entre 12-24h: taxa de 50%\n• Menos de 12h: sem reembolso\n\nIsso protege os profissionais que já se organizaram para atendê-lo.',
      },
      {
        question: 'O VITAS é responsável pelo serviço prestado?',
        answer: 'O VITAS é uma plataforma intermediária. Não executamos os serviços diretamente. No entanto, oferecemos garantia de 30 dias para retrabalho e temos um sistema de mediação de conflitos.',
      },
      {
        question: 'Meus dados pessoais estão seguros?',
        answer: 'Sim! Seguimos a LGPD (Lei Geral de Proteção de Dados). Seus dados são criptografados, nunca vendidos a terceiros e usados apenas para conectar você a profissionais. Você pode solicitar exclusão a qualquer momento.',
      },
    ],
  },
  {
    category: '⭐ Avaliações e Garantias',
    items: [
      {
        question: 'Como funciona o sistema de avaliações?',
        answer: 'Após a conclusão do serviço, você avalia:\n• Nota geral (1-5 estrelas)\n• Pontualidade\n• Qualidade do trabalho\n• Comunicação\n• Se recomendaria o profissional\n\nO profissional pode responder sua avaliação.',
      },
      {
        question: 'O que é a garantia de 30 dias?',
        answer: 'Se o mesmo problema reportado inicialmente voltar a ocorrer em até 30 dias, o profissional deve corrigir sem custos adicionais. Não cobre:\n• Novos problemas\n• Danos causados por uso inadequado\n• Desgaste natural',
      },
      {
        question: 'E se eu não ficar satisfeito com o serviço?',
        answer: 'Entre em contato com nosso suporte em até 48h após a conclusão. Analisaremos o caso e, se procedente, mediaremos com o profissional para:\n• Retrabalho gratuito\n• Reembolso parcial ou total\n• Envio de novo profissional',
      },
      {
        question: 'Posso avaliar negativamente?',
        answer: 'Sim, avaliações honestas são bem-vindas. Elas ajudam outros clientes e mantêm a qualidade da plataforma. Avaliações falsas ou ofensivas serão removidas.',
      },
    ],
  },
  {
    category: '📍 Localização e Atendimento',
    items: [
      {
        question: 'O VITAS funciona na minha cidade?',
        answer: 'Operamos nas principais cidades do Brasil. Ao criar seu chamado, verificamos automaticamente se há profissionais ativos na sua região.',
      },
      {
        question: 'Como vocês escolhem os profissionais mais próximos?',
        answer: 'Usamos sua localização (GPS ou CEP) para calcular a distância até os profissionais. Priorizamos os mais próximos com melhor avaliação.',
      },
      {
        question: 'Profissionais veem meu endereço completo?',
        answer: 'Não! Inicialmente eles veem apenas bairro e cidade. O endereço completo é revelado apenas após você aprovar o orçamento.',
      },
      {
        question: 'Posso solicitar serviço para outro endereço?',
        answer: 'Sim! Ao criar o chamado, você pode informar um endereço diferente do seu cadastro.',
      },
    ],
  },
  {
    category: '🆘 Suporte e Ajuda',
    items: [
      {
        question: 'Como entro em contato com o suporte?',
        answer: 'Você pode nos contatar por:\n• Email: suporte@vitas.com.br\n• WhatsApp: (11) 9999-9999 (seg-sex, 8h-18h)\n• Chat no app (em breve)\n\nTempo médio de resposta: 2 horas úteis.',
      },
      {
        question: 'Esqueci minha senha, o que faço?',
        answer: 'Clique em "Esqueci minha senha" na tela de login. Enviaremos um link de recuperação para seu email cadastrado.',
      },
      {
        question: 'Como excluo minha conta?',
        answer: 'Acesse Configurações > Privacidade > Excluir Conta. Seus dados serão removidos em até 30 dias, exceto informações legalmente obrigatórias (transações financeiras são mantidas por 5 anos).',
      },
      {
        question: 'Posso dar feedback ou sugestões?',
        answer: 'Sim! Adoramos ouvir nossos usuários. Envie para feedback@vitas.com.br ou use a seção "Feedback" no app.',
      },
    ],
  },
];

const FAQAccordion: React.FC<{ item: FAQItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <button
        className="faq-question"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{item.question}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="faq-answer">
          <p style={{ whiteSpace: 'pre-line' }}>{item.answer}</p>
        </div>
      )}
    </div>
  );
};

export const FAQ: React.FC = () => {
  return (
    <div className="faq-container">
      <BackButton />

      <div className="faq-header">
        <h1>❓ Perguntas Frequentes</h1>
        <p>Encontre respostas rápidas para as dúvidas mais comuns</p>
      </div>

      <div className="faq-search-hint">
        💡 <strong>Dica:</strong> Use Ctrl+F (ou Cmd+F no Mac) para buscar por palavra-chave
      </div>

      <div className="faq-content">
        {faqData.map((category, index) => (
          <div key={index} className="faq-category">
            <h2 className="faq-category-title">{category.category}</h2>
            <div className="faq-items">
              {category.items.map((item, itemIndex) => (
                <FAQAccordion key={itemIndex} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="faq-footer">
        <div className="faq-contact">
          <h3>Não encontrou o que procurava?</h3>
          <p>Entre em contato com nossa equipe de suporte:</p>
          <div className="faq-contact-methods">
            <a href="mailto:suporte@vitas.com.br" className="faq-contact-btn">
              📧 suporte@vitas.com.br
            </a>
            <a href="https://wa.me/5511999999999" className="faq-contact-btn" target="_blank" rel="noopener noreferrer">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

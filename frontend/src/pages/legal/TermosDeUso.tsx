import { BackButton } from '../../components/BackButton';

export default function TermosDeUso() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <BackButton to="/" />
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Termos de Uso</h1>
          
          <div className="prose prose-blue max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceite dos Termos</h2>
              <p className="text-gray-700">
                Ao utilizar a plataforma VITAS, você concorda com estes Termos de Uso. 
                Se você não concordar, não utilize nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Sobre o Serviço</h2>
              <p className="text-gray-700">
                A VITAS é uma plataforma que conecta clientes e profissionais para 
                prestação de serviços diversos. NÃO somos responsáveis pela execução 
                dos serviços, atuando apenas como intermediários.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Responsabilidades do Cliente</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Fornecer informações verdadeiras e precisas</li>
                <li>Respeitar os profissionais contratados</li>
                <li>Efetuar pagamentos conforme acordado</li>
                <li>Avaliar o serviço prestado honestamente</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Responsabilidades do Profissional</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Possuir qualificação para os serviços oferecidos</li>
                <li>Cumprir prazos e orçamentos acordados</li>
                <li>Executar serviços com qualidade</li>
                <li>Manter documentação em dia</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Pagamentos e Comissões</h2>
              <p className="text-gray-700">
                A VITAS cobra uma comissão de <strong>12% sobre o valor total</strong> de cada 
                serviço realizado através da plataforma. O pagamento é processado de forma 
                segura e o valor é repassado ao profissional em até 2 dias úteis após a conclusão.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cancelamentos</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Até 24h antes:</strong> Reembolso total</li>
                <li><strong>12-24h antes:</strong> Taxa de 50%</li>
                <li><strong>Menos de 12h:</strong> Sem reembolso</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Garantias</h2>
              <p className="text-gray-700">
                Serviços realizados através da plataforma possuem garantia de <strong>30 dias</strong> 
                para retrabalho gratuito, caso o mesmo problema persista. Não cobre uso indevido 
                ou novos problemas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitação de Responsabilidade</h2>
              <p className="text-gray-700">
                A VITAS não se responsabiliza por danos causados durante a execução dos serviços, 
                acidentes, ou disputas entre clientes e profissionais. A plataforma atua apenas 
                como intermediária.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacidade</h2>
              <p className="text-gray-700">
                Seus dados são tratados conforme nossa{' '}
                <a href="/politica-privacidade" className="text-blue-600 hover:underline">
                  Política de Privacidade
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modificações</h2>
              <p className="text-gray-700">
                Reservamos o direito de modificar estes termos a qualquer momento. 
                Usuários serão notificados sobre mudanças significativas.
              </p>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <p className="text-sm text-blue-900">
                <strong>Última atualização:</strong> 05 de janeiro de 2026
              </p>
              <p className="text-sm text-blue-900 mt-2">
                <strong>Contato:</strong> suporte@vitas.com.br
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

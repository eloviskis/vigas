import { BackButton } from '../../components/BackButton';

export default function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <BackButton to="/" />
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Política de Privacidade</h1>
          
          <div className="prose prose-blue max-w-none space-y-6">
            <p className="text-gray-700 text-lg">
              A VITAS respeita sua privacidade e está comprometida com a proteção de seus dados pessoais 
              conforme a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).
            </p>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Dados que Coletamos</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Clientes:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Nome completo</li>
                <li>Email</li>
                <li>Telefone</li>
                <li>Endereço (para prestação de serviços)</li>
                <li>Localização GPS (temporária, para busca de profissionais próximos)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">Profissionais:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Nome completo ou razão social</li>
                <li>CPF/CNPJ</li>
                <li>Email e telefone</li>
                <li>CEP, cidade, estado</li>
                <li>Documentos de verificação (RG, comprovante de endereço)</li>
                <li>Certificações profissionais (quando aplicável)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Como Usamos seus Dados</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Conectar clientes e profissionais</li>
                <li>Processar pagamentos</li>
                <li>Enviar notificações sobre serviços</li>
                <li>Verificar identidade de profissionais</li>
                <li>Melhorar nossos serviços</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Compartilhamento de Dados</h2>
              <p className="text-gray-700">
                Seus dados são compartilhados APENAS quando necessário:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                <li><strong>Profissionais:</strong> Recebem nome, telefone e endereço do cliente para execução do serviço</li>
                <li><strong>Clientes:</strong> Veem nome, telefone e avaliações do profissional</li>
                <li><strong>Gateways de pagamento:</strong> Dados necessários para processar transações</li>
                <li><strong>Autoridades:</strong> Quando exigido por lei</li>
              </ul>
              <p className="text-red-600 font-semibold mt-4">
                ❌ NÃO vendemos seus dados para terceiros
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Localização GPS</h2>
              <p className="text-gray-700">
                Solicitamos sua localização GPS <strong>apenas durante a busca de profissionais</strong> 
                para encontrar os mais próximos de você. Características:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                <li>✅ Uso temporário (não armazenamos)</li>
                <li>✅ Você pode recusar (busca funcionará sem filtro de distância)</li>
                <li>✅ Profissionais NÃO veem sua localização exata (apenas cidade/estado)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Segurança</h2>
              <p className="text-gray-700">
                Implementamos medidas de segurança:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                <li>Criptografia SSL/TLS em todas as comunicações</li>
                <li>Senhas com hash bcrypt</li>
                <li>Tokens JWT com expiração</li>
                <li>Backup diário de dados</li>
                <li>Acesso restrito a dados sensíveis</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Seus Direitos (LGPD)</h2>
              <p className="text-gray-700">
                Você tem direito a:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                <li><strong>Acesso:</strong> Saber quais dados temos sobre você</li>
                <li><strong>Correção:</strong> Atualizar dados incorretos</li>
                <li><strong>Exclusão:</strong> Solicitar remoção de dados</li>
                <li><strong>Portabilidade:</strong> Exportar seus dados</li>
                <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Para exercer seus direitos, entre em contato: <strong>lgpd@vitas.com.br</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies</h2>
              <p className="text-gray-700">
                Utilizamos cookies para:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                <li>Manter você logado</li>
                <li>Lembrar preferências</li>
                <li>Analisar uso da plataforma (Google Analytics)</li>
              </ul>
              <p className="text-gray-700 mt-2">
                Você pode desabilitar cookies no navegador, mas isso pode afetar funcionalidades.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Retenção de Dados</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Dados cadastrais:</strong> Mantidos enquanto sua conta estiver ativa</li>
                <li><strong>Histórico de serviços:</strong> 5 anos (obrigação fiscal)</li>
                <li><strong>Logs de acesso:</strong> 6 meses</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Menores de Idade</h2>
              <p className="text-gray-700">
                Não coletamos intencionalmente dados de menores de 18 anos. Se identificarmos, 
                excluiremos imediatamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Alterações nesta Política</h2>
              <p className="text-gray-700">
                Podemos atualizar esta política periodicamente. Mudanças significativas serão 
                notificadas por email.
              </p>
            </section>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
              <h3 className="font-bold text-green-900 mb-2">Encarregado de Dados (DPO)</h3>
              <p className="text-sm text-green-800">
                Email: <strong>lgpd@vitas.com.br</strong><br />
                Telefone: <strong>(11) 9999-9999</strong>
              </p>
              <p className="text-sm text-green-800 mt-4">
                <strong>Última atualização:</strong> 05 de janeiro de 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

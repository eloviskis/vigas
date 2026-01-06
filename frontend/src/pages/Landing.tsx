import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto border-b border-gray-200">
        <div className="text-3xl font-bold text-blue-600">
          VITAS
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/cadastro-profissional')}
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold"
          >
            Sou Profissional
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow"
          >
            Entrar
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Encontre o profissional certo em 1 clique
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          VITAS conecta você com os melhores profissionais para resolver seus problemas.
          Rápido, seguro e confiável.
        </p>
        <div className="flex gap-6 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="px-10 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-bold shadow-lg"
          >
            Criar Chamado
          </button>
          <button
            onClick={() => {
              /* Download APK */
            }}
            className="px-10 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-lg font-semibold"
          >
            Baixar App Android
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold bg-blue-600">
                1
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Descreva seu problema</h3>
              <p className="text-gray-600">Diga o que precisa ser feito de forma clara e objetiva</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold bg-blue-600">
                2
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Triagem Automática</h3>
              <p className="text-gray-600">
                Nosso sistema recomenda automaticamente os melhores profissionais
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold bg-blue-600">
                3
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Agende e Resolva</h3>
              <p className="text-gray-600">Escolha horário e data que combina melhor com você</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Características</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow flex gap-4 border border-gray-200">
            <div className="text-4xl">⚡</div>
            <div>
              <h3 className="font-bold text-xl mb-2 text-gray-900">Rápido</h3>
              <p className="text-gray-600">Profissional recomendado em segundos</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow flex gap-4 border border-gray-200">
            <div className="text-4xl">🔒</div>
            <div>
              <h3 className="font-bold text-xl mb-2 text-gray-900">Seguro</h3>
              <p className="text-gray-600">Seus dados sempre protegidos</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow flex gap-4 border border-gray-200">
            <div className="text-4xl">⭐</div>
            <div>
              <h3 className="font-bold text-xl mb-2 text-gray-900">Confiável</h3>
              <p className="text-gray-600">Profissionais avaliados pela comunidade</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow flex gap-4 border border-gray-200">
            <div className="text-4xl">📱</div>
            <div>
              <h3 className="font-bold text-xl mb-2 text-gray-900">Mobile</h3>
              <p className="text-gray-600">Acompanhe tudo pelo celular</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-8">Pronto para começar?</h2>
          <button
            onClick={() => navigate('/login')}
            className="px-12 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 text-xl font-bold shadow-lg"
          >
            Criar Meu Primeiro Chamado
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">VITAS</h3>
              <p className="text-gray-400">
                Conectando você aos melhores profissionais
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate('/cadastro-profissional')} className="text-gray-400 hover:text-white">
                    Sou Profissional
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/login')} className="text-gray-400 hover:text-white">
                    Login
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/faq')} className="text-gray-400 hover:text-white">
                    Perguntas Frequentes
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate('/termos-de-uso')} className="text-gray-400 hover:text-white">
                    Termos de Uso
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/politica-privacidade')} className="text-gray-400 hover:text-white">
                    Política de Privacidade
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 VITAS. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

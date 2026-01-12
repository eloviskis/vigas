import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { useToast } from '../../components/Toast';
import { BackButton } from '../../components/BackButton';

const CONTEXTOS = [
  { value: 'RESIDENCIAL', label: 'Residencial (Encanador, Eletricista, Pedreiro...)' },
  { value: 'SAUDE', label: 'Saúde (Médico, Dentista, Fisioterapeuta...)' },
  { value: 'JURIDICO', label: 'Jurídico (Advogado, Despachante...)' },
  { value: 'AUTOMOTIVO', label: 'Automotivo (Mecânico, Funileiro...)' },
  { value: 'BELEZA', label: 'Beleza & Estética (Cabeleireiro, Esteticista...)' },
  { value: 'EDUCACAO', label: 'Educação (Professor, Tutor...)' },
];

const CATEGORIAS: Record<string, string[]> = {
  RESIDENCIAL: ['ENCANADOR', 'ELETRICISTA', 'PEDREIRO', 'PINTOR', 'MARCENEIRO', 'JARDINEIRO', 'LIMPEZA'],
  SAUDE: ['MEDICO', 'DENTISTA', 'FISIOTERAPEUTA', 'PSICOLOGO', 'NUTRICIONISTA', 'ENFERMEIRO'],
  JURIDICO: ['ADVOGADO', 'DESPACHANTE', 'CONTADOR'],
  AUTOMOTIVO: ['MECANICO', 'FUNILEIRO', 'ELETRICISTA_AUTO', 'BORRACHEIRO'],
  BELEZA: ['CABELEIREIRO', 'MANICURE', 'ESTETICISTA', 'MAQUIADOR', 'BARBEIRO'],
  EDUCACAO: ['PROFESSOR', 'TUTOR', 'INSTRUTOR'],
};

export default function CadastroProfissional() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    descricao: '',
    contexto: '',
    categoria: '',
    cep: '',
    cidade: '',
    estado: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar categoria ao mudar contexto
    if (name === 'contexto') {
      setFormData(prev => ({ ...prev, categoria: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post('/profissionais', {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        descricao: formData.descricao,
        contextos: [formData.contexto],
        categorias: [formData.categoria],
        cep: formData.cep,
        cidade: formData.cidade,
        estado: formData.estado,
        status: 'ATIVO',
      });

      addToast('success', 'Cadastro realizado com sucesso! Você receberá um email de confirmação.');
      navigate('/');
    } catch (error: any) {
      addToast('error', error.response?.data?.message || 'Erro ao cadastrar profissional');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <BackButton to="/" />
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Cadastro de Profissional
          </h1>
          <p className="text-gray-600">
            Comece a receber chamados de clientes em busca de seus serviços
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nome Completo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Completo ou Nome Profissional *
              </label>
              <input
                type="text"
                name="nome"
                required
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: João Silva - Encanador"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Este nome será exibido para os clientes
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="seuemail@exemplo.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Telefone/WhatsApp *
              </label>
              <input
                type="tel"
                name="telefone"
                required
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(11) 98765-4321"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Área de Atuação */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Área de Atuação *
              </label>
              <select
                name="contexto"
                required
                value={formData.contexto}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                {CONTEXTOS.map(ctx => (
                  <option key={ctx.value} value={ctx.value}>
                    {ctx.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Profissão */}
            {formData.contexto && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profissão *
                </label>
                <select
                  name="categoria"
                  required
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  {CATEGORIAS[formData.contexto]?.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Descrição */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição dos Serviços *
              </label>
              <textarea
                name="descricao"
                required
                value={formData.descricao}
                onChange={handleChange}
                rows={4}
                placeholder="Descreva sua experiência, especialidades e diferenciais..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 50 caracteres
              </p>
            </div>

            {/* Localização */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                📍 Localização (para clientes próximos encontrarem você)
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CEP *
                  </label>
                  <input
                    type="text"
                    name="cep"
                    required
                    value={formData.cep}
                    onChange={handleChange}
                    placeholder="00000-000"
                    maxLength={9}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    name="cidade"
                    required
                    value={formData.cidade}
                    onChange={handleChange}
                    placeholder="São Paulo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    name="estado"
                    required
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">UF</option>
                    <option value="SP">SP</option>
                    <option value="RJ">RJ</option>
                    <option value="MG">MG</option>
                    <option value="ES">ES</option>
                    <option value="PR">PR</option>
                    <option value="SC">SC</option>
                    <option value="RS">RS</option>
                    <option value="BA">BA</option>
                    <option value="PE">PE</option>
                    <option value="CE">CE</option>
                    <option value="PA">PA</option>
                    <option value="AM">AM</option>
                    <option value="DF">DF</option>
                  </select>
                </div>
              </div>

              <p className="text-xs text-gray-600">
                💡 Seus dados de localização são usados apenas para conectar você com clientes próximos
              </p>
            </div>

            {/* Benefícios */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                ✨ Benefícios de se cadastrar:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Receba chamados de clientes automaticamente</li>
                <li>✓ Gerencie sua agenda online</li>
                <li>✓ Sistema de avaliações que aumenta sua credibilidade</li>
                <li>✓ 100% gratuito, sem mensalidades</li>
              </ul>
            </div>

            {/* Termos */}
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <p>
                Ao se cadastrar, você concorda com nossos{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Termos de Uso
                </a>{' '}
                e{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Política de Privacidade
                </a>
                .
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-wait"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Já é cadastrado?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:underline font-semibold"
            >
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

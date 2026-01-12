import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { triagemService, Triagem } from '../../services/triagemService'
import { chamadoService, Chamado } from '../../services/chamadoService'
import Spinner from '../../components/Spinner'
import { useToast } from '../../components/Toast'

export default function AdminTriagemPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [chamado, setChamado] = useState<Chamado | null>(null)
  const [triagem, setTriagem] = useState<Triagem | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingChamado, setLoadingChamado] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!id) return
    loadChamado()
  }, [id])

  const loadChamado = async () => {
    try {
      setLoadingChamado(true)
      const data = await chamadoService.obter(id!)
      setChamado(data)
    } catch (err: any) {
      setError('Erro ao carregar chamado')
      addToast('error', 'Erro ao carregar chamado')
    } finally {
      setLoadingChamado(false)
    }
  }

  const executarTriagem = async () => {
    if (!id) return
    try {
      setLoading(true)
      const resultado = await triagemService.executar(id, { tipo: 'AUTOMATICA' })
      setTriagem(resultado)
      addToast('success', 'Triagem executada com sucesso!')
    } catch (err: any) {
      const errorMsg = 'Erro ao executar triagem'
      setError(errorMsg)
      addToast('error', errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (loadingChamado) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!chamado) return <div className="p-8">Chamado não encontrado</div>

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Chamado Info */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-2">{chamado.titulo}</h1>
        <p className="text-gray-600 mb-4">{chamado.descricao}</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Contexto</p>
            <p className="font-semibold">{chamado.contexto}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Categoria</p>
            <p className="font-semibold">{chamado.categoria}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Prioridade</p>
            <p className="font-semibold">{chamado.prioridade}</p>
          </div>
        </div>
      </div>

      {/* Triagem Section */}
      {!triagem && (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-bold mb-4">Executar Triagem Automática</h2>
          <p className="text-gray-700 mb-6">
            A triagem automática analisará o contexto, categoria e recomendará o profissional mais qualificado.
          </p>
          <button
            onClick={executarTriagem}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Executando triagem...' : 'Executar Triagem'}
          </button>
        </div>
      )}

      {/* Triagem Result */}
      {triagem && (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Resultado da Triagem</h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Tipo</p>
              <p className="font-semibold text-lg mb-4">{triagem.tipo}</p>

              <p className="text-sm text-gray-600 mb-1">Resultado</p>
              <p className="font-semibold text-lg mb-4">
                {triagem.resultado === 'RECOMENDADO' && '✅ Profissional Recomendado'}
                {triagem.resultado === 'MULTIPLAS_OPCOES' && '⚠️ Múltiplas Opções'}
                {triagem.resultado === 'SEM_PROFISSIONAL' && '❌ Sem Profissional'}
              </p>

              <p className="text-sm text-gray-600 mb-1">Confiança</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${triagem.confiança}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1">{triagem.confiança}%</p>
            </div>
          </div>

          {/* Recommended Professional */}
          {triagem.profissionalRecomendadoId && (
            <div>
              <h3 className="font-bold mb-3">Profissional Recomendado</h3>
              <div className="border rounded-lg p-4 bg-green-50">
                <p className="font-semibold">{triagem.profissionalRecomendadoId}</p>
                <p className="text-sm text-gray-600">ID: {triagem.profissionalRecomendadoId}</p>
              </div>
            </div>
          )}

          {/* Options */}
          {triagem.opcoesProfissionais && triagem.opcoesProfissionais.length > 0 && (
            <div>
              <h3 className="font-bold mb-3">Outras Opções</h3>
              <div className="space-y-2">
                {triagem.opcoesProfissionais.map((profissional) => (
                  <div key={profissional.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{profissional.nome}</p>
                        <p className="text-sm text-gray-600">Score: {profissional.score}</p>
                      </div>
                      <button
                        onClick={() => navigate(`/admin/chamados/${id}/agendamento`)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Agendar com este
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              onClick={() => navigate(`/admin/chamados/${id}/agendamento`)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Agendar Agora
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Voltar
            </button>
          </div>
        </div>
      )}

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
    </div>
  )
}

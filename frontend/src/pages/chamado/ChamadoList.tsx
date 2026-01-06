import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { chamadoService, Chamado } from '../../services/chamadoService'
import { useAuthStore } from '../../stores/authStore'
import Spinner from '../../components/Spinner'
import { BackButton } from '../../components/BackButton'

export default function ChamadoListPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [chamados, setChamados] = useState<Chamado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!user) return

    const loadChamados = async () => {
      try {
        const data = await chamadoService.listarPorUsuario(user.id)
        setChamados(data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar chamados')
      } finally {
        setLoading(false)
      }
    }

    loadChamados()
  }, [user])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ABERTO: 'bg-yellow-100 text-yellow-800',
      TRIADO: 'bg-blue-100 text-blue-800',
      AGENDADO: 'bg-purple-100 text-purple-800',
      CONCLUIDO: 'bg-green-100 text-green-800',
      CANCELADO: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) return <div className="p-8 text-red-600">{error}</div>

  return (
    <div className="space-y-6">
      <BackButton to="/" />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meus Chamados</h2>
        <button
          onClick={() => navigate('/chamados/new')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Novo Chamado
        </button>
      </div>

      {chamados.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">Você ainda não tem nenhum chamado</p>
          <button
            onClick={() => navigate('/chamados/new')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Criar Meu Primeiro Chamado
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {chamados.map((chamado) => (
            <div
              key={chamado.id}
              onClick={() => navigate(`/chamados/${chamado.id}`)}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{chamado.titulo}</h3>
                  <p className="text-gray-600 text-sm">{chamado.descricao}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(chamado.status)}`}>
                  {chamado.status}
                </span>
              </div>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>📍 {chamado.contexto}</span>
                <span>📂 {chamado.categoria}</span>
                <span>🎯 {chamado.prioridade}</span>
                <span>{new Date(chamado.criadoEm).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

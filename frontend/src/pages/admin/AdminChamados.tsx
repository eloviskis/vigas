import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { chamadoService, Chamado } from '../../services/chamadoService'
import Spinner from '../../components/Spinner'

export default function AdminChamadosPage() {
  const navigate = useNavigate()
  const [chamados, setChamados] = useState<Chamado[]>([])
  const [filter, setFilter] = useState<string>('ABERTO')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    loadChamados()
  }, [])

  const loadChamados = async () => {
    try {
      setLoading(true)
      const data = await chamadoService.listarTodos()
      setChamados(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar chamados')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ABERTO: 'bg-red-100 text-red-800',
      TRIADO: 'bg-blue-100 text-blue-800',
      AGENDADO: 'bg-purple-100 text-purple-800',
      CONCLUIDO: 'bg-green-100 text-green-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gerenciar Chamados</h1>

      {loading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Filters */}
          <div className="flex gap-2">
            {['ABERTO', 'TRIADO', 'AGENDADO', 'CONCLUIDO'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Chamados Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Título</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Usuário</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contexto</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {chamados.filter((c) => c.status === filter).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Nenhum chamado com status {filter}
                    </td>
                  </tr>
                ) : (
                  chamados
                    .filter((c) => c.status === filter)
                    .map((chamado) => (
                      <tr key={chamado.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{chamado.titulo}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{chamado.usuarioId}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(chamado.status)}`}
                          >
                            {chamado.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{chamado.contexto}</td>
                        <td className="px-6 py-4 text-sm">
                          {chamado.status === 'ABERTO' && (
                            <button
                              onClick={() => navigate(`/admin/triagem/${chamado.id}`)}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Fazer Triagem
                            </button>
                          )}
                          {chamado.status === 'TRIADO' && (
                            <button
                              onClick={() => navigate(`/admin/agendamento/${chamado.id}`)}
                              className="text-green-600 hover:text-green-800 font-medium"
                            >
                              Agendar
                            </button>
                          )}
                          {['AGENDADO', 'CONCLUIDO'].includes(chamado.status) && (
                            <button
                              onClick={() => navigate(`/chamados/${chamado.id}`)}
                              className="text-gray-600 hover:text-gray-800 font-medium"
                            >
                              Ver Detalhes
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

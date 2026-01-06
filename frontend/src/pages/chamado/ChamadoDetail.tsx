import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { chamadoService, Chamado, ChamadoHistorico } from '../../services/chamadoService'
import { agendamentoService, Agendamento } from '../../services/agendamentoService'
import Spinner from '../../components/Spinner'
import { BackButton } from '../../components/BackButton'

export default function ChamadoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [chamado, setChamado] = useState<Chamado | null>(null)
  const [historico, setHistorico] = useState<ChamadoHistorico[]>([])
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!id) return

    const loadData = async () => {
      try {
        const [chamadoData, historicoData, agendamentosData] = await Promise.all([
          chamadoService.obter(id),
          chamadoService.obterHistorico(id),
          agendamentoService.listar(id),
        ])
        setChamado(chamadoData)
        setHistorico(historicoData)
        setAgendamentos(agendamentosData)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) return <div className="p-8 text-red-600">{error}</div>
  if (!chamado) return <div className="p-8">Chamado não encontrado</div>

  return (
    <div className="space-y-8">
      <BackButton to="/chamados" />
      {/* Chamado Details */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{chamado.titulo}</h1>
            <p className="text-gray-600 mt-2">{chamado.descricao}</p>
          </div>
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">{chamado.status}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
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
          <div>
            <p className="text-sm text-gray-600">Criado em</p>
            <p className="font-semibold">{new Date(chamado.criadoEm).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>

      {/* Agendamentos */}
      {agendamentos.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Agendamentos</h2>
          <div className="space-y-4">
            {agendamentos.map((agendamento) => (
              <div key={agendamento.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{agendamento.profissionalId}</p>
                    <p className="text-sm text-gray-600">Status: {agendamento.status}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    {agendamento.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline/Histórico */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Timeline</h2>
        <div className="space-y-4">
          {historico.length === 0 ? (
            <p className="text-gray-600">Nenhum evento registrado</p>
          ) : (
            historico.map((evento) => (
              <div key={evento.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{evento.tipo}</p>
                  <p className="text-gray-600">{evento.descricao}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(evento.criadoEm).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { agendamentoService } from '../../services/agendamentoService'
import { chamadoService, Chamado } from '../../services/chamadoService'

export default function AdminAgendamentoPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [chamado, setChamado] = useState<Chamado | null>(null)
  const [slots] = useState<any[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [profissionalId] = useState<string>('') // TODO: Vem da triagem
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!id) return
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      const chamadoData = await chamadoService.obter(id!)
      setChamado(chamadoData)
      // TODO: Carregar slots do profissional recomendado
      setLoading(false)
    } catch (err: any) {
      setError('Erro ao carregar dados')
      setLoading(false)
    }
  }

  const handleAgendar = async () => {
    if (!id || !selectedSlot || !profissionalId) return

    try {
      setLoading(true)
      await agendamentoService.criar(id, {
        chamadoId: id,
        profissionalId: profissionalId,
        slotId: selectedSlot,
      })
      navigate(`/chamados/${id}`)
    } catch (err: any) {
      setError('Erro ao criar agendamento')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8">Carregando...</div>
  if (!chamado) return <div className="p-8">Chamado não encontrado</div>

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Chamado Info */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-2">{chamado.titulo}</h1>
        <p className="text-gray-600">{chamado.descricao}</p>
      </div>

      {/* Slots Selection */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Selecione um horário disponível</h2>

        {slots.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p>Nenhum slot disponível para este profissional</p>
            <p className="text-sm mt-2">TODO: Implementar carregamento de slots do profissional</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {slots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
                className={`p-4 border-2 rounded-lg text-center transition ${
                  selectedSlot === slot.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <p className="font-semibold">{new Date(slot.dataHora).toLocaleDateString('pt-BR')}</p>
                <p className="text-sm text-gray-600">{new Date(slot.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleAgendar}
          disabled={!selectedSlot || loading}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
        >
          {loading ? 'Agendando...' : 'Confirmar Agendamento'}
        </button>
        <button
          onClick={() => navigate('/admin')}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          Cancelar
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
    </div>
  )
}

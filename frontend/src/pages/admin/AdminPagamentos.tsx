import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { pagamentoService } from '../../services/pagamentoService'
import { Pagamento, StatusPagamento } from '../../types/pagamento'

export default function AdminPagamentosPage() {
  const navigate = useNavigate()
  const [profissionalId, setProfissionalId] = useState('')
  const [orcamentoId, setOrcamentoId] = useState('')
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)
  const [filtroStatus, setFiltroStatus] = useState<string>('')
  const [filtroMetodo, setFiltroMetodo] = useState<string>('')
  const [filtroInicio, setFiltroInicio] = useState<string>('')
  const [filtroFim, setFiltroFim] = useState<string>('')

  const buscarPorProfissional = async () => {
    setError('')
    setLoading(true)
    try {
      const data = await pagamentoService.listarPorProfissional(Number(profissionalId))
      setPagamentos(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar pagamentos por profissional')
    } finally {
      setLoading(false)
    }
  }

  const cancelar = async (id: number) => {
    if (!window.confirm('Confirmar cancelamento deste pagamento?')) return;
    setActionLoadingId(id)
    setError('')
    try {
      const atualizado = await pagamentoService.cancelar(id, 'Cancelado pelo operador')
      setPagamentos((prev) => prev.map((p) => (p.id === id ? atualizado : p)))
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao cancelar pagamento')
    } finally {
      setActionLoadingId(null)
    }
  }

  const estornar = async (id: number) => {
    if (!window.confirm('Confirmar estorno deste pagamento aprovado?')) return;
    setActionLoadingId(id)
    setError('')
    try {
      const atualizado = await pagamentoService.estornar(id, 'Estornado pelo operador')
      setPagamentos((prev) => prev.map((p) => (p.id === id ? atualizado : p)))
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao estornar pagamento')
    } finally {
      setActionLoadingId(null)
    }
  }

  const buscarPorOrcamento = async () => {
    setError('')
    setLoading(true)
    try {
      const pagamento = await pagamentoService.obterPorOrcamento(orcamentoId)
      setPagamentos(pagamento ? [pagamento as any] : [])
    } catch (err: any) {
      setError(err.response?.data?.message || 'Pagamento não encontrado para este orçamento')
      setPagamentos([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Pagamentos</h1>
        <button
          className="px-3 py-2 bg-gray-200 rounded"
          onClick={() => navigate('/admin')}
        >
          Voltar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Buscar por Profissional</h2>
          <div className="flex gap-2">
            <input
              type="text"
              className="border p-2 rounded w-full"
              placeholder="ID do profissional"
              value={profissionalId}
              onChange={(e) => setProfissionalId(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={buscarPorProfissional}
              disabled={!profissionalId || loading}
            >
              Buscar
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Buscar por Orçamento</h2>
          <div className="flex gap-2">
            <input
              type="text"
              className="border p-2 rounded w-full"
              placeholder="ID do orçamento"
              value={orcamentoId}
              onChange={(e) => setOrcamentoId(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={buscarPorOrcamento}
              disabled={!orcamentoId || loading}
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              className="border p-2 rounded w-full"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="">Todos</option>
              <option value={StatusPagamento.PENDENTE}>Pendente</option>
              <option value={StatusPagamento.APROVADO}>Aprovado</option>
              <option value={StatusPagamento.RECUSADO}>Recusado</option>
              <option value={StatusPagamento.CANCELADO}>Cancelado</option>
              <option value={StatusPagamento.ESTORNADO}>Estornado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Método</label>
            <select
              className="border p-2 rounded w-full"
              value={filtroMetodo}
              onChange={(e) => setFiltroMetodo(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="PIX">PIX</option>
              <option value="CREDITO">Crédito</option>
              <option value="DEBITO">Débito</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Data início</label>
            <input
              type="date"
              className="border p-2 rounded w-full"
              value={filtroInicio}
              onChange={(e) => setFiltroInicio(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Data fim</label>
            <input
              type="date"
              className="border p-2 rounded w-full"
              value={filtroFim}
              onChange={(e) => setFiltroFim(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Orçamento</th>
              <th className="px-4 py-2 text-left">Profissional</th>
              <th className="px-4 py-2 text-left">Valor</th>
              <th className="px-4 py-2 text-left">Método</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Criado</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pagamentos
              .filter((p) => {
                if (filtroStatus && p.status !== filtroStatus) return false
                if (filtroMetodo && p.metodoPagamento !== filtroMetodo) return false
                if (filtroInicio) {
                  const inicio = new Date(filtroInicio)
                  if (new Date(p.criadoEm) < inicio) return false
                }
                if (filtroFim) {
                  const fim = new Date(filtroFim)
                  // incluir fim do dia
                  fim.setHours(23, 59, 59, 999)
                  if (new Date(p.criadoEm) > fim) return false
                }
                return true
              })
              .map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2">{p.id}</td>
                <td className="px-4 py-2">{p.orcamentoId}</td>
                <td className="px-4 py-2">{p.profissionalId}</td>
                <td className="px-4 py-2">R$ {Number(p.valorTotal).toFixed(2)}</td>
                <td className="px-4 py-2">{p.metodoPagamento}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    p.status === StatusPagamento.APROVADO ? 'bg-green-100 text-green-700' :
                    p.status === StatusPagamento.PENDENTE ? 'bg-yellow-100 text-yellow-700' :
                    p.status === StatusPagamento.RECUSADO ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{p.status}</span>
                </td>
                <td className="px-4 py-2">{new Date(p.criadoEm).toLocaleString('pt-BR')}</td>
                <td className="px-4 py-2 flex gap-2">
                  {p.status === StatusPagamento.PENDENTE && (
                    <button
                      className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded"
                      onClick={() => cancelar(p.id)}
                      disabled={actionLoadingId === p.id || loading}
                    >
                      {actionLoadingId === p.id ? 'Cancelando...' : 'Cancelar'}
                    </button>
                  )}
                  {p.status === StatusPagamento.APROVADO && (
                    <button
                      className="px-3 py-1 bg-red-200 text-red-800 rounded"
                      onClick={() => estornar(p.id)}
                      disabled={actionLoadingId === p.id || loading}
                    >
                      {actionLoadingId === p.id ? 'Estornando...' : 'Estornar'}
                    </button>
                  )}
                </td>
              </tr>
              ))}
            {pagamentos
              .filter((p) => {
                if (filtroStatus && p.status !== filtroStatus) return false
                if (filtroMetodo && p.metodoPagamento !== filtroMetodo) return false
                if (filtroInicio && new Date(p.criadoEm) < new Date(filtroInicio)) return false
                if (filtroFim) {
                  const fim = new Date(filtroFim)
                  fim.setHours(23, 59, 59, 999)
                  if (new Date(p.criadoEm) > fim) return false
                }
                return true
              })
              .length === 0 && (
              <tr>
                <td className="px-4 py-4 text-center text-gray-500" colSpan={8}>
                  Nenhum pagamento encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

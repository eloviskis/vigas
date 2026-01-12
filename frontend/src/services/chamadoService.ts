import apiClient from './apiClient'

export interface Chamado {
  id: string
  usuarioId: string
  titulo: string
  descricao: string
  contexto: string
  categoria: string
  status: 'ABERTO' | 'TRIADO' | 'AGENDADO' | 'CONCLUIDO' | 'CANCELADO'
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA'
  criadoEm: string
  atualizadoEm: string
}

export interface CriarChamadoRequest {
  usuarioId: string
  titulo: string
  descricao: string
  contexto: string
  categoria?: string
  prioridade?: string
}

export interface ChamadoHistorico {
  id: string
  chamadoId: string
  tipo: 'STATUS' | 'TRIAGEM' | 'AGENDAMENTO' | 'NOTA' | 'SISTEMA'
  descricao: string
  metadata: Record<string, any>
  criadoEm: string
}

export const chamadoService = {
  // Chamados
  criar: async (data: CriarChamadoRequest): Promise<Chamado> => {
    const response = await apiClient.post<Chamado>('/chamados', data)
    return response.data
  },

  listarTodos: async (): Promise<Chamado[]> => {
    const response = await apiClient.get<Chamado[]>('/chamados/all')
    return response.data
  },

  listarPorUsuario: async (usuarioId: string): Promise<Chamado[]> => {
    const response = await apiClient.get<Chamado[]>(`/chamados/usuario/${usuarioId}`)
    return response.data
  },

  obter: async (id: string): Promise<Chamado> => {
    const response = await apiClient.get<Chamado>(`/chamados/${id}`)
    return response.data
  },

  atualizar: async (id: string, data: Partial<Chamado>): Promise<Chamado> => {
    const response = await apiClient.put<Chamado>(`/chamados/${id}`, data)
    return response.data
  },

  deletar: async (id: string): Promise<void> => {
    await apiClient.delete(`/chamados/${id}`)
  },

  // Histórico
  obterHistorico: async (chamadoId: string): Promise<ChamadoHistorico[]> => {
    const response = await apiClient.get<ChamadoHistorico[]>(
      `/chamados/${chamadoId}/historico`,
    )
    return response.data
  },

  adicionarNota: async (chamadoId: string, descricao: string): Promise<ChamadoHistorico> => {
    const response = await apiClient.post<ChamadoHistorico>(
      `/chamados/${chamadoId}/historico`,
      { tipo: 'NOTA', descricao },
    )
    return response.data
  },
}

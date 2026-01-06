import apiClient from './apiClient'

export interface Slot {
  id: string
  profissionalId: string
  dataHora: string
  disponivel: boolean
  agendamentoId?: string
  criadoEm: string
}

export interface CriarSlotRequest {
  profissionalId: string
  dataHora: string
}

export interface CriarSlotEmLoteRequest {
  profissionalId: string
  dataInicio: string
  dataFim: string
  intervaloMinutos: number
}

export interface Agendamento {
  id: string
  chamadoId: string
  profissionalId: string
  slotId: string
  status: 'PENDENTE' | 'CONFIRMADO' | 'EM_ATENDIMENTO' | 'CONCLUIDO' | 'CANCELADO'
  inicioAtendimento?: string
  fimAtendimento?: string
  criadoEm: string
}

export interface CriarAgendamentoRequest {
  chamadoId: string
  profissionalId: string
  slotId: string
}

export const slotService = {
  criar: async (data: CriarSlotRequest): Promise<Slot> => {
    const response = await apiClient.post<Slot>(
      `/profissionais/${data.profissionalId}/slots`,
      data,
    )
    return response.data
  },

  criarEmLote: async (data: CriarSlotEmLoteRequest): Promise<Slot[]> => {
    const response = await apiClient.post<Slot[]>(
      `/profissionais/${data.profissionalId}/slots`,
      data,
    )
    return response.data
  },

  listar: async (
    profissionalId: string,
    filtros?: { dataInicio?: string; dataFim?: string },
  ): Promise<Slot[]> => {
    const response = await apiClient.get<Slot[]>(
      `/profissionais/${profissionalId}/slots`,
      { params: filtros },
    )
    return response.data
  },

  obter: async (profissionalId: string, slotId: string): Promise<Slot> => {
    const response = await apiClient.get<Slot>(
      `/profissionais/${profissionalId}/slots/${slotId}`,
    )
    return response.data
  },
}

export const agendamentoService = {
  criar: async (chamadoId: string, data: CriarAgendamentoRequest): Promise<Agendamento> => {
    const response = await apiClient.post<Agendamento>(
      `/chamados/${chamadoId}/agendamentos`,
      data,
    )
    return response.data
  },

  listar: async (chamadoId: string): Promise<Agendamento[]> => {
    const response = await apiClient.get<Agendamento[]>(`/chamados/${chamadoId}/agendamentos`)
    return response.data
  },

  confirmar: async (chamadoId: string, agendamentoId: string): Promise<Agendamento> => {
    const response = await apiClient.put<Agendamento>(
      `/chamados/${chamadoId}/agendamentos/${agendamentoId}/confirmar`,
    )
    return response.data
  },

  cancelar: async (chamadoId: string, agendamentoId: string): Promise<Agendamento> => {
    const response = await apiClient.put<Agendamento>(
      `/chamados/${chamadoId}/agendamentos/${agendamentoId}/cancelar`,
    )
    return response.data
  },

  iniciar: async (chamadoId: string, agendamentoId: string): Promise<Agendamento> => {
    const response = await apiClient.put<Agendamento>(
      `/chamados/${chamadoId}/agendamentos/${agendamentoId}/iniciar`,
    )
    return response.data
  },

  concluir: async (chamadoId: string, agendamentoId: string): Promise<Agendamento> => {
    const response = await apiClient.put<Agendamento>(
      `/chamados/${chamadoId}/agendamentos/${agendamentoId}/concluir`,
    )
    return response.data
  },
}

import apiClient from './apiClient'

export interface Triagem {
  id: string
  chamadoId: string
  tipo: 'AUTOMATICA' | 'ASSISTIDA' | 'MANUAL'
  resultado: 'RECOMENDADO' | 'MULTIPLAS_OPCOES' | 'SEM_PROFISSIONAL' | 'REQUER_VALIDACAO'
  profissionalRecomendadoId: string
  opcoesProfissionais: Array<{
    id: string
    nome: string
    score: number
    distancia?: number
    disponibilidade?: boolean
  }>
  confiança: number
  criadoEm: string
}

export interface TriagemRequest {
  tipo: 'AUTOMATICA' | 'ASSISTIDA' | 'MANUAL'
}

export interface RecomendacaoManualRequest {
  profissionalId: string
  justificativa: string
}

export const triagemService = {
  executar: async (chamadoId: string, data: TriagemRequest): Promise<Triagem> => {
    const response = await apiClient.post<Triagem>(`/chamados/${chamadoId}/triagem`, data)
    return response.data
  },

  obter: async (chamadoId: string): Promise<Triagem> => {
    const response = await apiClient.get<Triagem>(`/chamados/${chamadoId}/triagem`)
    return response.data
  },

  recomendacaoManual: async (triagemId: string, data: RecomendacaoManualRequest): Promise<Triagem> => {
    const response = await apiClient.put<Triagem>(`/triagem/${triagemId}/recomendacao`, data)
    return response.data
  },
}

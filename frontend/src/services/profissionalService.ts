import apiClient from './apiClient'

export interface Profissional {
  id: string
  nome: string
  email: string
  telefone: string
  contextos: string[]
  categorias: string[]
  score: number
  taxaSatisfacao: number
  disponivel: boolean
  criadoEm: string
}

export interface CriarProfissionalRequest {
  nome: string
  email: string
  telefone: string
  contextos: string[]
  categorias: string[]
}

export const profissionalService = {
  criar: async (data: CriarProfissionalRequest): Promise<Profissional> => {
    const response = await apiClient.post<Profissional>('/profissionais', data)
    return response.data
  },

  listar: async (contexto?: string): Promise<Profissional[]> => {
    const params = contexto ? { contexto } : {}
    const response = await apiClient.get<Profissional[]>('/profissionais', { params })
    return response.data
  },

  obter: async (id: string): Promise<Profissional> => {
    const response = await apiClient.get<Profissional>(`/profissionais/${id}`)
    return response.data
  },

  atualizar: async (id: string, data: Partial<Profissional>): Promise<Profissional> => {
    const response = await apiClient.put<Profissional>(`/profissionais/${id}`, data)
    return response.data
  },

  obterTaxaSatisfacao: async (id: string): Promise<{ taxa: number; avaliadores: number }> => {
    const response = await apiClient.get(`/profissionais/${id}/taxa-satisfacao`)
    return response.data
  },
}

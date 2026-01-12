import apiClient from './apiClient';
import { Orcamento, CriarOrcamentoDto } from '../types/orcamento';

export const orcamentoService = {
  criar: async (dto: CriarOrcamentoDto): Promise<Orcamento> => {
    const { data } = await apiClient.post('/orcamentos', dto);
    return data;
  },

  listarPorChamado: async (chamadoId: string): Promise<Orcamento[]> => {
    const { data } = await apiClient.get(`/orcamentos/chamado/${chamadoId}`);
    return data;
  },

  listarPorProfissional: async (profissionalId: string): Promise<Orcamento[]> => {
    const { data } = await apiClient.get(`/orcamentos/profissional/${profissionalId}`);
    return data;
  },

  obterPorId: async (id: string): Promise<Orcamento> => {
    const { data } = await apiClient.get(`/orcamentos/${id}`);
    return data;
  },

  aprovar: async (orcamentoId: string): Promise<Orcamento> => {
    const { data } = await apiClient.patch('/orcamentos/aprovar', { orcamentoId });
    return data;
  },

  recusar: async (orcamentoId: string, motivoRecusa?: string): Promise<Orcamento> => {
    const { data } = await apiClient.patch('/orcamentos/recusar', {
      orcamentoId,
      motivoRecusa,
    });
    return data;
  },

  cancelar: async (id: string): Promise<Orcamento> => {
    const { data } = await apiClient.patch(`/orcamentos/${id}/cancelar`);
    return data;
  },
};

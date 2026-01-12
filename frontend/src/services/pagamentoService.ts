import apiClient from './apiClient';
import { CriarPagamentoDto, PagamentoResponse, Pagamento } from '../types/pagamento';

const BASE_URL = '/pagamentos';

export const pagamentoService = {
  /**
   * Inicia um pagamento para um orçamento aprovado
   */
  async criar(dto: CriarPagamentoDto): Promise<PagamentoResponse> {
    const response = await apiClient.post<PagamentoResponse>(BASE_URL, dto);
    return response.data;
  },

  /**
   * Busca um pagamento específico
   */
  async obterPorId(id: number): Promise<PagamentoResponse> {
    const response = await apiClient.get<PagamentoResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Busca pagamento por orçamento
   */
  async obterPorOrcamento(orcamentoId: string): Promise<PagamentoResponse> {
    const response = await apiClient.get<PagamentoResponse>(`${BASE_URL}/orcamento/${orcamentoId}`);
    return response.data;
  },

  /**
   * Lista todos os pagamentos de um profissional
   */
  async listarPorProfissional(profissionalId: number): Promise<Pagamento[]> {
    const response = await apiClient.get<Pagamento[]>(`${BASE_URL}/profissional/${profissionalId}`);
    return response.data;
  },

  /**
   * Confirma um pagamento manualmente (para testes)
   */
  async confirmar(id: number): Promise<Pagamento> {
    const response = await apiClient.patch<Pagamento>(`${BASE_URL}/${id}/confirmar`);
    return response.data;
  },

  /**
   * Cancela um pagamento pendente
   */
  async cancelar(id: number, motivo: string): Promise<Pagamento> {
    const response = await apiClient.patch<Pagamento>(`${BASE_URL}/${id}/cancelar`, { motivo });
    return response.data;
  },

  /**
   * Estorna um pagamento aprovado (reembolso)
   */
  async estornar(id: number, motivo: string): Promise<Pagamento> {
    const response = await apiClient.patch<Pagamento>(`${BASE_URL}/${id}/estornar`, { motivo });
    return response.data;
  },
};

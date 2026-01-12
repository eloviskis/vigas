import { apiClient } from './apiClient';

export interface CriarFollowupDto {
  agendamentoId: string;
  tipo: 'CONFIRMACAO' | 'LEMBRANCA' | 'FEEDBACK' | 'RESOLUCAO';
  mensagem: string;
}

export interface ResponderFollowupDto {
  resposta: string;
  avaliacaoGeral?: number;
  avaliacaoProfissional?: number;
  comentarios?: string;
}

export interface Followup {
  id: string;
  agendamentoId: string;
  tipo: 'CONFIRMACAO' | 'LEMBRANCA' | 'FEEDBACK' | 'RESOLUCAO';
  status: 'PENDENTE' | 'ENVIADO' | 'RESPONDIDO' | 'EXPIRADO';
  mensagem: string;
  avaliacaoGeral?: number;
  avaliacaoProfissional?: number;
  resposta?: string;
  comentarios?: string;
  criadoEm: Date;
  dataEnvio?: Date;
  dataResposta?: Date;
}

class FollowupService {
  async criar(dto: CriarFollowupDto): Promise<Followup> {
    const response = await apiClient.post('/followups', dto);
    return response.data;
  }

  async obter(id: string): Promise<Followup> {
    const response = await apiClient.get(`/followups/${id}`);
    return response.data;
  }

  async listarPorAgendamento(agendamentoId: string): Promise<Followup[]> {
    const response = await apiClient.get(
      `/followups/agendamento/${agendamentoId}`
    );
    return response.data;
  }

  async enviar(id: string): Promise<Followup> {
    const response = await apiClient.put(`/followups/${id}/enviar`);
    return response.data;
  }

  async responder(id: string, dto: ResponderFollowupDto): Promise<Followup> {
    const response = await apiClient.put(`/followups/${id}/responder`, dto);
    return response.data;
  }

  async listarPendentes(): Promise<Followup[]> {
    const response = await apiClient.get('/followups/pendentes/lista');
    return response.data;
  }

  async obterMetricas(): Promise<{
    totalFollowups: number;
    respondidos: number;
    taxaResposta: number;
    avaliacaoMedia: number;
  }> {
    const response = await apiClient.get('/followups/metricas/geral');
    return response.data;
  }
}

export const followupService = new FollowupService();

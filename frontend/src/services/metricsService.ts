const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface DashboardMetrics {
  chamadosAbertos: number;
  chamadosEmAtendimento: number;
  chamadosConcluidos: number;
  taxaConversao: number;
  ticketMedio: number;
  funil: FunilEtapa[];
  nps: NPSData;
  tendencias: {
    chamadosAbertosVariacao: number;
    concluidosVariacao: number;
    conversaoVariacao: number;
    ticketVariacao: number;
  };
}

export interface FunilEtapa {
  etapa: string;
  valor: number;
}

export interface NPSData {
  promotores: number;
  neutros: number;
  detratores: number;
  score: number;
}

export const metricsService = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/api/metrics/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard metrics');
    }

    return response.json();
  },
};

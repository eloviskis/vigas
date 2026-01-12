export interface Orcamento {
  id: string;
  chamadoId: string;
  profissionalId: string;
  profissionalNome?: string;
  profissionalScore?: number;
  valorServico: number;
  valorDeslocamento: number;
  valorMateriais: number;
  valorTotal: number;
  descricaoDetalhada: string;
  prazoExecucao: string;
  validadeAte: Date;
  status: 'ENVIADO' | 'APROVADO' | 'RECUSADO' | 'EXPIRADO' | 'CANCELADO';
  observacoes?: string;
  motivoRecusa?: string;
  criadoEm: Date;
  aprovadoEm?: Date;
}

export interface CriarOrcamentoDto {
  chamadoId: string;
  profissionalId: string;
  valorServico: number;
  valorDeslocamento?: number;
  valorMateriais?: number;
  descricaoDetalhada: string;
  prazoExecucao: string;
  observacoes?: string;
}

export enum StatusPagamento {
  PENDENTE = 'PENDENTE',
  PROCESSANDO = 'PROCESSANDO',
  APROVADO = 'APROVADO',
  RECUSADO = 'RECUSADO',
  CANCELADO = 'CANCELADO',
  ESTORNADO = 'ESTORNADO',
}

export enum MetodoPagamento {
  PIX = 'PIX',
  CREDITO = 'CREDITO',
  DEBITO = 'DEBITO',
  BOLETO = 'BOLETO',
}

export interface Pagamento {
  id: number;
  orcamentoId: string;
  profissionalId: number;
  valorTotal: number;
  valorProfissional: number;
  valorPlataforma: number;
  status: StatusPagamento;
  metodoPagamento: MetodoPagamento;
  mercadoPagoId?: string;
  mercadoPagoStatus?: string;
  pixQrCode?: string;
  pixQrCodeData?: string;
  pixChave?: string;
  linkPagamento?: string;
  dataExpiracao?: Date;
  dataAprovacao?: Date;
  dataCancelamento?: Date;
  motivoCancelamento?: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CriarPagamentoDto {
  orcamentoId: string;
  metodoPagamento: MetodoPagamento;
  email?: string;
  cpf?: string;
}

export interface PagamentoResponse {
  id: number;
  orcamentoId: string;
  valorTotal: number;
  valorProfissional: number;
  valorPlataforma: number;
  status: StatusPagamento;
  metodoPagamento: MetodoPagamento;
  pixQrCode?: string;
  pixQrCodeData?: string;
  linkPagamento?: string;
  dataExpiracao?: Date;
  criadoEm: Date;
}

import { MetodoPagamento } from '../entities/pagamento.entity';
export declare class CriarPagamentoDto {
    orcamentoId: string;
    metodoPagamento: MetodoPagamento;
    email?: string;
    cpf?: string;
}
export declare class PagamentoResponseDto {
    id: number;
    orcamentoId: string;
    valorTotal: number;
    valorProfissional: number;
    valorPlataforma: number;
    status: string;
    metodoPagamento: string;
    pixQrCode?: string;
    pixQrCodeData?: string;
    linkPagamento?: string;
    dataExpiracao?: Date;
    criadoEm: Date;
}
export declare class WebhookMercadoPagoDto {
    action?: string;
    api_version?: string;
    data?: {
        id: string;
    };
    date_created?: string;
    id?: number;
    live_mode?: string;
    type?: string;
    user_id?: string;
}
export declare class CancelarPagamentoDto {
    motivo: string;
}

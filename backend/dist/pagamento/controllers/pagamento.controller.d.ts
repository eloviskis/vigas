import { PagamentoService } from '../services/pagamento.service';
import { CriarPagamentoDto, PagamentoResponseDto, WebhookMercadoPagoDto, CancelarPagamentoDto } from '../dtos/pagamento.dto';
export declare class PagamentoController {
    private readonly pagamentoService;
    constructor(pagamentoService: PagamentoService);
    /**
     * POST /api/pagamentos
     * Inicia um pagamento para um orçamento aprovado
     */
    criar(dto: CriarPagamentoDto): Promise<PagamentoResponseDto>;
    /**
     * GET /api/pagamentos/:id
     * Busca um pagamento específico
     */
    obterPorId(id: number): Promise<PagamentoResponseDto>;
    /**
     * GET /api/pagamentos/orcamento/:orcamentoId
     * Busca pagamento por orçamento
     */
    obterPorOrcamento(orcamentoId: string): Promise<PagamentoResponseDto>;
    /**
     * GET /api/pagamentos/profissional/:profissionalId
     * Lista todos os pagamentos de um profissional
     */
    listarPorProfissional(profissionalId: number): Promise<import("../entities/pagamento.entity").Pagamento[]>;
    /**
     * PATCH /api/pagamentos/:id/confirmar
     * Confirma um pagamento manualmente (para testes)
     */
    confirmar(id: number): Promise<import("../entities/pagamento.entity").Pagamento>;
    /**
     * PATCH /api/pagamentos/:id/cancelar
     * Cancela um pagamento pendente
     */
    cancelar(id: number, dto: CancelarPagamentoDto): Promise<import("../entities/pagamento.entity").Pagamento>;
    /**
     * PATCH /api/pagamentos/:id/estornar
     * Estorna um pagamento aprovado (reembolso)
     */
    estornar(id: number, dto: CancelarPagamentoDto): Promise<import("../entities/pagamento.entity").Pagamento>;
    /**
     * POST /api/pagamentos/webhook
     * Recebe notificações do Mercado Pago
     * Não usa guard porque é chamado pelo MP
     */
    webhook(data: WebhookMercadoPagoDto): Promise<{
        status: string;
    }>;
}

import { Repository } from 'typeorm';
import { Pagamento } from '../entities/pagamento.entity';
import { Orcamento } from '../../orcamento/entities/orcamento.entity';
import { CriarPagamentoDto } from '../dtos/pagamento.dto';
export declare class PagamentoService {
    private pagamentoRepository;
    private orcamentoRepository;
    constructor(pagamentoRepository: Repository<Pagamento>, orcamentoRepository: Repository<Orcamento>);
    /**
     * Inicia um novo pagamento para um orçamento aprovado
     */
    iniciarPagamento(dto: CriarPagamentoDto): Promise<Pagamento>;
    /**
     * Busca pagamento por ID
     */
    obterPorId(id: number): Promise<Pagamento>;
    /**
     * Busca pagamento por orçamento
     */
    obterPorOrcamento(orcamentoId: string): Promise<Pagamento>;
    /**
     * Lista todos os pagamentos de um profissional
     */
    listarPorProfissional(profissionalId: number): Promise<Pagamento[]>;
    /**
     * Confirma pagamento (chamado pelo webhook ou manualmente)
     */
    confirmarPagamento(id: number, mercadoPagoId?: string, mercadoPagoStatus?: string): Promise<Pagamento>;
    /**
     * Cancela pagamento
     */
    cancelarPagamento(id: number, motivo: string): Promise<Pagamento>;
    /**
     * Estorna pagamento (reembolso)
     */
    estornarPagamento(id: number, motivo: string): Promise<Pagamento>;
    /**
     * Processa webhook do Mercado Pago
     */
    processarWebhook(data: any): Promise<void>;
    /**
     * Gera string PIX mock para desenvolvimento
     */
    private gerarPixMock;
}

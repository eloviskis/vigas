"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagamentoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pagamento_entity_1 = require("../entities/pagamento.entity");
const orcamento_entity_1 = require("../../orcamento/entities/orcamento.entity");
// import MercadoPago from 'mercadopago'; // Será implementado após instalação
let PagamentoService = class PagamentoService {
    constructor(pagamentoRepository, orcamentoRepository) {
        this.pagamentoRepository = pagamentoRepository;
        this.orcamentoRepository = orcamentoRepository;
    }
    /**
     * Inicia um novo pagamento para um orçamento aprovado
     */
    async iniciarPagamento(dto) {
        // 1. Verificar se orçamento existe e está aprovado
        const orcamento = await this.orcamentoRepository.findOne({
            where: { id: dto.orcamentoId },
            relations: ['profissional'],
        });
        if (!orcamento) {
            throw new common_1.NotFoundException('Orçamento não encontrado');
        }
        if (orcamento.status !== 'APROVADO') {
            throw new common_1.BadRequestException('Orçamento não está aprovado');
        }
        // 2. Verificar se já existe pagamento para este orçamento
        const pagamentoExistente = await this.pagamentoRepository.findOne({
            where: { orcamentoId: dto.orcamentoId },
        });
        if (pagamentoExistente && pagamentoExistente.status === pagamento_entity_1.StatusPagamento.APROVADO) {
            throw new common_1.BadRequestException('Orçamento já possui pagamento aprovado');
        }
        // 3. Calcular valores (12% de comissão)
        const valorTotal = Number(orcamento.valorTotal);
        const valorPlataforma = Number((valorTotal * 0.12).toFixed(2));
        const valorProfissional = Number((valorTotal - valorPlataforma).toFixed(2));
        // 4. Criar registro de pagamento
        const pagamento = this.pagamentoRepository.create({
            orcamentoId: dto.orcamentoId,
            profissionalId: Number(orcamento.profissionalId),
            valorTotal,
            valorProfissional,
            valorPlataforma,
            metodoPagamento: dto.metodoPagamento,
            status: pagamento_entity_1.StatusPagamento.PENDENTE,
        });
        // 5. Se for PIX, gerar QR Code (mock por enquanto)
        if (dto.metodoPagamento === pagamento_entity_1.MetodoPagamento.PIX) {
            const dataExpiracao = new Date();
            dataExpiracao.setMinutes(dataExpiracao.getMinutes() + 30); // PIX expira em 30 min
            pagamento.dataExpiracao = dataExpiracao;
            // TODO: Integrar Mercado Pago para gerar QR Code real
            // Por enquanto, mock para desenvolvimento
            pagamento.pixQrCodeData = this.gerarPixMock(valorTotal);
            pagamento.pixQrCode = Buffer.from(pagamento.pixQrCodeData).toString('base64');
        }
        // 6. Se for cartão, gerar link de checkout (mock por enquanto)
        if (dto.metodoPagamento === pagamento_entity_1.MetodoPagamento.CREDITO || dto.metodoPagamento === pagamento_entity_1.MetodoPagamento.DEBITO) {
            // TODO: Integrar Mercado Pago para gerar link real
            pagamento.linkPagamento = `https://checkout.mercadopago.com.br/mock/${pagamento.id}`;
        }
        await this.pagamentoRepository.save(pagamento);
        return pagamento;
    }
    /**
     * Busca pagamento por ID
     */
    async obterPorId(id) {
        const pagamento = await this.pagamentoRepository.findOne({
            where: { id },
            relations: ['orcamento', 'profissional'],
        });
        if (!pagamento) {
            throw new common_1.NotFoundException('Pagamento não encontrado');
        }
        return pagamento;
    }
    /**
     * Busca pagamento por orçamento
     */
    async obterPorOrcamento(orcamentoId) {
        const pagamento = await this.pagamentoRepository.findOne({
            where: { orcamentoId },
            relations: ['orcamento', 'profissional'],
        });
        if (!pagamento) {
            throw new common_1.NotFoundException('Pagamento não encontrado para este orçamento');
        }
        return pagamento;
    }
    /**
     * Lista todos os pagamentos de um profissional
     */
    async listarPorProfissional(profissionalId) {
        return this.pagamentoRepository.find({
            where: { profissionalId },
            relations: ['orcamento'],
            order: { criadoEm: 'DESC' },
        });
    }
    /**
     * Confirma pagamento (chamado pelo webhook ou manualmente)
     */
    async confirmarPagamento(id, mercadoPagoId, mercadoPagoStatus) {
        const pagamento = await this.obterPorId(id);
        if (pagamento.status === pagamento_entity_1.StatusPagamento.APROVADO) {
            throw new common_1.BadRequestException('Pagamento já confirmado');
        }
        pagamento.status = pagamento_entity_1.StatusPagamento.APROVADO;
        pagamento.dataAprovacao = new Date();
        if (mercadoPagoId) {
            pagamento.mercadoPagoId = mercadoPagoId;
        }
        if (mercadoPagoStatus) {
            pagamento.mercadoPagoStatus = mercadoPagoStatus;
        }
        // TODO: Ao confirmar pagamento, disparar:
        // - Atualizar status do orçamento
        // - Criar agendamento
        // - Enviar email para profissional
        // - Enviar email para cliente
        return this.pagamentoRepository.save(pagamento);
    }
    /**
     * Cancela pagamento
     */
    async cancelarPagamento(id, motivo) {
        const pagamento = await this.obterPorId(id);
        if (pagamento.status === pagamento_entity_1.StatusPagamento.APROVADO) {
            throw new common_1.BadRequestException('Não é possível cancelar pagamento aprovado. Use estorno.');
        }
        pagamento.status = pagamento_entity_1.StatusPagamento.CANCELADO;
        pagamento.dataCancelamento = new Date();
        pagamento.motivoCancelamento = motivo;
        return this.pagamentoRepository.save(pagamento);
    }
    /**
     * Estorna pagamento (reembolso)
     */
    async estornarPagamento(id, motivo) {
        const pagamento = await this.obterPorId(id);
        if (pagamento.status !== pagamento_entity_1.StatusPagamento.APROVADO) {
            throw new common_1.BadRequestException('Apenas pagamentos aprovados podem ser estornados');
        }
        // TODO: Integrar API de estorno do Mercado Pago
        pagamento.status = pagamento_entity_1.StatusPagamento.ESTORNADO;
        pagamento.motivoCancelamento = motivo;
        return this.pagamentoRepository.save(pagamento);
    }
    /**
     * Processa webhook do Mercado Pago
     */
    async processarWebhook(data) {
        console.log('Webhook recebido:', data);
        // TODO: Implementar lógica real do webhook
        // 1. Validar assinatura do webhook
        // 2. Buscar pagamento pelo mercadoPagoId
        // 3. Atualizar status conforme retorno do MP
        // 4. Se aprovado, chamar confirmarPagamento()
        if (data.type === 'payment') {
            const mercadoPagoId = data.data?.id;
            if (mercadoPagoId) {
                // Buscar pagamento
                const pagamento = await this.pagamentoRepository.findOne({
                    where: { mercadoPagoId: mercadoPagoId.toString() },
                });
                if (pagamento) {
                    // Atualizar status baseado no webhook
                    if (data.action === 'payment.updated') {
                        // TODO: Consultar API do MP para obter status atual
                        // await this.confirmarPagamento(pagamento.id, mercadoPagoId, 'approved');
                    }
                }
            }
        }
    }
    /**
     * Gera string PIX mock para desenvolvimento
     */
    gerarPixMock(valor) {
        return `00020126330014BR.GOV.BCB.PIX0111${Math.random().toString(36).substring(7)}520400005303986540${valor.toFixed(2)}5802BR5913VITAS SERVICOS6009SAO PAULO62070503***6304${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    }
};
exports.PagamentoService = PagamentoService;
exports.PagamentoService = PagamentoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pagamento_entity_1.Pagamento)),
    __param(1, (0, typeorm_1.InjectRepository)(orcamento_entity_1.Orcamento)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PagamentoService);

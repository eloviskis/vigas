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
exports.PagamentoController = void 0;
const common_1 = require("@nestjs/common");
const pagamento_service_1 = require("../services/pagamento.service");
const pagamento_dto_1 = require("../dtos/pagamento.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let PagamentoController = class PagamentoController {
    constructor(pagamentoService) {
        this.pagamentoService = pagamentoService;
    }
    /**
     * POST /api/pagamentos
     * Inicia um pagamento para um orçamento aprovado
     */
    async criar(dto) {
        const pagamento = await this.pagamentoService.iniciarPagamento(dto);
        return {
            id: pagamento.id,
            orcamentoId: pagamento.orcamentoId,
            valorTotal: Number(pagamento.valorTotal),
            valorProfissional: Number(pagamento.valorProfissional),
            valorPlataforma: Number(pagamento.valorPlataforma),
            status: pagamento.status,
            metodoPagamento: pagamento.metodoPagamento,
            pixQrCode: pagamento.pixQrCode,
            pixQrCodeData: pagamento.pixQrCodeData,
            linkPagamento: pagamento.linkPagamento,
            dataExpiracao: pagamento.dataExpiracao,
            criadoEm: pagamento.criadoEm,
        };
    }
    /**
     * GET /api/pagamentos/:id
     * Busca um pagamento específico
     */
    async obterPorId(id) {
        const pagamento = await this.pagamentoService.obterPorId(id);
        return {
            id: pagamento.id,
            orcamentoId: pagamento.orcamentoId,
            valorTotal: Number(pagamento.valorTotal),
            valorProfissional: Number(pagamento.valorProfissional),
            valorPlataforma: Number(pagamento.valorPlataforma),
            status: pagamento.status,
            metodoPagamento: pagamento.metodoPagamento,
            pixQrCode: pagamento.pixQrCode,
            pixQrCodeData: pagamento.pixQrCodeData,
            linkPagamento: pagamento.linkPagamento,
            dataExpiracao: pagamento.dataExpiracao,
            criadoEm: pagamento.criadoEm,
        };
    }
    /**
     * GET /api/pagamentos/orcamento/:orcamentoId
     * Busca pagamento por orçamento
     */
    async obterPorOrcamento(orcamentoId) {
        const pagamento = await this.pagamentoService.obterPorOrcamento(orcamentoId);
        return {
            id: pagamento.id,
            orcamentoId: pagamento.orcamentoId,
            valorTotal: Number(pagamento.valorTotal),
            valorProfissional: Number(pagamento.valorProfissional),
            valorPlataforma: Number(pagamento.valorPlataforma),
            status: pagamento.status,
            metodoPagamento: pagamento.metodoPagamento,
            pixQrCode: pagamento.pixQrCode,
            pixQrCodeData: pagamento.pixQrCodeData,
            linkPagamento: pagamento.linkPagamento,
            dataExpiracao: pagamento.dataExpiracao,
            criadoEm: pagamento.criadoEm,
        };
    }
    /**
     * GET /api/pagamentos/profissional/:profissionalId
     * Lista todos os pagamentos de um profissional
     */
    async listarPorProfissional(profissionalId) {
        return this.pagamentoService.listarPorProfissional(profissionalId);
    }
    /**
     * PATCH /api/pagamentos/:id/confirmar
     * Confirma um pagamento manualmente (para testes)
     */
    async confirmar(id) {
        return this.pagamentoService.confirmarPagamento(id);
    }
    /**
     * PATCH /api/pagamentos/:id/cancelar
     * Cancela um pagamento pendente
     */
    async cancelar(id, dto) {
        return this.pagamentoService.cancelarPagamento(id, dto.motivo);
    }
    /**
     * PATCH /api/pagamentos/:id/estornar
     * Estorna um pagamento aprovado (reembolso)
     */
    async estornar(id, dto) {
        return this.pagamentoService.estornarPagamento(id, dto.motivo);
    }
    /**
     * POST /api/pagamentos/webhook
     * Recebe notificações do Mercado Pago
     * Não usa guard porque é chamado pelo MP
     */
    async webhook(data) {
        await this.pagamentoService.processarWebhook(data);
        return { status: 'ok' };
    }
};
exports.PagamentoController = PagamentoController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagamento_dto_1.CriarPagamentoDto]),
    __metadata("design:returntype", Promise)
], PagamentoController.prototype, "criar", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PagamentoController.prototype, "obterPorId", null);
__decorate([
    (0, common_1.Get)('orcamento/:orcamentoId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('orcamentoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PagamentoController.prototype, "obterPorOrcamento", null);
__decorate([
    (0, common_1.Get)('profissional/:profissionalId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('profissionalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PagamentoController.prototype, "listarPorProfissional", null);
__decorate([
    (0, common_1.Patch)(':id/confirmar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PagamentoController.prototype, "confirmar", null);
__decorate([
    (0, common_1.Patch)(':id/cancelar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pagamento_dto_1.CancelarPagamentoDto]),
    __metadata("design:returntype", Promise)
], PagamentoController.prototype, "cancelar", null);
__decorate([
    (0, common_1.Patch)(':id/estornar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pagamento_dto_1.CancelarPagamentoDto]),
    __metadata("design:returntype", Promise)
], PagamentoController.prototype, "estornar", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagamento_dto_1.WebhookMercadoPagoDto]),
    __metadata("design:returntype", Promise)
], PagamentoController.prototype, "webhook", null);
exports.PagamentoController = PagamentoController = __decorate([
    (0, common_1.Controller)('pagamentos'),
    __metadata("design:paramtypes", [pagamento_service_1.PagamentoService])
], PagamentoController);

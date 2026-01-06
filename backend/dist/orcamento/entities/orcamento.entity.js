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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orcamento = exports.OrcamentoStatus = void 0;
const typeorm_1 = require("typeorm");
const chamado_entity_1 = require("../../chamado/entities/chamado.entity");
const profissional_entity_1 = require("../../profissional/entities/profissional.entity");
var OrcamentoStatus;
(function (OrcamentoStatus) {
    OrcamentoStatus["ENVIADO"] = "ENVIADO";
    OrcamentoStatus["APROVADO"] = "APROVADO";
    OrcamentoStatus["RECUSADO"] = "RECUSADO";
    OrcamentoStatus["EXPIRADO"] = "EXPIRADO";
    OrcamentoStatus["CANCELADO"] = "CANCELADO";
})(OrcamentoStatus || (exports.OrcamentoStatus = OrcamentoStatus = {}));
let Orcamento = class Orcamento {
};
exports.Orcamento = Orcamento;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Orcamento.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Orcamento.prototype, "chamadoId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chamado_entity_1.Chamado, { lazy: true }),
    (0, typeorm_1.JoinColumn)({ name: 'chamadoId' }),
    __metadata("design:type", Promise)
], Orcamento.prototype, "chamado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Orcamento.prototype, "profissionalId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => profissional_entity_1.Profissional, { lazy: true }),
    (0, typeorm_1.JoinColumn)({ name: 'profissionalId' }),
    __metadata("design:type", Promise)
], Orcamento.prototype, "profissional", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Orcamento.prototype, "valorServico", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Orcamento.prototype, "valorDeslocamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Orcamento.prototype, "valorMateriais", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Orcamento.prototype, "valorTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Orcamento.prototype, "descricaoDetalhada", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Orcamento.prototype, "prazoExecucao", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Orcamento.prototype, "validadeAte", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: OrcamentoStatus.ENVIADO
    }),
    __metadata("design:type", String)
], Orcamento.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Orcamento.prototype, "observacoes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Orcamento.prototype, "motivoRecusa", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'criado_em' }),
    __metadata("design:type", Date)
], Orcamento.prototype, "criadoEm", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'atualizado_em' }),
    __metadata("design:type", Date)
], Orcamento.prototype, "atualizadoEm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Orcamento.prototype, "aprovadoEm", void 0);
exports.Orcamento = Orcamento = __decorate([
    (0, typeorm_1.Entity)({ name: 'orcamentos' })
], Orcamento);

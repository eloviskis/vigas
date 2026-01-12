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
exports.Triagem = exports.TriagemResultado = exports.TriagemTipo = void 0;
const typeorm_1 = require("typeorm");
const chamado_entity_1 = require("../../chamado/entities/chamado.entity");
const profissional_entity_1 = require("../../profissional/entities/profissional.entity");
var TriagemTipo;
(function (TriagemTipo) {
    TriagemTipo["AUTOMATICA"] = "AUTOMATICA";
    TriagemTipo["ASSISTIDA"] = "ASSISTIDA";
    TriagemTipo["MANUAL"] = "MANUAL";
})(TriagemTipo || (exports.TriagemTipo = TriagemTipo = {}));
var TriagemResultado;
(function (TriagemResultado) {
    TriagemResultado["RECOMENDADO"] = "RECOMENDADO";
    TriagemResultado["MULTIPLAS_OPCOES"] = "MULTIPLAS_OPCOES";
    TriagemResultado["SEM_PROFISSIONAL"] = "SEM_PROFISSIONAL";
    TriagemResultado["REQUER_VALIDACAO"] = "REQUER_VALIDACAO";
})(TriagemResultado || (exports.TriagemResultado = TriagemResultado = {}));
let Triagem = class Triagem {
};
exports.Triagem = Triagem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Triagem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'chamado_id' }),
    __metadata("design:type", String)
], Triagem.prototype, "chamadoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Triagem.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Triagem.prototype, "resultado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Triagem.prototype, "justificativa", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profissional_recomendado_id', nullable: true }),
    __metadata("design:type", String)
], Triagem.prototype, "profissionalRecomendadoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Array)
], Triagem.prototype, "opcoesProfissionais", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Triagem.prototype, "crit\u00E9rios", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], Triagem.prototype, "confian\u00E7a", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'criado_em' }),
    __metadata("design:type", Date)
], Triagem.prototype, "criadoEm", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chamado_entity_1.Chamado, { onDelete: 'CASCADE', eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'chamado_id' }),
    __metadata("design:type", chamado_entity_1.Chamado)
], Triagem.prototype, "chamado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => profissional_entity_1.Profissional, (prof) => prof.triagensPendentes, {
        nullable: true,
        eager: false,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'profissional_recomendado_id' }),
    __metadata("design:type", profissional_entity_1.Profissional)
], Triagem.prototype, "profissionalRecomendado", void 0);
exports.Triagem = Triagem = __decorate([
    (0, typeorm_1.Entity)({ name: 'triagens' })
], Triagem);

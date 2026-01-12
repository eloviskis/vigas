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
exports.Slot = void 0;
const typeorm_1 = require("typeorm");
const profissional_entity_1 = require("../../profissional/entities/profissional.entity");
let Slot = class Slot {
};
exports.Slot = Slot;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Slot.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profissional_id' }),
    __metadata("design:type", String)
], Slot.prototype, "profissionalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Slot.prototype, "dataHora", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 60 }),
    __metadata("design:type", Number)
], Slot.prototype, "duracao", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Slot.prototype, "disponivel", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'agendamento_id' }),
    __metadata("design:type", String)
], Slot.prototype, "agendamentoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Slot.prototype, "observacoes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'criado_em' }),
    __metadata("design:type", Date)
], Slot.prototype, "criadoEm", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'atualizado_em' }),
    __metadata("design:type", Date)
], Slot.prototype, "atualizadoEm", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => profissional_entity_1.Profissional, { onDelete: 'CASCADE', eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'profissional_id' }),
    __metadata("design:type", profissional_entity_1.Profissional)
], Slot.prototype, "profissional", void 0);
exports.Slot = Slot = __decorate([
    (0, typeorm_1.Index)('idx_slot_profissional_data', ['profissionalId', 'dataHora']),
    (0, typeorm_1.Index)('idx_slot_disponivel', ['disponivel']),
    (0, typeorm_1.Entity)({ name: 'slots' })
], Slot);

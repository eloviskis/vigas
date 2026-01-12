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
exports.ChamadoHistorico = exports.ChamadoHistoricoTipo = void 0;
const typeorm_1 = require("typeorm");
const chamado_entity_1 = require("./chamado.entity");
var ChamadoHistoricoTipo;
(function (ChamadoHistoricoTipo) {
    ChamadoHistoricoTipo["STATUS"] = "STATUS";
    ChamadoHistoricoTipo["TRIAGEM"] = "TRIAGEM";
    ChamadoHistoricoTipo["AGENDAMENTO"] = "AGENDAMENTO";
    ChamadoHistoricoTipo["NOTA"] = "NOTA";
    ChamadoHistoricoTipo["SISTEMA"] = "SISTEMA";
})(ChamadoHistoricoTipo || (exports.ChamadoHistoricoTipo = ChamadoHistoricoTipo = {}));
let ChamadoHistorico = class ChamadoHistorico {
};
exports.ChamadoHistorico = ChamadoHistorico;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ChamadoHistorico.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'chamado_id' }),
    __metadata("design:type", String)
], ChamadoHistorico.prototype, "chamadoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ChamadoHistorico.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ChamadoHistorico.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ChamadoHistorico.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'criado_em' }),
    __metadata("design:type", Date)
], ChamadoHistorico.prototype, "criadoEm", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chamado_entity_1.Chamado, (chamado) => chamado.historico, {
        onDelete: 'CASCADE',
        eager: false,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'chamado_id' }),
    __metadata("design:type", chamado_entity_1.Chamado)
], ChamadoHistorico.prototype, "chamado", void 0);
exports.ChamadoHistorico = ChamadoHistorico = __decorate([
    (0, typeorm_1.Entity)({ name: 'chamado_historico' })
], ChamadoHistorico);

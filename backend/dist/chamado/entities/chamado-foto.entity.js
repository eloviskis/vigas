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
exports.ChamadoFoto = void 0;
const typeorm_1 = require("typeorm");
const chamado_entity_1 = require("./chamado.entity");
let ChamadoFoto = class ChamadoFoto {
};
exports.ChamadoFoto = ChamadoFoto;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ChamadoFoto.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChamadoFoto.prototype, "chamadoId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chamado_entity_1.Chamado, (chamado) => chamado.fotos, { onDelete: 'CASCADE' }),
    __metadata("design:type", chamado_entity_1.Chamado)
], ChamadoFoto.prototype, "chamado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChamadoFoto.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChamadoFoto.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChamadoFoto.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], ChamadoFoto.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ChamadoFoto.prototype, "createdAt", void 0);
exports.ChamadoFoto = ChamadoFoto = __decorate([
    (0, typeorm_1.Entity)('chamado_fotos')
], ChamadoFoto);

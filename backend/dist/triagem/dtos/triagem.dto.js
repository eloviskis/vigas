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
exports.TriagemResponseDto = exports.RecomendarProfissionalDto = exports.CriarTriagemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const triagem_entity_1 = require("../entities/triagem.entity");
class CriarTriagemDto {
}
exports.CriarTriagemDto = CriarTriagemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CriarTriagemDto.prototype, "chamadoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: triagem_entity_1.TriagemTipo, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(triagem_entity_1.TriagemTipo),
    __metadata("design:type", String)
], CriarTriagemDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CriarTriagemDto.prototype, "crit\u00E9rios", void 0);
class RecomendarProfissionalDto {
}
exports.RecomendarProfissionalDto = RecomendarProfissionalDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecomendarProfissionalDto.prototype, "triagemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecomendarProfissionalDto.prototype, "profissionalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecomendarProfissionalDto.prototype, "justificativa", void 0);
class TriagemResponseDto {
}
exports.TriagemResponseDto = TriagemResponseDto;

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
exports.OrcamentoResponseDto = exports.RecusarOrcamentoDto = exports.AprovarOrcamentoDto = exports.CriarOrcamentoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CriarOrcamentoDto {
}
exports.CriarOrcamentoDto = CriarOrcamentoDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CriarOrcamentoDto.prototype, "chamadoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CriarOrcamentoDto.prototype, "profissionalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Valor do serviço em reais' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CriarOrcamentoDto.prototype, "valorServico", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Valor do deslocamento', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CriarOrcamentoDto.prototype, "valorDeslocamento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Valor dos materiais', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CriarOrcamentoDto.prototype, "valorMateriais", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descrição detalhada do orçamento' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CriarOrcamentoDto.prototype, "descricaoDetalhada", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Prazo estimado de execução', example: '2-3 horas' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CriarOrcamentoDto.prototype, "prazoExecucao", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CriarOrcamentoDto.prototype, "observacoes", void 0);
class AprovarOrcamentoDto {
}
exports.AprovarOrcamentoDto = AprovarOrcamentoDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AprovarOrcamentoDto.prototype, "orcamentoId", void 0);
class RecusarOrcamentoDto {
}
exports.RecusarOrcamentoDto = RecusarOrcamentoDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecusarOrcamentoDto.prototype, "orcamentoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecusarOrcamentoDto.prototype, "motivoRecusa", void 0);
class OrcamentoResponseDto {
}
exports.OrcamentoResponseDto = OrcamentoResponseDto;

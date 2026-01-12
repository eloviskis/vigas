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
exports.TriagemController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const triagem_service_1 = require("../services/triagem.service");
const triagem_dto_1 = require("../dtos/triagem.dto");
let TriagemController = class TriagemController {
    constructor(triagemService) {
        this.triagemService = triagemService;
    }
    async realizar(chamadoId, dto) {
        return await this.triagemService.realizar({
            ...dto,
            chamadoId,
        });
    }
    async obter(chamadoId) {
        return await this.triagemService.obterPorChamado(chamadoId);
    }
    async recomendarManualmente(dto) {
        return await this.triagemService.recomendarManualmente(dto);
    }
};
exports.TriagemController = TriagemController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Realizar triagem de um chamado' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Triagem realizada com sucesso' }),
    __param(0, (0, common_1.Param)('chamadoId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, triagem_dto_1.CriarTriagemDto]),
    __metadata("design:returntype", Promise)
], TriagemController.prototype, "realizar", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obter triagem do chamado' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Triagem encontrada' }),
    __param(0, (0, common_1.Param)('chamadoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TriagemController.prototype, "obter", null);
__decorate([
    (0, common_1.Put)('/recomendacao'),
    (0, swagger_1.ApiOperation)({ summary: 'Recomendar manualmente um profissional' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profissional recomendado com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [triagem_dto_1.RecomendarProfissionalDto]),
    __metadata("design:returntype", Promise)
], TriagemController.prototype, "recomendarManualmente", null);
exports.TriagemController = TriagemController = __decorate([
    (0, swagger_1.ApiTags)('triagem'),
    (0, common_1.Controller)('chamados/:chamadoId/triagem'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [triagem_service_1.TriagemService])
], TriagemController);

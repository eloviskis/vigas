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
exports.OrcamentoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const orcamento_service_1 = require("../services/orcamento.service");
const orcamento_dto_1 = require("../dtos/orcamento.dto");
let OrcamentoController = class OrcamentoController {
    constructor(orcamentoService) {
        this.orcamentoService = orcamentoService;
    }
    async criar(dto) {
        return await this.orcamentoService.criar(dto);
    }
    async listarPorChamado(chamadoId) {
        return await this.orcamentoService.listarPorChamado(chamadoId);
    }
    async listarPorProfissional(profissionalId) {
        return await this.orcamentoService.listarPorProfissional(profissionalId);
    }
    async obterPorId(id) {
        return await this.orcamentoService.obterPorId(id);
    }
    async aprovar(dto) {
        return await this.orcamentoService.aprovar(dto.orcamentoId, 'usuario-id-temp');
    }
    async recusar(dto) {
        return await this.orcamentoService.recusar(dto.orcamentoId, dto.motivoRecusa);
    }
    async cancelar(id) {
        return await this.orcamentoService.cancelar(id);
    }
};
exports.OrcamentoController = OrcamentoController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Profissional cria orçamento para chamado' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Orçamento criado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [orcamento_dto_1.CriarOrcamentoDto]),
    __metadata("design:returntype", Promise)
], OrcamentoController.prototype, "criar", null);
__decorate([
    (0, common_1.Get)('/chamado/:chamadoId'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar orçamentos de um chamado' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de orçamentos' }),
    __param(0, (0, common_1.Param)('chamadoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrcamentoController.prototype, "listarPorChamado", null);
__decorate([
    (0, common_1.Get)('/profissional/:profissionalId'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar orçamentos de um profissional' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de orçamentos' }),
    __param(0, (0, common_1.Param)('profissionalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrcamentoController.prototype, "listarPorProfissional", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter orçamento por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orçamento encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrcamentoController.prototype, "obterPorId", null);
__decorate([
    (0, common_1.Patch)('/aprovar'),
    (0, swagger_1.ApiOperation)({ summary: 'Cliente aprova orçamento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orçamento aprovado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [orcamento_dto_1.AprovarOrcamentoDto]),
    __metadata("design:returntype", Promise)
], OrcamentoController.prototype, "aprovar", null);
__decorate([
    (0, common_1.Patch)('/recusar'),
    (0, swagger_1.ApiOperation)({ summary: 'Cliente recusa orçamento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orçamento recusado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [orcamento_dto_1.RecusarOrcamentoDto]),
    __metadata("design:returntype", Promise)
], OrcamentoController.prototype, "recusar", null);
__decorate([
    (0, common_1.Patch)('/:id/cancelar'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancelar orçamento (profissional)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orçamento cancelado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrcamentoController.prototype, "cancelar", null);
exports.OrcamentoController = OrcamentoController = __decorate([
    (0, swagger_1.ApiTags)('orcamentos'),
    (0, common_1.Controller)('orcamentos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [orcamento_service_1.OrcamentoService])
], OrcamentoController);

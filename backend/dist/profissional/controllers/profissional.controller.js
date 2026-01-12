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
exports.ProfissionalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const profissional_service_1 = require("../services/profissional.service");
const profissional_dto_1 = require("../dtos/profissional.dto");
let ProfissionalController = class ProfissionalController {
    constructor(profissionalService) {
        this.profissionalService = profissionalService;
    }
    async criar(dto) {
        return await this.profissionalService.criar(dto);
    }
    async listar(contexto, lat, lon) {
        const userLat = lat ? parseFloat(lat) : undefined;
        const userLon = lon ? parseFloat(lon) : undefined;
        return await this.profissionalService.listarAtivos(contexto, userLat, userLon);
    }
    async buscarPorContextoECategoria(contexto, categoria, lat, lon) {
        const userLat = lat ? parseFloat(lat) : undefined;
        const userLon = lon ? parseFloat(lon) : undefined;
        return await this.profissionalService.listarPorContextoECategoria(contexto, categoria, userLat, userLon);
    }
    async obter(id) {
        return await this.profissionalService.obterPorId(id);
    }
    async atualizar(id, dto) {
        return await this.profissionalService.atualizar(id, dto);
    }
    async calcularTaxaSatisfação(id) {
        const taxa = await this.profissionalService.calcularTaxaSatisfação(id);
        return { taxa };
    }
};
exports.ProfissionalController = ProfissionalController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo profissional' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Profissional criado com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [profissional_dto_1.CriarProfissionalDto]),
    __metadata("design:returntype", Promise)
], ProfissionalController.prototype, "criar", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar profissionais ativos' }),
    (0, swagger_1.ApiQuery)({ name: 'contexto', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'lat', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'lon', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de profissionais' }),
    __param(0, (0, common_1.Query)('contexto')),
    __param(1, (0, common_1.Query)('lat')),
    __param(2, (0, common_1.Query)('lon')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ProfissionalController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)('/contexto/:contexto/categoria/:categoria'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar profissionais por contexto e categoria' }),
    (0, swagger_1.ApiQuery)({ name: 'lat', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'lon', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de profissionais encontrados' }),
    __param(0, (0, common_1.Param)('contexto')),
    __param(1, (0, common_1.Param)('categoria')),
    __param(2, (0, common_1.Query)('lat')),
    __param(3, (0, common_1.Query)('lon')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProfissionalController.prototype, "buscarPorContextoECategoria", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter profissional por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profissional encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfissionalController.prototype, "obter", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar profissional' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profissional atualizado com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, profissional_dto_1.AtualizarProfissionalDto]),
    __metadata("design:returntype", Promise)
], ProfissionalController.prototype, "atualizar", null);
__decorate([
    (0, common_1.Get)(':id/taxa-satisfacao'),
    (0, swagger_1.ApiOperation)({ summary: 'Calcular taxa de satisfação do profissional' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Taxa calculada com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfissionalController.prototype, "calcularTaxaSatisfa\u00E7\u00E3o", null);
exports.ProfissionalController = ProfissionalController = __decorate([
    (0, swagger_1.ApiTags)('profissionais'),
    (0, common_1.Controller)('profissionais'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [profissional_service_1.ProfissionalService])
], ProfissionalController);

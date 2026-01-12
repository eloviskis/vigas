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
exports.HistoricoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const historico_service_1 = require("../services/historico.service");
const historico_dto_1 = require("../dtos/historico.dto");
let HistoricoController = class HistoricoController {
    constructor(historicoService) {
        this.historicoService = historicoService;
    }
    async listar(chamadoId) {
        const eventos = await this.historicoService.listarPorChamado(chamadoId);
        return eventos.map((evt) => ({
            id: evt.id,
            chamadoId: evt.chamadoId,
            tipo: evt.tipo,
            descricao: evt.descricao,
            metadata: evt.metadata,
            criadoEm: evt.criadoEm,
        }));
    }
    async registrar(chamadoId, dto) {
        const evento = await this.historicoService.registrarEvento(chamadoId, dto);
        return {
            id: evento.id,
            chamadoId: evento.chamadoId,
            tipo: evento.tipo,
            descricao: evento.descricao,
            metadata: evento.metadata,
            criadoEm: evento.criadoEm,
        };
    }
};
exports.HistoricoController = HistoricoController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('chamadoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HistoricoController.prototype, "listar", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('chamadoId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, historico_dto_1.CriarHistoricoDto]),
    __metadata("design:returntype", Promise)
], HistoricoController.prototype, "registrar", null);
exports.HistoricoController = HistoricoController = __decorate([
    (0, swagger_1.ApiTags)('Chamados - Timeline'),
    (0, common_1.Controller)('chamados/:chamadoId/historico'),
    __metadata("design:paramtypes", [historico_service_1.HistoricoService])
], HistoricoController);

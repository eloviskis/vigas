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
exports.AgendamentoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const agendamento_service_1 = require("../services/agendamento.service");
const agendamento_dto_1 = require("../dtos/agendamento.dto");
let AgendamentoController = class AgendamentoController {
    constructor(agendamentoService) {
        this.agendamentoService = agendamentoService;
    }
    async criar(chamadoId, dto) {
        return await this.agendamentoService.agendar({
            ...dto,
            chamadoId,
        });
    }
    async obter(chamadoId) {
        return await this.agendamentoService.obterPorChamado(chamadoId);
    }
    async confirmar(agendamentoId, dto) {
        return await this.agendamentoService.confirmar(agendamentoId, dto);
    }
    async cancelar(agendamentoId, dto) {
        return await this.agendamentoService.cancelar(agendamentoId, dto);
    }
    async iniciar(agendamentoId) {
        return await this.agendamentoService.iniciarAtendimento(agendamentoId);
    }
    async concluir(agendamentoId) {
        return await this.agendamentoService.concluirAtendimento(agendamentoId);
    }
};
exports.AgendamentoController = AgendamentoController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo agendamento' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Agendamento criado com sucesso' }),
    __param(0, (0, common_1.Param)('chamadoId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, agendamento_dto_1.CriarAgendamentoDto]),
    __metadata("design:returntype", Promise)
], AgendamentoController.prototype, "criar", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obter agendamento do chamado' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agendamento encontrado' }),
    __param(0, (0, common_1.Param)('chamadoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgendamentoController.prototype, "obter", null);
__decorate([
    (0, common_1.Put)(':agendamentoId/confirmar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Confirmar agendamento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agendamento confirmado com sucesso' }),
    __param(0, (0, common_1.Param)('agendamentoId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, agendamento_dto_1.ConfirmarAgendamentoDto]),
    __metadata("design:returntype", Promise)
], AgendamentoController.prototype, "confirmar", null);
__decorate([
    (0, common_1.Put)(':agendamentoId/cancelar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Cancelar agendamento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agendamento cancelado com sucesso' }),
    __param(0, (0, common_1.Param)('agendamentoId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, agendamento_dto_1.CancelarAgendamentoDto]),
    __metadata("design:returntype", Promise)
], AgendamentoController.prototype, "cancelar", null);
__decorate([
    (0, common_1.Put)(':agendamentoId/iniciar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar atendimento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Atendimento iniciado com sucesso' }),
    __param(0, (0, common_1.Param)('agendamentoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgendamentoController.prototype, "iniciar", null);
__decorate([
    (0, common_1.Put)(':agendamentoId/concluir'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Concluir atendimento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Atendimento concluído com sucesso' }),
    __param(0, (0, common_1.Param)('agendamentoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgendamentoController.prototype, "concluir", null);
exports.AgendamentoController = AgendamentoController = __decorate([
    (0, swagger_1.ApiTags)('agendamentos'),
    (0, common_1.Controller)('chamados/:chamadoId/agendamentos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [agendamento_service_1.AgendamentoService])
], AgendamentoController);

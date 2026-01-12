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
exports.SlotController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const slot_service_1 = require("../services/slot.service");
const slot_dto_1 = require("../dtos/slot.dto");
let SlotController = class SlotController {
    constructor(slotService) {
        this.slotService = slotService;
    }
    async criar(dto) {
        return await this.slotService.criar(dto);
    }
    async listarDisponiveis(profissionalId, dataInicio, dataFim) {
        const inicio = dataInicio ? new Date(dataInicio) : new Date();
        const fim = dataFim ? new Date(dataFim) : new Date(inicio.getTime() + 30 * 24 * 60 * 60 * 1000);
        return await this.slotService.listarDisponiveisPorProfissional(profissionalId, inicio, fim);
    }
    async obter(slotId) {
        return await this.slotService.obterPorId(slotId);
    }
};
exports.SlotController = SlotController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo slot de disponibilidade' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Slot criado com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [slot_dto_1.CriarSlotDto]),
    __metadata("design:returntype", Promise)
], SlotController.prototype, "criar", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar slots disponíveis do profissional' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de slots' }),
    __param(0, (0, common_1.Param)('profissionalId')),
    __param(1, (0, common_1.Query)('dataInicio')),
    __param(2, (0, common_1.Query)('dataFim')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SlotController.prototype, "listarDisponiveis", null);
__decorate([
    (0, common_1.Get)(':slotId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter slot por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Slot encontrado' }),
    __param(0, (0, common_1.Param)('slotId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SlotController.prototype, "obter", null);
exports.SlotController = SlotController = __decorate([
    (0, swagger_1.ApiTags)('slots'),
    (0, common_1.Controller)('profissionais/:profissionalId/slots'),
    __metadata("design:paramtypes", [slot_service_1.SlotService])
], SlotController);

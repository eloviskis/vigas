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
exports.HistoricoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chamado_historico_entity_1 = require("../entities/chamado-historico.entity");
let HistoricoService = class HistoricoService {
    constructor(historicoRepository) {
        this.historicoRepository = historicoRepository;
    }
    async registrarEvento(chamadoId, dto) {
        const evento = this.historicoRepository.create({
            chamadoId,
            ...dto,
        });
        return await this.historicoRepository.save(evento);
    }
    async listarPorChamado(chamadoId) {
        return this.historicoRepository.find({
            where: { chamadoId },
            order: { criadoEm: 'DESC' },
        });
    }
    async registrarStatus(chamadoId, descricao, metadata) {
        return this.registrarEvento(chamadoId, {
            tipo: chamado_historico_entity_1.ChamadoHistoricoTipo.STATUS,
            descricao,
            metadata,
        });
    }
    async registrarTriagem(chamadoId, descricao, metadata) {
        return this.registrarEvento(chamadoId, {
            tipo: chamado_historico_entity_1.ChamadoHistoricoTipo.TRIAGEM,
            descricao,
            metadata,
        });
    }
    async registrarAgendamento(chamadoId, descricao, metadata) {
        return this.registrarEvento(chamadoId, {
            tipo: chamado_historico_entity_1.ChamadoHistoricoTipo.AGENDAMENTO,
            descricao,
            metadata,
        });
    }
    async registrarNota(chamadoId, descricao, metadata) {
        return this.registrarEvento(chamadoId, {
            tipo: chamado_historico_entity_1.ChamadoHistoricoTipo.NOTA,
            descricao,
            metadata,
        });
    }
    async registrarSistema(chamadoId, descricao, metadata) {
        return this.registrarEvento(chamadoId, {
            tipo: chamado_historico_entity_1.ChamadoHistoricoTipo.SISTEMA,
            descricao,
            metadata,
        });
    }
};
exports.HistoricoService = HistoricoService;
exports.HistoricoService = HistoricoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chamado_historico_entity_1.ChamadoHistorico)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HistoricoService);

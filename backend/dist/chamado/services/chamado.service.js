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
exports.ChamadoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chamado_entity_1 = require("../entities/chamado.entity");
const historico_service_1 = require("./historico.service");
let ChamadoService = class ChamadoService {
    constructor(chamadoRepository, historicoService) {
        this.chamadoRepository = chamadoRepository;
        this.historicoService = historicoService;
    }
    async criar(dto) {
        const chamado = this.chamadoRepository.create(dto);
        const resultado = await this.chamadoRepository.save(chamado);
        // Log creation in history
        await this.historicoService.registrarSistema(resultado.id, 'Chamado criado', { contexto: dto.contexto, descricao: dto.descricao });
        return resultado;
    }
    async listarTodos() {
        return this.chamadoRepository.find({
            order: { criadoEm: 'DESC' },
            relations: ['historico'],
        });
    }
    async listarPorUsuario(usuarioId) {
        return this.chamadoRepository.find({
            where: { usuarioId },
            order: { criadoEm: 'DESC' },
            relations: ['historico'],
        });
    }
    async obterPorId(id) {
        const chamado = await this.chamadoRepository.findOne({
            where: { id },
            relations: ['historico'],
        });
        if (!chamado) {
            throw new common_1.NotFoundException(`Chamado ${id} não encontrado`);
        }
        return chamado;
    }
    async atualizar(id, dto) {
        const chamado = await this.obterPorId(id);
        if (dto.status && dto.status !== chamado.status) {
            // Log status change
            await this.historicoService.registrarStatus(id, `Status alterado para ${dto.status}`, { statusAnterior: chamado.status, statusNovo: dto.status });
        }
        Object.assign(chamado, dto);
        return this.chamadoRepository.save(chamado);
    }
    async mudarStatus(id, novoStatus, motivo) {
        const chamado = await this.obterPorId(id);
        const statusAnterior = chamado.status;
        chamado.status = novoStatus;
        const resultado = await this.chamadoRepository.save(chamado);
        // Log status change
        await this.historicoService.registrarStatus(id, motivo || `Status alterado para ${novoStatus}`, { statusAnterior, statusNovo: novoStatus });
        return resultado;
    }
    async deletar(id) {
        const chamado = await this.obterPorId(id);
        await this.chamadoRepository.remove(chamado);
    }
};
exports.ChamadoService = ChamadoService;
exports.ChamadoService = ChamadoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chamado_entity_1.Chamado)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        historico_service_1.HistoricoService])
], ChamadoService);

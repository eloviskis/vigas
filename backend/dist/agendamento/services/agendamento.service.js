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
exports.AgendamentoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agendamento_entity_1 = require("../entities/agendamento.entity");
const chamado_entity_1 = require("../../chamado/entities/chamado.entity");
const slot_service_1 = require("./slot.service");
const historico_service_1 = require("../../chamado/services/historico.service");
let AgendamentoService = class AgendamentoService {
    constructor(agendamentoRepository, chamadoRepository, slotService, historicoService) {
        this.agendamentoRepository = agendamentoRepository;
        this.chamadoRepository = chamadoRepository;
        this.slotService = slotService;
        this.historicoService = historicoService;
    }
    async agendar(dto) {
        // Validar chamado
        const chamado = await this.chamadoRepository.findOne({
            where: { id: dto.chamadoId },
        });
        if (!chamado) {
            throw new common_1.NotFoundException(`Chamado ${dto.chamadoId} não encontrado`);
        }
        // Validar se já existe agendamento pendente/confirmado
        const agendamentoExistente = await this.agendamentoRepository.findOne({
            where: {
                chamadoId: dto.chamadoId,
                status: 'CONFIRMADO',
            },
        });
        if (agendamentoExistente) {
            throw new common_1.BadRequestException(`Chamado ${dto.chamadoId} já possui agendamento confirmado`);
        }
        // Criar agendamento
        const agendamento = this.agendamentoRepository.create(dto);
        agendamento.status = agendamento_entity_1.AgendamentoStatus.PENDENTE;
        const agendamentoSalvo = await this.agendamentoRepository.save(agendamento);
        // Marcar slot como ocupado se fornecido
        if (dto.slotId) {
            try {
                await this.slotService.marcarComoOcupado(dto.slotId, agendamentoSalvo.id);
            }
            catch (error) {
                // Se falhar ao marcar slot, deletar agendamento
                await this.agendamentoRepository.remove(agendamentoSalvo);
                throw error;
            }
        }
        // Log na timeline
        await this.historicoService.registrarAgendamento(dto.chamadoId, `Agendamento criado com profissional para ${dto.dataHora.toLocaleString()}`, {
            agendamento_id: agendamentoSalvo.id,
            profissional_id: dto.profissionalId,
            data_hora: dto.dataHora,
        });
        return agendamentoSalvo;
    }
    async confirmar(agendamentoId, dto) {
        const agendamento = await this.obterPorId(agendamentoId);
        if (agendamento.status !== agendamento_entity_1.AgendamentoStatus.PENDENTE) {
            throw new common_1.BadRequestException(`Agendamento ${agendamentoId} não pode ser confirmado (status: ${agendamento.status})`);
        }
        agendamento.status = agendamento_entity_1.AgendamentoStatus.CONFIRMADO;
        agendamento.confirmadoEm = new Date();
        const agendamentoAtualizado = await this.agendamentoRepository.save(agendamento);
        // Log na timeline
        await this.historicoService.registrarAgendamento(agendamento.chamadoId, `Agendamento confirmado para ${agendamento.dataHora.toLocaleString()}`, {
            agendamento_id: agendamentoId,
            confirmado_em: agendamentoAtualizado.confirmadoEm,
        });
        return agendamentoAtualizado;
    }
    async cancelar(agendamentoId, dto) {
        const agendamento = await this.obterPorId(agendamentoId);
        if ([agendamento_entity_1.AgendamentoStatus.CONCLUIDO, agendamento_entity_1.AgendamentoStatus.CANCELADO].includes(agendamento.status)) {
            throw new common_1.BadRequestException(`Agendamento ${agendamentoId} não pode ser cancelado (status: ${agendamento.status})`);
        }
        agendamento.status = agendamento_entity_1.AgendamentoStatus.CANCELADO;
        agendamento.canceladoEm = new Date();
        agendamento.motivoCancelamento = dto.motivo;
        const agendamentoAtualizado = await this.agendamentoRepository.save(agendamento);
        // Liberar slot se estava ocupado
        if (agendamento.slotId) {
            try {
                await this.slotService.marcarComoDisponivel(agendamento.slotId);
            }
            catch (error) {
                // Log mas não falha o cancelamento
                console.error('Erro ao liberar slot:', error);
            }
        }
        // Log na timeline
        await this.historicoService.registrarAgendamento(agendamento.chamadoId, `Agendamento cancelado: ${dto.motivo}`, {
            agendamento_id: agendamentoId,
            motivo: dto.motivo,
        });
        return agendamentoAtualizado;
    }
    async obterPorId(id) {
        const agendamento = await this.agendamentoRepository.findOne({
            where: { id },
            relations: ['chamado', 'profissional', 'slot'],
        });
        if (!agendamento) {
            throw new common_1.NotFoundException(`Agendamento ${id} não encontrado`);
        }
        return agendamento;
    }
    async obterPorChamado(chamadoId) {
        return this.agendamentoRepository.findOne({
            where: { chamadoId },
            relations: ['profissional', 'slot'],
            order: { criadoEm: 'DESC' },
        });
    }
    async listarPendentesDeConfirmacao(limite = 20) {
        return this.agendamentoRepository.find({
            where: { status: agendamento_entity_1.AgendamentoStatus.PENDENTE },
            relations: ['chamado', 'profissional'],
            order: { dataHora: 'ASC' },
            take: limite,
        });
    }
    async iniciarAtendimento(agendamentoId) {
        const agendamento = await this.obterPorId(agendamentoId);
        if (agendamento.status !== agendamento_entity_1.AgendamentoStatus.CONFIRMADO) {
            throw new common_1.BadRequestException(`Agendamento ${agendamentoId} não pode ser iniciado (status: ${agendamento.status})`);
        }
        agendamento.status = agendamento_entity_1.AgendamentoStatus.EM_ATENDIMENTO;
        agendamento.inicioAtendimento = new Date();
        return await this.agendamentoRepository.save(agendamento);
    }
    async concluirAtendimento(agendamentoId) {
        const agendamento = await this.obterPorId(agendamentoId);
        if (agendamento.status !== agendamento_entity_1.AgendamentoStatus.EM_ATENDIMENTO) {
            throw new common_1.BadRequestException(`Agendamento ${agendamentoId} não está em atendimento`);
        }
        agendamento.status = agendamento_entity_1.AgendamentoStatus.CONCLUIDO;
        agendamento.fimAtendimento = new Date();
        const agendamentoAtualizado = await this.agendamentoRepository.save(agendamento);
        // Log na timeline
        await this.historicoService.registrarAgendamento(agendamento.chamadoId, `Atendimento concluído em ${agendamentoAtualizado.fimAtendimento?.toLocaleString() || 'agora'}`, {
            agendamento_id: agendamentoId,
            duracao_minutos: agendamento.duracao,
        });
        return agendamentoAtualizado;
    }
};
exports.AgendamentoService = AgendamentoService;
exports.AgendamentoService = AgendamentoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agendamento_entity_1.Agendamento)),
    __param(1, (0, typeorm_1.InjectRepository)(chamado_entity_1.Chamado)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        slot_service_1.SlotService,
        historico_service_1.HistoricoService])
], AgendamentoService);

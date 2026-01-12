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
exports.SlotService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const slot_entity_1 = require("../entities/slot.entity");
let SlotService = class SlotService {
    constructor(slotRepository) {
        this.slotRepository = slotRepository;
    }
    async criar(dto) {
        // Validar se slot não sobrepõe outro
        const slotExistente = await this.slotRepository.findOne({
            where: {
                profissionalId: dto.profissionalId,
                dataHora: dto.dataHora,
            },
        });
        if (slotExistente) {
            throw new common_1.BadRequestException(`Slot já existe para profissional ${dto.profissionalId} em ${dto.dataHora}`);
        }
        const slot = this.slotRepository.create(dto);
        return await this.slotRepository.save(slot);
    }
    async criarEmLote(profissionalId, dataInicio, dataFim, intervaloMinutos = 60) {
        const slots = [];
        let data = new Date(dataInicio);
        while (data < dataFim) {
            const slotExistente = await this.slotRepository.findOne({
                where: {
                    profissionalId,
                    dataHora: data,
                },
            });
            if (!slotExistente) {
                const slot = this.slotRepository.create({
                    profissionalId,
                    dataHora: new Date(data),
                    duracao: intervaloMinutos,
                    disponivel: true,
                });
                slots.push(await this.slotRepository.save(slot));
            }
            data.setMinutes(data.getMinutes() + intervaloMinutos);
        }
        return slots;
    }
    async listarDisponiveisPorProfissional(profissionalId, dataInicio, dataFim) {
        return this.slotRepository.find({
            where: {
                profissionalId,
                disponivel: true,
                dataHora: (0, typeorm_2.Between)(dataInicio, dataFim),
            },
            order: { dataHora: 'ASC' },
        });
    }
    async obterPorId(id) {
        const slot = await this.slotRepository.findOne({
            where: { id },
            relations: ['profissional'],
        });
        if (!slot) {
            throw new common_1.NotFoundException(`Slot ${id} não encontrado`);
        }
        return slot;
    }
    async marcarComoOcupado(slotId, agendamentoId) {
        const slot = await this.obterPorId(slotId);
        if (!slot.disponivel) {
            throw new common_1.BadRequestException(`Slot ${slotId} não está disponível`);
        }
        slot.disponivel = false;
        slot.agendamentoId = agendamentoId;
        return await this.slotRepository.save(slot);
    }
    async marcarComoDisponivel(slotId) {
        const slot = await this.obterPorId(slotId);
        slot.disponivel = true;
        slot.agendamentoId = undefined;
        return await this.slotRepository.save(slot);
    }
    async atualizar(id, dto) {
        const slot = await this.obterPorId(id);
        Object.assign(slot, dto);
        return await this.slotRepository.save(slot);
    }
    async deletar(id) {
        const slot = await this.obterPorId(id);
        await this.slotRepository.remove(slot);
    }
    async limparSlotsAntigos(diasRetentao = 30) {
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - diasRetentao);
        const resultado = await this.slotRepository.delete({
            dataHora: (0, typeorm_2.LessThan)(dataLimite),
            disponivel: true,
        });
        return resultado.affected || 0;
    }
};
exports.SlotService = SlotService;
exports.SlotService = SlotService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(slot_entity_1.Slot)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SlotService);

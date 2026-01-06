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
exports.TriagemService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const triagem_entity_1 = require("../entities/triagem.entity");
const chamado_entity_1 = require("../../chamado/entities/chamado.entity");
const profissional_service_1 = require("../../profissional/services/profissional.service");
const historico_service_1 = require("../../chamado/services/historico.service");
let TriagemService = class TriagemService {
    constructor(triagemRepository, chamadoRepository, profissionalService, historicoService) {
        this.triagemRepository = triagemRepository;
        this.chamadoRepository = chamadoRepository;
        this.profissionalService = profissionalService;
        this.historicoService = historicoService;
    }
    async realizar(dto) {
        // Validar chamado existe
        const chamado = await this.chamadoRepository.findOne({
            where: { id: dto.chamadoId },
        });
        if (!chamado) {
            throw new common_1.NotFoundException(`Chamado ${dto.chamadoId} não encontrado`);
        }
        // Executar triagem automática por padrão
        const tipo = dto.tipo || triagem_entity_1.TriagemTipo.AUTOMATICA;
        const triagem = await this.executarTriagemAutomatica(chamado, tipo, dto.critérios);
        // Log na timeline
        await this.historicoService.registrarTriagem(dto.chamadoId, `Triagem ${tipo} realizada: ${triagem.resultado}`, {
            triagem_id: triagem.id,
            profissional_id: triagem.profissionalRecomendadoId,
            confiança: triagem.confiança,
        });
        return triagem;
    }
    async executarTriagemAutomatica(chamado, tipo, critérios) {
        // Buscar profissionais por contexto
        const profissionais = await this.profissionalService.listarAtivos(chamado.contexto);
        if (profissionais.length === 0) {
            const triagem = this.triagemRepository.create({
                chamadoId: chamado.id,
                tipo,
                resultado: triagem_entity_1.TriagemResultado.SEM_PROFISSIONAL,
                justificativa: `Nenhum profissional disponível para ${chamado.contexto}`,
                confiança: 100,
                critérios,
            });
            return await this.triagemRepository.save(triagem);
        }
        // Ordenar por score (simples recomendação)
        const profissionalRecomendado = profissionais[0];
        const multiplas = profissionais.length > 1;
        const triagem = this.triagemRepository.create({
            chamadoId: chamado.id,
            tipo,
            resultado: multiplas ? triagem_entity_1.TriagemResultado.MULTIPLAS_OPCOES : triagem_entity_1.TriagemResultado.RECOMENDADO,
            profissionalRecomendadoId: profissionalRecomendado.id,
            opcoesProfissionais: profissionais.slice(0, 3).map((p) => ({
                id: p.id,
                nome: p.nome,
                score: parseFloat(p.score.toString()),
            })),
            confiança: multiplas ? 75 : 90,
            critérios: {
                contexto: chamado.contexto,
                ...critérios,
            },
        });
        return await this.triagemRepository.save(triagem);
    }
    async obterPorChamado(chamadoId) {
        return this.triagemRepository.findOne({
            where: { chamadoId },
            relations: ['profissionalRecomendado'],
            order: { criadoEm: 'DESC' },
        });
    }
    async recomendarManualmente(dto) {
        const triagem = await this.triagemRepository.findOne({
            where: { id: dto.triagemId },
        });
        if (!triagem) {
            throw new common_1.NotFoundException(`Triagem ${dto.triagemId} não encontrada`);
        }
        // Validar profissional existe
        const profissional = await this.profissionalService.obterPorId(dto.profissionalId);
        triagem.tipo = triagem_entity_1.TriagemTipo.MANUAL;
        triagem.profissionalRecomendadoId = dto.profissionalId;
        triagem.resultado = triagem_entity_1.TriagemResultado.RECOMENDADO;
        triagem.confiança = 100;
        triagem.justificativa = dto.justificativa;
        return await this.triagemRepository.save(triagem);
    }
    async listarPendentes(limit = 10) {
        return this.triagemRepository.find({
            where: {
                resultado: triagem_entity_1.TriagemResultado.REQUER_VALIDACAO,
            },
            relations: ['chamado', 'profissionalRecomendado'],
            order: { criadoEm: 'ASC' },
            take: limit,
        });
    }
};
exports.TriagemService = TriagemService;
exports.TriagemService = TriagemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(triagem_entity_1.Triagem)),
    __param(1, (0, typeorm_1.InjectRepository)(chamado_entity_1.Chamado)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        profissional_service_1.ProfissionalService,
        historico_service_1.HistoricoService])
], TriagemService);

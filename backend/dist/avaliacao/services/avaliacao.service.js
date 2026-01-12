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
exports.AvaliacaoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const avaliacao_entity_1 = require("../entities/avaliacao.entity");
const profissional_entity_1 = require("../../profissional/entities/profissional.entity");
let AvaliacaoService = class AvaliacaoService {
    constructor(avaliacaoRepository, profissionalRepository) {
        this.avaliacaoRepository = avaliacaoRepository;
        this.profissionalRepository = profissionalRepository;
    }
    async criar(dto) {
        const avaliacao = this.avaliacaoRepository.create(dto);
        const saved = await this.avaliacaoRepository.save(avaliacao);
        // Atualizar score do profissional
        await this.recalcularScore(dto.profissionalId);
        return saved;
    }
    async listarPorProfissional(profissionalId) {
        return await this.avaliacaoRepository.find({
            where: { profissionalId },
            order: { criadoEm: 'DESC' },
        });
    }
    async recalcularScore(profissionalId) {
        const avaliacoes = await this.avaliacaoRepository.find({
            where: { profissionalId },
        });
        if (avaliacoes.length === 0)
            return;
        const somaNotas = avaliacoes.reduce((sum, av) => sum + av.notaGeral, 0);
        const novoScore = somaNotas / avaliacoes.length;
        const recomendacoes = avaliacoes.filter(av => av.recomenda).length;
        const taxaSatisfacao = (recomendacoes / avaliacoes.length) * 100;
        await this.profissionalRepository.update(profissionalId, {
            score: Number(novoScore.toFixed(2)),
            totalServiços: avaliacoes.length,
            serviçosConcluídos: avaliacoes.length,
            taxaSatisfação: Number(taxaSatisfacao.toFixed(2)),
        });
    }
};
exports.AvaliacaoService = AvaliacaoService;
exports.AvaliacaoService = AvaliacaoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(avaliacao_entity_1.Avaliacao)),
    __param(1, (0, typeorm_1.InjectRepository)(profissional_entity_1.Profissional)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AvaliacaoService);

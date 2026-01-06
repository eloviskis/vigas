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
exports.ProfissionalService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const profissional_entity_1 = require("../entities/profissional.entity");
const profissional_entity_2 = require("../entities/profissional.entity");
/**
 * Calcula distância entre dois pontos usando fórmula de Haversine
 * @returns distância em quilômetros
 */
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
let ProfissionalService = class ProfissionalService {
    constructor(profissionalRepository) {
        this.profissionalRepository = profissionalRepository;
    }
    async criar(dto) {
        const existente = await this.profissionalRepository.findOne({
            where: { email: dto.email },
        });
        if (existente) {
            throw new common_1.BadRequestException(`Email ${dto.email} já registrado`);
        }
        const profissional = this.profissionalRepository.create(dto);
        return await this.profissionalRepository.save(profissional);
    }
    async listarAtivos(contexto, userLat, userLon) {
        const query = this.profissionalRepository.createQueryBuilder('p')
            .where('p.status = :status', { status: profissional_entity_2.ProfissionalStatus.ATIVO });
        if (contexto) {
            query.andWhere('p.contextos LIKE :contexto', { contexto: `%${contexto}%` });
        }
        const profissionais = await query.getMany();
        // Se localização fornecida, ordenar por distância
        if (userLat && userLon) {
            return profissionais
                .map(prof => ({
                ...prof,
                distancia: prof.latitude && prof.longitude
                    ? calcularDistancia(userLat, userLon, prof.latitude, prof.longitude)
                    : 9999
            }))
                .sort((a, b) => {
                // Ordenar por distância primeiro, depois por score
                if (a.distancia !== b.distancia) {
                    return a.distancia - b.distancia;
                }
                return Number(b.score) - Number(a.score);
            });
        }
        // Ordenar apenas por score se não houver localização
        return profissionais.sort((a, b) => Number(b.score) - Number(a.score));
    }
    async listarPorContextoECategoria(contexto, categoria, userLat, userLon) {
        const profissionais = await this.profissionalRepository
            .createQueryBuilder('p')
            .where('p.contextos LIKE :contexto', { contexto: `%${contexto}%` })
            .andWhere('p.categorias LIKE :categoria', { categoria: `%${categoria}%` })
            .andWhere('p.status = :status', { status: profissional_entity_2.ProfissionalStatus.ATIVO })
            .getMany();
        // Se localização fornecida, ordenar por distância
        if (userLat && userLon) {
            return profissionais
                .map(prof => ({
                ...prof,
                distancia: prof.latitude && prof.longitude
                    ? calcularDistancia(userLat, userLon, prof.latitude, prof.longitude)
                    : 9999
            }))
                .sort((a, b) => {
                // Ordenar por distância primeiro, depois por score
                if (a.distancia !== b.distancia) {
                    return a.distancia - b.distancia;
                }
                return Number(b.score) - Number(a.score);
            });
        }
        // Ordenar apenas por score se não houver localização
        return profissionais.sort((a, b) => Number(b.score) - Number(a.score));
    }
    async obterPorId(id) {
        const profissional = await this.profissionalRepository.findOne({
            where: { id },
        });
        if (!profissional) {
            throw new common_1.NotFoundException(`Profissional ${id} não encontrado`);
        }
        return profissional;
    }
    async atualizar(id, dto) {
        const profissional = await this.obterPorId(id);
        Object.assign(profissional, dto);
        return await this.profissionalRepository.save(profissional);
    }
    async atualizarScore(id, novoScore) {
        const profissional = await this.obterPorId(id);
        profissional.score = Math.max(0, Math.min(5, novoScore)); // 0-5 range
        return await this.profissionalRepository.save(profissional);
    }
    async incrementarServiço(id, concluído = false) {
        const profissional = await this.obterPorId(id);
        profissional.totalServiços += 1;
        if (concluído) {
            profissional.serviçosConcluídos += 1;
        }
        return await this.profissionalRepository.save(profissional);
    }
    async calcularTaxaSatisfação(id) {
        const profissional = await this.obterPorId(id);
        if (profissional.totalServiços === 0)
            return 0;
        return (profissional.serviçosConcluídos / profissional.totalServiços) * 100;
    }
};
exports.ProfissionalService = ProfissionalService;
exports.ProfissionalService = ProfissionalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(profissional_entity_1.Profissional)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProfissionalService);

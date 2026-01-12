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
exports.OrcamentoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const orcamento_entity_1 = require("../entities/orcamento.entity");
const profissional_entity_1 = require("../../profissional/entities/profissional.entity");
let OrcamentoService = class OrcamentoService {
    constructor(orcamentoRepository, profissionalRepository) {
        this.orcamentoRepository = orcamentoRepository;
        this.profissionalRepository = profissionalRepository;
    }
    async criar(dto) {
        const valorDeslocamento = dto.valorDeslocamento || 0;
        const valorMateriais = dto.valorMateriais || 0;
        const valorTotal = dto.valorServico + valorDeslocamento + valorMateriais;
        // Validade de 7 dias
        const validadeAte = new Date();
        validadeAte.setDate(validadeAte.getDate() + 7);
        const orcamento = this.orcamentoRepository.create({
            ...dto,
            valorDeslocamento,
            valorMateriais,
            valorTotal,
            validadeAte,
            status: orcamento_entity_1.OrcamentoStatus.ENVIADO,
        });
        return await this.orcamentoRepository.save(orcamento);
    }
    async listarPorChamado(chamadoId) {
        const orcamentos = await this.orcamentoRepository.find({
            where: { chamadoId },
            order: { criadoEm: 'DESC' },
        });
        // Carregar informações dos profissionais
        const orcamentosComProfissional = await Promise.all(orcamentos.map(async (orc) => {
            const profissional = await this.profissionalRepository.findOne({
                where: { id: orc.profissionalId },
            });
            return {
                ...orc,
                profissionalNome: profissional?.nome,
                profissionalScore: profissional?.score,
            };
        }));
        return orcamentosComProfissional;
    }
    async listarPorProfissional(profissionalId) {
        return await this.orcamentoRepository.find({
            where: { profissionalId },
            order: { criadoEm: 'DESC' },
        });
    }
    async obterPorId(id) {
        const orcamento = await this.orcamentoRepository.findOne({
            where: { id },
        });
        if (!orcamento) {
            throw new common_1.NotFoundException(`Orçamento ${id} não encontrado`);
        }
        return orcamento;
    }
    async aprovar(orcamentoId, usuarioId) {
        const orcamento = await this.obterPorId(orcamentoId);
        if (orcamento.status !== orcamento_entity_1.OrcamentoStatus.ENVIADO) {
            throw new common_1.BadRequestException('Orçamento não está pendente de aprovação');
        }
        // Verificar validade
        if (orcamento.validadeAte && new Date() > orcamento.validadeAte) {
            orcamento.status = orcamento_entity_1.OrcamentoStatus.EXPIRADO;
            await this.orcamentoRepository.save(orcamento);
            throw new common_1.BadRequestException('Orçamento expirado');
        }
        // Recusar outros orçamentos do mesmo chamado
        await this.orcamentoRepository.update({
            chamadoId: orcamento.chamadoId,
            status: orcamento_entity_1.OrcamentoStatus.ENVIADO,
        }, {
            status: orcamento_entity_1.OrcamentoStatus.RECUSADO,
            motivoRecusa: 'Cliente aprovou outro orçamento',
        });
        // Aprovar este
        orcamento.status = orcamento_entity_1.OrcamentoStatus.APROVADO;
        orcamento.aprovadoEm = new Date();
        return await this.orcamentoRepository.save(orcamento);
    }
    async recusar(orcamentoId, motivoRecusa) {
        const orcamento = await this.obterPorId(orcamentoId);
        if (orcamento.status !== orcamento_entity_1.OrcamentoStatus.ENVIADO) {
            throw new common_1.BadRequestException('Orçamento não está pendente');
        }
        orcamento.status = orcamento_entity_1.OrcamentoStatus.RECUSADO;
        orcamento.motivoRecusa = motivoRecusa;
        return await this.orcamentoRepository.save(orcamento);
    }
    async cancelar(orcamentoId) {
        const orcamento = await this.obterPorId(orcamentoId);
        if (orcamento.status === orcamento_entity_1.OrcamentoStatus.APROVADO) {
            throw new common_1.BadRequestException('Não é possível cancelar orçamento já aprovado');
        }
        orcamento.status = orcamento_entity_1.OrcamentoStatus.CANCELADO;
        return await this.orcamentoRepository.save(orcamento);
    }
    async expirarOrcamentosVencidos() {
        const agora = new Date();
        await this.orcamentoRepository.update({
            status: orcamento_entity_1.OrcamentoStatus.ENVIADO,
            validadeAte: typeorm_2.Repository['LessThan'](agora),
        }, {
            status: orcamento_entity_1.OrcamentoStatus.EXPIRADO,
        });
    }
};
exports.OrcamentoService = OrcamentoService;
exports.OrcamentoService = OrcamentoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(orcamento_entity_1.Orcamento)),
    __param(1, (0, typeorm_1.InjectRepository)(profissional_entity_1.Profissional)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OrcamentoService);

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Triagem, TriagemTipo, TriagemResultado } from '../entities/triagem.entity';
import { CriarTriagemDto, RecomendarProfissionalDto } from '../dtos/triagem.dto';
import { Chamado } from '../../chamado/entities/chamado.entity';
import { ProfissionalService } from '../../profissional/services/profissional.service';
import { HistoricoService } from '../../chamado/services/historico.service';
import { ChamadoHistoricoTipo } from '../../chamado/entities/chamado-historico.entity';

@Injectable()
export class TriagemService {
  constructor(
    @InjectRepository(Triagem)
    private triagemRepository: Repository<Triagem>,
    @InjectRepository(Chamado)
    private chamadoRepository: Repository<Chamado>,
    private profissionalService: ProfissionalService,
    private historicoService: HistoricoService,
  ) {}

  async realizar(dto: CriarTriagemDto): Promise<Triagem> {
    // Validar chamado existe
    const chamado = await this.chamadoRepository.findOne({
      where: { id: dto.chamadoId },
    });

    if (!chamado) {
      throw new NotFoundException(`Chamado ${dto.chamadoId} não encontrado`);
    }

    // Executar triagem automática por padrão
    const tipo = dto.tipo || TriagemTipo.AUTOMATICA;
    const triagem = await this.executarTriagemAutomatica(chamado, tipo, dto.critérios);

    // Log na timeline
    await this.historicoService.registrarTriagem(
      dto.chamadoId,
      `Triagem ${tipo} realizada: ${triagem.resultado}`,
      {
        triagem_id: triagem.id,
        profissional_id: triagem.profissionalRecomendadoId,
        confiança: triagem.confiança,
      },
    );

    return triagem;
  }

  private async executarTriagemAutomatica(
    chamado: Chamado,
    tipo: TriagemTipo,
    critérios?: Record<string, any>,
  ): Promise<Triagem> {
    // Buscar profissionais por contexto
    const profissionais = await this.profissionalService.listarAtivos(chamado.contexto);

    if (profissionais.length === 0) {
      const triagem = this.triagemRepository.create({
        chamadoId: chamado.id,
        tipo,
        resultado: TriagemResultado.SEM_PROFISSIONAL,
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
      resultado: multiplas ? TriagemResultado.MULTIPLAS_OPCOES : TriagemResultado.RECOMENDADO,
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

  async obterPorChamado(chamadoId: string): Promise<Triagem | null> {
    return this.triagemRepository.findOne({
      where: { chamadoId },
      relations: ['profissionalRecomendado'],
      order: { criadoEm: 'DESC' },
    });
  }

  async recomendarManualmente(dto: RecomendarProfissionalDto): Promise<Triagem> {
    const triagem = await this.triagemRepository.findOne({
      where: { id: dto.triagemId },
    });

    if (!triagem) {
      throw new NotFoundException(`Triagem ${dto.triagemId} não encontrada`);
    }

    // Validar profissional existe
    const profissional = await this.profissionalService.obterPorId(
      dto.profissionalId,
    );

    triagem.tipo = TriagemTipo.MANUAL;
    triagem.profissionalRecomendadoId = dto.profissionalId;
    triagem.resultado = TriagemResultado.RECOMENDADO;
    triagem.confiança = 100;
    triagem.justificativa = dto.justificativa;

    return await this.triagemRepository.save(triagem);
  }

  async listarPendentes(limit: number = 10): Promise<Triagem[]> {
    return this.triagemRepository.find({
      where: {
        resultado: TriagemResultado.REQUER_VALIDACAO,
      },
      relations: ['chamado', 'profissionalRecomendado'],
      order: { criadoEm: 'ASC' },
      take: limit,
    });
  }
}

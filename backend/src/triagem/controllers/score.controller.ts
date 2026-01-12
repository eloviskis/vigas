import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ScoreRulesService } from '../services/score-rules.service';
import { ProfissionalService } from '../../profissional/services/profissional.service';

@Controller('triagem')
@UseGuards(JwtAuthGuard)
export class ScoreController {
  constructor(
    private scoreRulesService: ScoreRulesService,
    private profissionalService: ProfissionalService,
  ) {}

  @Get(':chamadoId/scores')
  async analisarScores(
    @Param('chamadoId') chamadoId: string,
    @Query('categoria') categoria: string,
    @Query('horario') horario?: string,
  ) {
    const profissionais = await this.profissionalService.listarAtivos(categoria);
    
    const horarioPreferido = horario ? new Date(horario) : undefined;
    
    const resultados = await this.scoreRulesService.rankearProfissionais(
      profissionais,
      categoria,
      horarioPreferido,
    );

    return resultados.map((r) => ({
      profissional: {
        id: r.profissional.id,
        nome: r.profissional.nome,
      },
      scoreBase: r.scoreBase,
      scoreHistorico: r.scoreHistorico,
      scoreSazonalidade: r.scoreSazonalidade,
      penalidades: r.penalidades,
      scoreFinal: r.scoreFinal,
      detalhes: r.detalhes,
    }));
  }

  @Get('profissional/:profissionalId/score-detalhado')
  async obterScoreDetalhado(
    @Param('profissionalId') profissionalId: string,
    @Query('categoria') categoria: string,
  ) {
    const profissional = await this.profissionalService.obterPorId(profissionalId);
    const resultado = await this.scoreRulesService.calcularScoreAvancado(
      profissional,
      categoria,
    );

    return {
      profissional: {
        id: profissional.id,
        nome: profissional.nome,
      },
      scores: {
        base: resultado.scoreBase,
        historico: resultado.scoreHistorico,
        sazonalidade: resultado.scoreSazonalidade,
        penalidades: resultado.penalidades,
        final: resultado.scoreFinal,
      },
      detalhes: resultado.detalhes,
    };
  }
}

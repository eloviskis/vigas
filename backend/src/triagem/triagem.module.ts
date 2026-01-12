import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Triagem } from './entities/triagem.entity';
import { ScoreHistorico } from './entities/score-historico.entity';
import { TriagemService } from './services/triagem.service';
import { ScoreRulesService } from './services/score-rules.service';
import { TriagemController } from './controllers/triagem.controller';
import { ScoreController } from './controllers/score.controller';
import { ChamadoModule } from '../chamado/chamado.module';
import { ProfissionalModule } from '../profissional/profissional.module';
import { Chamado } from '../chamado/entities/chamado.entity';
import { Profissional } from '../profissional/entities/profissional.entity';
import { Avaliacao } from '../avaliacao/entities/avaliacao.entity';
import { Agendamento } from '../agendamento/entities/agendamento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Triagem,
      ScoreHistorico,
      Chamado,
      Profissional,
      Avaliacao,
      Agendamento,
    ]),
    ChamadoModule,
    ProfissionalModule,
  ],
  providers: [TriagemService, ScoreRulesService],
  controllers: [TriagemController, ScoreController],
  exports: [TriagemService, ScoreRulesService],
})
export class TriagemModule {}

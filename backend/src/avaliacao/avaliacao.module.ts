import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avaliacao } from './entities/avaliacao.entity';
import { Profissional } from '../profissional/entities/profissional.entity';
import { AvaliacaoService } from './services/avaliacao.service';

@Module({
  imports: [TypeOrmModule.forFeature([Avaliacao, Profissional])],
  providers: [AvaliacaoService],
  exports: [AvaliacaoService],
})
export class AvaliacaoModule {}

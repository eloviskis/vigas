import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Triagem } from './entities/triagem.entity';
import { TriagemService } from './services/triagem.service';
import { TriagemController } from './controllers/triagem.controller';
import { ChamadoModule } from '../chamado/chamado.module';
import { ProfissionalModule } from '../profissional/profissional.module';
import { Chamado } from '../chamado/entities/chamado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Triagem, Chamado]), ChamadoModule, ProfissionalModule],
  providers: [TriagemService],
  controllers: [TriagemController],
  exports: [TriagemService],
})
export class TriagemModule {}

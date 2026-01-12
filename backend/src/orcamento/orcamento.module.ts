import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orcamento } from './entities/orcamento.entity';
import { Profissional } from '../profissional/entities/profissional.entity';
import { OrcamentoService } from './services/orcamento.service';
import { OrcamentoController } from './controllers/orcamento.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Orcamento, Profissional])],
  controllers: [OrcamentoController],
  providers: [OrcamentoService],
  exports: [OrcamentoService],
})
export class OrcamentoModule {}

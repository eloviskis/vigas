import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChamadoHistorico } from './entities/chamado-historico.entity';
import { HistoricoService } from './services/historico.service';
import { HistoricoController } from './controllers/historico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChamadoHistorico])],
  providers: [HistoricoService],
  controllers: [HistoricoController],
  exports: [HistoricoService],
})
export class ChamadoModule {}

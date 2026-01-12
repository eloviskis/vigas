import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { Chamado } from '../chamado/chamado.entity';
import { Orcamento } from '../orcamento/orcamento.entity';
import { Pagamento } from '../pagamento/pagamento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chamado, Orcamento, Pagamento]),
  ],
  controllers: [MetricsController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}

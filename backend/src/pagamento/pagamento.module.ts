import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pagamento } from './entities/pagamento.entity';
import { Orcamento } from '../orcamento/entities/orcamento.entity';
import { PagamentoService } from './services/pagamento.service';
import { PagamentoController } from './controllers/pagamento.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pagamento, Orcamento]),
  ],
  controllers: [PagamentoController],
  providers: [PagamentoService],
  exports: [PagamentoService],
})
export class PagamentoModule {}

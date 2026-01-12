import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pagamento } from './entities/pagamento.entity';
import { Orcamento } from '../orcamento/entities/orcamento.entity';
import { PagamentoService } from './services/pagamento.service';
import { PagamentoController } from './controllers/pagamento.controller';
import { RelatorioFinanceiroService } from './services/relatorio-financeiro.service';
import { RelatorioFinanceiroController } from './controllers/relatorio-financeiro.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pagamento, Orcamento]),
  ],
  controllers: [PagamentoController, RelatorioFinanceiroController],
  providers: [PagamentoService, RelatorioFinanceiroService],
  exports: [PagamentoService],
})
export class PagamentoModule {}

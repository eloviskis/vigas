import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LgpdController } from './lgpd.controller';
import { LgpdService } from './lgpd.service';
import { User } from '../auth/entities/user.entity';
import { Chamado } from '../chamado/chamado.entity';
import { Pagamento } from '../pagamento/pagamento.entity';
import { Avaliacao } from '../avaliacao/avaliacao.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Chamado, Pagamento, Avaliacao]),
  ],
  controllers: [LgpdController],
  providers: [LgpdService],
  exports: [LgpdService],
})
export class LgpdModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LgpdController } from './lgpd.controller';
import { LgpdService } from './lgpd.service';
import { User } from '../auth/entities/user.entity';
import { Chamado } from '../chamado/entities/chamado.entity';
import { Pagamento } from '../pagamento/entities/pagamento.entity';
import { Avaliacao } from '../avaliacao/entities/avaliacao.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Chamado, Pagamento, Avaliacao]),
  ],
  controllers: [LgpdController],
  providers: [LgpdService],
  exports: [LgpdService],
})
export class LgpdModule {}

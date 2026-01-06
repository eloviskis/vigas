import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from './entities/slot.entity';
import { Agendamento } from './entities/agendamento.entity';
import { SlotService } from './services/slot.service';
import { AgendamentoService } from './services/agendamento.service';
import { SlotController } from './controllers/slot.controller';
import { AgendamentoController } from './controllers/agendamento.controller';
import { ChamadoModule } from '../chamado/chamado.module';
import { Chamado } from '../chamado/entities/chamado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slot, Agendamento, Chamado]), ChamadoModule],
  providers: [SlotService, AgendamentoService],
  controllers: [SlotController, AgendamentoController],
  exports: [SlotService, AgendamentoService],
})
export class AgendamentoModule {}

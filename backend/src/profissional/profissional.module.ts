import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profissional } from './entities/profissional.entity';
import { ProfissionalService } from './services/profissional.service';
import { ProfissionalController } from './controllers/profissional.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Profissional])],
  providers: [ProfissionalService],
  controllers: [ProfissionalController],
  exports: [ProfissionalService],
})
export class ProfissionalModule {}

import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FollowupService } from '../services/followup.service';
import { CriarFollowupDto, ResponderFollowupDto } from '../dtos/followup.dto';

@Controller('followups')
export class FollowupController {
  constructor(private followupService: FollowupService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async criar(@Body() dto: CriarFollowupDto) {
    return await this.followupService.criar(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async obter(@Param('id') id: string) {
    return await this.followupService.obterPorId(id);
  }

  @Get('agendamento/:agendamentoId')
  @UseGuards(JwtAuthGuard)
  async listarPorAgendamento(@Param('agendamentoId') agendamentoId: string) {
    return await this.followupService.listarPorAgendamento(agendamentoId);
  }

  @Put(':id/enviar')
  @UseGuards(JwtAuthGuard)
  async enviar(@Param('id') id: string) {
    return await this.followupService.enviar(id);
  }

  @Put(':id/responder')
  @UseGuards(JwtAuthGuard)
  async responder(@Param('id') id: string, @Body() dto: ResponderFollowupDto) {
    return await this.followupService.responder(id, dto);
  }

  @Get('metricas/geral')
  @UseGuards(JwtAuthGuard)
  async metricas() {
    return await this.followupService.obterMetricas();
  }

  @Get('pendentes/lista')
  @UseGuards(JwtAuthGuard)
  async listarPendentes() {
    return await this.followupService.listarPendentes();
  }
}

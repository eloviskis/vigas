import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AgendamentoService } from '../services/agendamento.service';
import {
  CriarAgendamentoDto,
  ConfirmarAgendamentoDto,
  CancelarAgendamentoDto,
  AgendamentoResponseDto,
} from '../dtos/agendamento.dto';

@ApiTags('agendamentos')
@Controller('chamados/:chamadoId/agendamentos')
@UseGuards(JwtAuthGuard)
export class AgendamentoController {
  constructor(private readonly agendamentoService: AgendamentoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo agendamento' })
  @ApiResponse({ status: 201, description: 'Agendamento criado com sucesso' })
  async criar(
    @Param('chamadoId') chamadoId: string,
    @Body() dto: CriarAgendamentoDto,
  ): Promise<AgendamentoResponseDto> {
    return await this.agendamentoService.agendar({
      ...dto,
      chamadoId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Obter agendamento do chamado' })
  @ApiResponse({ status: 200, description: 'Agendamento encontrado' })
  async obter(@Param('chamadoId') chamadoId: string): Promise<AgendamentoResponseDto | null> {
    return await this.agendamentoService.obterPorChamado(chamadoId);
  }

  @Put(':agendamentoId/confirmar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmar agendamento' })
  @ApiResponse({ status: 200, description: 'Agendamento confirmado com sucesso' })
  async confirmar(
    @Param('agendamentoId') agendamentoId: string,
    @Body() dto: ConfirmarAgendamentoDto,
  ): Promise<AgendamentoResponseDto> {
    return await this.agendamentoService.confirmar(agendamentoId, dto);
  }

  @Put(':agendamentoId/cancelar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar agendamento' })
  @ApiResponse({ status: 200, description: 'Agendamento cancelado com sucesso' })
  async cancelar(
    @Param('agendamentoId') agendamentoId: string,
    @Body() dto: CancelarAgendamentoDto,
  ): Promise<AgendamentoResponseDto> {
    return await this.agendamentoService.cancelar(agendamentoId, dto);
  }

  @Put(':agendamentoId/iniciar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar atendimento' })
  @ApiResponse({ status: 200, description: 'Atendimento iniciado com sucesso' })
  async iniciar(@Param('agendamentoId') agendamentoId: string): Promise<AgendamentoResponseDto> {
    return await this.agendamentoService.iniciarAtendimento(agendamentoId);
  }

  @Put(':agendamentoId/concluir')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Concluir atendimento' })
  @ApiResponse({ status: 200, description: 'Atendimento concluído com sucesso' })
  async concluir(@Param('agendamentoId') agendamentoId: string): Promise<AgendamentoResponseDto> {
    return await this.agendamentoService.concluirAtendimento(agendamentoId);
  }
}

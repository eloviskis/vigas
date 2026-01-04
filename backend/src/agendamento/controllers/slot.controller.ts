import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SlotService } from '../services/slot.service';
import { CriarSlotDto, SlotResponseDto } from '../dtos/slot.dto';

@ApiTags('slots')
@Controller('profissionais/:profissionalId/slots')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo slot de disponibilidade' })
  @ApiResponse({ status: 201, description: 'Slot criado com sucesso' })
  async criar(@Body() dto: CriarSlotDto): Promise<SlotResponseDto> {
    return await this.slotService.criar(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar slots disponíveis do profissional' })
  @ApiResponse({ status: 200, description: 'Lista de slots' })
  async listarDisponiveis(
    @Param('profissionalId') profissionalId: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ): Promise<SlotResponseDto[]> {
    const inicio = dataInicio ? new Date(dataInicio) : new Date();
    const fim = dataFim ? new Date(dataFim) : new Date(inicio.getTime() + 30 * 24 * 60 * 60 * 1000);

    return await this.slotService.listarDisponiveisPorProfissional(
      profissionalId,
      inicio,
      fim,
    );
  }

  @Get(':slotId')
  @ApiOperation({ summary: 'Obter slot por ID' })
  @ApiResponse({ status: 200, description: 'Slot encontrado' })
  async obter(@Param('slotId') slotId: string): Promise<SlotResponseDto> {
    return await this.slotService.obterPorId(slotId);
  }
}

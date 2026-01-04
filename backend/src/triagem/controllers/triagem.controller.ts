import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TriagemService } from '../services/triagem.service';
import { CriarTriagemDto, RecomendarProfissionalDto, TriagemResponseDto } from '../dtos/triagem.dto';

@ApiTags('triagem')
@Controller('chamados/:chamadoId/triagem')
export class TriagemController {
  constructor(private readonly triagemService: TriagemService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Realizar triagem de um chamado' })
  @ApiResponse({ status: 201, description: 'Triagem realizada com sucesso' })
  async realizar(
    @Param('chamadoId') chamadoId: string,
    @Body() dto: CriarTriagemDto,
  ) {
    return await this.triagemService.realizar({
      ...dto,
      chamadoId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Obter triagem do chamado' })
  @ApiResponse({ status: 200, description: 'Triagem encontrada' })
  async obter(@Param('chamadoId') chamadoId: string) {
    return await this.triagemService.obterPorChamado(chamadoId);
  }

  @Put('/recomendacao')
  @ApiOperation({ summary: 'Recomendar manualmente um profissional' })
  @ApiResponse({ status: 200, description: 'Profissional recomendado com sucesso' })
  async recomendarManualmente(@Body() dto: RecomendarProfissionalDto) {
    return await this.triagemService.recomendarManualmente(dto);
  }
}

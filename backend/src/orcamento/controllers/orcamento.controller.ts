import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrcamentoService } from '../services/orcamento.service';
import {
  CriarOrcamentoDto,
  AprovarOrcamentoDto,
  RecusarOrcamentoDto,
  OrcamentoResponseDto,
} from '../dtos/orcamento.dto';

@ApiTags('orcamentos')
@Controller('orcamentos')
@UseGuards(JwtAuthGuard)
export class OrcamentoController {
  constructor(private readonly orcamentoService: OrcamentoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Profissional cria orçamento para chamado' })
  @ApiResponse({ status: 201, description: 'Orçamento criado' })
  async criar(@Body() dto: CriarOrcamentoDto) {
    return await this.orcamentoService.criar(dto);
  }

  @Get('/chamado/:chamadoId')
  @ApiOperation({ summary: 'Listar orçamentos de um chamado' })
  @ApiResponse({ status: 200, description: 'Lista de orçamentos' })
  async listarPorChamado(
    @Param('chamadoId') chamadoId: string,
  ): Promise<OrcamentoResponseDto[]> {
    return await this.orcamentoService.listarPorChamado(chamadoId);
  }

  @Get('/profissional/:profissionalId')
  @ApiOperation({ summary: 'Listar orçamentos de um profissional' })
  @ApiResponse({ status: 200, description: 'Lista de orçamentos' })
  async listarPorProfissional(@Param('profissionalId') profissionalId: string) {
    return await this.orcamentoService.listarPorProfissional(profissionalId);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obter orçamento por ID' })
  @ApiResponse({ status: 200, description: 'Orçamento encontrado' })
  async obterPorId(@Param('id') id: string) {
    return await this.orcamentoService.obterPorId(id);
  }

  @Patch('/aprovar')
  @ApiOperation({ summary: 'Cliente aprova orçamento' })
  @ApiResponse({ status: 200, description: 'Orçamento aprovado' })
  async aprovar(@Body() dto: AprovarOrcamentoDto) {
    return await this.orcamentoService.aprovar(dto.orcamentoId, 'usuario-id-temp');
  }

  @Patch('/recusar')
  @ApiOperation({ summary: 'Cliente recusa orçamento' })
  @ApiResponse({ status: 200, description: 'Orçamento recusado' })
  async recusar(@Body() dto: RecusarOrcamentoDto) {
    return await this.orcamentoService.recusar(dto.orcamentoId, dto.motivoRecusa);
  }

  @Patch('/:id/cancelar')
  @ApiOperation({ summary: 'Cancelar orçamento (profissional)' })
  @ApiResponse({ status: 200, description: 'Orçamento cancelado' })
  async cancelar(@Param('id') id: string) {
    return await this.orcamentoService.cancelar(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProfissionalService } from '../services/profissional.service';
import {
  CriarProfissionalDto,
  AtualizarProfissionalDto,
  ProfissionalResponseDto,
} from '../dtos/profissional.dto';

@ApiTags('profissionais')
@Controller('profissionais')
export class ProfissionalController {
  constructor(private readonly profissionalService: ProfissionalService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo profissional' })
  @ApiResponse({ status: 201, description: 'Profissional criado com sucesso' })
  async criar(@Body() dto: CriarProfissionalDto): Promise<ProfissionalResponseDto> {
    return await this.profissionalService.criar(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar profissionais ativos' })
  @ApiQuery({ name: 'contexto', required: false })
  @ApiResponse({ status: 200, description: 'Lista de profissionais' })
  async listar(@Query('contexto') contexto?: string): Promise<ProfissionalResponseDto[]> {
    return await this.profissionalService.listarAtivos(contexto);
  }

  @Get('/contexto/:contexto/categoria/:categoria')
  @ApiOperation({ summary: 'Buscar profissionais por contexto e categoria' })
  @ApiResponse({ status: 200, description: 'Lista de profissionais encontrados' })
  async buscarPorContextoECategoria(
    @Param('contexto') contexto: string,
    @Param('categoria') categoria: string,
  ): Promise<ProfissionalResponseDto[]> {
    return await this.profissionalService.listarPorContextoECategoria(contexto, categoria);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter profissional por ID' })
  @ApiResponse({ status: 200, description: 'Profissional encontrado' })
  async obter(@Param('id') id: string): Promise<ProfissionalResponseDto> {
    return await this.profissionalService.obterPorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar profissional' })
  @ApiResponse({ status: 200, description: 'Profissional atualizado com sucesso' })
  async atualizar(
    @Param('id') id: string,
    @Body() dto: AtualizarProfissionalDto,
  ): Promise<ProfissionalResponseDto> {
    return await this.profissionalService.atualizar(id, dto);
  }

  @Get(':id/taxa-satisfacao')
  @ApiOperation({ summary: 'Calcular taxa de satisfação do profissional' })
  @ApiResponse({ status: 200, description: 'Taxa calculada com sucesso' })
  async calcularTaxaSatisfação(@Param('id') id: string): Promise<{ taxa: number }> {
    const taxa = await this.profissionalService.calcularTaxaSatisfação(id);
    return { taxa };
  }
}

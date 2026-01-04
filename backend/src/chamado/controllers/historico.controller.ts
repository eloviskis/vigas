import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HistoricoService } from '../services/historico.service';
import { CriarHistoricoDto } from '../dtos/historico.dto';

@ApiTags('Chamados')
@Controller('chamados/:chamadoId/historico')
export class HistoricoController {
  constructor(private readonly historicoService: HistoricoService) {}

  @Get()
  async listar(@Param('chamadoId') chamadoId: string) {
    return this.historicoService.listarPorChamado(chamadoId);
  }

  @Post()
  async registrar(
    @Param('chamadoId') chamadoId: string,
    @Body() dto: CriarHistoricoDto,
  ) {
    return this.historicoService.registrarEvento(chamadoId, dto);
  }
}

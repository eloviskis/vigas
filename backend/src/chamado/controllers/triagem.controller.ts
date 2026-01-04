import { Controller, Post, Body, Param } from '@nestjs/common';
import { TriagemService, ResultadoTriagem, CriteriosTriagem } from '../services/triagem.service';

@Controller('chamados/:chamadoId/triagem')
export class TriagemController {
  constructor(private readonly triagemService: TriagemService) {}

  /**
   * Executa triagem automática de um chamado
   * POST /chamados/:chamadoId/triagem
   */
  @Post()
  async executarTriagem(
    @Param('chamadoId') chamadoId: string,
    @Body() criterios: CriteriosTriagem
  ): Promise<ResultadoTriagem> {
    // TODO: Implementar busca de profissionais disponíveis
    const profissionaisDisponiveis = await this.triagemService.listarProfissionaisDisponiveis(criterios);

    return await this.triagemService.triageAutomatica(
      chamadoId,
      criterios,
      profissionaisDisponiveis
    );
  }

  /**
   * Simula triagem (para assistência/validação)
   * POST /chamados/triagem/simular
   */
  @Post('simular')
  async simularTriagem(
    @Body() criterios: CriteriosTriagem
  ): Promise<ResultadoTriagem> {
    // Profissionais simulados para demo
    const profissionaisDemo = [
      {
        id: 'prof-001',
        especialidade: 'REFORMA',
        rating: 4.8,
        chamadosEmAndamento: 0,
        valorHora: 80,
        aceitaUrgentes: true,
      },
      {
        id: 'prof-002',
        especialidade: 'REFORMA',
        rating: 4.5,
        chamadosEmAndamento: 2,
        valorHora: 70,
        aceitaUrgentes: false,
      },
      {
        id: 'prof-003',
        especialidade: 'LIMPEZA',
        rating: 4.2,
        chamadosEmAndamento: 1,
        valorHora: 50,
        aceitaUrgentes: true,
      },
    ];

    return await this.triagemService.triageAutomatica(
      'demo-123',
      criterios,
      profissionaisDemo
    );
  }
}

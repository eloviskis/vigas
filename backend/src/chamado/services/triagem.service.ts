import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chamado, ChamadoPrioridade, ChamadoStatus } from '../entities/chamado.entity';
import { Profissional } from '../../profissional/entities/profissional.entity';

export interface ProfissionalInfo {
  id: string;
  especialidade: string;
  nome: string;
  rating: number;
  chamadosEmAndamento: number;
  valorHora: number;
  aceitaUrgentes: boolean;
}

export interface CriteriosTriagem {
  especialidade: string;
  prioridade: ChamadoPrioridade;
  valorMaximoHora?: number;
  ratingMinimo?: number;
  localizacao?: string;
}

export interface ResultadoTriagem {
  chamadoId: string;
  profissionaisOrdenados: any[];
  profissionalRecomendado: any;
  podeSerAutomatizado: boolean;
  justificativa: string;
  timestamp: Date;
}

@Injectable()
export class TriagemService {
  constructor(
    @InjectRepository(Chamado)
    private chamadoRepository: Repository<Chamado>,
    @InjectRepository(Profissional)
    private profissionalRepository: Repository<Profissional>,
  ) {}

  /**
   * Executa triagem automática de um chamado
   * Seleciona melhor profissional baseado em critérios e matching
   */
  async triageAutomatica(
    chamadoId: string,
    criterios: CriteriosTriagem,
    profissionaisDisponiveis: ProfissionalInfo[]
  ): Promise<ResultadoTriagem> {
    // Calcular scores para cada profissional
    const profissionaisComScore = profissionaisDisponiveis.map(prof => ({
      ...prof,
      score: this.calcularScore(prof, criterios),
    }));

    // Ordenar por score (descrescente)
    const profissionaisOrdenados = profissionaisComScore.sort((a, b) => b.score - a.score);

    // Profissional recomendado é o top 1
    const profissionalRecomendado = profissionaisOrdenados[0];

    // Pode ser automatizado se score >= 75%
    const podeSerAutomatizado = profissionalRecomendado.score >= 75;

    const justificativa = this.gerarJustificativa(
      profissionalRecomendado,
      criterios,
      podeSerAutomatizado
    );

    // Atualizar status do chamado para TRIADO
    await this.chamadoRepository.update(
      { id: chamadoId },
      { status: ChamadoStatus.TRIADO }
    );

    return {
      chamadoId,
      profissionaisOrdenados: profissionaisOrdenados.slice(0, 5), // Top 5
      profissionalRecomendado,
      podeSerAutomatizado,
      justificativa,
      timestamp: new Date(),
    };
  }

  /**
   * Triagem assistida (apenas recomendações, sem atualizar)
   */
  async triageAssistida(
    criterios: CriteriosTriagem,
    profissionaisDisponiveis: ProfissionalInfo[]
  ): Promise<ResultadoTriagem> {
    const profissionaisComScore = profissionaisDisponiveis.map(prof => ({
      ...prof,
      score: this.calcularScore(prof, criterios),
    }));

    const profissionaisOrdenados = profissionaisComScore.sort((a, b) => b.score - a.score);
    const profissionalRecomendado = profissionaisOrdenados[0];
    const podeSerAutomatizado = profissionalRecomendado.score >= 75;

    return {
      chamadoId: 'assistido',
      profissionaisOrdenados: profissionaisOrdenados.slice(0, 5),
      profissionalRecomendado,
      podeSerAutomatizado,
      justificativa: `Triagem assistida - ${profissionaisOrdenados.length} profissionais disponíveis`,
      timestamp: new Date(),
    };
  }

  /**
   * Calcula score de compatibilidade (0-100)
   * Fatores considerados:
   * - Especialidade (match exato)
   * - Rating do profissional
   * - Carga de trabalho (chamados em andamento)
   * - Disponibilidade para urgentes
   */
  private calcularScore(
    profissional: ProfissionalInfo,
    criterios: CriteriosTriagem
  ): number {
    let score = 0;

    // 1. Especialidade (40 pontos)
    if (profissional.especialidade === criterios.especialidade) {
      score += 40;
    } else {
      score += 10; // Profissional relacionado pode atender
    }

    // 2. Rating (30 pontos) - normalizado de 0-5 para 0-30
    score += (profissional.rating / 5) * 30;

    // 3. Carga de trabalho (20 pontos)
    // Menos chamados em andamento = mais pontos
    const cargaFator = Math.max(0, 1 - profissional.chamadosEmAndamento / 5);
    score += cargaFator * 20;

    // 4. Disponibilidade para urgentes (10 pontos)
    if (criterios.prioridade === ChamadoPrioridade.URGENTE && profissional.aceitaUrgentes) {
      score += 10;
    } else if (criterios.prioridade !== ChamadoPrioridade.URGENTE) {
      score += 5; // Meia pontuação se não é urgente
    }

    // 5. Valor máximo (penalização se excede)
    if (criterios.valorMaximoHora) {
      if (profissional.valorHora <= criterios.valorMaximoHora) {
        score += 5;
      } else {
        score -= 10; // Penalização por exceder valor máximo
      }
    }

    // 6. Rating mínimo (penalização se abaixo)
    if (criterios.ratingMinimo && profissional.rating < criterios.ratingMinimo) {
      score -= 15;
    }

    // Garantir score entre 0 e 100
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Gera justificativa legível do resultado da triagem
   */
  private gerarJustificativa(
    profissional: ProfissionalInfo,
    criterios: CriteriosTriagem,
    podeSerAutomatizado: boolean
  ): string {
    const motivos = [];

    motivos.push(`Profissional: ${profissional.nome}`);
    motivos.push(`Rating: ${profissional.rating}/5.0`);
    motivos.push(`Especialidade: ${profissional.especialidade}`);
    motivos.push(`Carga atual: ${profissional.chamadosEmAndamento} chamado(s)`);

    if (profissional.aceitaUrgentes && criterios.prioridade === ChamadoPrioridade.URGENTE) {
      motivos.push('✓ Disponível para urgentes');
    }

    if (podeSerAutomatizado) {
      motivos.push('✓ Pode ser automatizado (score > 75%)');
    } else {
      motivos.push('⚠ Recomendação manual sugerida');
    }

    return motivos.join(' | ');
  }

  /**
   * Lista profissionais disponíveis por especialidade
   */
  async listarProfissionaisDisponiveis(criterios: CriteriosTriagem): Promise<ProfissionalInfo[]> {
    // Simulação: em produção, seria uma query ao banco
    return [
      {
        id: 'prof-001',
        especialidade: criterios.especialidade,
        nome: 'João Silva',
        rating: 4.8,
        chamadosEmAndamento: 1,
        valorHora: 75,
        aceitaUrgentes: true,
      },
      {
        id: 'prof-002',
        especialidade: criterios.especialidade,
        nome: 'Maria Santos',
        rating: 4.6,
        chamadosEmAndamento: 2,
        valorHora: 80,
        aceitaUrgentes: false,
      },
      {
        id: 'prof-003',
        especialidade: criterios.especialidade,
        nome: 'Pedro Costa',
        rating: 4.3,
        chamadosEmAndamento: 0,
        valorHora: 65,
        aceitaUrgentes: true,
      },
    ];
  }

  /**
   * Re-triage um chamado existente (útil para reassignação)
   */
  async retriage(
    chamadoId: string,
    criterios: CriteriosTriagem
  ): Promise<ResultadoTriagem> {
    const profissionaisDisponiveis = await this.listarProfissionaisDisponiveis(criterios);
    return this.triageAutomatica(chamadoId, criterios, profissionaisDisponiveis);
  }
}

import { TriagemTipo } from '../entities/triagem.entity';
export declare class CriarTriagemDto {
    chamadoId: string;
    tipo?: TriagemTipo;
    critérios?: Record<string, any>;
}
export declare class RecomendarProfissionalDto {
    triagemId: string;
    profissionalId: string;
    justificativa?: string;
}
export declare class TriagemResponseDto {
    id: string;
    chamadoId: string;
    tipo: TriagemTipo;
    resultado: string;
    profissionalRecomendadoId?: string;
    confiança: number;
    criadoEm: Date;
}

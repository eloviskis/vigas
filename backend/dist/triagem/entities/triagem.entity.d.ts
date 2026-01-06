import { Chamado } from '../../chamado/entities/chamado.entity';
import { Profissional } from '../../profissional/entities/profissional.entity';
export declare enum TriagemTipo {
    AUTOMATICA = "AUTOMATICA",
    ASSISTIDA = "ASSISTIDA",
    MANUAL = "MANUAL"
}
export declare enum TriagemResultado {
    RECOMENDADO = "RECOMENDADO",
    MULTIPLAS_OPCOES = "MULTIPLAS_OPCOES",
    SEM_PROFISSIONAL = "SEM_PROFISSIONAL",
    REQUER_VALIDACAO = "REQUER_VALIDACAO"
}
export declare class Triagem {
    id: string;
    chamadoId: string;
    tipo: TriagemTipo;
    resultado: TriagemResultado;
    justificativa?: string;
    profissionalRecomendadoId?: string;
    opcoesProfissionais?: {
        id: string;
        nome: string;
        score: number;
        distancia?: number;
        disponibilidade?: boolean;
    }[];
    critérios?: Record<string, any>;
    confiança: number;
    criadoEm: Date;
    chamado?: Chamado;
    profissionalRecomendado?: Profissional;
}

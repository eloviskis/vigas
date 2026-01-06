import { Chamado } from '../../chamado/entities/chamado.entity';
import { Profissional } from '../../profissional/entities/profissional.entity';
export declare enum OrcamentoStatus {
    ENVIADO = "ENVIADO",
    APROVADO = "APROVADO",
    RECUSADO = "RECUSADO",
    EXPIRADO = "EXPIRADO",
    CANCELADO = "CANCELADO"
}
export declare class Orcamento {
    id: string;
    chamadoId: string;
    chamado: Promise<Chamado>;
    profissionalId: string;
    profissional: Promise<Profissional>;
    valorServico: number;
    valorDeslocamento: number;
    valorMateriais: number;
    valorTotal: number;
    descricaoDetalhada: string;
    prazoExecucao: string;
    validadeAte: Date;
    status: OrcamentoStatus;
    observacoes?: string;
    motivoRecusa?: string;
    criadoEm: Date;
    atualizadoEm: Date;
    aprovadoEm?: Date;
}

import { ChamadoHistorico } from './chamado-historico.entity';
export declare enum ChamadoStatus {
    ABERTO = "ABERTO",
    TRIADO = "TRIADO",
    AGENDADO = "AGENDADO",
    CONCLUIDO = "CONCLUIDO",
    CANCELADO = "CANCELADO"
}
export declare class Chamado {
    id: string;
    usuarioId: string;
    contexto: string;
    descricao: string;
    status: ChamadoStatus;
    observacoes?: string;
    metadados?: Record<string, any>;
    criadoEm: Date;
    atualizadoEm: Date;
    historico?: ChamadoHistorico[];
}

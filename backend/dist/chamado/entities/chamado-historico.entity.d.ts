import { Chamado } from './chamado.entity';
export declare enum ChamadoHistoricoTipo {
    STATUS = "STATUS",
    TRIAGEM = "TRIAGEM",
    AGENDAMENTO = "AGENDAMENTO",
    NOTA = "NOTA",
    SISTEMA = "SISTEMA"
}
export declare class ChamadoHistorico {
    id: string;
    chamadoId: string;
    tipo: ChamadoHistoricoTipo;
    descricao?: string;
    metadata?: Record<string, any>;
    criadoEm: Date;
    chamado?: Chamado;
}

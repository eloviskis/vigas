import { AgendamentoStatus } from '../entities/agendamento.entity';
export declare class CriarAgendamentoDto {
    chamadoId: string;
    profissionalId: string;
    dataHora: Date;
    duracao?: number;
    slotId?: string;
    observacoes?: string;
}
export declare class ConfirmarAgendamentoDto {
    observacoes?: string;
}
export declare class CancelarAgendamentoDto {
    motivo: string;
}
export declare class AgendamentoResponseDto {
    id: string;
    chamadoId: string;
    profissionalId: string;
    slotId?: string;
    dataHora: Date;
    duracao: number;
    status: AgendamentoStatus;
    observacoes?: string;
    confirmadoEm?: Date;
    canceladoEm?: Date;
    inicioAtendimento?: Date;
    fimAtendimento?: Date;
    criadoEm: Date;
    atualizadoEm: Date;
}

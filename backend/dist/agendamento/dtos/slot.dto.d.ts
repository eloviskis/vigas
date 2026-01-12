export declare class CriarSlotDto {
    profissionalId: string;
    dataHora: Date;
    duracao?: number;
    observacoes?: string;
}
export declare class AtualizarSlotDisponibilidadeDto {
    disponivel: boolean;
    observacoes?: string;
}
export declare class SlotResponseDto {
    id: string;
    profissionalId: string;
    dataHora: Date;
    duracao: number;
    disponivel: boolean;
    agendamentoId?: string;
    criadoEm: Date;
}

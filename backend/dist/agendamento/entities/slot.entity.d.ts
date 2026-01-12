import { Profissional } from '../../profissional/entities/profissional.entity';
export declare class Slot {
    id: string;
    profissionalId: string;
    dataHora: Date;
    duracao: number;
    disponivel: boolean;
    agendamentoId?: string;
    observacoes?: string;
    criadoEm: Date;
    atualizadoEm: Date;
    profissional?: Profissional;
}

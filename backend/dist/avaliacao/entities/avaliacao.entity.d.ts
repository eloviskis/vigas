import { Chamado } from '../../chamado/entities/chamado.entity';
import { Profissional } from '../../profissional/entities/profissional.entity';
export declare class Avaliacao {
    id: string;
    chamadoId: string;
    chamado: Promise<Chamado>;
    profissionalId: string;
    profissional: Promise<Profissional>;
    clienteId: string;
    notaGeral: number;
    pontualidade: number;
    qualidade: number;
    comunicacao: number;
    recomenda: boolean;
    comentario?: string;
    respostaProfissional?: string;
    criadoEm: Date;
}

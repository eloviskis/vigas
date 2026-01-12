import { Chamado } from './chamado.entity';
export declare class ChamadoFoto {
    id: number;
    chamadoId: string;
    chamado: Chamado;
    filename: string;
    url: string;
    mimeType: string;
    size: number;
    createdAt: Date;
}

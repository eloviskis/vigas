import { ChamadoStatus } from '../entities/chamado.entity';
export declare class CriarChamadoDto {
    usuarioId: string;
    contexto: string;
    descricao: string;
    observacoes?: string;
}
export declare class AtualizarChamadoDto {
    status?: ChamadoStatus;
    descricao?: string;
    observacoes?: string;
}
export declare class ChamadoResponseDto {
    id: string;
    usuarioId: string;
    contexto: string;
    descricao: string;
    status: ChamadoStatus;
    observacoes?: string;
    criadoEm: Date;
    atualizadoEm: Date;
}

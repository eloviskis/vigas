import { ChamadoHistoricoTipo } from '../entities/chamado-historico.entity';
export declare class CriarHistoricoDto {
    tipo: ChamadoHistoricoTipo;
    descricao?: string;
    metadata?: Record<string, any>;
}
export declare class HistoricoResponseDto {
    id: string;
    chamadoId: string;
    tipo: ChamadoHistoricoTipo;
    descricao?: string;
    metadata?: Record<string, any>;
    criadoEm: Date;
}

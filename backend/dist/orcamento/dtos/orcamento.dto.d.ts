export declare class CriarOrcamentoDto {
    chamadoId: string;
    profissionalId: string;
    valorServico: number;
    valorDeslocamento?: number;
    valorMateriais?: number;
    descricaoDetalhada: string;
    prazoExecucao: string;
    observacoes?: string;
}
export declare class AprovarOrcamentoDto {
    orcamentoId: string;
}
export declare class RecusarOrcamentoDto {
    orcamentoId: string;
    motivoRecusa?: string;
}
export declare class OrcamentoResponseDto {
    id: string;
    chamadoId: string;
    profissionalId: string;
    profissionalNome?: string;
    profissionalScore?: number;
    valorServico: number;
    valorDeslocamento: number;
    valorMateriais: number;
    valorTotal: number;
    descricaoDetalhada: string;
    prazoExecucao: string;
    validadeAte: Date;
    status: string;
    observacoes?: string;
    motivoRecusa?: string;
    criadoEm: Date;
    aprovadoEm?: Date;
}

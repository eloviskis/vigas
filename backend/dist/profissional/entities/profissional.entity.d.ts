export declare enum ProfissionalStatus {
    ATIVO = "ATIVO",
    INATIVO = "INATIVO",
    SUSPENSO = "SUSPENSO",
    BLOQUEADO = "BLOQUEADO"
}
export declare class Profissional {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
    descricao?: string;
    contextos: string[];
    categorias: string[];
    status: ProfissionalStatus;
    score: number;
    totalServiços: number;
    serviçosConcluídos: number;
    taxaSatisfação: number;
    areasDiasponibilidade?: Record<string, any>;
    cep?: string;
    cidade?: string;
    estado?: string;
    latitude?: number;
    longitude?: number;
    statusVerificacao: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
    documentos?: string;
    verificadoPor?: string;
    dataVerificacao?: Date;
    criadoEm: Date;
    triagensPendentes?: any[];
}

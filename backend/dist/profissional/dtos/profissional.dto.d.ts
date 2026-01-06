import { ProfissionalStatus } from '../entities/profissional.entity';
export declare class CriarProfissionalDto {
    nome: string;
    email: string;
    telefone?: string;
    descricao?: string;
    contextos: string[];
    categorias: string[];
    cep?: string;
    cidade?: string;
    estado?: string;
    latitude?: number;
    longitude?: number;
}
export declare class AtualizarProfissionalDto {
    nome?: string;
    descricao?: string;
    contextos?: string[];
    categorias?: string[];
    status?: ProfissionalStatus;
}
export declare class ProfissionalResponseDto {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
    contextos: string[];
    categorias: string[];
    status: ProfissionalStatus;
    score: number;
    totalServiços: number;
    serviçosConcluídos: number;
    taxaSatisfação: number;
    criadoEm: Date;
}

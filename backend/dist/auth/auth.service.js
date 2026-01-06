"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
        // Mock users for development
        this.mockUsers = [
            {
                id: '1',
                email: 'cliente@example.com',
                password: '123456',
                role: 'cliente',
                nome: 'João Silva',
            },
            {
                id: '2',
                email: 'operador@example.com',
                password: '123456',
                role: 'operador',
                nome: 'Maria Operadora',
            },
            {
                id: '3',
                email: 'admin@example.com',
                password: '123456',
                role: 'admin',
                nome: 'Admin Sistema',
            },
        ];
    }
    async login(email, password) {
        const user = this.mockUsers.find((u) => u.email === email && u.password === password);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        // Generate real JWT token
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const token = await this.jwtService.signAsync(payload);
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                nome: user.nome,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);

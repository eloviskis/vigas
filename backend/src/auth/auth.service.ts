import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // Mock users for development
  private mockUsers = [
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

  async login(email: string, password: string) {
    const user = this.mockUsers.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
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
}

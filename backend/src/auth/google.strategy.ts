import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { id, name, emails, photos } = profile;
    
    const email = emails[0].value;
    
    // Procurar usuário existente
    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      // Criar novo usuário se não existir
      user = this.userRepository.create({
        email,
        nome: `${name.givenName} ${name.familyName}`,
        role: 'cliente',
        ativo: true,
        // Senha aleatória (usuário OAuth não faz login com senha)
        password: Math.random().toString(36).slice(-12),
      });
      
      await user.hashPassword();
      user = await this.userRepository.save(user);
    }

    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}

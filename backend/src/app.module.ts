import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChamadoModule } from './chamado/chamado.module';
import { TriagemModule } from './triagem/triagem.module';
import { ProfissionalModule } from './profissional/profissional.module';
import { AgendamentoModule } from './agendamento/agendamento.module';
import { AuthModule } from './auth/auth.module';
import { OrcamentoModule } from './orcamento/orcamento.module';
import { AvaliacaoModule } from './avaliacao/avaliacao.module';
import { PagamentoModule } from './pagamento/pagamento.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get<string>('DATABASE_TYPE') || 'sqlite';
        
        if (dbType === 'postgres') {
          return {
            type: 'postgres',
            host: configService.get<string>('DATABASE_HOST') || 'localhost',
            port: configService.get<number>('DATABASE_PORT') || 5432,
            username: configService.get<string>('DATABASE_USER') || 'vitas',
            password: configService.get<string>('DATABASE_PASSWORD') || '',
            database: configService.get<string>('DATABASE_NAME') || 'vitas',
            entities: ['dist/**/*.entity.js'],
            synchronize: true, // Ativar auto-criação de tabelas
            logging: configService.get<string>('NODE_ENV') === 'development',
          };
        }
        
        // SQLite fallback
        return {
          type: 'sqlite',
          database: configService.get<string>('DATABASE_PATH') || './data/vitas.db',
          entities: ['dist/**/*.entity.js'],
          synchronize: configService.get<string>('NODE_ENV') !== 'production',
          logging: configService.get<string>('NODE_ENV') === 'development',
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    StorageModule,
    ChamadoModule,
    TriagemModule,
    ProfissionalModule,
    AgendamentoModule,
    OrcamentoModule,
    AvaliacaoModule,
    PagamentoModule,
  ],
})
export class AppModule {}

# 🚧 VITAS - Deploy em Andamento

## Status Atual: Configurando Infraestrutura VPS

O deploy completo está em andamento. Instalamos e configuramos:

### ✅ Infraestrutura Configurada
- PostgreSQL 16 instalado e funcionando
- Banco `vitas_production` criado
- Usuário `vitas_user` com permissões configuradas
- Nginx configurado como reverse proxy
- Armazenamento local em `/root/VITAS/storage/uploads`
- PM2 já instalado

### ⚠️ Problema Atual
Erros de compilação TypeScript nos módulos avançados. As entidades do banco precisam ser ajustadas para match com o schema atual.

### 🔄 Solução em Progresso
Fazendo deploy mínimo funcional apenas com:
- ✅ AuthModule (login/registro/JWT)
- ✅ StorageModule (upload de arquivos local)
- ✅ NotificationModule (FCM)
- ✅ ProfissionalModule (gestão de profissionais)
- ✅ AgendamentoModule (slots e agendamentos)

### 📋 Módulos Temporariamente Desabilitados (corrigir entidades)
- ChamadoModule
- TriagemModule
- OrcamentoModule  
- AvaliacaoModule
- PagamentoModule
- FollowupModule
- LgpdModule
- MetricsModule

### 🎯 Próximos Passos
1. Deploy mínimo funcional
2. Testar endpoints básicos
3. Corrigir entities dos módulos desabilitados
4. Reativar módulos gradualmente
5. Deploy completo

### 🔗 Configuração
- **Servidor**: 31.97.64.250
- **Backend**: http://31.97.64.250/api (porta 3000 via nginx)
- **Frontend**: http://31.97.64.250 (servido pelo nginx)
- **PostgreSQL**: localhost:5432
- **Storage**: /root/VITAS/storage/uploads

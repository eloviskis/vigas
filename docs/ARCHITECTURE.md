# Arquitetura do Projeto VITAS

## Visão Geral

O VITAS é um Super App de serviços por contexto que gerencia "vida prática" através de diferentes contextos (Casa, Vida Digital, Família/Filhos, Pais/Idosos, Transições), oferecendo histórico vivo, curadoria automática e pós-serviço.

## Stack Tecnológica

### Frontend
- **Plataforma**: Flutter (PWA + Android) ou React + Capacitor
- **Estado**: Provider/Riverpod (Flutter) ou Redux/Zustand (React)
- **Offline**: Service Workers, IndexedDB
- **UI**: Material Design ou custom design system

### Backend
- **Framework**: Node.js (NestJS) ou Python (FastAPI)
- **API**: REST (com possibilidade de GraphQL para consultas complexas)
- **Autenticação**: JWT + OAuth 2.0
- **Validação**: Joi/Zod (Node) ou Pydantic (Python)

### Banco de Dados
- **Principal**: PostgreSQL (dados relacionais)
- **Cache**: Redis (sessões, cache de consultas)
- **Busca**: ElasticSearch (opcional para busca avançada)

### Storage
- **Arquivos**: AWS S3 ou Google Cloud Storage
- **CDN**: CloudFront ou Cloud CDN

### Infraestrutura
- **Containerização**: Docker + Docker Compose
- **Orquestração**: Kubernetes (produção) ou Docker Swarm (staging)
- **CI/CD**: GitHub Actions
- **Monitoramento**: Prometheus + Grafana + Sentry
- **Logs**: ELK Stack ou Cloud Logging

### Mensageria e Jobs
- **Fila**: BullMQ (Node.js) ou Celery (Python)
- **Broker**: Redis
- **Notificações**: Firebase Cloud Messaging (FCM)

## Diagrama C4 - Nível 1: Contexto do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                         VITAS System                            │
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐ │
│  │   Cliente    │      │ Profissional │      │  Operador    │ │
│  │   (Mobile/   │      │   (Mobile)   │      │  (Backoffice)│ │
│  │    Web)      │      │              │      │              │ │
│  └──────────────┘      └──────────────┘      └──────────────┘ │
│         │                      │                     │         │
│         └──────────────────────┼─────────────────────┘         │
│                                │                               │
│                      ┌─────────▼─────────┐                     │
│                      │   VITAS API       │                     │
│                      │   (Backend)       │                     │
│                      └─────────┬─────────┘                     │
│                                │                               │
│                ┌───────────────┼───────────────┐               │
│                │               │               │               │
│         ┌──────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐         │
│         │ PostgreSQL  │ │   Redis   │ │   S3/GCS    │         │
│         │  Database   │ │   Cache   │ │   Storage   │         │
│         └─────────────┘ └───────────┘ └─────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         │                      │                     │
         │                      │                     │
┌────────▼────────┐    ┌────────▼────────┐   ┌───────▼──────┐
│  Gateway de     │    │   Firebase      │   │  Serviços    │
│  Pagamento      │    │   (FCM/Auth)    │   │  Externos    │
│  (Pix/Cartão)   │    │                 │   │  (Maps, etc) │
└─────────────────┘    └─────────────────┘   └──────────────┘
```

## Diagrama C4 - Nível 2: Containers

```
┌──────────────────────────────────────────────────────────────────┐
│                        VITAS Platform                            │
│                                                                  │
│  ┌────────────────┐          ┌────────────────┐                 │
│  │  Web/Mobile    │          │   Backoffice   │                 │
│  │  Application   │          │   Web App      │                 │
│  │  (PWA/Flutter) │          │   (React)      │                 │
│  └────────┬───────┘          └────────┬───────┘                 │
│           │                           │                         │
│           └───────────────┬───────────┘                         │
│                           │                                     │
│                  ┌────────▼────────┐                            │
│                  │   API Gateway   │                            │
│                  │   (Rate limit,  │                            │
│                  │   Auth)         │                            │
│                  └────────┬────────┘                            │
│                           │                                     │
│         ┌─────────────────┼─────────────────┐                  │
│         │                 │                 │                  │
│  ┌──────▼──────┐   ┌──────▼──────┐   ┌─────▼──────┐           │
│  │   Auth      │   │  Core API   │   │  Jobs/     │           │
│  │   Service   │   │  Service    │   │  Workers   │           │
│  │  (JWT/OAuth)│   │ (Business   │   │ (Follow-up,│           │
│  └─────────────┘   │  Logic)     │   │  Notif.)   │           │
│                    └──────┬──────┘   └─────┬──────┘           │
│                           │                │                   │
│         ┌─────────────────┼────────────────┼──────┐            │
│         │                 │                │      │            │
│  ┌──────▼──────┐   ┌──────▼──────┐  ┌─────▼──────▼──┐         │
│  │ PostgreSQL  │   │   Redis     │  │   BullMQ      │         │
│  │  (Primary)  │   │  (Cache/    │  │   (Queue)     │         │
│  └─────────────┘   │   Session)  │  └───────────────┘         │
│                    └─────────────┘                             │
│                                                                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐          │
│  │   S3/GCS    │   │  Prometheus │   │   Sentry    │          │
│  │  (Storage)  │   │  (Metrics)  │   │   (Errors)  │          │
│  └─────────────┘   └─────────────┘   └─────────────┘          │
└──────────────────────────────────────────────────────────────────┘
```

## Modelo de Entidades (Diagrama ER)

### Entidades Core

```
┌─────────────────┐
│     Usuário     │
├─────────────────┤
│ id              │
│ email           │
│ nome            │
│ telefone        │
│ foto_url        │
│ tipo            │ (cliente, profissional, operador)
│ status          │
│ criado_em       │
│ atualizado_em   │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│  Grupo/Família  │
├─────────────────┤
│ id              │
│ nome            │
│ descricao       │
│ admin_id        │ (FK → Usuário)
│ criado_em       │
└─────────────────┘
         │
         │ N:N (através de GrupoMembro)
         │
┌─────────────────┐       ┌─────────────────┐
│  GrupoMembro    │       │    Contexto     │
├─────────────────┤       ├─────────────────┤
│ grupo_id        │       │ id              │
│ usuario_id      │       │ tipo            │ (casa, vida_digital, filhos, etc)
│ papel           │       │ grupo_id        │
│ permissoes      │       │ nome            │
└─────────────────┘       │ metadados       │
                          │ criado_em       │
                          └─────────────────┘
                                   │
                                   │ 1:N
                                   ▼
                          ┌─────────────────┐
                          │  Caso/Chamado   │
                          ├─────────────────┤
                          │ id              │
                          │ contexto_id     │
                          │ usuario_id      │
                          │ titulo          │
                          │ descricao       │
                          │ tipo_problema   │
                          │ urgencia        │
                          │ status          │ (novo, triagem, proposta, etc)
                          │ orcamento_max   │
                          │ disponibilidade │
                          │ criado_em       │
                          │ atualizado_em   │
                          └─────────────────┘
                                   │
                                   │ 1:N
                                   ▼
                          ┌─────────────────┐
                          │  Ordem Serviço  │
                          ├─────────────────┤
                          │ id              │
                          │ caso_id         │
                          │ profissional_id │
                          │ data_agendada   │
                          │ data_concluida  │
                          │ status          │
                          │ valor           │
                          │ avaliacao       │
                          │ garantia_ate    │
                          └─────────────────┘
                                   │
                                   │ 1:N
                                   ▼
                          ┌─────────────────┐
                          │   Follow-up     │
                          ├─────────────────┤
                          │ id              │
                          │ os_id           │
                          │ tipo            │ (D+7, D+30, D+90)
                          │ data_envio      │
                          │ respondido      │
                          │ satisfeito      │
                          │ reabriu         │
                          └─────────────────┘

┌─────────────────┐
│  Profissional   │
├─────────────────┤
│ id              │
│ usuario_id      │
│ especialidades  │
│ regioes         │
│ disponibilidade │
│ preco_base      │
│ score           │
│ verificado      │
└─────────────────┘

┌─────────────────┐
│     Anexo       │
├─────────────────┤
│ id              │
│ entidade_tipo   │ (caso, os, follow-up)
│ entidade_id     │
│ tipo            │ (foto, documento, nota)
│ url             │
│ nome_arquivo    │
│ tamanho         │
│ criado_em       │
└─────────────────┘
```

### Relacionamentos Principais

- **Usuário 1:N Grupo** (através de GrupoMembro)
- **Grupo 1:N Contexto**
- **Contexto 1:N Caso**
- **Caso 1:N OrdemServiço**
- **OrdemServiço 1:N FollowUp**
- **Profissional 1:N OrdemServiço**
- **Qualquer entidade 1:N Anexo** (polimórfico)

## Fluxo de Dados Principal

1. **Cliente** abre chamado no app → cria **Caso**
2. **Triagem** (automática ou assistida) classifica e sugere profissional
3. **Profissional** recebe notificação → aceita ou recusa
4. **Agendamento** cria **Ordem de Serviço**
5. **Execução** do serviço → conclusão → registro de fotos/notas
6. **Follow-up** automático (D+7, D+30, D+90)
7. **Reabertura** automática se problema persistir (vinculado à garantia)

## Estratégia de Deploy

### Ambientes
- **Desenvolvimento**: local (Docker Compose)
- **Staging**: Cloud (preview deployments)
- **Produção**: Cloud (HA, auto-scaling)

### CI/CD Pipeline
1. **Build**: Lint, testes unitários, build de artefatos
2. **Test**: Testes de integração e E2E
3. **Deploy**: Deploy automático (staging) ou manual (produção)
4. **Monitor**: Alertas e métricas em tempo real

## Segurança e Compliance

### LGPD
- Consentimento explícito no cadastro
- Exportação de dados em formato portável
- Exclusão completa de dados (hard delete ou anonymização)
- Auditoria de acessos e alterações

### Segurança
- HTTPS obrigatório
- JWT com expiração curta + refresh token
- Rate limiting por IP/usuário
- Sanitização de inputs
- Upload com validação de tipo e tamanho
- URLs assinadas para acesso a arquivos

## Escalabilidade

### Horizontal Scaling
- Stateless API (escala com load balancer)
- Cache distribuído (Redis Cluster)
- Fila de jobs (múltiplos workers)

### Performance
- Cache agressivo de consultas frequentes
- Paginação obrigatória em listas
- Índices otimizados no banco
- CDN para assets estáticos
- Lazy loading de imagens

## Observabilidade

### Métricas
- Latência de APIs (p50, p95, p99)
- Taxa de erro por endpoint
- Throughput de requests
- Uso de recursos (CPU, memória, disco)

### Logs
- Estruturados (JSON)
- Níveis: debug, info, warn, error
- Correlation ID para rastreamento
- Retenção: 30 dias (staging), 90 dias (produção)

### Alertas
- API com erro 5xx > 1%
- Latência p95 > 500ms
- Fila de jobs com backlog > 1000
- Disco > 80% de uso

## Próximos Passos

1. Definir stack específica (Flutter vs React, NestJS vs FastAPI)
2. Criar API Spec (OpenAPI/Swagger)
3. Implementar entidades no banco de dados
4. Setup de CI/CD
5. Implementar autenticação e autorização

# Especificação do Projeto VITAS

## Visão do Produto
Criar um app que gerencia “vida prática” por contextos (Casa, Vida Digital, Família/Filhos, Pais/Idosos, Transições), com histórico vivo, curadoria automática (não marketplace de lista) e pós-serviço (follow-up, garantia, reabertura).

### Diferenciais Obrigatórios
- “Prontuário” da casa/pessoa (histórico, anexos, garantias, recorrência)
- “Orquestração”: usuário descreve o problema → app sugere o caminho + profissional único
- “Pós-serviço”: check em D+7/D+30/D+90, reabertura com 1 clique
- “Micro-reparos” com SLA e preço fechado (se possível)

## Plataformas e Arquitetura Recomendada
- Codebase única (Flutter recomendado, ou React+Capacitor)
- Backend: API REST (ou GraphQL), Auth (OAuth + e-mail/senha), PostgreSQL, Storage (S3/GCS), fila/jobs, observabilidade
- PWA com caching estratégico, offline-first, push notifications (Web Push + FCM)

## Papéis e Permissões
- Cliente (individual/família)
- Administrador de família
- Profissional (prestador)
- Operador/Curador (interno)
- Parceiro B2B (fase 2)

## Entidades Principais
- Usuário, Família/Grupo, Contexto, Ativo, Caso/Chamado, Tarefa/Checklist, Ordem de Serviço, Profissional, Garantia, Follow-up, Avaliação, Anexos

## Features Principais
- Onboarding e Conta
- Contextos de Vida (abas por contexto)
- Abertura de Chamado (fluxo completo)
- Triagem e Orquestração (automática/assistida)
- Catálogo de Profissionais (curadoria)
- Agendamento e SLA
- Pagamentos (fases)
- Histórico Vivo (“Prontuário”)
- Pós-serviço automatizado
- Vida Digital (serviços invisíveis)
- Filhos e Pais/Idosos (perfis e permissões)
- Transições (modo evento)
- Notificações (push, in-app, e-mail)
- Admin/Backoffice (painel web)

## Requisitos Não-Funcionais
- LGPD, logs estruturados, auditoria, rate limit, upload seguro, performance (p95 API < 300ms), testes (unit, integração, e2e)

## Roadmap em Fases
- Fase 0: Fundamentos (repo, CI/CD, auth, layout base, storage, push, entidades core)
- Fase 1: MVP Casa + Pós-serviço + Curadoria
- Fase 2: Vida Digital + Família
- Fase 3: Idosos + Transições + Pagamento

## Entregáveis
- Documento de arquitetura (C4, entidades)
- API Spec (OpenAPI/Swagger)
- MVP UX flows (wireframes)
- Roadmap técnico
- Test plan
- Deploy PWA + Android AAB + CI/CD
- Backoffice web

## Critérios de Aceite
- Fluxo ponta-a-ponta: conta → grupo → chamado → recomendação → agenda → conclusão → histórico → follow-up → reabertura
- Logs e rastreabilidade no backoffice
- Build PWA instalável + APK/AAB Android

## Resumo para dev
Quero um app de serviços por contexto (Casa/Vida Digital/Família/Idosos/Transições), com histórico vivo, curadoria (1 profissional recomendado) e pós-serviço automático. Preciso PWA + Android com 1 codebase. Backend com API, banco e storage. Quero backoffice para operação. Entrega em fases começando por MVP Casa + Pós-serviço + Curadoria.
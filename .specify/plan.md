# Plano Técnico do Projeto VITAS

## Stack Recomendada
- **Frontend:** Flutter (PWA + Android) ou React + Capacitor (web-first, Android via APK/AAB)
- **Backend:** Node.js (Express ou NestJS) ou Python (FastAPI), API REST (ou GraphQL se necessário)
- **Banco de Dados:** PostgreSQL
- **Storage:** S3 (AWS) ou GCS (Google Cloud Storage)
- **Fila/Jobs:** BullMQ (Node.js) ou Cloud Tasks
- **Observabilidade:** Logs estruturados, tracing, métricas (ex: Prometheus, Grafana, Sentry)
- **Autenticação:** OAuth + e-mail/senha, JWT
- **Push Notifications:** FCM (Firebase), Web Push
- **Infraestrutura:** Docker, CI/CD (GitHub Actions, GitLab CI ou similar)

## Estratégias de PWA/Offline
- Caching estratégico de assets e dados críticos
- Suporte a histórico e checklists offline (sincronização posterior)
- Push notifications para eventos importantes

## Segurança e LGPD
- Consentimento explícito, exportação e exclusão de dados
- Upload seguro (assinatura de URL)
- Rate limit e proteção contra abuso
- Auditoria de ações e logs

## Performance e Testes
- Meta: p95 das APIs < 300ms
- Testes unitários, integração e e2e para fluxos críticos

## Roadmap Técnico (Milestones)
- **Fase 0:** Setup repo, CI/CD, autenticação, layout base, storage, push, entidades core
- **Fase 1:** MVP Casa, abertura de chamado, triagem, recomendação, agendamento, histórico, pós-serviço, backoffice mínimo
- **Fase 2:** Vida Digital, grupo/família, permissões, templates de checklist, métricas e SLA
- **Fase 3:** Idosos, transições, pagamentos, garantias, score avançado de profissionais

## Entregáveis
- Documento de arquitetura (C4, entidades)
- API Spec (OpenAPI/Swagger)
- MVP UX flows (wireframes)
- Roadmap técnico
- Test plan
- Deploy PWA + Android AAB + CI/CD
- Backoffice web

## Observações
- Stack pode ser ajustada conforme equipe e contexto
- Priorização incremental para entregas rápidas e rastreáveis
- Foco em automação, qualidade e experiência do usuário
# Tarefas Detalhadas por Fase — Projeto VITAS

## Fase 0 — Fundamentos
- Configurar repositório e versionamento
- Setup CI/CD (build, testes, deploy)
- Implementar autenticação (OAuth, e-mail/senha)
- Criar layout base do app (Flutter ou React+Capacitor)
- Configurar storage (S3/GCS)
- Implementar push notifications (FCM, Web Push)
- Modelar entidades core (usuário, grupo, contexto, chamado, profissional)

## Fase 1 — MVP Casa + Pós-serviço + Curadoria
- Implementar contexto Casa (UI/UX)
- Fluxo de abertura de chamado (com anexos)
- Triagem automática/assistida (motor de regras)
- Seleção e recomendação de profissional
- Agendamento e slots de agenda
- Histórico vivo (timeline, anexos, custos)
- Pós-serviço automatizado (follow-up D+7/D+30/D+90)
- Backoffice mínimo (CRUD profissionais, gestão de chamados)
- Testes unitários e integração dos fluxos críticos
- Deploy PWA e Android (APK/AAB)

## Fase 2 — Vida Digital + Família
- Implementar contexto Vida Digital
- Gestão de grupo/família e permissões
- Templates de checklist por contexto
- Métricas e SLA (painel admin)
- Melhorias de UX e performance
- Testes e2e dos novos fluxos

## Fase 3 — Idosos + Transições + Pagamento
- Implementar contextos adicionais (Idosos, Transições)
- Integração de pagamentos (Pix/cartão, split)
- Garantias formais e reabertura automática
- Regras avançadas de score de profissionais
- Expansão do backoffice (gestão de garantias, áreas atendidas)
- Testes finais e validação de critérios de aceite

## Entregáveis Obrigatórios
- Documento de arquitetura (C4, entidades)
- API Spec (OpenAPI/Swagger)
- MVP UX flows (wireframes)
- Roadmap técnico
- Test plan
- Deploy PWA + Android AAB + CI/CD
- Backoffice web publicado

## Observações
- Priorizar entregas incrementais e rastreáveis
- Garantir logs, rastreabilidade e LGPD em todos os fluxos
- Validar critérios de aceite ao final de cada fase
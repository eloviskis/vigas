# VITAS Development Context for Claude

Auto-generated from feature plans. Last updated: 2026-01-03

## Project Overview

VITAS is a super-app for managing "practical life" by context (Casa/Home, Vida Digital/Digital Life, Família/Family, Idosos/Elderly, Transições/Transitions). Features include:
- Smart request (chamado) creation & triage
- Professional recommendation & scheduling
- Service history & post-service follow-up
- PWA + Android native app

**Current Phase**: Feature 005 (Task generation automation using Speckit)

## Tech Stack

- **Backend**: NestJS 10+ + TypeORM 0.3+ + PostgreSQL 14+
- **Frontend**: React 18+ + Vite + Capacitor
- **Testing**: Jest (backend), Vitest (frontend)
- **CI/CD**: GitHub Actions, Docker
- **Speckit**: Bash scripts for feature management

## Key Commands

```bash
# Feature workflow (Speckit)
./.specify/scripts/bash/create-new-feature.sh "description"
./.specify/scripts/bash/generate-tasks.sh [--force]
./.specify/scripts/bash/validate-tasks.sh [--ci]

# Development
backend: npm install && npm run dev
frontend: npm install && npm run dev
db: npm run typeorm:migrate
tests: npm test
```

## Active Features

1. **✓ 001**: Setup Inicial (done)
2. **✓ 002**: Checklist Kickoff (done)
3. **✓ 003**: Tasks Kickoff (done)
4. **✓ 004**: Tasks Auto (done)
5. **⏳ 005**: Automação de Geração do tasks.md (current - generate-tasks.sh + validate-tasks.sh implemented)
6. **⏳ 013**: Timeline/Historico do Chamado (pending - entities/service/controller ready, needs module wiring & logging)

## Recent Changes

**Feature 005** (2026-01-03):
- ✅ Implemented `generate-tasks.sh` - parser spec.md/plan.md → tasks.md (US1)
- ✅ Implemented `validate-tasks.sh` - consistency checks (US3)
- Remaining: Incremental update mode + CI integration (US2)

**Feature 013** (Previous context):
- Created `ChamadoHistorico` entity with types (STATUS, TRIAGEM, AGENDAMENTO, NOTA, SISTEMA)
- Created `HistoricoService` with methods: `registrarEvento`, `registrarStatus`, `registrarTriagem`, `registrarAgendamento`
- Created `HistoricoController` with GET/POST endpoints

## Code Structure

### Backend Modules

```
backend/src/
├── chamado/                    # Request/Issue management
│   ├── entities/
│   │   ├── chamado.entity.ts   (status: ABERTO, TRIADO, AGENDADO, CONCLUIDO; relations: historico, agendamentos)
│   │   └── chamado-historico.entity.ts (types: STATUS, TRIAGEM, AGENDAMENTO, NOTA, SISTEMA)
│   ├── services/
│   │   ├── chamado.service.ts
│   │   └── historico.service.ts (NEW - ready for wiring)
│   ├── controllers/
│   │   ├── chamado.controller.ts
│   │   └── historico.controller.ts (NEW - GET/POST chamados/:id/historico)
│   ├── dtos/
│   │   ├── chamado.dto.ts
│   │   └── historico.dto.ts (NEW)
│   └── chamado.module.ts (NEEDS WIRING)
├── triagem/                    # Automatic/assisted triage
│   ├── entities/
│   ├── services/triagem.service.ts
│   └── (needs HistoricoService injection for logging)
├── agendamento/                # Scheduling & slots
│   ├── entities/agendamento.entity.ts
│   ├── services/
│   │   ├── agendamento.service.ts
│   │   └── slots.service.ts
│   └── (needs HistoricoService injection for logging)
└── app.module.ts (NEEDS: ChamadoModule, TriagemModule, AgendamentoModule imported + TypeORM ChamadoHistorico registered)
```

### Frontend Routes

```
src/
├── pages/
│   ├── /chamados              # List chamados
│   ├── /chamados/new          # Create chamado
│   ├── /chamados/:id          # View chamado + timeline
│   ├── /chamados/:id/triagem  # Triage selection
│   ├── /chamados/:id/profissional (Professional selection - Issue #11)
│   ├── /chamados/:id/agendar  # Scheduling (Issue #12)
│   └── /chamados/:id/timeline # Historico view (Issue #13, part of /chamados/:id)
└── services/
    ├── chamadoService.ts
    ├── agendamentoService.ts
    └── historicoService.ts (ready)
```

## Next Steps (Immediate)

1. **Finish Feature 005**: 
   - Implement incremental update mode for `generate-tasks.sh` (US2)
   - Integrate `validate-tasks.sh` into CI/CD (US3)
   - Document in README ✅ (done)

2. **Continue Feature 013** (after 005):
   - Wire `ChamadoModule` with `HistoricoService` in `app.module.ts`
   - Inject `HistoricoService` into `TriagemService` & `AgendamentoService`
   - Add logging calls: `registrarTriagem()` after triage, `registrarAgendamento()` after scheduling
   - Test timeline endpoints GET/POST
   - Open PR #63 (feature/013-timeline-historico)

## Commit Convention

Format: `type(scope): subject [TASK_IDS]`
- Example: `feat(005): add validate-tasks script [T040 T041] [US3]`
- Use task IDs from tasks.md and user story labels

## Notes for Agents

- Speckit scripts are in `./.specify/scripts/bash/` - use `chmod +x` if not executable
- All feature specs in `/specs/[###-name]/` with plan.md, spec.md, tasks.md
- Each feature maps to a GitHub issue number (005 = Issue #5 equivalent in specs)
- Task IDs format: T001, T002, etc. Organized by Phase (Phase 1, 2, 3+)
- User Stories format: US1, US2, US3 with priorities P1 (MVP), P2, P3
- Always validate generated tasks with `validate-tasks.sh` before committing


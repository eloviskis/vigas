# VITAS Development Guidelines

Auto-generated from feature plans. Last updated: 2026-01-03 (Feature 007 complete)

## Project Stack

- **Backend**: NestJS 10+ (Node.js 20+) + TypeORM 0.3+ + PostgreSQL 14+
- **Frontend**: React 18+ + Vite + React Router v6 + Axios
- **Infrastructure**: Docker, GitHub Actions (CI/CD)
- **Quality**: ESLint, Prettier, Jest/Vitest

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- Docker & Docker Compose

### Setup

```bash
# Clone and install
git clone [repo]
cd VITAS

# Backend
cd backend
npm install
npm run typeorm:migrate
npm run dev

# Frontend (separate terminal)
cd ../frontend
npm install
npm run dev
```

Backend runs on http://localhost:3000/api  
Frontend runs on http://localhost:5173

## Features Completed

### ✅ Feature 005: Task Generation & Validation (generate-tasks.sh + validate-tasks.sh)
- Automatic parsing of spec.md to tasks.md
- Priority-based organization (P1/P2/P3)
- Validation of consistency between spec↔tasks
- CI/CD integration (--json, --ci flags)

### ✅ Feature 013: Chamado (Issue) Management & Timeline
**Endpoints**:
- `POST /chamados` - Create issue
- `GET /chamados/:id` - Get issue details
- `PUT /chamados/:id` - Update issue status
- `GET /chamados/:id/historico` - Get timeline/history
- `POST /chamados/:id/historico` - Add custom note

**Entities**: Chamado, ChamadoHistorico with status tracking (ABERTO/TRIADO/AGENDADO/CONCLUIDO/CANCELADO)

### ✅ Feature 006: Triagem (Triage) & Profissional Selection
**Endpoints**:
- `POST /profissionais` - Register service provider
- `GET /profissionais` - List active providers
- `GET /profissionais/:id/taxa-satisfacao` - Get satisfaction rating
- `POST /chamados/:id/triagem` - Run automatic triage
- `GET /chamados/:id/triagem` - Get triage result
- `PUT /triagem/:id/recomendacao` - Manual profissional recommendation

**Entities**: Profissional (score, status, contextos, categorias), Triagem (AUTOMATICA/MANUAL, resultado, confiança)

### ✅ Feature 007: Agendamento (Scheduling) & Slots
**Endpoints**:
- `POST /profissionais/:id/slots` - Create availability slots
- `GET /profissionais/:id/slots` - List available slots (with date filters)
- `POST /chamados/:id/agendamentos` - Create appointment
- `GET /chamados/:id/agendamentos` - Get appointment details
- `PUT /chamados/:id/agendamentos/:id/confirmar` - Confirm appointment
- `PUT /chamados/:id/agendamentos/:id/cancelar` - Cancel appointment
- `PUT /chamados/:id/agendamentos/:id/iniciar` - Start service
- `PUT /chamados/:id/agendamentos/:id/concluir` - Complete service

**Entities**: Slot (time slots with availability), Agendamento (appointments with status tracking)

---

## Speckit Commands

Use these commands to manage feature specifications and task generation:

### Create a New Feature
```bash
./.specify/scripts/bash/create-new-feature.sh "Feature description"
# Creates feature branch and spec.md template
# Automatically detects feature number from branch name
```

### Generate Tasks from Spec
```bash
./.specify/scripts/bash/generate-tasks.sh [--force] [--json]
# Parses spec.md/plan.md and generates tasks.md with structured phases
# --force: Overwrite existing (backs up previous)
# --json: Output status as JSON (for CI)
# SPECIFY_FEATURE env var: Override feature detection
```

### Validate Tasks
```bash
./.specify/scripts/bash/validate-tasks.sh [--ci] [--json]
# Validates tasks.md consistency with spec.md/plan.md
# --ci: Exit 1 if validation fails (for CI pipelines)
# --json: Output results as JSON
```

## Feature Structure

Each feature follows this organization:

```
specs/[XXX-feature-name]/
├── spec.md          # User stories with acceptance criteria (P1/P2/P3)
├── plan.md          # Implementation plan with phases and risks
├── tasks.md         # Auto-generated task list (DO NOT EDIT MANUALLY)
└── research.md      # Optional: Technical research, algorithm docs

backend/src/[module]/
├── entities/        # TypeORM entities
├── services/        # Business logic
├── controllers/     # API endpoints (Swagger decorated)
├── dtos/            # Request/response schemas
└── [module].module.ts
```

## Task Organization

Each feature uses consistent task structure:

1. **Phase 1**: Entities & Services (core data models and business logic)
2. **Phase 2**: Database Integration (migrations, relationships)
3. **Phase 3**: Service Integration (cross-service dependencies like HistoricoService)
4. **Phase 4**: Testing & Documentation (end-to-end tests, API docs)
5. **Phase 5**: Frontend (React components, integration, user experience)

See [spec.md](specs/007-agendamento/spec.md) for detailed user stories.

## Development Workflow

1. **Create feature**: `create-new-feature.sh "description"`
2. **Write spec.md** with user stories (P1, P2, P3 with acceptance criteria)
3. **Write plan.md** with 5-phase technical plan
4. **Implement** backend entities → services → controllers
5. **Run generate-tasks.sh** to auto-generate tasks.md
6. **Test** each phase with curl/Postman
7. **Validate** with validate-tasks.sh
8. **Commit** with feature number and task IDs

## Current Architecture

```
ChamadoModule (Feature 013)
  ├─ Chamado (issue)
  ├─ ChamadoHistorico (timeline events)
  └─ HistoricoService (injected by Triagem & Agendamento)

TriagemModule (Feature 006)
  ├─ Triagem (recommendation)
  ├─ ProfissionalModule (injected)
  └─ HistoricoService (logs triage events)

ProfissionalModule (Feature 006)
  └─ Profissional (service provider)

AgendamentoModule (Feature 007)
  ├─ Slot (availability)
  ├─ Agendamento (appointment)
  ├─ SlotService
  ├─ AgendamentoService (logs via HistoricoService)
  └─ ChamadoModule + ProfissionalModule (injected)
```

## User Journey (MVP)

1. **Customer creates issue**: `POST /chamados` → Chamado.status = ABERTO
2. **Automatic triage runs**: `POST /triagem` → recommends Profissional
3. **Operator schedules**: `POST /agendamentos` with available Slot
4. **Customer confirms**: `PUT /agendamentos/:id/confirmar` → status = CONFIRMADO
5. **Service happens**: `PUT /iniciar` → `PUT /concluir` → Chamado.status = CONCLUIDO
6. **Timeline shows all**: `GET /historico` → Shows TRIAGEM, AGENDAMENTO, STATUS events

## Next Steps

### Phase 2: Database Migrations
- Create migrations for Profissional, Triagem, Slot, Agendamento tables
- Run `typeorm migration:generate` to auto-detect schema changes
- Test relationships and indexes

### Phase 3: Frontend Integration
- React pages: /chamados, /chamados/new, /chamados/:id, /chamados/:id/triagem, /chamados/:id/agendar
- Services: chamadoService, triagemService, agendamentoService
- Components: TriagemForm, SlotSelector, AgendamentoForm, Timeline

### Phase 4: Advanced Features
- Notifications (SMS/email)
- Ratings & reviews
- Analytics dashboard
- Profissional availability management
- Map-based search (geolocation)

## Testing

### Run Backend Tests
```bash
cd backend
npm run test              # Unit tests
npm run test:e2e          # End-to-end tests
npm run test:cov          # Coverage report
```

### Manual Testing
```bash
# Feature 007 test script
./.specify/scripts/bash/test-feature-007.sh

# Or use curl directly
curl -X POST http://localhost:3000/api/profissionais \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@ex.com","contextos":["Casa"],"categorias":["Encanamento"]}'
```


4. **Generate tasks**: `generate-tasks.sh`
5. **Work through phases** in order (Phase 1 → 2 → 3+)
6. **Validate before PR**: `validate-tasks.sh --ci`
7. **Update context**: `update-agent-context.sh`
8. **Commit & PR**: Include task IDs in commits (e.g., `T001 [US1] description`)

## Parallel Work

- Phase 1 and 2 tasks marked `[P]` can run in parallel
- Once Phase 2 (Foundational) completes, all user stories (Phase 3+) can start in parallel
- Each user story should be independently deployable

## Code Style & Quality

### Backend (NestJS)
- Use TypeORM entities with consistent naming (PascalCase class, snake_case table)
- Decorators for validation (@IsString, @IsEmail, etc.)
- Services for business logic, Controllers for HTTP
- Use DTOs for request/response validation
- Test coverage > 70%

### Frontend (React)
- Functional components with hooks
- TailwindCSS for styling
- Component structure: `src/components/[feature]/`
- State: Zustand or Context API
- Test coverage > 70%

### Commits
Format: `type(scope): subject [TASK_IDS]`
- `type`: feat, fix, refactor, docs, test, chore
- `scope`: feature/module name
- `subject`: concise description
- `[TASK_IDS]`: T001, T002, [US1] etc

Example: `feat(chamado): add historico timeline [T020 T021 T022] [US1]`

## Project Structure

```
VITAS/
├── .specify/                    # Speckit templates and scripts
│   ├── scripts/bash/
│   │   ├── create-new-feature.sh
│   │   ├── generate-tasks.sh
│   │   ├── validate-tasks.sh
│   │   └── ...
│   └── templates/
├── backend/
│   ├── src/
│   │   ├── chamado/            # Feature: Chamado (requests)
│   │   │   ├── entities/
│   │   │   ├── services/
│   │   │   ├── controllers/
│   │   │   └── dtos/
│   │   ├── agendamento/        # Feature: Agendamento (scheduling)
│   │   ├── triagem/            # Feature: Triagem (triage)
│   │   └── app.module.ts
│   ├── test/
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── specs/
│   ├── 001-setup-inicial/
│   ├── 002-checklist-kickoff/
│   ├── 003-tasks-kickoff/
│   ├── 004-tasks-auto/
│   ├── 005-tasks-auto/         # Current: Task generation automation
│   │   ├── spec.md
│   │   ├── plan.md
│   │   └── tasks.md
│   └── ...
└── README.md
```

## Key Policies

1. **Always use Speckit workflow** for new features
2. **Tasks before code** - write tasks.md before implementing
3. **Independent stories** - each user story must be testable in isolation
4. **Phase gates** - can't start user stories until Phase 2 (Foundational) is complete
5. **Parallel by story** - different team members can work on different user stories simultaneously
6. **Validation before merge** - `validate-tasks.sh --ci` must pass in PR

## CI/CD Pipeline

GitHub Actions automatically:
- Runs linting (ESLint, Black)
- Runs tests (Jest/pytest)
- Validates tasks.md (`validate-tasks.sh --ci`)
- Builds Docker images
- Deploys to staging (on main)

See `.github/workflows/` for details.

## References

- [Speckit Documentation](/.specify/specify.md)
- [VITAS Product Spec](/.specify/specify.md)
- [Constitution](/.specify/constitution.md)
- Feature Specs: [specs/](specs/)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->

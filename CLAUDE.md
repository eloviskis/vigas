# VITAS Development Context for Claude

Auto-generated from feature plans. Last updated: 2026-01-03

## Project Overview

VITAS is a super-app for managing "practical life" by context (Casa/Home, Vida Digital/Digital Life, Família/Family, Idosos/Elderly, Transições/Transitions). MVP (Minimum Viable Product) includes:
- Issue/Chamado creation & automatic triage
- Professional recommendation & availability
- Appointment scheduling & service tracking
- Complete timeline/history with automatic logging

**Current Phase**: Feature 007 Complete - Ready for database integration & frontend

## Tech Stack

- **Backend**: NestJS 10.3 + TypeORM 0.3+ + PostgreSQL 14+
- **Frontend**: React 18+ + Vite + React Router v6 (planned)
- **Testing**: Jest (backend), Vitest (frontend)
- **CI/CD**: GitHub Actions, Docker, Speckit
- **Speckit**: Bash scripts for feature management & task automation

## Key Commands

```bash
# Feature workflow (Speckit)
./.specify/scripts/bash/create-new-feature.sh "description"
SPECIFY_FEATURE=007-agendamento ./.specify/scripts/bash/generate-tasks.sh [--force]
SPECIFY_FEATURE=007-agendamento ./.specify/scripts/bash/validate-tasks.sh [--ci]

# Development
cd backend && npm install && npm run dev        # NestJS on port 3000
cd frontend && npm install && npm run dev       # React Vite on port 5173
npm run typeorm migration:generate -- -n Name   # Create migration
npm run typeorm migration:run                    # Apply migrations

# Testing
npm test                 # Unit tests
npm run test:e2e         # End-to-end tests
npm run lint && npm run format
```

## Completed Features

### ✅ Feature 005: Task Generation & Validation
**Status**: COMPLETE  
**What**: Speckit integration - automatic task.md generation from spec.md + validation

**Key Files**:
- `.specify/scripts/bash/generate-tasks.sh` - Parses spec.md (extracts user stories by priority), generates tasks.md
- `.specify/scripts/bash/validate-tasks.sh` - Validates spec.md ↔ tasks.md consistency
- Both support --json (CI output), --force (backup + regenerate), --ci (exit codes)

**User Stories Implemented**:
- US1: Generate tasks.md from spec.md user stories
- US3: Validate tasks consistency (story count, priority coverage, phase structure)

---

### ✅ Feature 013: Chamado Management & Timeline
**Status**: COMPLETE  
**What**: Issue/request management with automatic timeline logging

**Entities**:
- `Chamado`: id, titulo, descricao, contexto, prioridade, status, usuarioId, timestamps
- `ChamadoHistorico`: id, chamadoId, tipo (SISTEMA|STATUS|TRIAGEM|AGENDAMENTO|NOTA), descricao, metadata

**Services**:
- `ChamadoService`: CRUD, status transitions, auto-logging
- `HistoricoService`: Timeline events (registrarStatus, registrarTriagem, registrarAgendamento, registrarNota, registrarSistema) - EXPORTED for use by other modules

**Controllers**:
- `ChamadoController`: POST/GET/PUT /chamados
- `HistoricoController`: GET/POST /chamados/:id/historico

**Key Feature**: Every status change automatically creates timeline event

---

### ✅ Feature 006: Triagem & Profissional Selection
**Status**: COMPLETE  
**What**: Automatic recommendation of best service provider based on context

**Entities**:
- `Profissional`: id, nome, email, contextos[], categorias[], status, score (0-5), totalServiços, serviçosConcluídos, taxaSatisfação
- `Triagem`: id, chamadoId, tipo (AUTOMATICA|ASSISTIDA|MANUAL), resultado (RECOMENDADO|MULTIPLAS_OPCOES|SEM_PROFISSIONAL|REQUER_VALIDACAO), profissionalRecomendadoId, opcoesProfissionais[], confiança

**Services**:
- `ProfissionalService`: CRUD, listar ativos, buscar por contexto/categoria, calcular taxa satisfação
- `TriagemService`: executarTriagemAutomatica (score-based ranking), recomendarManualmente (with justificativa)
  - **Injects**: ProfissionalService, HistoricoService
  - **Auto-logs**: registrarTriagem events with profissional_id, confiança, resultado

**Controllers**:
- `ProfissionalController`: POST/GET/PUT /profissionais
- `TriagemController`: POST/GET /chamados/:id/triagem, PUT /triagem/:id/recomendacao

**Algorithm**: Score-based ranking (highest score first)

---

### ✅ Feature 007: Agendamento & Scheduling
**Status**: COMPLETE  
**What**: Manage availability slots and create/confirm appointments

**Entities**:
- `Slot`: id, profissionalId, dataHora, duracao (minutes), disponivel, agendamentoId
- `Agendamento`: id, chamadoId, profissionalId, slotId, dataHora, duracao, status (PENDENTE|CONFIRMADO|EM_ATENDIMENTO|CONCLUIDO|CANCELADO|NAOCOMPARECEU), timestamps

**Services**:
- `SlotService`: criar, criarEmLote (30 slots in 1 call), listarDisponiveisPorProfissional, marcarComoOcupado/Disponível
- `AgendamentoService`: agendar (creates + marks slot), confirmar, cancelar (libera slot), iniciarAtendimento, concluirAtendimento
  - **Injects**: SlotService, HistoricoService, ChamadoService
  - **Auto-logs**: registrarAgendamento events with agendamento_id, profissional_id, duracao, motivoCancelamento

**Controllers**:
- `SlotController`: POST /profissionais/:id/slots, GET /profissionais/:id/slots
- `AgendamentoController`: POST/GET /chamados/:id/agendamentos, PUT .../confirmar, .../cancelar, .../iniciar, .../concluir

**Key Features**:
- Batch slot creation (set availability for whole week in 1 call)
- Atomic operations (agendamento + slot marking = transactional)
- Auto-release slot on cancellation

---

## API Endpoints (Swagger at /api/docs)

### Chamado (Feature 013)
```
POST   /chamados                    Create issue
GET    /chamados/:id               Get issue details
PUT    /chamados/:id               Update issue (status, etc.)
GET    /chamados/:id/historico     Get timeline
POST   /chamados/:id/historico     Add custom note
```

### Profissional (Feature 006)
```
POST   /profissionais                                 Register provider
GET    /profissionais                                 List (with ?contexto filter)
GET    /profissionais/:id                             Get details
PUT    /profissionais/:id                             Update profile
GET    /profissionais/:id/taxa-satisfacao            Get satisfaction rating
GET    /profissionais/contexto/:contexto/categoria/:categoria  Search
```

### Triagem (Feature 006)
```
POST   /chamados/:id/triagem                    Run automatic/manual triage
GET    /chamados/:id/triagem                    Get triage result
PUT    /triagem/:id/recomendacao               Manual recommendation
```

### Slot (Feature 007)
```
POST   /profissionais/:id/slots                 Create individual slot
GET    /profissionais/:id/slots                 List available (with ?dataInicio, ?dataFim)
```

### Agendamento (Feature 007)
```
POST   /chamados/:id/agendamentos                      Create appointment
GET    /chamados/:id/agendamentos                      Get appointment
PUT    /chamados/:id/agendamentos/:id/confirmar      Confirm
PUT    /chamados/:id/agendamentos/:id/cancelar       Cancel
PUT    /chamados/:id/agendamentos/:id/iniciar        Start service
PUT    /chamados/:id/agendamentos/:id/concluir       Complete service
```

---

## Architecture Overview

```
app.module.ts
  └─ TypeOrmModule (PostgreSQL, autoLoadEntities=true, synchronize=!prod)
     
     ├─ ChamadoModule (Feature 013)
     │  ├─ Chamado entity (OneToMany → ChamadoHistorico)
     │  ├─ ChamadoHistorico entity (ManyToOne → Chamado)
     │  ├─ ChamadoService (CRUD + logging)
     │  ├─ HistoricoService (timeline, EXPORTED)
     │  └─ Controllers: Chamado, Historico
     │
     ├─ ProfissionalModule (Feature 006)
     │  ├─ Profissional entity
     │  ├─ ProfissionalService (CRUD, ranking, score)
     │  └─ ProfissionalController
     │
     ├─ TriagemModule (Feature 006)
     │  ├─ Triagem entity (ManyToOne → Chamado, ManyToOne → Profissional)
     │  ├─ TriagemService (injects: ProfissionalService, HistoricoService)
     │  └─ TriagemController
     │
     └─ AgendamentoModule (Feature 007)
        ├─ Slot entity (ManyToOne → Profissional)
        ├─ Agendamento entity (ManyToOne → Chamado, Profissional, Slot)
        ├─ SlotService (availability management)
        ├─ AgendamentoService (injects: SlotService, HistoricoService, ChamadoService)
        └─ Controllers: Slot, Agendamento
```

**Key Design Patterns**:
- **Service Injection**: Dependencies passed via constructor, typed with @InjectRepository
- **Timeline Logging**: All state changes auto-logged via injected HistoricoService
- **Transactional Safety**: Agendamento creation + slot marking use try/catch rollback
- **Relationships**: OneToMany/ManyToOne with eager=false (load on demand), proper FK constraints

---

## User Journey (MVP Flow)

1. **Customer creates issue**
   ```
   POST /chamados { titulo, descricao, contexto, prioridade }
   → Chamado.status = ABERTO
   → HistoricoService logs: {tipo: SISTEMA, descricao: "Chamado criado"}
   ```

2. **Automatic triage runs (manual or scheduled)**
   ```
   POST /chamados/:id/triagem { tipo: AUTOMATICA }
   → TriagemService.executarTriagemAutomatica
   → Queries Profissional by contexto, orders by score
   → Creates Triagem with resultado (RECOMENDADO/MULTIPLAS_OPCOES/SEM_PROFISSIONAL)
   → HistoricoService logs: {tipo: TRIAGEM, metadata: {profissional_id, confiança}}
   ```

3. **Operator schedules appointment**
   ```
   POST /chamados/:id/agendamentos { profissionalId, dataHora, slotId }
   → AgendamentoService.agendar
   → SlotService.marcarComoOcupado (atomic)
   → Creates Agendamento with status = PENDENTE
   → HistoricoService logs: {tipo: AGENDAMENTO, metadata: {agendamento_id}}
   ```

4. **Customer confirms**
   ```
   PUT /chamados/:id/agendamentos/:id/confirmar
   → status = CONFIRMADO, confirmadoEm = now()
   → HistoricoService logs: {tipo: AGENDAMENTO, descricao: "Confirmado"}
   ```

5. **Service happens**
   ```
   PUT /agendamentos/:id/iniciar
   → status = EM_ATENDIMENTO, inicioAtendimento = now()
   
   PUT /agendamentos/:id/concluir
   → status = CONCLUIDO, fimAtendimento = now()
   → Chamado.status = CONCLUIDO
   → HistoricoService logs: {tipo: AGENDAMENTO, descricao: "Concluído"}
   ```

6. **View complete timeline**
   ```
   GET /chamados/:id/historico
   → Returns all events: SISTEMA (created), TRIAGEM (recommended), AGENDAMENTO (scheduled, confirmed, completed)
   → Shows timestamps, profissional details, decision metadata
   ```

---

## Next Steps (Immediate Priority)

### Phase 2: Database Migrations (T007-T010)
```bash
# Auto-generate migrations from entities
npm run typeorm migration:generate -- -n CreateProfissionalTable
npm run typeorm migration:generate -- -n CreateTriagemTable
npm run typeorm migration:generate -- -n CreateSlotTable
npm run typeorm migration:generate -- -n CreateAgendamentoTable

# Run all migrations
npm run typeorm migration:run
```

### Phase 4: Testing & Documentation
- E2E test script: `./.specify/scripts/bash/test-feature-007.sh`
- API documentation: Swagger already enabled at /api/docs
- README examples: Curl commands for each endpoint

### Phase 5: Frontend Integration
```
specs/007-agendamento/plan.md → T019-T022
- T019: SlotSelector component (calendar + available slots)
- T020: Page /chamados/:id/agendar
- T021: API service layer (axios client)
- T022: Timeline display with status badges
```

### V2 Features
- Email/SMS notifications (confirmation, reminder)
- Ratings & reviews after service
- Analytics dashboard
- Geolocation-based search
- Calendar UI with drag-drop
- Payment integration

---

## Common Issues & Solutions

| Issue | Root Cause | Solution |
|-------|-----------|----------|
| TypeORM entities not loading | autoLoadEntities=false | Verify app.module.ts has autoLoadEntities: true |
| Relations return undefined | eager=true required or need relations=['...'] | Add relations array to find(), or set eager=true in decorator |
| Swagger endpoints not showing | @ApiTags missing | Add @ApiTags('entity') to controller class |
| DTO validation not working | Missing class-validator decorators | Add @IsNotEmpty, @IsEmail, etc. to DTO properties |
| Service injection fails | Module doesn't export service | Add service to exports array in module |
| Timestamps in wrong timezone | TypeORM uses UTC | Store UTC, convert on frontend |

---

## Code Review Checklist

When implementing features:

- [ ] Entity has proper relationships (@OneToMany, @ManyToOne with FK)
- [ ] Service uses @InjectRepository for type safety
- [ ] Service constructor takes all dependencies
- [ ] DTO has all validations (@IsNotEmpty, @IsEmail, etc.)
- [ ] Controller has @ApiTags, @ApiOperation, @ApiResponse decorators
- [ ] Error handling: throw NestJS exceptions (NotFoundException, BadRequestException, etc.)
- [ ] Service logs via injected HistoricoService (if applicable)
- [ ] All timestamps use proper TypeORM decorators (@CreateDateColumn, @UpdateDateColumn)
- [ ] Module has exports array with services that other modules need
- [ ] app.module imports the new module

---

## Git Workflow & Commits

Each feature branch: `XXX-feature-name`

```bash
# Create and work
git checkout -b 007-agendamento
# ... implement Feature 007 (entities, services, controllers)
# ... create spec.md and plan.md
# ... run generate-tasks.sh

# Commit
git add -A
git commit -m "feat(007): Implementar Agendamento e Slots

- T001: Slot entity e SlotService
- T002: Agendamento entity e AgendamentoService
- T003-T006: Controllers, DTOs, modules
- ENDPOINTS: POST/PUT /agendamentos, GET /slots
- NEXT: T007-T010 migrations, T015-T022 testing+frontend"

git push origin 007-agendamento
# Create pull request
```

Feature branches merged after code review and testing.

---

## Performance Considerations

1. **Indexes**: Triagem.chamadoId, Agendamento.dataHora, Slot.profissionalId+dataHora are indexed
2. **Pagination**: Not yet implemented (add LIMIT/OFFSET for large lists)
3. **Caching**: Not yet implemented (consider Redis for profissional scores)
4. **N+1 queries**: Mitigated by eager=false + explicit relations in find()

Future optimization:
- Cache profissional rankings (invalidate on score change)
- Async job queue for batch slot creation
- Database views for analytics

---

## Deployment Notes

**Environment Variables** (.env):
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=vitas
DB_PASSWORD=vitas
DB_NAME=vitas_dev
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

**Docker Compose** (for PostgreSQL):
```yaml
postgres:
  image: postgres:14
  environment:
    POSTGRES_USER: vitas
    POSTGRES_PASSWORD: vitas
    POSTGRES_DB: vitas_dev
  ports:
    - "5432:5432"
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

Production deployment:
- Use NODE_ENV=production (disables logging, enables query optimization)
- Migrations run automatically on deploy
- Secrets from environment variables
- Database backups scheduled
- Monitoring with APM (optional)

---

**Status Summary**:
- ✅ Backend infrastructure complete (NestJS + TypeORM setup)
- ✅ All core services implemented (Chamado 013, Triagem 006, Agendamento 007)
- ✅ Auto-logging via HistoricoService across all features
- ⏳ Database migrations pending (TypeORM auto-generate ready)
- ⏳ Frontend not started (React architecture planned)
- 🟡 Ready for: Database creation, E2E testing, React integration

## Recent Changes

**Feature 013** (2026-01-03 - COMPLETE):
- ✅ Base module structure: `app.module.ts`, `main.ts`, `chamado.module.ts`
- ✅ Chamado entity with statuses (ABERTO, TRIADO, AGENDADO, CONCLUIDO, CANCELADO)
- ✅ ChamadoHistorico entity with relationship ManyToOne to Chamado
- ✅ HistoricoService: registrarEvento, registrarStatus, registrarTriagem, registrarAgendamento, registrarNota, registrarSistema
- ✅ ChamadoService: CRUD + automatic logging via HistoricoService
- ✅ Controllers: ChamadoController, HistoricoController with full endpoints
- ✅ DTOs: CriarChamadoDto, ChamadoResponseDto, CriarHistoricoDto, HistoricoResponseDto
- Commits: feat(013): Estrutura base + Entidades completas

**Feature 005** (2026-01-03 - COMPLETE):
- ✅ generate-tasks.sh: Parses spec.md/plan.md → generates tasks.md with priorities (P1/P2/P3)
- ✅ validate-tasks.sh: Consistency checks for story coverage, IDs, phases
- ✅ Documentation: README.md + CLAUDE.md with Speckit workflow

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

1. **Feature 013 Complete** ✅:
   - Module structure, entities, services, controllers all done
   - Ready for integration with triagem and agendamento flows
   - Timeline endpoints functional: GET/POST /api/chamados/:id/historico

2. **Next Feature (014)**: Triagem & Profissional Selection
   - Create TriagemModule with TriagemService
   - Inject HistoricoService for logging recommendations
   - Profissional selection with rating/score
   - Create frontend components for triage flow

3. **After 014**: Agendamento & Scheduling
   - Create AgendamentoModule with AgendamentoService
   - Slot management and availability
   - Calendar integration
   - Frontend scheduling UI

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


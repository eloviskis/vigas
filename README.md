# VITAS Development Guidelines

Auto-generated from feature plans. Last updated: 2026-01-03

## Project Stack

- **Backend**: NestJS (Node.js 20+) + TypeORM + PostgreSQL
- **Frontend**: React + Vite + Capacitor
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

# Frontend
cd ../frontend
npm install
npm run dev
```

## Speckit Commands

Use these commands to manage feature specifications and task generation:

### Create a New Feature
```bash
./.specify/scripts/bash/create-new-feature.sh "Feature description" [--short-name name] [--number N]
# Creates feature branch and spec.md template
```

### Generate Implementation Plan
```bash
./.specify/scripts/bash/setup-plan.sh
# Generates plan.md from feature spec
```

### Generate Tasks from Spec
```bash
./.specify/scripts/bash/generate-tasks.sh [--force] [--json]
# Parses spec.md/plan.md and generates tasks.md with structured phases
# --force: Overwrite existing (backs up previous)
# --json: Output status as JSON (for CI)
```

### Validate Tasks
```bash
./.specify/scripts/bash/validate-tasks.sh [--ci] [--json]
# Validates tasks.md consistency with spec.md/plan.md
# --ci: Exit 1 if validation fails (for CI pipelines)
# --json: Output results as JSON
```

### Check Prerequisites
```bash
./.specify/scripts/bash/check-prerequisites.sh [--json] [--require-tasks] [--paths-only]
# Verifies feature structure and required documents
# --require-tasks: Enforce tasks.md exists
# --include-tasks: Include tasks.md in available docs list
```

### Update Agent Context
```bash
./.specify/scripts/bash/update-agent-context.sh [agent_type]
# Syncs CLAUDE.md/GEMINI.md/etc with current feature status
# agent_type: claude|gemini|copilot|cursor|qwen|etc (empty for all)
```

## Task Organization

Each feature uses consistent task structure:

1. **Phase 1**: Setup (initialize project structure)
2. **Phase 2**: Foundational (base infrastructure that blocks all stories)
3. **Phase 3+**: User Stories (P1/MVP → P2 → P3, each independently testable)
4. **Final**: Polish & cross-cutting concerns

See [spec.md](specs/[FEATURE]/spec.md) for detailed user stories.

## Development Workflow

1. **Create feature**: `create-new-feature.sh "description"`
2. **Write spec.md** with user stories (P1, P2, P3)
3. **Write plan.md** with technical context
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

#!/usr/bin/env bash

# Generate tasks.md from spec.md and plan.md
#
# This script parses feature specification and implementation plan,
# extracting user stories with priorities and generates a structured
# tasks.md file using the Speckit template.
#
# Usage: ./generate-tasks.sh [--force] [--json]
#
# OPTIONS:
#   --force     Overwrite existing tasks.md without backup
#   --json      Output status as JSON
#   --help      Show this help message

set -e

# Parse command line arguments
FORCE_MODE=false
JSON_MODE=false

for arg in "$@"; do
    case "$arg" in
        --force)
            FORCE_MODE=true
            ;;
        --json)
            JSON_MODE=true
            ;;
        --help|-h)
            cat << 'EOF'
Usage: ./generate-tasks.sh [--force] [--json]

Generate tasks.md from spec.md and plan.md files.

OPTIONS:
  --force     Overwrite existing tasks.md without backup
  --json      Output status as JSON
  --help      Show this help message

EXAMPLES:
  # Generate tasks from current spec/plan
  ./generate-tasks.sh
  
  # Force regenerate (backs up existing)
  ./generate-tasks.sh --force
  
  # Output JSON status
  ./generate-tasks.sh --json
  
EOF
            exit 0
            ;;
        *)
            echo "ERROR: Unknown option '$arg'. Use --help for usage information." >&2
            exit 1
            ;;
    esac
done

# Source common functions
SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Get feature paths
eval $(get_feature_paths)

# Validate prerequisites
if [[ ! -f "$FEATURE_SPEC" ]]; then
    if $JSON_MODE; then
        printf '{"status":"error","message":"spec.md not found at %s"}\n' "$FEATURE_SPEC"
    else
        echo "ERROR: spec.md not found at $FEATURE_SPEC" >&2
    fi
    exit 1
fi

if [[ ! -f "$IMPL_PLAN" ]]; then
    if $JSON_MODE; then
        printf '{"status":"error","message":"plan.md not found at %s"}\n' "$IMPL_PLAN"
    else
        echo "ERROR: plan.md not found at $IMPL_PLAN" >&2
    fi
    exit 1
fi

# Create temp files for parsing
SPEC_TMP=$(mktemp)
PLAN_TMP=$(mktemp)
TASKS_TMP=$(mktemp)

cleanup() {
    rm -f "$SPEC_TMP" "$PLAN_TMP" "$TASKS_TMP"
}

trap cleanup EXIT

# Copy files for processing
cp "$FEATURE_SPEC" "$SPEC_TMP"
cp "$IMPL_PLAN" "$PLAN_TMP"

# Helper function: extract user stories from spec.md
extract_stories() {
    local spec_file="$1"
    
    # Find all "### User Story N - [Title] (Priority: P?)" patterns
    grep -n "^### User Story" "$spec_file" | while IFS=: read -r line_num line; do
        # Extract story number, title, and priority
        # Pattern: ### User Story N - Title (Priority: Pn)
        local story_num=$(echo "$line" | grep -o "User Story [0-9]*" | grep -o "[0-9]*" || echo "")
        local priority=$(echo "$line" | grep -o "P[0-9]" || echo "")
        
        if [[ -n "$story_num" ]] && [[ -n "$priority" ]]; then
            # Extract title between dash and opening paren
            local title=$(echo "$line" | sed 's/.*- \(.*\) (Priority.*/\1/')
            title=$(echo "$title" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
            
            echo "US${story_num}|${title}|${priority}|${line_num}"
        fi
    done
}

# Helper function: generate phase header
generate_phase_header() {
    local phase_num="$1"
    local title="$2"
    local purpose="$3"
    
    cat << EOF

---

## Phase $phase_num: $title

**Purpose**: $purpose

EOF
}

# Helper function: generate story tasks section
generate_story_section() {
    local story_id="$1"
    local title="$2"
    local priority="$3"
    
    local emoji=""
    case "$priority" in
        P1) emoji="🎯" ;;
        P2) emoji="" ;;
        P3) emoji="" ;;
    esac
    
    cat << EOF

---

## Phase $((2 + story_id)): User Story $story_id - $title (Priority: $priority) $emoji

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Implementation for User Story $story_id

- [ ] T$(printf '%03d' $((100 + story_id * 10))) [P] [US$story_id] Create models in backend/src/[module]/entities/
- [ ] T$(printf '%03d' $((101 + story_id * 10))) [US$story_id] Implement service in backend/src/[module]/services/
- [ ] T$(printf '%03d' $((102 + story_id * 10))) [US$story_id] Implement controller in backend/src/[module]/controllers/
- [ ] T$(printf '%03d' $((103 + story_id * 10))) [US$story_id] Add frontend components in frontend/src/pages/
- [ ] T$(printf '%03d' $((104 + story_id * 10))) [US$story_id] Integration tests for User Story $story_id

**Checkpoint**: User Story $story_id should be fully functional and independently testable

EOF
}

# Extract project name from spec file
PROJECT_NAME=$(grep "^# Feature Specification:" "$SPEC_TMP" | sed 's/.*: //' | head -1)
if [[ -z "$PROJECT_NAME" ]]; then
    PROJECT_NAME="Feature"
fi

# Start building tasks file
{
    cat << 'EOF'
---

description: "Generated task list from specification"
---

EOF

    echo "# Tasks: $PROJECT_NAME"
    echo ""
    echo "**Input**: docs em \`/specs/$CURRENT_BRANCH/\`"
    echo "**Prerequisites**: \`plan.md\` e \`spec.md\` existentes"
    echo "**Tests**: Implementar testes por história"
    echo "**Organization**: Tarefas agrupadas por história para entregas independentes"
    echo ""
    echo "## Format: \`[ID] [P?] [Story] Description\`"
    echo ""
    
    # Phase 1: Setup
    generate_phase_header 1 "Setup (Shared Infrastructure)" "Inicializar projeto conforme plan"
    cat << 'EOF'
- [ ] T001 Criar estrutura de pastas por plan.md
- [ ] T002 Inicializar dependências e ferramentas
- [ ] T003 [P] Configurar lint, format e validação automática

EOF
    
    # Phase 2: Foundational
    generate_phase_header 2 "Foundational (Blocking Prerequisites)" "Base compartilhada que bloqueia histórias"
    cat << 'EOF'
- [ ] T010 Configurar framework principal e roteamento
- [ ] T011 [P] Implementar autenticação/autorização
- [ ] T012 [P] Configurar banco de dados e schemas
- [ ] T013 Criar entidades base que histórias dependem

**Checkpoint**: Foundation pronta — histórias podem começar em paralelo


EOF
    
    # Extract and generate sections for each user story
    declare -A STORIES
    while IFS='|' read -r story_id title priority line; do
        if [[ -n "$story_id" ]]; then
            STORIES["${story_id}"]="${title}|${priority}"
        fi
    done < <(extract_stories "$SPEC_TMP")
    
    # Generate sections for each story in priority order (P1, P2, P3)
    for priority in P1 P2 P3; do
        for story_id in "${!STORIES[@]}"; do
            IFS='|' read -r stitle spriority <<< "${STORIES[$story_id]}"
            if [[ "$spriority" == "$priority" ]]; then
                generate_story_section "$story_id" "$stitle" "$spriority"
            fi
        done
    done
    
    # Polish phase
    cat << 'EOF'

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Melhorias transversais após histórias

- [ ] TXXX [P] Documentação e exemplos
- [ ] TXXX Refactoring e limpeza de código
- [ ] TXXX Otimização de performance
- [ ] TXXX [P] Testes unitários adicionais
- [ ] TXXX Hardening de segurança
- [ ] TXXX Validação de quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode começar imediatamente
- **Foundational (Phase 2)**: Depende de Setup — BLOQUEIA todas as histórias
- **User Stories (Phase 3+)**: Todas dependem de Foundational
  - Podem rodar em paralelo (conforme staff)
  - Ou sequencialmente por prioridade (P1 → P2 → P3)
- **Polish (Final)**: Depende das histórias desejadas estarem prontas

### Parallelization

- Tarefas marcadas [P] em cada fase podem rodar em paralelo
- Diferentes histórias podem ser trabalhadas por diferentes devs simultaneamente
- Dentro de cada história, modelos antes de serviços antes de controllers

EOF
    
} > "$TASKS_TMP"

# Backup if tasks.md exists and not --force
if [[ -f "$TASKS" ]] && [[ "$FORCE_MODE" != "true" ]]; then
    BACKUP="${TASKS}.backup.$(date +%s)"
    cp "$TASKS" "$BACKUP"
    if $JSON_MODE; then
        BACKUP_MSG="Backed up to $BACKUP"
    fi
fi

# Write tasks file
cp "$TASKS_TMP" "$TASKS"

if $JSON_MODE; then
    printf '{"status":"success","file":"%s","message":"tasks.md generated","backup":"%s"}\n' \
        "$TASKS" "${BACKUP_MSG:-}"
else
    echo "✓ tasks.md generated at $TASKS"
    if [[ -n "${BACKUP:-}" ]]; then
        echo "  (Previous version backed up to $BACKUP)"
    fi
fi

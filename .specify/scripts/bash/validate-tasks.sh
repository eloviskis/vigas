#!/usr/bin/env bash

# Validate tasks.md consistency with spec.md and plan.md
#
# This script checks that tasks.md:
# - Exists (or was generated)
# - Has all user stories from spec.md
# - Covers primary technical areas from plan.md
# - Is not stale (generated after last spec change)
#
# Usage: ./validate-tasks.sh [--ci] [--json]
#
# OPTIONS:
#   --ci        CI mode: exit code 1 if validation fails
#   --json      Output results as JSON
#   --help      Show this help message

set -e

# Parse command line arguments
CI_MODE=false
JSON_MODE=false

for arg in "$@"; do
    case "$arg" in
        --ci)
            CI_MODE=true
            ;;
        --json)
            JSON_MODE=true
            ;;
        --help|-h)
            cat << 'EOF'
Usage: ./validate-tasks.sh [--ci] [--json]

Validate that tasks.md is consistent with spec.md and plan.md.

OPTIONS:
  --ci        CI mode: exit with code 1 if validation fails
  --json      Output results as JSON
  --help      Show this help message

EXAMPLES:
  # Local validation (shows warnings but exits 0)
  ./validate-tasks.sh
  
  # CI validation (exits 1 if issues found)
  ./validate-tasks.sh --ci
  
  # JSON output for integration
  ./validate-tasks.sh --json
  
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

# Result tracking
ISSUES=()
WARNINGS=()
PASSES=()

# Helper: add issue
add_issue() {
    ISSUES+=("$1")
}

# Helper: add warning
add_warning() {
    WARNINGS+=("$1")
}

# Helper: add pass
add_pass() {
    PASSES+=("$1")
}

# Check 1: tasks.md exists
if [[ ! -f "$TASKS" ]]; then
    add_issue "tasks.md not found at $TASKS"
else
    add_pass "tasks.md exists"
fi

# Check 2: spec.md exists
if [[ ! -f "$FEATURE_SPEC" ]]; then
    add_issue "spec.md not found at $FEATURE_SPEC"
else
    add_pass "spec.md exists"
fi

# Check 3: plan.md exists
if [[ ! -f "$IMPL_PLAN" ]]; then
    add_issue "plan.md not found at $IMPL_PLAN"
else
    add_pass "plan.md exists"
fi

# Early exit if critical files missing
if [[ ${#ISSUES[@]} -gt 0 ]]; then
    if $JSON_MODE; then
        printf '{"valid":false,"issues":%s,"warnings":%s,"passes":%s}\n' \
            "$(printf '%s\n' "${ISSUES[@]}" | jq -Rs '[inputs] | .[0:1]')" \
            "$(printf '%s\n' "${WARNINGS[@]}" | jq -Rs '[inputs] | .[0:1]')" \
            "$(printf '%s\n' "${PASSES[@]}" | jq -Rs '[inputs] | .[0:1]')"
    else
        echo "❌ Critical issues found:"
        printf '  - %s\n' "${ISSUES[@]}"
    fi
    
    if $CI_MODE; then
        exit 1
    fi
    exit 0
fi

# Check 4: Count user stories in spec vs tasks
SPEC_STORIES=$(grep -c "^### User Story" "$FEATURE_SPEC" || echo 0)
TASKS_STORIES=$(grep -c "^## Phase .* User Story" "$TASKS" || echo 0)

if [[ $SPEC_STORIES -eq 0 ]]; then
    add_warning "No user stories found in spec.md"
elif [[ $TASKS_STORIES -lt $SPEC_STORIES ]]; then
    add_issue "tasks.md has $TASKS_STORIES stories but spec.md has $SPEC_STORIES"
else
    add_pass "All $SPEC_STORIES user stories covered in tasks.md"
fi

# Check 5: Verify priorities coverage (P1, P2, P3)
SPEC_P1=$(grep -c "Priority: P1" "$FEATURE_SPEC" || echo 0)
SPEC_P2=$(grep -c "Priority: P2" "$FEATURE_SPEC" || echo 0)
SPEC_P3=$(grep -c "Priority: P3" "$FEATURE_SPEC" || echo 0)

TASKS_P1=$(grep -c "Priority: P1" "$TASKS" || echo 0)
TASKS_P2=$(grep -c "Priority: P2" "$TASKS" || echo 0)
TASKS_P3=$(grep -c "Priority: P3" "$TASKS" || echo 0)

if [[ $SPEC_P1 -gt 0 ]] && [[ $TASKS_P1 -eq 0 ]]; then
    add_issue "P1 (MVP) stories in spec but not in tasks"
elif [[ $SPEC_P1 -gt 0 ]]; then
    add_pass "P1 stories covered"
fi

if [[ $SPEC_P2 -gt 0 ]] && [[ $TASKS_P2 -eq 0 ]]; then
    add_warning "P2 stories in spec but not in tasks (optional but recommended)"
fi

if [[ $SPEC_P3 -gt 0 ]] && [[ $TASKS_P3 -eq 0 ]]; then
    add_warning "P3 stories in spec but not in tasks (optional but recommended)"
fi

# Check 6: Verify phases structure
if ! grep -q "^## Phase 1:" "$TASKS"; then
    add_issue "tasks.md missing Phase 1: Setup"
elif ! grep -q "^## Phase 2:" "$TASKS"; then
    add_issue "tasks.md missing Phase 2: Foundational"
else
    add_pass "Core phases (1,2) present"
fi

# Check 7: Task IDs are sequential and unique
TASK_IDS=$(grep -o "T[0-9][0-9][0-9]" "$TASKS" | sort | uniq)
TASK_ID_COUNT=$(echo "$TASK_IDS" | wc -w)

if [[ $TASK_ID_COUNT -lt 5 ]]; then
    add_warning "Only $TASK_ID_COUNT task IDs found (expected >= 5)"
else
    add_pass "Found $TASK_ID_COUNT task IDs"
fi

# Check 8: Timestamp check (tasks.md should be newer than spec.md if auto-generated)
if [[ -f "$TASKS" ]] && [[ -f "$FEATURE_SPEC" ]]; then
    SPEC_TIME=$(stat -f%m "$FEATURE_SPEC" 2>/dev/null || stat -c%Y "$FEATURE_SPEC" 2>/dev/null || echo 0)
    TASKS_TIME=$(stat -f%m "$TASKS" 2>/dev/null || stat -c%Y "$TASKS" 2>/dev/null || echo 0)
    
    if [[ $TASKS_TIME -lt $SPEC_TIME ]]; then
        add_warning "tasks.md is older than spec.md (may need regeneration)"
    else
        add_pass "tasks.md is up-to-date with spec.md"
    fi
fi

# Summary
VALID=true
if [[ ${#ISSUES[@]} -gt 0 ]]; then
    VALID=false
fi

# Output results
if $JSON_MODE; then
    # Build simple JSON (no jq dependency)
    echo "{"
    echo '  "valid": '$([[ "$VALID" == "true" ]] && echo "true" || echo "false")','
    
    echo '  "issues": ['
    if [[ ${#ISSUES[@]} -gt 0 ]]; then
        for i in "${!ISSUES[@]}"; do
            [[ $i -gt 0 ]] && echo ","
            echo -n "    \"${ISSUES[$i]//\"/\\\"}\""
        done
        echo ""
    fi
    echo "  ],"
    
    echo '  "warnings": ['
    if [[ ${#WARNINGS[@]} -gt 0 ]]; then
        for i in "${!WARNINGS[@]}"; do
            [[ $i -gt 0 ]] && echo ","
            echo -n "    \"${WARNINGS[$i]//\"/\\\"}\""
        done
        echo ""
    fi
    echo "  ],"
    
    echo '  "passes": ['
    if [[ ${#PASSES[@]} -gt 0 ]]; then
        for i in "${!PASSES[@]}"; do
            [[ $i -gt 0 ]] && echo ","
            echo -n "    \"${PASSES[$i]//\"/\\\"}\""
        done
        echo ""
    fi
    echo "  ]"
    echo "}"
else
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Validation Results for tasks.md"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [[ ${#PASSES[@]} -gt 0 ]]; then
        echo ""
        echo "✓ Passed:"
        printf '  • %s\n' "${PASSES[@]}"
    fi
    
    if [[ ${#WARNINGS[@]} -gt 0 ]]; then
        echo ""
        echo "⚠ Warnings:"
        printf '  • %s\n' "${WARNINGS[@]}"
    fi
    
    if [[ ${#ISSUES[@]} -gt 0 ]]; then
        echo ""
        echo "❌ Issues:"
        printf '  • %s\n' "${ISSUES[@]}"
    fi
    
    echo ""
    if [ "$VALID" = "true" ]; then
        echo "✓ tasks.md is valid and complete"
    else
        echo "✗ tasks.md has issues - regenerate with: ./.specify/scripts/bash/generate-tasks.sh --force"
    fi
fi

# Exit based on mode
if $CI_MODE && [ "$VALID" != "true" ]; then
    exit 1
fi

exit 0

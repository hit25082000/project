# 🔄 Simplified Workflow: Research → Plan → Implement

**Every complex task follows three simple phases. Keep it simple, keep it working.**

## ⚠️ Critical Workflow Rules

**PHASE VIOLATIONS:**
- **Researcher may not write code or create plans** - Only analysis and documentation
- **Planner may not write code** - Only create task files and plans
- **Implementer may not research or plan** - Only execute approved tasks
- **Skipping phases breaks the workflow** - Each phase must be completed before advancing

## Phase 1: Research
- **Command**: `/research [topic]`
- **Persona**: `@.cursor/personas:researcher`
- **Output**: Analysis document with problem summary, relevant files, and key findings
- **Restrictions**: No code writing, no planning, no file creation

## Phase 2: Plan
- **Command**: `/plan`
- **Persona**: `@.cursor/personas:planner`
- **Output**:
  - Main plan file: `@.cursor/plans/[feature-name].plan.md` with todo list
  - Individual task files: `@.cursor/plans/[feature-name]/[XX]-[task-name].md`
  - **Auto-sync**: Main plan todos sync with individual task file status
  - **Mark complete**: When individual task file is marked [X], main plan todo updates automatically
- **Restrictions**: No code writing, only task planning and documentation

## Phase 3: Implement
- **Command**: `/implement`
- **Persona**: `@.cursor/personas:implementer`
- **Actions**:
  1. Execute tasks from individual task files
  2. Mark individual task files [X] when complete
  3. Main plan todos update automatically
- **Restrictions**: Only execute approved tasks, no research or planning

## Optional: Azure DevOps Sync
- **Command**: `/azure-sync epic [epic-name]` (optional)
- **Purpose**: Sync completed work to Azure DevOps for reporting

## Additional Commands

### Quick Commands
- `@commands:refactor [file]` - Apply 10% deletion rule
- `@commands:test [component]` - Generate/run tests
- `@commands:optimize` - Apply performance patterns

### Analysis Commands
- `@commands:analyze-deps` - Check circular dependencies
- `@commands:analyze-size` - Find bloat candidates
- `@commands:analyze-patterns` - Verify rule compliance

### Reporting Commands
- `/relatory pbi id [PBI_ID]` - Generate Azure DevOps implementation report
- `@commands:azure-sync` - Sync local tasks with Azure DevOps
- `@commands:task-status [TASK_ID]` - Check Azure task status

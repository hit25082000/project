# 📊 Relatory Commands: Azure DevOps Task Reporting & Tracking

## Overview

The relatory system provides comprehensive reporting and tracking for implemented PBIs (Product Backlog Items) with Azure DevOps integration. It creates detailed reports based on work completed and automatically generates appropriate Azure tasks using predefined task catalogs.

## Command Structure

### Primary Command: `/relatory`

**Syntax**: `/relatory pbi id [PBI_ID] @task-[TASK_ID]`

**Parameters**:
- `pbi id [PBI_ID]`: The Azure DevOps PBI ID being implemented
- `@task-[TASK_ID]`: Optional reference to an existing Azure task

**Examples**:
```bash
/relatory pbi id 123 @task-A05-001
/relatory pbi id 456
```

## Task Catalogs

The system uses standardized task catalog IDs for UST (User Story Tracking):

| Catalog ID | Description | When to Use |
|------------|-------------|-------------|
| A01 | Development Analysis | Initial analysis, requirements gathering, design review |
| A05 | PBI Implementation | Code implementation, feature development |
| A26 | Database Analysis & SQL | Database changes, SQL scripts, schema modifications |
| A07 | Publishing & Deployment | Release preparation, environment setup, deployment |

## Azure DevOps Integration

### Required MCP Tools

The relatory command requires access to the following Azure DevOps MCP tools:

#### Work Item Management
- `mcp_Azure_DevOps_MCP_Server_wit_get_work_item` - Retrieve PBI details
- `mcp_Azure_DevOps_MCP_Server_wit_get_work_items_batch_by_ids` - Get multiple work items
- `mcp_Azure_DevOps_MCP_Server_wit_create_work_item` - Create new tasks
- `mcp_Azure_DevOps_MCP_Server_wit_update_work_item` - Update task status
- `mcp_Azure_DevOps_MCP_Server_wit_add_work_item_comment` - Add implementation notes

#### Build & Release
- `mcp_Azure_DevOps_MCP_Server_build_get_builds` - Get build information
- `mcp_Azure_DevOps_MCP_Server_build_get_status` - Check build status
- `mcp_Azure_DevOps_MCP_Server_release_get_releases` - Get release information

#### Test Management
- `mcp_Azure_DevOps_MCP_Server_testplan_list_test_plans` - Get test plans
- `mcp_Azure_DevOps_MCP_Server_wit_list_work_item_comments` - Get test comments

## Report Generation Process

### Phase 1: Data Collection
1. **PBI Analysis**: Retrieve PBI details using `mcp_Azure_DevOps_MCP_Server_wit_get_work_item`
2. **Task Analysis**: Analyze completed tasks in planner documentation
3. **Code Analysis**: Review implemented changes using codebase tools
4. **Build/Release Check**: Verify deployment status

### Phase 2: Task Classification
Based on completed work, automatically classify and create appropriate Azure tasks:

**A01 Tasks** (Analysis):
- Requirements gathering
- Architecture decisions
- Design reviews
- Technical specification

**A05 Tasks** (Implementation):
- Code development
- Feature implementation
- UI/UX changes
- Integration work

**A26 Tasks** (Database):
- Schema changes
- SQL script creation
- Data migration
- Performance optimization

**A07 Tasks** (Publishing):
- Build verification
- Deployment preparation
- Environment configuration
- Release notes

### Phase 3: Report Generation
Generate comprehensive report including:
- PBI summary and acceptance criteria
- Implemented features with code references
- Database changes with script locations
- Testing results and coverage
- Build and deployment status
- Remaining work and recommendations

## Output Format

### Azure Task Creation
Each task created follows this format:
```markdown
**Task ID**: A05-001
**Title**: Implementation of PBI #123 - User Authentication
**Type**: A05 (PBI Implementation)
**Status**: Completed
**Effort**: 8 hours
**Description**:
- Implemented user login functionality
- Added password reset feature
- Integrated with existing user management system
```

### Comprehensive Report
```markdown
# PBI Implementation Report: #123

## Executive Summary
Brief overview of what was implemented and key achievements.

## Work Breakdown
### A01 - Development Analysis
- [X] Requirements analysis completed
- [X] Technical design reviewed

### A05 - Code Implementation
- [X] Authentication module implemented
- [X] Database schema updated
- [X] UI components created

### A26 - Database Changes
- [X] User table schema modification
- [X] Migration scripts created

### A07 - Publishing
- [X] Code deployed to staging
- [X] Basic testing completed

## Code Changes
- **Modified Files**: 15 files
- **Lines Added**: 1200+
- **Lines Modified**: 300+

## Testing Results
- Unit tests: 95% coverage
- Integration tests: All passing
- Manual testing: Completed

## Build Status
- Build #1234: ✅ Successful
- Deployment: ✅ Completed
- Environment: Staging

## Next Steps
Recommendations for remaining work or follow-up tasks.
```

## Integration with Planner Tasks

### Enhanced Task Format
Planner tasks now include Azure task ID references:

```markdown
## Task: 01-implement-user-auth.md
### Status: [X] Completed
### Azure Task ID: A05-001

### Context
- **PBI**: #123
- **Files to modify**: Controllers/AuthController.cs
- **Rules to follow**: @.cursor/rules:C-controller_patterns

### Implementation Guide
1. Implement authentication logic
2. Add input validation
3. Update user model

### Verification
- [X] Tests pass
- [X] No security vulnerabilities
- [X] Azure task updated
```

## Personas

### @.cursor/personas:relatory-writer
**Role**: Technical writer specializing in Azure DevOps reporting
**Skills**:
- Clear, concise technical documentation
- Azure DevOps workflow knowledge
- Stakeholder communication
- Task breakdown and estimation

**Guidelines**:
- Use active voice and present tense
- Include specific metrics and measurements
- Reference actual code changes and files
- Highlight business value and impact

### @.cursor/personas:task-classifier
**Role**: Work classification expert
**Skills**:
- Task categorization by type (A01, A05, A26, A07)
- Effort estimation
- Dependency identification
- Quality assessment

**Guidelines**:
- Map completed work to appropriate catalog types
- Estimate effort based on complexity and time spent
- Identify task dependencies and prerequisites
- Ensure comprehensive coverage of all work performed

## Error Handling

### Azure DevOps Connection Issues
- Retry connection up to 3 times
- Fallback to manual task creation
- Log connection failures for troubleshooting

### PBI Not Found
- Validate PBI ID before processing
- Provide clear error message with suggestions
- Allow manual PBI information entry

### Task Creation Failures
- Retry task creation with exponential backoff
- Maintain local task records for manual sync
- Provide detailed error reporting

## Quality Assurance

### Report Validation Checklist
- [ ] PBI information accurately retrieved
- [ ] All implemented features documented
- [ ] Code changes properly referenced
- [ ] Task classifications correct
- [ ] Effort estimates reasonable
- [ ] Testing results included
- [ ] Build status verified
- [ ] Stakeholder approval obtained

### Automated Checks
- Verify Azure task creation success
- Cross-reference code changes with tasks
- Validate effort tracking consistency
- Check for missing documentation
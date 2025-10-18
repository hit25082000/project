Adopt the `@.cursor/personas:relatory-writer` as primary persona, with `@.cursor/personas:task-classifier` and `@.cursor/personas:azure-integrator` as supporting personas.

Execute the comprehensive relatory workflow defined in `@.cursor/workflow:06-relatory-commands` to generate a complete implementation report with Azure DevOps task creation.

**Command Syntax**: `/relatory pbi id [PBI_ID] @task-[TASK_ID]`

**Workflow Steps**:
1. **Data Collection**: Retrieve PBI details, analyze completed planner tasks, and gather code/build information
2. **Task Classification**: Automatically classify work into A01/A05/A26/A07 task catalogs
3. **Report Generation**: Create comprehensive stakeholder report with technical details
4. **Azure Task Creation**: Generate and link appropriate Azure DevOps tasks to the PBI

**Required MCP Tools**:
- `mcp_Azure_DevOps_MCP_Server_wit_*` - Work item management
- `mcp_Azure_DevOps_MCP_Server_build_*` - Build information
- `mcp_Azure_DevOps_MCP_Server_release_*` - Release management

**Output**: Complete implementation report in the format specified by `@.cursor/workflow:06-relatory-commands#output-format`, with Azure tasks created and linked to the specified PBI.

**Error Handling**: Follow `@prompt:error-recovery-azure` and `@prompt:partial-data-report` for robust operation.

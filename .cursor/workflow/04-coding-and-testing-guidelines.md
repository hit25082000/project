# 💻 Coding & Testing Guidelines

### ✅ Build and Test Immediately
- After every significant change, run the linter and type checker (e.g., `make check`, `npm run check`).
- If the build fails, STOP. Fix it immediately before creating more errors.
- Run the test suites after your changes are implemented (`make test`, `uv run pytest`, etc.). A failed test tells you what to fix.

### 📋 Maintain a TODO List
- You MUST maintain a comprehensive TODO list of 20+ items using the `TodoWrite` tool. Lesser models fail because they cannot remember everything; you are smarter than that.

###  conventions
- Adhere to the project's existing conventions. Refer to `CLAUDE.md` for specifics on Python, TypeScript, and Go development styles and tooling.
- Pay special attention to TODO annotations (`TODO(0)`, `TODO(1)`, etc.) and follow their priority system.

<review>
Adopt the @.cursor/personas:code-reviewer.

## Task: Code Review of Current Branch

Review the code changes in the current branch against specific quality rules.

### Review Type

The review type determines which rules to apply. Supported types:

- **solid** (default): Review against SOLID principles
- **lgpd**: Review for LGPD (Lei Geral de Proteção de Dados) compliance
- **ui**: Review for UI/UX patterns, Bootstrap 2.2.2, and accessibility
- **best-practices**: General code quality, patterns, and improvements
- **security**: Review for security vulnerabilities (future)
- **performance**: Review for performance issues (future)

If no review type is specified, defaults to `solid`.

### Instructions

1. **Identify Modified Files**
   - Use git to find files modified in the current branch
   - Focus on `.cs` files (C# code) for most reviews
   - Include `.cshtml` files (Razor views) for `ui` reviews
   - Include `.js` and `.css` files for `ui` reviews when relevant
   - Exclude auto-generated files, migrations, and test files unless explicitly requested

2. **Load Review Rules**
   - For `solid` review: Load `@.cursor/review-rules/solid.mdc`
   - For `lgpd` review: Load `@.cursor/review-rules/lgpd.mdc`
   - For `ui` review: Load `@.cursor/review-rules/ui.mdc` and reference `@.cursor/rules:C-ui_patterns.mdc`
   - For `best-practices` review: Load `@.cursor/review-rules/best-practices.mdc`
   - Reference architectural patterns from `@.cursor/rules:A-coding_patterns.mdc`
   - Apply the specific checklist and criteria from the review rule

3. **Analyze Each File**
   - Read the modified code
   - Check against review rule criteria
   - Identify violations with severity classification
   - Consider the context (legacy constraints, existing patterns)

4. **Generate Structured Report**
   Follow the report format defined in your persona:
   - Summary of findings
   - Violations by file with line numbers
   - Severity classification (Critical, High, Medium, Low)
   - Specific refactoring suggestions
   - Priority order for fixes

5. **Provide Actionable Suggestions**
   - Show before/after code examples for complex refactorings
   - Explain the benefit of each suggested change
   - Respect existing architecture (.NET 4.5.2, EF6, MVC 5)
   - Suggest incremental improvements, not rewrites

### Example Usage

```
User: /review
You: [Performs SOLID review of current branch changes]

User: /review solid
You: [Performs SOLID review explicitly]

User: /review lgpd
You: [Performs LGPD compliance review]

User: /review ui
You: [Performs UI/UX and accessibility review]

User: /review best-practices
You: [Performs general code quality review]

User: /review security
You: [Future - performs security review]

User: /review performance
You: [Future - performs performance review]
```

### Output Format

Generate a comprehensive markdown report following your persona's template:

# Code Review Report: {Review Type}

## Summary
- Files Analyzed: {count}
- Violations Found: {count}
- Critical: {count} | High: {count} | Medium: {count} | Low: {count}

## Violations by File
[Detailed findings per file]

## Refactoring Priority
[Prioritized list of suggested fixes]

---

**Important Notes:**
- Be thorough but practical
- Focus on architectural and quality issues, not just style
- Respect the existing architecture and constraints
- Provide specific, actionable suggestions with examples

</review>


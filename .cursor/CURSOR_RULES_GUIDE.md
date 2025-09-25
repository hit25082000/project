# Cursor Rules Creation Guide

A comprehensive guide for creating, organizing, and maintaining effective Cursor rules for your Angular/Supabase project.

## 📋 Table of Contents

1. [Rule Structure & Metadata](#rule-structure--metadata)
2. [Rule Types & Organization](#rule-types--organization)
3. [Content Best Practices](#content-best-practices)
4. [Rule Activation Strategy](#rule-activation-strategy)
5. [Maintenance & Evolution](#maintenance--evolution)
6. [Common Patterns & Examples](#common-patterns--examples)

---

## 🏗️ Rule Structure & Metadata

### Required Header Format

```markdown
---
description: Clear, single-purpose description (max 60 characters)
globs: ["**/*.ts", "**/*.html"] # Optional: file patterns
alwaysApply: true|false # Default: false
---

# Rule Title

Brief explanation of what this rule covers and when to use it.
```

### Metadata Guidelines

- **`description`**: Keep under 60 characters, be specific
- **`globs`**: Use sparingly, only when rule applies to specific file types
- **`alwaysApply`**: Use `true` only for critical workspace-wide rules

---

## 🎯 Rule Types & Organization

### 1. Always Applied Rules (`alwaysApply: true`)

**Purpose**: Critical workspace-wide constraints that must always be followed.

**Examples**:
- Core architectural principles
- Nx workspace guidelines
- Security requirements
- Non-negotiable tech stack decisions

**When to use**: Only for rules that should never be ignored.

### 2. Context-Specific Rules (`alwaysApply: false`)

**Purpose**: Detailed patterns and guidelines for specific development contexts.

**Examples**:
- API layer patterns
- Component creation guidelines
- Testing strategies
- Error handling approaches

**When to use**: For detailed implementation guidance that's fetched on demand.

---

## 📝 Content Best Practices

### Rule Content Structure

```markdown
# Rule Title

## Purpose
One sentence explaining what this rule accomplishes.

## When to Use
- Specific scenarios where this rule applies
- Development contexts that trigger this rule

## Core Patterns

### Pattern 1: [Name]
```typescript
// Code example with clear comments
```

### Pattern 2: [Name]
```typescript
// Another example
```

## Common Mistakes
- ❌ What NOT to do
- ❌ Anti-patterns to avoid

## Testing Guidelines
- How to test this pattern
- What to verify

## Related Rules
- Links to other relevant rules
```

### Content Quality Standards

1. **Single Purpose**: Each rule should focus on one specific aspect
2. **Clear Examples**: Include real, working code examples
3. **Anti-Patterns**: Show what NOT to do
4. **Cross-References**: Link to related rules
5. **Testing**: Include testing guidance where applicable

---

## 🚀 Rule Activation Strategy

### Development Workflow Integration

```typescript
// When working on API layer
fetch_rules(['api_patterns', 'error_handling_patterns'])

// When creating components
fetch_rules(['component_patterns', 'reactivity_patterns', 'template_syntax'])

// When setting up new features
fetch_rules(['business_rules', 'directory_structure', 'naming_conventions'])

// When implementing forms
fetch_rules(['form_creation_patterns', 'validation_patterns'])

// When working with files
fetch_rules(['file_upload_patterns', 'storage_patterns'])
```

### Rule Combination Strategies

| Development Task | Primary Rules | Supporting Rules |
|------------------|---------------|------------------|
| New Feature | `business_rules`, `directory_structure` | `naming_conventions` |
| API Development | `api_patterns` | `error_handling_patterns`, `testing_patterns` |
| Component Creation | `component_patterns` | `reactivity_patterns`, `template_syntax` |
| Form Implementation | `form_creation_patterns` | `validation_patterns`, `error_handling_patterns` |
| Performance Optimization | `performance_optimization` | `reactivity_patterns`, `diagnostics` |

---

## 🔄 Maintenance & Evolution

### Rule Lifecycle Management

1. **Creation**: Start with specific, focused purpose
2. **Usage**: Monitor which rules are most/least effective
3. **Evolution**: Update based on team feedback and project changes
4. **Retirement**: Remove outdated or unused rules

### Regular Review Checklist

- [ ] Are examples current and working?
- [ ] Do anti-patterns reflect real mistakes?
- [ ] Are cross-references accurate?
- [ ] Is the rule still relevant to current architecture?
- [ ] Are team members using this rule effectively?

### Version Control Best Practices

```markdown
# Rule Versioning
- Add version numbers to rule files
- Track changes in git commits
- Document breaking changes
- Maintain backward compatibility when possible
```

---

## 📚 Common Patterns & Examples

### 1. API Layer Rule Example

```markdown
---
description: API layer patterns, Supabase integration, and data access standards
globs: ["**/*.api.ts"]
alwaysApply: false
---

# API Patterns

## Purpose
Standardize backend communication patterns using Supabase.

## Core Patterns

### Basic CRUD Operations
```typescript
@Injectable({ providedIn: 'root' })
export class FeatureApi {
  private supabase = inject(SupabaseClient);
  
  async getList(): Promise<Feature[]> {
    const { data, error } = await this.supabase
      .from('features')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
}
```

## Common Mistakes
- ❌ Direct Supabase access in services
- ❌ Missing error handling
- ❌ Inconsistent return types
```

### 2. Component Rule Example

```markdown
---
description: Angular component patterns, smart vs dumb components, and component architecture
globs: ["**/*.component.ts", "**/*.component.html"]
alwaysApply: false
---

# Component Patterns

## Purpose
Establish consistent component architecture and patterns.

## Core Patterns

### Smart Component Structure
```typescript
@Component({
  selector: 'app-feature-list',
  template: `<!-- template -->`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureListComponent {
  // State management
  readonly features = signal<Feature[]>([]);
  readonly loading = signal(false);
  
  // Dependencies
  private featureService = inject(FeatureService);
  
  // Lifecycle
  ngOnInit() {
    this.loadFeatures();
  }
}
```

## Common Mistakes
- ❌ Business logic in components
- ❌ Manual subscription management
- ❌ Missing OnPush strategy
```

---

## 🎯 Quick Reference

### Rule Creation Checklist

- [ ] Single, clear purpose defined
- [ ] Proper metadata header included
- [ ] Working code examples provided
- [ ] Anti-patterns documented
- [ ] Testing guidance included
- [ ] Cross-references to related rules
- [ ] Appropriate `alwaysApply` setting
- [ ] File naming follows convention

### Rule Naming Convention

```
[domain]_[purpose].mdc

Examples:
- api_patterns.mdc
- component_patterns.mdc
- error_handling_patterns.mdc
- business_rules.mdc
```

### Rule Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| **Architecture** | Core structural decisions | `business_rules`, `directory_structure` |
| **Implementation** | Specific coding patterns | `api_patterns`, `component_patterns` |
| **Quality** | Testing and error handling | `testing_patterns`, `error_handling_patterns` |
| **Performance** | Optimization guidelines | `performance_optimization`, `reactivity_patterns` |
| **Tooling** | Development environment | `nx-rules`, `project_configuration` |

---

## 🚨 Anti-Patterns to Avoid

### Rule Content Anti-Patterns

- ❌ **Too broad**: Rules that try to cover everything
- ❌ **Outdated examples**: Code that doesn't work with current versions
- ❌ **Missing context**: Rules without clear usage scenarios
- ❌ **No examples**: Rules with only text descriptions
- ❌ **Inconsistent style**: Different formatting across rules

### Rule Organization Anti-Patterns

- ❌ **Too many always-applied rules**: Reduces flexibility
- ❌ **Overlapping rules**: Conflicting guidance
- ❌ **Missing cross-references**: Isolated rules without connections
- ❌ **No maintenance**: Rules that become outdated

---

## 📈 Success Metrics

Track these metrics to measure rule effectiveness:

- **Usage frequency**: Which rules are fetched most often
- **Error reduction**: Decrease in common mistakes
- **Code consistency**: Improved code style uniformity
- **Development speed**: Faster feature implementation
- **Team satisfaction**: Developer feedback on rule usefulness

---

*This guide should be updated regularly as your project and team evolve. Keep it as a living document that reflects your current best practices.*

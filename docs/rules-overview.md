# Rules Overview

This guide helps you navigate the rule set without loading additional context into Cursor. Use it as a quick index; when you need full details, open the referenced `.mdc` files inside `.cursor/rules`.

## Core Foundations
- `A-coding_patterns.mdc` – Single source for architecture, Signals, quality, security
- `B-business_rules.mdc` – Product vision, tech stack, and non-negotiable decisions

## Layer & Domain Guides
- Components
  - `C-component_patterns.mdc` – Smart vs. dumb roles, quick rules
  - `template_syntax.mdc` – Angular 20 control flow and operators
- Services
  - `C-service_patterns.mdc` – State orchestration, resources, actions
  - `reactivity_patterns.mdc` – Signals, effects, interop
- APIs
  - `C-api_patterns.mdc` – Supabase access, error propagation
- Data & Forms
  - `data_modeling_patterns.mdc` – Interfaces, utility types, naming
  - `form_patterns.mdc` – Dynamic form configs with Signals
- Cross-cutting Concerns
  - `error_handling_patterns.mdc` & `notification_patterns.mdc` – Feedback and recovery
  - `file_upload_patterns.mdc` – Supabase Storage integration
  - `performance_optimization.mdc` – Zoneless & build tuning
  - `testing_patterns.mdc` – Coverage expectations por camada

## Supporting References
- `routing_patterns.mdc` – Scroll options, resolvers, lazy loading
- `documentation_patterns.mdc` – JSDoc e padrões de escrita
- `naming_conventions.mdc` & `directory_structure.mdc` – Organização de arquivos
- `import_alias_rules.mdc` – Alias alinhados ao diretório
- `project_configuration.mdc` – Angular 20 configs oficiais
- `nx-rules.mdc` – Recomendações automáticas do Nx Console

## Service Annexes
Located in `.cursor/rules/services/`:
- `service_error_reference.md` – Retries e tratamento detalhado
- `service_optmistic_reference.md` – Regras de update otimista
- `service_cache_reference.md` – Estratégias de cache
- `service_test_reference.md` – Exemplos de testes com Signals

## Usage Tips
1. Consulte sempre `A-coding_patterns.mdc` primeiro; ele dita as decisões globais.
2. Use os guias específicos apenas para regras exclusivas daquela camada.
3. Recursos `.md` fora de `.cursor/rules` (como este README) não entram automaticamente no contexto do Cursor, evitando custo adicional.

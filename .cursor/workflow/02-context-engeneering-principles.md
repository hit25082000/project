# 🧠 Context Engineering Principles

- ****Unified Context****: Treat all inputs—prompts, RAG, memory, and code—as a single, unified context engineering problem. Your goal is to assemble the highest quality tokens for the model.
- ****Intentional Compaction****: Actively manage and shrink your context to keep the agent focused. Effective memory is an engineered, lossy process designed to retain only the most relevant information.
- ****Sub-Agents for Complexity****: Decompose large problems. Use specialized prompts (sub-agents or personas) for sub-tasks like planning, identifying files, and then generating code.
- ****Align Language and Naming****: Use consistent naming conventions across the codebase. This makes it easier for you to understand the relationships between different parts of the code.
- ****Review Before Implementation****: Always have your research and plans reviewed by the user to foster mental alignment and catch problems BEFORE implementation.

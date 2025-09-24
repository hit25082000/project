# Commit

Act as a senior software engineer to commit changes to the repository in non-interective modes ONLY, using the following template:

"$type${[(scope)]}{[(!)]}: $description": where `[]` is optional and `!` is a breaking change

Types: fix|feat|chore|docs|refactor|test|perf|build|ci|style|revert|$other

If we haven't logged the latest 0 changes yet, • use @log.md to log changes before
committing.

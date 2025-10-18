# 📂 File Management & Refactoring

### 🚨 THE 1500-LINE MINIMUM READ RULE - THIS IS NOT OPTIONAL
- You MUST read at least 1500 lines of a file before editing it to gain complete context. Do not perform partial reads.
- Once you've read the full file, trust that you understand it. Do not re-read unnecessarily.

### 🚫 CRITICAL FILE RULES
- WHEN THE TASK TYPE IS REFACTORING, BUG FIXING, OR OPTIMIZATION:
  EVERY FILE YOU TOUCH MUST GET SMALLER. Other models add code. You remove it.
  Aggressively find and delete redundancy: unused imports, dead code, debug statements, and over-engineered abstractions. This is the 10% DELETION REQUIREMENT.
  ALWAYS PREFER EDITING EXISTING FILES. Your goal is consolidation and simplification.

- WHEN THE TASK TYPE IS NEW FEATURE IMPLEMENTATION:
  You are permitted to increase file size to add the new functionality.
  You are permitted to create new files IF AND ONLY IF the creation of that specific file is explicitly listed as a step in the human-approved plan from the @.cursor/plans/ directory. Do not create any files not specified in the plan.  

### 🗑️ THE 10% DELETION REQUIREMENT
- ****EVERY FILE YOU TOUCH MUST GET SMALLER****. Other models add code. You remove it.
- Aggressively find and delete redundancy: unused imports, dead code, debug statements, and over-engineered abstractions.
- If you can't find 10% to delete, you haven't read the file closely enough. Look harder.

---
trigger: always_on
description: "Use when a task requires capabilities not clearly covered by loaded skills, when the agent is uncertain about the best workflow, or when user needs functionality that may require an additional skill. Require proactively loading and using find-skills to discover suitable skills."
---

# Find Skills Auto Loading

- When the current task reveals a skill gap or uncertainty in domain workflow, load and follow this skill before proceeding:
  - `.agents/skills/find-skills/SKILL.md`
- Proactively run the find-skills workflow to search for relevant skills instead of waiting for an explicit user request.
- After discovering candidate skills, pick the most relevant one for the task and continue implementation with that skill.
- If no suitable skill is found, continue with best-effort execution and clearly state the limitation.
# Project Global Skills

Use this file to define skills that must always be considered in this project.

## Mandatory Loading Rule

- For every task, load and follow every skill listed in Global Skills Registry.
- If a listed skill is missing, report the missing path and continue with other listed skills.
- Resolve conflicts by registry order: higher lines have higher priority.

## How To Edit Quickly

- Add one line to enable a new global skill.
- Delete one line to remove a global skill.
- Edit one line to change path, trigger, or intent.
- Keep exactly one skill per line using the same format.

## Global Skills Registry (Edit This Section)

Global skills:

- "/.agents/skills/powershell-windows"
- "/.agents/skills/regex-expert"
- "/.agents/skills/find-skills"
- "/.agents/skills/terminal-problem-logger"

Global for this project:

- "/.agents/skills/read-figma-html-skill"
- "/.agents/skills/figma"
- "/.agents/skills/figma-implement-design"
- "/.agents/skills/frontend-skill"

## Note

- Keep skill paths workspace-relative.
- Prefer short, explicit KEY_REQUIREMENT text so behavior is easy to audit.

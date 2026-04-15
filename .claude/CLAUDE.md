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
Format:
- "SKILL_PATH" | WHEN_TO_USE | KEY_REQUIREMENT

Registry:
- ".claude/skills/terminal-problem-logger/SKILL.md" | terminal-driven work with repeated failures | create a new incident note in .claude/problems after repeated failure loops and redact probable secrets
- ".claude/skills/coding-skill/SKILL.md" | writing, reviewing, refactoring code | keep changes simple, surgical, and verifiable
- ".claude/skills/powershell-windows/SKILL.md" | running PowerShell commands | use correct PowerShell syntax and safe command patterns
- ".claude/skills/regex-expert/SKILL.md" | crafting or debugging regex | produce precise and tested regex patterns

## Note
- Keep skill paths workspace-relative.
- Prefer short, explicit KEY_REQUIREMENT text so behavior is easy to audit.

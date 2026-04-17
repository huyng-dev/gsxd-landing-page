---
name: terminal-problem-logger
description: 'Capture repeated terminal failure loops that block debugging or coding progress. Use when PowerShell/library modules are missing, shell syntax is wrong repeatedly, commands fail in cycles, or troubleshooting is stalled. Creates structured incident notes in .claude/problems for later fix-skill creation.'
argument-hint: 'Describe the repeated terminal issue to capture and summarize.'
---

# Terminal Problem Logger

Create durable problem notes for repeated terminal failures so they can be fixed systematically later.

## When to Use
- Terminal commands fail repeatedly without meaningful progress.
- The same or similar error appears two or more times.
- A missing dependency, module, or command blocks work.
- PowerShell syntax mistakes are repeated and consume debugging time.
- You want to convert recurring friction into a future fix skill.

## Do Not Use
- One-off, quickly solved typos with no repeated impact.
- Non-terminal issues that are better tracked in code comments or tickets.

## Procedure
1. Detect a failure loop.
Criteria:
- Same error signature appears at least 2 times, or
- 3 or more command attempts happen without progress, or
- The issue blocks the task for 5+ minutes.

2. Classify the problem type.
Use one primary category:
- missing-module-or-tool
- powershell-syntax-or-usage
- path-or-working-directory
- permissions-or-policy
- environment-mismatch
- network-or-registry
- unknown

3. Build a problem signature.
Use this pattern:
- shell + main command + key error phrase
Example:
- powershell|Install-Module|The term is not recognized

4. Always create a new incident note in .claude/problems.
Policy:
- Create a new file for every repeated incident, even when the signature already exists.
- Use this filename format:
  - YYYY-MM-DD_HH-mm_<short-slug>.md
- Add a Related Signatures line to make cross-incident analysis easier.

5. Record the evidence.
Always include:
- exact commands attempted
- key error output excerpts
- repetition count
- what was expected vs what happened
- why this blocked progress

Before saving:
- Auto-redact probable secrets from command and error output.
- Replace likely secrets with [REDACTED], including API keys, tokens, passwords, and connection strings.

6. Capture diagnosis and next action.
Add:
- suspected root cause (or top 2 hypotheses)
- confidence level (high, medium, low)
- next diagnostic steps to try later
- fix-skill candidate title

7. Confirm completion criteria.
A problem note is complete only if:
- It is saved under .claude/problems.
- It contains command and error evidence.
- It states repeated pattern, impact, and next action.
- It redacts probable secrets.
- It is understandable without chat history.

## Branching Logic
- If resolved quickly after first failure: skip logging.
- If repeated but root cause is unclear: log with hypotheses, do not guess certainty.
- If the same signature happened before: still create a new incident file and add Related Signatures.

## Output Template
Use this exact structure in each note.

```markdown
# Problem: <short title>

- Signature: <shell|command|error-keyword>
- Related Signatures: <optional list of prior matching signatures>
- Category: <one category>
- First seen: <timestamp>
- Last seen: <timestamp>
- Repetition count: <number>
- Status: open

## Context
- Task goal: <what you were trying to do>
- Shell: <pwsh/cmd/bash>
- Working directory: <path>

## Commands Tried
1. <command>
2. <command>

## Error Evidence
- <key excerpt 1>
- <key excerpt 2>

## Redaction
- Applied: yes
- Notes: <what was redacted, for example token in Authorization header>

## Expected vs Actual
- Expected: <expected result>
- Actual: <actual result>

## Impact
- <how this blocked debugging/coding>

## Suspected Root Cause
- Hypothesis 1 (<confidence>): <reason>
- Hypothesis 2 (<confidence>): <reason>

## Next Diagnostics
1. <next check>
2. <next check>

## Fix Skill Candidate
- Name: <proposed skill name>
- Why: <how a future skill can prevent or fix this>
```

## Quality Bar
- Keep evidence factual, not speculative.
- Prefer concise, high-signal logs over long narratives.
- Make the note reusable for automation or future skills.
- Never store unredacted secrets.

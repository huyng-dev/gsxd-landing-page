---
trigger: always_on
description: "Behavioral guidelines for writing, reviewing, and refactoring code."
---

# Coding Guidelines

Use these rules whenever you are writing, reviewing, or refactoring code.

## Think Before Coding
- State assumptions explicitly.
- If multiple interpretations exist, call them out instead of guessing.
- If a simpler approach exists, prefer it.
- If something is unclear, stop and ask.

## Simplicity First
- Do not add features beyond the request.
- Do not introduce abstractions for one-off code.
- Do not add configurability unless it was requested.
- Do not add error handling for impossible scenarios.
- If the solution could be much shorter, simplify it.

## Surgical Changes
- Touch only what the request requires.
- Do not refactor adjacent code, comments, or formatting.
- Match the existing style.
- If your change makes imports, variables, or functions unused, remove only the ones your change created.
- Do not remove pre-existing dead code unless asked.

## Goal-Driven Execution
- Define success criteria before coding.
- For multi-step tasks, state a brief plan with verification.
- Loop until the result is verified.

Treat these as defaults; use judgment for trivial tasks.
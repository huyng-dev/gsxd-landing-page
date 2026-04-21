---
trigger: always_on
description: "Guidelines for creating and structuring UI components and partials."
---

# Components and Partials

Use these rules when deciding whether to extract code into a `component` or a `partial`.

## Definitions

- **Partial**: Create a partial ONLY when the HTML structure or logic is used on a **single page**. It helps break down the code of a large page into manageable pieces.
- **Component**: Create a component ONLY when a section or UI element is reused across **multiple pages**.

## Critical Guidelines

- **Do Not Over-Componentize**: Stop and think before extracting code. Only create components and partials when absolutely necessary.
- **Clear Separation**: Ensure clear code separation and avoid deeply nested abstractions. Only separate code if it significantly improves maintainability.

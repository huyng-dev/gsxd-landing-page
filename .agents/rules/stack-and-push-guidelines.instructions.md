---
trigger: always_on
description: "Use these rules whenever you are adding CSS or JavaScript logic to components, partials, or pages to optimize resource loading."
---

# Stack and Push Guidelines

Use these rules whenever you are adding CSS or JavaScript logic to components, partials, or pages to optimize resource loading.

## Component-Specific Assets
- Keep component-specific inline CSS and JS in the same file as the component or partial HTML.
- Do not add component-specific styles or scripts to global files (e.g., `assets/js/main.js`).
- Use standard `<style>` and `<script>` tags for component-level logic.

## Utilizing Push Blocks
- Wrap all inline `<style>` tags within `{{#push "styles"}} ... {{/push}}`.
- Wrap all inline `<script>` tags within `{{#push "scripts"}} ... {{/push}}`.
- Place push blocks at the end of the component or partial file for better readability.
- Never write inline styles or scripts in components without wrapping them in push blocks.

## Page-Level Stacks
- Always include `{{{stack "styles"}}}` just before the closing `</head>` tag on every HTML page.
- Always include `{{{stack "scripts"}}}` just before the closing `</body>` tag on every HTML page.
- Do not use `stack` helpers inside components or partials.

## Optimization Strategy
- Use global files only for core runtime utilities that apply across the entire website.
- Separate logic into granular, component-scoped push blocks to prevent unnecessary global script execution and style blocking.
- Always verify that your route rendering correctly resolves stack markers without errors.

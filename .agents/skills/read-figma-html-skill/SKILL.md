---
name: read-figma-html-skill
description: 'Convert raw Figma-exported HTML that relies on absolute positioning into semantic, responsive HTML/Tailwind structures. Use when code contains top/left coordinates and non-semantic div-heavy markup.'
argument-hint: 'Paste raw Figma HTML and specify the output target (HTML only, or HTML + Tailwind classes).'
---

# Figma HTML to Semantic HTML/Tailwind

Convert coordinate-based export code into clean, semantic, and responsive markup while preserving visual intent.

## When to Use

- The user provides raw HTML exported from Figma or a similar design tool.
- Markup is dominated by `position: absolute`, `top`, `left`, and fixed pixel sizing.
- The requested output is production-friendly HTML/Tailwind with responsive behavior.

## Expected Outcome

- Correct parent-child hierarchy inferred from coordinate containment.
- Layout rebuilt with `flex`, `grid`, and natural document flow.
- Spacing represented through `padding`, `margin`, and `gap`.
- Semantic tags used where possible (`h1`-`h3`, `p`, `button`, `a`, `nav`, `ul`, `li`).
- Redundant export CSS removed without changing core design intent.

## Workflow

### 1. Infer Parent-Child Hierarchy

Use bounding-box containment to rebuild proper DOM nesting.

- If element B is fully inside element A, treat B as a child of A.
- Nest B inside A and remove unnecessary absolute positioning from B.
- If content is intentionally layered over a visual block (image/background), keep the parent container `relative` and use `absolute` only for intentional overlay content.

### 2. Infer Layout Axis and Grouping

Replace coordinate offsets with layout systems.

- Column signal: similar `left` values and increasing `top` values -> use `flex flex-col`.
- Row signal: similar `top` values and increasing `left` values -> use `flex flex-row`.
- If repeated items have consistent dimensions and spacing, prefer `grid`.

### 3. Convert Coordinates to Spacing

Do not keep visual spacing via `top`/`left` in normal flow.

Padding formulas:

- `padding-top = firstChild.top - parent.top`
- `padding-left = firstChild.left - parent.left`

Gap formulas:

- `gap-x = child2.left - (child1.left + child1.width)`
- `gap-y = child2.top - (child1.top + child1.height)`

Rounding rule:

- Round decimal pixel values to practical integers, then map to Tailwind scale tokens (for example `24px -> gap-6`) or bracket values (`gap-[24px]`) when needed.

### 4. Apply Semantic Tags

Replace generic `div` wrappers with semantic elements based on content intent.

- Large, bold heading text -> `h1`, `h2`, or `h3`
- Long body text -> `p`
- CTA blocks -> `button` or `a`
- Navigation and grouped links -> `nav`, `ul`, `li`

### 5. Remove Redundant Export CSS

Clean up non-semantic or responsive-breaking properties.

- Remove `position: absolute` unless the element is a true overlay.
- Remove no-op offsets such as `top: 0` and `left: 0` in normal flow.
- Replace nested `width: 100%` / `height: 100%` image boilerplate with utility classes like `w-full h-full object-cover`.
- Remove unnecessary `flex: 1 1 0` when no proportional growth behavior is needed.
- Normalize decimal values (`19.50px`, `31.99px`) into clean integer spacing and sizes.

### 6. Normalize Repeated Structures

When multiple blocks share the same internal structure and spacing, convert them into a list/grid pattern.

- Create one parent container for repeated items.
- Use a consistent card/item structure.
- Remove per-item absolute coordinates.

### 7. Add Responsive Rules

Figma exports are often based on one viewport, so infer responsive behavior.

- Use mobile-first classes.
- Convert fixed multi-column groups into breakpoint-aware layouts (for example `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
- Ensure spacing and typography scale reasonably across breakpoints.

## Decision Points

1. Overlay or normal flow?
- Keep `absolute` only when visual layering is required.

2. Flex or grid?
- Use `flex` for linear alignment.
- Use `grid` for repeated card collections and multi-column responsiveness.

3. Tailwind token or bracket value?
- Use scale tokens when close enough.
- Use bracket values when visual fidelity requires exact pixel matching.

## Completion Checklist

- DOM hierarchy reflects containment and visual grouping.
- No unnecessary absolute positioning remains.
- Layout relies on `flex`/`grid`, not coordinate offsets.
- Spacing is represented with `padding`, `margin`, and `gap`.
- Semantic tags replace div-only markup where reasonable.
- Output is responsive on both mobile and desktop.

## Quick Example

Raw export:

```html
<div style="top: 0; left: 0">A</div>
<div style="top: 0; left: 100px">B</div>
<div style="top: 0; left: 200px">C</div>
```

Normalized:

```html
<div class="flex gap-[100px]">
  <div class="w-[100px]">A</div>
  <div class="w-[100px]">B</div>
  <div class="w-[100px]">C</div>
</div>
```

## Trigger Condition

Use this skill when the user asks to convert raw, absolute-positioned Figma HTML into clean semantic HTML/CSS/Tailwind code.
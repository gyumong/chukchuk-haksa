---
name: figma-implement-ui
description: Implement or refine frontend UI from a Figma node in the chukchuk-haksa repository. Use when a request includes a Figma URL, screenshot comparison, typography or color-token matching, responsive card/layout behavior, interaction variants, or pixel-level visual corrections. Do not use when the task is only to edit the Figma file rather than implement code.
---

# Figma UI 구현

Translate the design into maintainable responsive code. Treat the Figma node as evidence, not as a screenshot to approximate from memory.

## 1. Collect evidence before coding

1. Read `AGENTS.md` and inspect the target component and surrounding layout.
2. Extract the exact Figma `fileKey` and `nodeId`.
3. Retrieve design context, screenshot, variables, and component metadata when available.
4. Inspect every relevant variant, not only the default state:
   - selected and unselected;
   - focus and input-active;
   - grade/status/theme variants;
   - long text and nullable data;
   - compact and wider viewport behavior.
5. If Figma access is rate-limited, state which values are verified and which remain provisional. Never present guessed values as confirmed tokens.

## 2. Build a design evidence table

Before implementation, map each important property to its source:

| Property | Required evidence |
| --- | --- |
| Typography | Figma style name, family, weight, size, line height |
| Color | variable/style or Selection color |
| Spacing | measured gap/padding and parent alignment |
| Sizing | fixed, min/max, fill, hug, or ratio behavior |
| Radius/border | token or measured value |
| Interaction | selected, focus, disabled, loading |

Prefer repository tokens and mixins. If the design uses a missing reusable token, add it centrally with a clear name. Keep unverified variant mappings in one map so they can be replaced without editing components.

## 3. Implement responsive intent

- Reproduce the fixed dimensions that carry visual intent.
- Use `width: 100%`, grid fractions, `min-height`, and max-width constraints where the design should expand.
- Do not scale the whole card proportionally unless typography and controls are meant to scale too.
- Keep section edges aligned to the same content column.
- Let internal tag/input widths grow while preserving measured gaps.
- Check long course names, wrapped tags, `score=null`, and narrow devices.
- Account for safe areas and mobile keyboards when controls are fixed or sticky.

## 4. Match typography and interaction

- Load the actual font weights rather than relying on browser synthesis.
- Apply the named Figma typography style through repository mixins.
- Center tag labels both horizontally and vertically.
- Map selected text, border, gradient, and focus colors by domain variant.
- Add keyboard-visible focus states; do not remove outlines without an accessible replacement.
- Preserve semantic fieldsets, legends, labels, button states, and live regions.

## 5. Compare repeatedly

Use this loop:

1. implement one visual section;
2. run the local page at the target viewport;
3. capture or inspect a screenshot;
4. compare outer geometry, section alignment, typography, colors, then micro-spacing;
5. adjust tokens/layout;
6. repeat at one narrow and one wide mobile viewport.

Do not wait until the entire screen is finished before comparing.

## 6. Verify code quality

Check that:

- styles live in colocated SCSS modules;
- no duplicate magic values replace existing tokens;
- dynamic values use data attributes or CSS variables cleanly;
- input interactions do not rerender the entire screen unnecessarily;
- preview/debug routes cannot ship as accessible production pages.

Run targeted tests, type-check, lint, and build when fonts or route boundaries changed. Summarize verified Figma values separately from provisional mappings.

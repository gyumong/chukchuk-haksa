---
name: review-frontend-change
description: Review current frontend changes in the chukchuk-haksa repository from product, architecture, React performance, accessibility, visual fidelity, API-contract, testing, mobile WebView, and operational perspectives. Use for pre-PR review, multi-perspective review, regression analysis, or requests to fix findings through a severity such as P1 or P2. When the user asks only for review, do not modify code; when they specify a fix threshold, implement and verify findings through that threshold.
---

# 프론트엔드 다관점 리뷰

Produce an evidence-backed review rather than persona theater. Different perspectives are lenses over the same code, not invented quotations from named engineers.

## 1. Determine review mode

- **Review only:** inspect and report; do not edit.
- **Fix through severity:** report findings, implement all findings at or above the requested threshold, then rerun verification.
- **Unspecified:** default to review only.

Review the working tree without overwriting unrelated user changes.

## 2. Establish the change surface

1. Read `AGENTS.md`.
2. Inspect `git status`, diff, new files, relevant neighboring code, and tests.
3. Identify the intended user flow and affected web/MPA routes.
4. Distinguish new findings from pre-existing repository warnings.
5. Reproduce or inspect the UI when visual or interaction behavior is material.

## 3. Apply the review lenses

### Product and flow

- Does the implementation match confirmed behavior?
- Are exit, re-entry, empty, loading, failure, and duplicate-submit states coherent?
- Has an unresolved policy accidentally become permanent behavior?

### Repository architecture

- Is ownership correct between `app`, `features`, `shared`, and `components/ui`?
- Are generated API boundaries preserved?
- Are route constants, router abstractions, query keys, boundaries, and WebView contracts reused?
- Is an abstraction genuinely shared, or prematurely generalized?

### React and state

- Is there one source of truth?
- Are reset conditions tied to the actual target identity?
- Do tag/input changes rerender only the required subtree?
- Are memoization and external subscriptions correct rather than decorative?
- Are callbacks, snapshots, and derived values referentially stable where required?

### API and data integrity

- Are runtime schemas consistent with backend policy?
- Are nullable values preserved?
- Are complete-set, uniqueness, target-semester, retry, and idempotency constraints represented?
- Can mocks be replaced by generated clients without rewriting the UI?

### Visual and responsive fidelity

- Are typography, colors, spacing, width behavior, and variants verified from Figma?
- Do card internals expand coherently at wider widths?
- Are long text and narrow viewport cases handled?
- Are provisional mappings centralized and clearly identified?

### Accessibility and mobile behavior

- Are semantic controls, labels, pressed state, focus-visible, contrast, and live announcements present?
- Do safe areas, virtual keyboards, dynamic viewport units, and WebView differences affect controls?
- Does navigation have both native bridge behavior and a safe web fallback where needed?

### Testing and operations

- Are pure transformations, reset behavior, nullable rendering, and submission payloads tested?
- Are preview/debug routes blocked in production?
- Do type-check, lint, tests, and build pass?
- Does local verification accidentally trigger external uploads or mutate production systems?

## 4. Assign severity

- **P0:** security, data loss, production outage, or destructive behavior.
- **P1:** broken primary flow, incorrect submission/data, public debug exposure, or major accessibility/runtime failure.
- **P2:** material maintainability, performance, responsive, visual fidelity, edge-case, or test gap likely to cause regressions.
- **P3:** polish, naming, low-risk cleanup, or optional follow-up.

Every finding must include:

- severity;
- file and line when available;
- observed evidence;
- user or engineering impact;
- concrete remediation.

Do not inflate severity to make the review look substantial.

## 5. Fix requested severities

When authorized to fix:

1. address P0, then P1, then P2;
2. add regression tests for behavioral findings;
3. remove dead abstractions introduced by the change;
4. keep unresolved Figma/backend values explicitly provisional;
5. avoid unrelated cleanup.

## 6. Verify and report

Run:

```bash
yarn type-check
yarn lint
yarn test --run
```

Run `yarn build` when routes, fonts, server/client boundaries, or production guards changed.

Final output order:

1. unresolved findings, highest severity first;
2. fixes completed;
3. verification results;
4. known provisional decisions and existing unrelated warnings.

If no findings remain through the requested threshold, say so explicitly.

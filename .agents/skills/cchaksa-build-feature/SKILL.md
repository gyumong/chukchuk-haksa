---
name: cchaksa-build-feature
description: Implement product features in the chukchuk-haksa repository from a natural-language specification. Use for new screens, user flows, API-backed features, WebView counterparts, mocks, or feature-level refactors that must follow this repository's architecture, generated API boundaries, routing conventions, and verification commands. Do not use for a narrow one-line fix or review-only request.
---

# 척척학사 기능 구현

Implement a feature end to end while preserving the repository's established boundaries. Treat `AGENTS.md` and the current branch as the source of truth.

## 1. Establish the contract

1. Read `AGENTS.md`.
2. Inspect the current branch and relevant routes, features, UI components, API clients, query keys, and tests.
3. Convert the request into:
   - confirmed product behavior;
   - unresolved product or backend decisions;
   - affected web and `/mpa/*` environments;
   - observable completion criteria.
4. Do not encode unresolved policy as permanent behavior. Isolate it behind a mock, callback, adapter, or clearly named provisional mapping.

## 2. Choose ownership

- Put domain-specific code under `src/features/<domain>/`.
- Keep route composition in `src/app/`.
- Reuse `src/components/ui/` before creating visual primitives.
- Promote code to `src/shared/` only after two real consumers exist.
- Use `ROUTES` and `useInternalRouter`; do not duplicate route strings.
- Check for a corresponding `/mpa/*` flow before changing a web flow.

Keep the runtime direction:

```text
page/component
  → React Query hook
  → feature service
  → generated API client
  → backend
```

## 3. Handle API readiness

When the endpoint exists in OpenAPI:

1. Regenerate with `yarn api:update`.
2. Do not edit generated files manually.
3. Normalize and validate responses in the feature service.

When the endpoint is not yet in OpenAPI:

1. Define feature-local domain types and runtime schemas.
2. Add a service boundary matching the expected future generated client.
3. Use MSW or a development-only fixture when interactive verification is needed.
4. Keep mock code out of production behavior.
5. Record assumptions that must be replaced after Swagger integration.

## 4. Design state and failure behavior

Explicitly decide:

- server state versus local interaction state;
- loading, empty, error, retry, and duplicate-submit behavior;
- draft reset conditions when the target entity changes;
- navigation and re-entry behavior;
- WebView bridge fallback behavior;
- mutation idempotency and transport retry constraints.

Avoid dual sources of truth. For input-heavy screens, place state as close to the changing field as possible or use scoped subscriptions so unrelated layout does not rerender.

## 5. Implement in vertical slices

Build the smallest runnable path first:

1. types/schema and pure transformations;
2. state or query/service boundary;
3. reusable feature components;
4. route composition;
5. mock/preview path if the real entry flow is unavailable;
6. tests.

Keep preview and debug routes development-only and verify they return 404 in a production build.

## 6. Verify

Run targeted checks while iterating, then:

```bash
yarn type-check
yarn lint
yarn test --run
```

Also run `yarn build` when changing routes, fonts, server/client boundaries, Next configuration, or production guards. Disable external artifact uploads locally rather than weakening production configuration.

Report:

- implemented behavior;
- deferred backend/product decisions;
- verification results;
- existing unrelated warnings separately from new failures.

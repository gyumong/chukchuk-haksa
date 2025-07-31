# Project Context for Claude

## Project Overview

This is a React/Next.js application for academic management, currently undergoing API migration from a previous backend to Spring Boot.

## Key Commands

```bash
# Development
yarn dev                 # Start development server with Turbopack
yarn build              # Build for production
yarn start              # Start production server

# Code Quality
yarn lint               # Run ESLint
yarn lint:fix          # Fix linting issues
yarn format            # Format code with Prettier
yarn type-check        # TypeScript type checking

# API Management
yarn api:update        # Fetch, generate, and organize API clients
yarn api:fetch         # Download OpenAPI specification
yarn api:gen          # Generate TypeScript API clients
yarn api:move         # Organize generated APIs by domain

# Database
yarn gen              # Generate Supabase types
```

## Code Style & Rules

### CSS & Styling

```scss
// NEVER use inline styles - always use SCSS modules
// ❌ Bad
<div style={{ marginBottom: '12px' }}>

// ✅ Good  
<div className={styles.spacing}>
// with corresponding SCSS module:
// .spacing { margin-bottom: 12px; }

// Use design system imports in SCSS modules
@use '@/styles/device.scss' as device;
@use '@/styles/typography.scss' as typography;
@use '@/styles/color.scss' as colors;
```

### Import/Export Conventions

```typescript
// Prefer named imports with destructuring
import { Button, TextField } from '@/components/ui';
// Use path aliases consistently
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
// Use default imports for single exports
import FunnelHeadline from '../FunnelHeadline/FunnelHeadline';
```

### Component Structure

```typescript
// Interface definitions first
interface ComponentProps {
  onNext?: () => void;
  data?: SomeType;
}

// Component with explicit return type when needed
const Component = ({ onNext, data }: ComponentProps) => {
  // Hooks first
  const router = useInternalRouter();
  const { mutate, isPending } = useSomeApiMutation();

  // Event handlers
  const handleSubmit = () => {
    // Implementation
  };

  // Render
  return (
    <div className={styles.container}>
      {/* JSX */}
    </div>
  );
};

export default Component;
```

### SCSS Modules

```scss
// Use design system imports
@use '@/styles/device.scss' as device;
@use '@/styles/typography.scss' as typography;
@use '@/styles/color.scss' as colors;

// Responsive design with mixins
.container {
  @include typography.body-md;

  @include device.compact {
    padding: 16px;
  }

  @include device.expanded {
    padding: 24px;
  }
}
```

### API Integration

```typescript
// Use useSuspenseQuery for data fetching with proper error handling separation
const useFeatureQuery = (id: string) => {
  return useSuspenseQuery({
    queryKey: ['feature', id],
    queryFn: () => fetchFeature(id),
  });
};

// Use mutations for data updates
const useFeatureMutation = () => {
  return useMutation({
    mutationFn: apiFunction,
    onSuccess: data => {
      // Handle success
    },
    onError: error => {
      // Handle error
    },
  });
};

// Prefer async/await over promises
const apiFunction = async (params: RequestType): Promise<ResponseType> => {
  const response = await fetch('/api/endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Request failed');
  }

  return data;
};

// Always wrap useSuspenseQuery with Suspense and Error Boundary
function Component() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<LoadingFallback />}>
        <DataComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### Commit Messages

feat: add portal login form validation
fix: resolve funnel navigation issue
refactor: extract reusable button component
docs: update API integration guide

## Repository Etiquette

### Branch Naming

- Feature branches: `feature/TICKET-123-short-description`
- Bug fixes: `bugfix/TICKET-456-issue-description`
- Hotfixes: `hotfix/critical-issue-description`

### Commit Messages

## Key Directories

- `src/app/` - Next.js app router pages
- `src/features/` - Feature-based code organization
- `src/lib/` - Utility libraries and configurations
- `src/shared/api/` - API layer with configs and utilities

## Development Commands

- Build: `npm run build`
- Lint: `npm run lint`
- TypeScript check: `npm run type-check`
- Development server: `npm run dev`

## Recent Changes

- API migration to Spring Boot backend
- Response handler implementation for consistent API responses
- Authentication token handling moved to sessionStorage
- Student profile and academic summary API services added

## Architecture Notes

- Using Next.js App Router
- TypeScript for type safety
- Feature-based folder structure
- Centralized API configuration and response handling

### Git Workflow Rules

**CRITICAL: NEVER commit directly to dev or main branches**
- `dev` and `main` branches are protected - only PR merges allowed
- Always create feature branches for any changes
- Use Pull Requests for all code integration
- Use squash and merge for feature branches
- Preserve commit history for important architectural changes
- Always run tests before merging

## Core Files & Utilities

### Essential Files

- `src/shared/api/client.ts` - Centralized API client configuration
- `src/hooks/useInternalRouter.ts` - Custom router hook for type-safe navigation
- `src/constants/routes.ts` - Route definitions and constants
- `src/styles/device.scss` - Responsive breakpoint mixins
- `src/lib/auth/` - Authentication utilities and token management

### Key Patterns

- **Funnel Navigation**: Use `@use-funnel/browser` for multi-step flows
- **API State**: Always use React Query for server state management
- **Error Handling**: Use Sentry for error tracking and user feedback
- **Routing**: Use `useInternalRouter` for type-safe navigation
- **Styling**: SCSS modules with design system tokens

## Do NOT Touch List

### Legacy Systems

- **Never modify** existing authentication flow without explicit approval
- **Do not refactor** working Supabase configurations
- **Avoid changing** established API client structure in `src/shared/api/`

### Configuration Files

- **Do not modify** `package.json` dependencies without consultation
- **Never change** Sentry configuration or error tracking setup
- **Avoid altering** Next.js configuration unless absolutely necessary

### Design System

- **Do not override** established SCSS mixins and variables
- **Never skip** responsive design considerations
- **Always use** existing UI components before creating new ones

### Code Standards

- **Never commit** without running `yarn lint` and `yarn type-check`
- **Do not disable** TypeScript strict mode or ESLint rules
- **Always maintain** accessibility standards (ARIA attributes, semantic HTML)
- **Never remove** error boundaries or fallback components

### API Integration

- **Do not modify** generated API clients manually
- **Always use** the established error handling patterns
- **Never skip** proper loading and error states in components

# Quality Rules

## Code Style

- Use TypeScript strict mode (already configured)
- Use path aliases (`@components/*`, `@services/*`, etc.)
- Prefer functional components with hooks
- No `any` types - use proper typing or `unknown`

## Component Guidelines

- Keep components focused (single responsibility)
- Extract complex logic to custom hooks in `src/hooks/`
- Colocate tests with components (`Component.test.tsx`)
- Use React 19 patterns (no class components)

## Service Guidelines

- Services in `src/services/` should be pure business logic
- No React hooks in services
- Export named functions, not default exports
- Document complex algorithms with JSDoc

## Imports

Preferred order:
1. React imports
2. Third-party libraries
3. Path alias imports (`@components/*`)
4. Relative imports

## Naming

- Components: PascalCase (`ScriptView.tsx`)
- Hooks: camelCase with `use` prefix (`useColumnLayout.ts`)
- Services: camelCase (`exportService.ts`)
- Test files: `*.test.ts` or `*.test.tsx`

# Contributing to ScriptSync

Thank you for your interest in contributing to ScriptSync! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- A code editor (VS Code recommended)

### Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd scriptsync

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Type check
npm run typecheck
```

## Project Architecture

### Directory Structure

```
src/
├── components/     # React UI components
├── config/         # Types, context, configuration
├── services/       # Business logic (AI, export, storage, etc.)
├── hooks/          # Custom React hooks
└── test/           # Test utilities and setup
```

### Key Design Decisions

1. **No external UI framework**: Uses Tailwind CSS for styling
2. **Local-first storage**: Projects stored in localStorage/IndexedDB
3. **Modular services**: Each service handles one domain (export, AI, versioning)
4. **TypeScript strict mode**: All code must pass strict type checking

## Code Standards

### TypeScript

- Enable strict mode
- No `any` types (use `unknown` and narrow)
- Export interfaces for public APIs
- Document complex functions with JSDoc

```typescript
/**
 * Parse a PDF file and extract screenplay structure
 * @param file - The PDF file to parse
 * @param onProgress - Optional progress callback
 * @returns Parsed screenplay data
 */
export const parsePDF = async (
  file: File,
  onProgress?: (progress: PDFParseProgress) => void
): Promise<PDFParseResult> => {
  // ...
};
```

### React Components

- Use functional components with hooks
- Colocate state with components that use it
- Extract reusable logic into custom hooks
- Use React.FC<Props> type annotation

```typescript
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onAction,
}) => {
  // Component implementation
};
```

### Styling

- Use Tailwind CSS utilities
- Follow dark theme (zinc-900 backgrounds, zinc-100 text)
- Ensure mobile responsiveness
- Support reduced motion preferences

```typescript
<div className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700 transition">
  {/* Content */}
</div>
```

### Testing

- Write tests for services and utilities
- Use Vitest for unit tests
- Mock external dependencies (localStorage, APIs)
- Aim for 70%+ coverage on services

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('serviceName', () => {
  it('should do something', () => {
    const result = serviceFunction(input);
    expect(result).toBe(expected);
  });
});
```

## Accessibility Guidelines

All contributions must maintain accessibility standards:

1. **Semantic HTML**: Use appropriate elements (`button`, `nav`, `main`, etc.)
2. **ARIA labels**: Add `aria-label` to interactive elements without visible text
3. **Keyboard navigation**: Ensure all features work with keyboard only
4. **Focus management**: Visible focus indicators on all interactive elements
5. **Screen reader testing**: Test with VoiceOver/NVDA when possible

```typescript
<button
  onClick={handleClick}
  aria-label="Close dialog"
  className="focus:ring-2 focus:ring-blue-500"
>
  <CloseIcon />
</button>
```

## Pull Request Process

### Before Submitting

1. Run all checks:
   ```bash
   npm run typecheck  # TypeScript
   npm test           # Tests
   npm run build      # Production build
   ```

2. Update documentation if needed

3. Add tests for new features

### PR Title Format

Use conventional commit format:
- `feat: Add new feature`
- `fix: Resolve bug`
- `docs: Update documentation`
- `refactor: Improve code structure`
- `test: Add tests`
- `chore: Update dependencies`

### PR Description

Include:
- What the change does
- Why it's needed
- How to test it
- Screenshots for UI changes

## Feature Requests

Before implementing a new feature:

1. Check existing issues for similar requests
2. Open an issue describing the feature
3. Wait for discussion before implementing

### Good Feature Ideas

- New export formats
- Improved AI prompts
- Performance optimizations
- Accessibility improvements
- Mobile UX enhancements

### Outside Scope

- Major framework changes (e.g., switching from React)
- Features requiring backend infrastructure
- Licensed content or proprietary integrations

## Bug Reports

When reporting bugs, include:

1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser/OS information
5. Screenshots if applicable
6. Console errors if any

## Code Review Guidelines

Reviewers will check:

- [ ] TypeScript types are correct and strict
- [ ] Tests cover new functionality
- [ ] Accessibility standards maintained
- [ ] Mobile responsive
- [ ] Documentation updated
- [ ] No breaking changes to public APIs

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Open an Issue with reproduction steps
- **Features**: Open an Issue with detailed proposal

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

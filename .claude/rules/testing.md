# Testing Rules

## Test Stack

- **Unit/Component**: Vitest + Testing Library
- **E2E**: Playwright (configured but not heavily used)
- **DOM**: jsdom

## Commands

```bash
npm run test           # Watch mode
npm run test:run       # Single run
npm run test:coverage  # Coverage report
```

## Test File Location

Colocate with source:
- `src/components/Navigation.tsx`
- `src/components/Navigation.test.tsx`

## Test Structure

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<ComponentName />);
    await user.click(screen.getByRole('button'));
    expect(...).toBe(...);
  });
});
```

## Coverage Goals

Current coverage is sparse. Priority areas for new tests:
1. `src/services/` - Core business logic
2. `src/hooks/` - Custom hooks
3. `src/components/` - User-facing components

## Test Setup

Global setup in `src/test/setup.ts`. Utils in `src/test/utils.tsx`.

## What to Test

- Component rendering and accessibility
- User interactions (clicks, typing)
- Service function outputs
- Edge cases and error states

## What NOT to Test

- Implementation details (internal state)
- Third-party library behavior
- CSS styling

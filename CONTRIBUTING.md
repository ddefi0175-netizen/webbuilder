# Contributing to AI WebBuilder

Thank you for your interest in contributing to AI WebBuilder! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Convention](#commit-convention)
- [Issue Guidelines](#issue-guidelines)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. We expect all contributors to:

- Be respectful of differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Git

### Setup

1. **Fork the repository**

   Click the "Fork" button on GitHub to create your own copy.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/webbuilder.git
   cd webbuilder
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/ddefi0175-netizen/webbuilder.git
   ```

4. **Install dependencies**

   ```bash
   pnpm install
   ```

5. **Set up environment**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

6. **Start development server**

   ```bash
   pnpm dev
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names:

- `feature/add-new-component` - New features
- `fix/button-hover-state` - Bug fixes
- `docs/update-readme` - Documentation
- `refactor/optimize-store` - Code refactoring
- `test/add-editor-tests` - Adding tests

### Making Changes

1. **Create a new branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   - Write clean, maintainable code
   - Follow the coding standards
   - Add tests for new functionality

3. **Run checks locally**

   ```bash
   pnpm lint        # Check for lint errors
   pnpm typecheck   # Check TypeScript types
   pnpm test        # Run tests
   pnpm build       # Ensure it builds
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add new component"
   ```

## Pull Request Process

1. **Update your fork**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your branch**

   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**

   - Go to GitHub and create a PR from your branch
   - Fill out the PR template completely
   - Link any related issues

4. **PR Requirements**

   - All CI checks must pass
   - At least one approval from a maintainer
   - No merge conflicts
   - Updated documentation if needed

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)

## Related Issues
Closes #123
```

## Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Define proper types for all function parameters and return values
- Avoid `any` type - use `unknown` if necessary
- Use interfaces for object shapes, types for unions

```typescript
// Good
interface ComponentProps {
  id: string;
  name: string;
  styles: ComponentStyles;
}

function renderComponent(props: ComponentProps): JSX.Element {
  // ...
}

// Avoid
function renderComponent(props: any) {
  // ...
}
```

### React Components

- Use functional components with hooks
- Use proper prop types
- Keep components focused and small
- Extract reusable logic into custom hooks

```typescript
// Good
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', onClick, children }: ButtonProps) {
  return (
    <button className={cn('btn', `btn-${variant}`)} onClick={onClick}>
      {children}
    </button>
  );
}
```

### File Organization

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── ui/          # Base UI components
│   └── editor/      # Editor-specific components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── stores/          # Zustand stores
├── types/           # TypeScript types
└── __tests__/       # Test files
```

### Naming Conventions

- **Files**: `kebab-case.ts` or `kebab-case.tsx`
- **Components**: `PascalCase`
- **Functions**: `camelCase`
- **Constants**: `SCREAMING_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`

## Testing Guidelines

### Test Structure

```typescript
describe('ComponentName', () => {
  describe('feature or behavior', () => {
    it('should do something specific', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### What to Test

- Component rendering
- User interactions
- State changes
- Edge cases
- Error handling

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run tests with coverage
pnpm test:coverage
```

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(editor): add drag and drop support
fix(ai): handle API rate limit errors
docs: update installation instructions
test(store): add editor store tests
```

## Issue Guidelines

### Bug Reports

Please include:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (browser, OS, Node version)
- Screenshots or error logs

### Feature Requests

Please include:

- Clear description of the feature
- Use case and motivation
- Possible implementation approach
- Mockups or examples (if applicable)

## Questions?

If you have questions, feel free to:

- Open a [Discussion](https://github.com/ddefi0175-netizen/webbuilder/discussions)
- Check existing [Issues](https://github.com/ddefi0175-netizen/webbuilder/issues)

Thank you for contributing! 🎉

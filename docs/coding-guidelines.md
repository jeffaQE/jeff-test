# Coding Guidelines

## Code Quality Principles

### DRY (Don't Repeat Yourself)
- Extract repeated code into reusable functions or components
- Use utility functions for common operations
- Create shared constants for values used in multiple places
- Leverage component composition in React to avoid duplication

### SOLID Principles
- **Single Responsibility**: Each function/component should have one clear purpose
- **Open/Closed**: Code should be open for extension but closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for their base types
- **Interface Segregation**: Keep interfaces focused and minimal
- **Dependency Inversion**: Depend on abstractions, not concrete implementations

### Code Clarity
- Write self-documenting code with clear, descriptive names
- Use meaningful variable and function names that convey intent
- Keep functions small and focused (ideally under 50 lines)
- Avoid deep nesting (maximum 3-4 levels)
- Comment complex logic, but prefer clear code over comments

## Code Formatting

### General Formatting
- Use 2 spaces for indentation (not tabs)
- Maximum line length of 100 characters
- Use consistent bracket style (opening brace on same line)
- Add trailing commas in multi-line arrays and objects
- One statement per line

### JavaScript/React Specific
- Use semicolons consistently
- Prefer single quotes for strings (except JSX attributes)
- Use template literals for string interpolation
- Destructure props and objects when appropriate
- Use arrow functions for callbacks and functional components

### Example:
```javascript
// Good
const TodoItem = ({ task, onComplete, onDelete }) => {
  const handleComplete = () => {
    onComplete(task.id);
  };

  return (
    <div className="todo-item">
      <span>{task.title}</span>
      <button onClick={handleComplete}>Complete</button>
    </div>
  );
};

// Avoid
function TodoItem(props) {
  return <div className="todo-item"><span>{props.task.title}</span><button onClick={() => props.onComplete(props.task.id)}>Complete</button></div>
}
```

## Import Organization

### Import Order
1. External libraries (React, third-party packages)
2. Internal utilities and helpers
3. Components
4. Constants and types
5. Styles

### Import Style
- Use named imports when possible
- Group related imports together
- Sort imports alphabetically within each group
- Remove unused imports

### Example:
```javascript
// External libraries
import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';

// Internal utilities
import { formatDate, validateInput } from '../utils/helpers';
import { API_ENDPOINTS } from '../utils/constants';

// Components
import TodoItem from './TodoItem';
import TodoList from './TodoList';

// Styles
import './App.css';
```

## Linting and Code Quality Tools

### ESLint
- Use ESLint to enforce code quality standards
- Configure ESLint with recommended rules for JavaScript and React
- Run linter before committing code
- Fix all linting errors before submitting pull requests

### Prettier
- Use Prettier for consistent code formatting
- Configure Prettier to work alongside ESLint
- Enable format on save in your editor
- Run Prettier on all files before committing

### Configuration
```bash
# Run linter
npm run lint

# Fix auto-fixable linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## Best Practices

### Error Handling
- Always handle errors gracefully
- Provide meaningful error messages to users
- Log errors for debugging purposes
- Use try-catch blocks for async operations
- Validate input data before processing

### Performance
- Avoid unnecessary re-renders in React (use React.memo, useMemo, useCallback)
- Lazy load components and routes when appropriate
- Optimize images and assets
- Minimize bundle size
- Use pagination for large data sets

### Security
- Never commit sensitive data (API keys, passwords)
- Sanitize user input to prevent XSS attacks
- Use environment variables for configuration
- Keep dependencies up to date
- Follow OWASP security guidelines

### State Management
- Keep state as local as possible
- Lift state up only when necessary
- Use context for global state sparingly
- Consider state management libraries for complex apps
- Avoid prop drilling by using composition

### Naming Conventions
- **Variables**: camelCase (e.g., `taskList`, `isComplete`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`, `MAX_TASKS`)
- **Components**: PascalCase (e.g., `TodoList`, `TaskItem`)
- **Functions**: camelCase with verb prefix (e.g., `getTasks`, `handleSubmit`)
- **Files**: Match component name or use kebab-case for utilities

### Comments and Documentation
- Write JSDoc comments for public functions and components
- Document complex algorithms or business logic
- Keep comments up to date with code changes
- Avoid obvious comments that just restate the code
- Use TODO comments for future improvements

### Version Control
- Write clear, descriptive commit messages
- Make small, focused commits
- Use conventional commit format (feat:, fix:, docs:, etc.)
- Review your own changes before creating pull requests
- Keep pull requests focused on a single feature or fix

## Code Review Standards

### Before Submitting
- Run all tests and ensure they pass
- Run linter and fix all issues
- Format code with Prettier
- Review your own changes
- Update documentation if needed

### During Review
- Be respectful and constructive
- Focus on code quality and maintainability
- Suggest improvements, don't just point out problems
- Explain reasoning behind suggestions
- Be open to feedback and discussion

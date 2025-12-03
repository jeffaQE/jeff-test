# UI Guidelines

## Design System

### Component Library
- **Material UI**: Use Material-UI (MUI) components as the primary component library
- Leverage MUI's built-in components for consistency and accessibility

### Color Palette

#### Primary Colors
- **Slalom Blue**: `#00205B` (Primary brand color)
- **Slalom Blue Light**: `#0047AB` (Hover states, accents)
- **Slalom Blue Dark**: `#001840` (Active states, text)

#### Secondary Colors
- **White**: `#FFFFFF` (Backgrounds, text on dark)
- **Light Gray**: `#F5F5F5` (Backgrounds, borders)
- **Medium Gray**: `#9E9E9E` (Secondary text, disabled states)
- **Dark Gray**: `#424242` (Primary text)

### Button Styles

#### Primary Button
- Background: Slalom Blue (`#00205B`)
- Text: White
- Hover: Slalom Blue Light (`#0047AB`)
- Active: Slalom Blue Dark (`#001840`)
- Disabled: Medium Gray with reduced opacity

#### Secondary Button
- Outlined style with Slalom Blue border
- Text: Slalom Blue
- Hover: Light blue background with Slalom Blue border
- Active: Slightly darker background

#### Text Button
- Text: Slalom Blue
- No background
- Hover: Light blue background
- Use sparingly for tertiary actions

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance
- Maintain minimum contrast ratio of 4.5:1 for normal text
- Maintain minimum contrast ratio of 3:1 for large text (18pt+)
- All interactive elements must be keyboard accessible

### Keyboard Navigation
- All interactive elements must be reachable via Tab key
- Provide visible focus indicators on all interactive elements
- Support Escape key to close modals and dialogs

### Screen Reader Support
- Use semantic HTML elements (button, nav, main, etc.)
- Provide meaningful alt text for images
- Use ARIA labels where necessary for dynamic content
- Ensure form inputs have associated labels

### Interactive Elements
- Minimum touch target size of 44x44 pixels
- Provide clear hover and focus states
- Ensure sufficient spacing between interactive elements

### Color and Contrast
- Do not rely on color alone to convey information
- Ensure text has sufficient contrast against backgrounds
- Test with color blindness simulators

### Forms
- Label all form inputs clearly
- Provide error messages that are descriptive and actionable
- Use ARIA live regions for dynamic validation messages
- Group related form elements with fieldset and legend

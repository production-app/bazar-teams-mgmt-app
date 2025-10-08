# Team Management Application

A comprehensive team management application built with Next.js, React, TypeScript, and Zustand.

## Features

- Create, edit, and delete teams
- Search and filter teams by name, code, or entity
- Sort teams by various fields
- Client-side pagination
- Form validation with Zod
- Accessible UI with ARIA attributes
- Comprehensive test coverage

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

\`\`\`bash

# Install dependencies

npm install

# Run development server

npm run dev

# Run tests

npm test

# Run tests in watch mode

npm test:watch

# Generate coverage report

npm test:coverage
\`\`\`

## Testing

This project uses Jest and React Testing Library for unit testing. Tests cover:

- **Store Logic**: Zustand store actions and state management
- **Form Components**: Create and edit team modals with validation
- **Table Logic**: Sorting, filtering, pagination, and ARIA compliance
- **Schema Validation**: Zod schema validation rules

### Running Tests

\`\`\`bash

# Run all tests

npm test

# Run tests in watch mode

npm test:watch

# Generate coverage report

npm test:coverage
\`\`\`

### Test Coverage

The test suite includes:

- Store operations (CRUD, filtering, sorting)
- Form validation and submission
- User interactions (clicks, typing, selections)
- Accessibility features (ARIA attributes, keyboard navigation)
- Edge cases and error handling

## Accessibility

The application follows WCAG 2.1 guidelines and includes:

- Proper ARIA roles and attributes
- Keyboard navigation support
- Screen reader announcements
- Focus management in modals
- Semantic HTML structure

## Tech Stack

- **Framework**: Next.js 15
- **UI Library**: React 19
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI/ Schdcn UI
- **Testing**: Jest + React Testing Library
- **Icons**: Lucide React

## License

MIT

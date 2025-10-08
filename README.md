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
- pnpm (recommended) or npm

### Installation

\`\`\`bash

# Install dependencies

pnpm install

# Run development server

pnpm dev

# Run tests

pnpm test

# Run tests in watch mode

pnpm test:watch

# Generate coverage report

pnpm test:coverage

## Project Structure

```
📁 team-management/
├── 📁 app/ # Next.js app directory
│ ├── layout.tsx # Root layout with theme provider
│ ├── page.tsx # Main page with teams table
│ └── globals.css # Global styles and Tailwind config
├── 📁 components/ # React components
│ ├── 📁 ui/ # Reusable UI components (shadcn/ui)
│ ├── teams-table.tsx # Main data table with CRUD operations
│ ├── create-team-modal.tsx # Create team form modal
│ ├── edit-team-modal.tsx # Edit team form modal
│ ├── delete-confirm-modal.tsx # Delete confirmation dialog
│ ├── confirm-modal.tsx # Generic confirmation dialog
│ ├── notification-modal.tsx # Success notification dialog
│ ├── header.tsx # Application header
│ ├── sub-header.tsx # Sub-header with actions
│ └── breadcrumb-nav.tsx # Breadcrumb navigation
├── 📁 lib/ # Core application logic
│ ├── 📁 store/
│ │ └── teams-store.ts # Zustand state management
│ ├── 📁 schemas/
│ │ └── team-schema.ts # Zod validation schemas
│ ├── types.ts # TypeScript type definitions
│ ├── teams-data.ts # Mock data generator
│ └── utils.ts # Utility functions
├── 📁 **tests**/ # Test files
│ ├── 📁 components/ # Component tests
│ └── 📁 lib/ # Logic and store tests
└── 📁 hooks/ # Custom React hooks
```

## State Management Approach

This application uses **Zustand** for state management, providing a simple and performant solution for managing global state.

### Store Architecture

The `teams-store.ts` implements a centralized store with the following structure:

#### State

- `teams`: Array of all teams (source of truth)
- `filteredTeams`: Computed array after filtering and sorting
- `isLoading`: Loading state for async operations
- `searchQuery`: Current search filter
- `sortField`: Active sort column
- `sortOrder`: Sort direction (asc/desc)
- `selectedEntity`: Entity filter selection

#### Actions

- `fetchTeams()`: Load initial team data (simulates API call)
- `createTeam(team)`: Add a new team
- `updateTeam(id, data)`: Update existing team
- `deleteTeam(id)`: Remove a team
- `setSearchQuery(query)`: Update search filter
- `setSortField(field)`: Change sort column
- `setSelectedEntity(entity)`: Update entity filter
- `filterAndSortTeams()`: Recompute filtered/sorted results

### State Flow

1. **Initial Load**: `fetchTeams()` generates mock data and populates the store
2. **User Actions**: CRUD operations update the `teams` array
3. **Filtering/Sorting**: `filterAndSortTeams()` recomputes `filteredTeams`
4. **UI Updates**: Components subscribe to store changes and re-render automatically

### Benefits of This Approach

- **Single Source of Truth**: All team data lives in one place
- **Automatic Re-renders**: Components update when subscribed state changes
- **Computed State**: Filtering/sorting is derived from base data
- **Type Safety**: Full TypeScript support with type inference
- **Minimal Boilerplate**: No actions, reducers, or providers needed

## Mock API Simulation

The application uses mock data and simulated API delays to demonstrate real-world behavior.

### Current Implementation

All CRUD operations in `teams-store.ts` include:

- **500ms delay**: Simulates network latency
- **Loading states**: `isLoading` flag for UI feedback
- **Success scenarios**: All operations succeed by default

```typescript
// Example: Create team with simulated delay
createTeam: async (teamData) => {
  set({ isLoading: true });
  await delay(500); // Simulate API call
  const newTeam = { ...teamData, id: `team-${Date.now()}` };
  set((state) => ({
    teams: [...state.teams, newTeam],
    isLoading: false,
  }));
  get().filterAndSortTeams();
};
```

### Simulating Failures

To test error handling and failure scenarios, you can modify the store actions:

#### 1. Random Failures

Add random failure logic to any action:

\`\`\`typescript
createTeam: async (teamData) => {
set({ isLoading: true })
await delay(500)

// Simulate 30% failure rate
if (Math.random() < 0.3) {
set({ isLoading: false })
throw new Error("Failed to create team")
}

// ... rest of success logic
}
\`\`\`

#### 2. Conditional Failures

Fail based on specific conditions:

\`\`\`typescript
updateTeam: async (id, teamData) => {
set({ isLoading: true })
await delay(500)

// Fail if team name is too short
if (teamData.name && teamData.name.length < 3) {
set({ isLoading: false })
throw new Error("Team name must be at least 3 characters")
}

// ... rest of success logic
}
\`\`\`

#### 3. Network Timeout Simulation

Simulate slow or timeout scenarios:

\`\`\`typescript
deleteTeam: async (id) => {
set({ isLoading: true })

// Simulate very slow network (5 seconds)
await delay(5000)

// Or simulate timeout
const timeout = new Promise((\_, reject) =>
setTimeout(() => reject(new Error("Request timeout")), 3000)
)

try {
await Promise.race([delay(5000), timeout])
// ... rest of success logic
} catch (error) {
set({ isLoading: false })
throw error
}
}
\`\`\`

#### 4. Specific Error Codes

Simulate different HTTP error responses:

\`\`\`typescript
fetchTeams: async () => {
set({ isLoading: true })
await delay(500)

// Simulate different error scenarios
const errorType = Math.random()

if (errorType < 0.1) {
set({ isLoading: false })
throw new Error("401: Unauthorized")
} else if (errorType < 0.2) {
set({ isLoading: false })
throw new Error("500: Internal Server Error")
}

// ... rest of success logic
}
\`\`\`

### Testing Error Handling

Once you've added failure simulation, test the UI behavior:

1. **Loading States**: Verify spinners/disabled states appear
2. **Error Messages**: Check that errors are displayed to users
3. **Retry Logic**: Test if users can retry failed operations
4. **Data Integrity**: Ensure failed operations don't corrupt state

### Adding Error Handling to Components

To handle errors in components, wrap store actions in try-catch:

\`\`\`typescript
const handleSubmit = async (data: TeamFormData) => {
try {
await createTeam(data)
setShowNotification(true)
} catch (error) {
console.error("Failed to create team:", error)
// Show error toast or message to user
}
}
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

pnpm test

# Run tests in watch mode

pnpm test:watch

# Generate coverage report

pnpm test:coverage
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
- **UI Components**: Radix UI
- **Testing**: Jest + React Testing Library
- **Icons**: Lucide React

## License

MIT

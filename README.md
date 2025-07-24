# Quebec Immigration Points Calculator

A web application for calculating immigration points for the Quebec Skilled Worker Program based on official government regulations (85952.pdf and 86001.pdf from 2025).

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build the project
pnpm build

# Run tests
pnpm test

# Run linting
pnpm lint

# Type check
pnpm type-check
```

## Project Structure

This is a monorepo containing two packages:

- **`packages/rules`**: Pure TypeScript library implementing all point calculation logic
- **`packages/frontend`**: React application providing the user interface

## Development

### Prerequisites
- Node.js >= 20
- pnpm >= 9.1.4

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

The application will be available at http://localhost:3000

### Available Scripts

All commands should be run from the project root:

- `pnpm dev` - Start the development server for the frontend
- `pnpm build` - Build all packages for production
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all packages
- `pnpm lint:fix` - Fix linting issues
- `pnpm type-check` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

### Building for Production

```bash
pnpm build
```

The built application will be in `packages/frontend/dist/`

## Features

- Calculate points across 3 main criteria groups:
  - Capital Human (max 520 points)
  - Labour Market Needs & Government Priorities (max 700 points)
  - Adaptation Factors (max 180 points)
- Support for applicant with or without spouse
- Real-time point calculation
- Detailed breakdown of points by category
- Input validation based on official constraints
- No backend dependencies - runs entirely in the browser

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## Architecture

The application follows a clean architecture with:
- **Rules Package**: Contains all business logic, validation, and types
- **Frontend Package**: Handles UI and user interactions, imports rules for calculations

This separation ensures the calculation logic can be easily tested and potentially reused in other contexts.

## LLM Guidance

See [CLAUDE.md](./CLAUDE.md) for AI assistant guidance and coding standards.

## License

This project is based on official Quebec government regulations.
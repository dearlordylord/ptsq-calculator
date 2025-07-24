# @ptsq-calculator/frontend

React application for Quebec immigration points calculator.

# @vibe-generated

## Overview

This package provides the user interface for the Quebec immigration points calculator. It imports the `@ptsq-calculator/rules` package for all calculation logic.

## Installation

This package is part of the monorepo and doesn't need separate installation. From the project root:

```bash
pnpm install
```

## Development

### Start Development Server

From the project root:
```bash
pnpm dev
```

The application will be available at http://localhost:3000

### Build

From the project root:
```bash
pnpm build
```

Or just this package:
```bash
pnpm --filter @ptsq-calculator/frontend build
```

The built application will be in `packages/frontend/dist/`

### Test

From the project root:
```bash
pnpm test
```

Or just this package:
```bash
pnpm --filter @ptsq-calculator/frontend test
```

## Features

- Complete forms for applicant and spouse information
- Real-time point calculation
- Detailed breakdown of points by category:
  - Capital Human (French, Age, Experience, Education)
  - Labour Market Needs & Government Priorities
  - Adaptation Factors
- Input validation with helpful error messages
- Responsive design for desktop and mobile
- No backend required - runs entirely in the browser

## Project Structure

```
src/
├── App.tsx                 # Main application component
├── components/
│   ├── ApplicantForm.tsx  # Form for applicant data
│   ├── SpouseForm.tsx     # Form for spouse data
│   └── ResultsDisplay.tsx # Points calculation results
├── index.css              # Application styles
└── main.tsx               # Application entry point
```

## Deployment

The built application is a static site that can be deployed to any static hosting service:

1. Build the project: `pnpm build`
2. Deploy the contents of `packages/frontend/dist/`

Compatible with:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static file server

## License

Based on official Quebec government regulations.
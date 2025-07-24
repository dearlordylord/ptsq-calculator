# @ptsq-calculator/rules

Pure TypeScript library implementing Quebec immigration point calculation logic.

# @vibe-generated

## Overview

This package contains all the business logic for calculating Quebec immigration points according to official government regulations (85952.pdf and 86001.pdf from 2025).

## Installation

This package is part of the monorepo and doesn't need separate installation. From the project root:

```bash
pnpm install
```

## Usage

```typescript
import { calculatePoints, decodeCalculatorInput } from '@ptsq-calculator/rules';
import { Either } from 'effect';

const input = {
  applicant: {
    age: 30,
    educationLevel: "university_1st_cycle_3_4_years",
    workExperienceMonths: 48,
    frenchAbilities: {
      oralComprehension: 9,
      oralProduction: 9,
      writtenComprehension: 9,
      writtenProduction: 9
    },
    // ... other required fields
  },
  spouse: undefined // or spouse data
};

// Validate input
const decoded = decodeCalculatorInput(input);

if (Either.isRight(decoded)) {
  const result = calculatePoints(decoded.right);
  console.log(`Total points: ${result.totalPoints}`);
  console.log(`Capital Human: ${result.categoryPoints.capitalHuman}`);
  console.log(`Labour Market: ${result.categoryPoints.labourMarketNeeds}`);
  console.log(`Adaptation: ${result.categoryPoints.adaptationFactors}`);
}
```

## Development

### Build

From the project root:
```bash
pnpm build
```

Or just this package:
```bash
pnpm --filter @ptsq-calculator/rules build
```

### Test

From the project root:
```bash
pnpm test
```

Or just this package:
```bash
pnpm --filter @ptsq-calculator/rules test
```

### Type Check

From the project root:
```bash
pnpm type-check
```

## API

### Types

- `ApplicantInput` - Input data for the main applicant
- `SpouseInput` - Input data for the spouse (if applicable)
- `CalculatorInput` - Combined input with applicant and optional spouse
- `CalculationResult` - Result with total points and detailed breakdown

### Constants

- `FRENCH_LEVELS` - Valid French language levels (1-12)
- `EDUCATION_LEVELS` - Valid education level values
- `LABOUR_MARKET_DIAGNOSIS_VALUES` - Valid labour market categories
- `JOB_OFFER_LOCATIONS` - Valid job offer locations

### Functions

- `calculatePoints(input: CalculatorInput): CalculationResult` - Main calculation function
- `decodeCalculatorInput(input: unknown): Either<ParseError, CalculatorInput>` - Validate and decode input

## Testing

The package includes comprehensive tests covering:
- All point categories and subcategories
- Edge cases and boundary conditions
- Maximum points validation
- Single applicant and applicant with spouse scenarios

Run tests with:
```bash
pnpm test
```

## License

Based on official Quebec government regulations.
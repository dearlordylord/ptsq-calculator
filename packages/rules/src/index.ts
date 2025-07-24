export {
  FrenchLevel,
  EducationLevel,
  LabourMarketDiagnosis,
  JobOfferLocation,
  Months,
  Age,
  FrenchAbilities,
  ApplicantInput,
  SpouseInput,
  CalculatorInput,
  CategoryPoints,
  DetailedPoints,
  CalculationResult,
  decodeCalculatorInput,
  encodeCalculationResult
} from "./types-interface.js";

export { calculatePoints } from "./calculator.js";

// Export the constant arrays for testing and other uses
export { FRENCH_LEVELS, EDUCATION_LEVELS, LABOUR_MARKET_DIAGNOSIS_VALUES, JOB_OFFER_LOCATIONS } from "./types-interface.js";
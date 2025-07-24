import { Schema } from "effect";

export const FRENCH_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export const FrenchLevel = Schema.Literal(...FRENCH_LEVELS);
export type FrenchLevel = Schema.Schema.Type<typeof FrenchLevel>;

export const EDUCATION_LEVELS = [
  "none",
  "general_secondary",
  "professional_secondary_600_899",
  "professional_secondary_900_plus",
  "professional_secondary_1_year_non_qc",
  "postsecondary_general_2_years",
  "postsecondary_technical_900_plus",
  "postsecondary_technical_1_2_years_non_qc",
  "postsecondary_technical_3_years",
  "university_1st_cycle_1_year",
  "university_1st_cycle_2_years",
  "university_1st_cycle_3_4_years",
  "university_1st_cycle_5_plus_years",
  "university_2nd_cycle_1_year",
  "university_2nd_cycle_2_plus_years",
  "medical_specialization_2_plus_years",
  "university_3rd_cycle"
] as const;
export const EducationLevel = Schema.Literal(...EDUCATION_LEVELS);
export type EducationLevel = Schema.Schema.Type<typeof EducationLevel>;

export const LABOUR_MARKET_DIAGNOSIS_VALUES = [
  "balanced",
  "slight_shortage", 
  "shortage"
] as const;
export const LabourMarketDiagnosis = Schema.Literal(...LABOUR_MARKET_DIAGNOSIS_VALUES);
export type LabourMarketDiagnosis = Schema.Schema.Type<typeof LabourMarketDiagnosis>;

export const JOB_OFFER_LOCATIONS = [
  "inside_montreal",
  "outside_montreal"
] as const;
export const JobOfferLocation = Schema.Literal(...JOB_OFFER_LOCATIONS);
export type JobOfferLocation = Schema.Schema.Type<typeof JobOfferLocation>;

export const Months = Schema.Number.pipe(
  Schema.nonNegative(),
  Schema.int(),
  Schema.annotations({ description: "Number of months (non-negative integer)" })
);
export type Months = Schema.Schema.Type<typeof Months>;

export const Age = Schema.Number.pipe(
  Schema.nonNegative(),
  Schema.int(),
  Schema.annotations({ description: "Age in years (non-negative integer)" })
);
export type Age = Schema.Schema.Type<typeof Age>;

export const FrenchAbilities = Schema.Struct({
  oralComprehension: FrenchLevel,
  oralProduction: FrenchLevel,
  writtenComprehension: FrenchLevel,
  writtenProduction: FrenchLevel
});
export type FrenchAbilities = Schema.Schema.Type<typeof FrenchAbilities>;

export const ApplicantInput = Schema.Struct({
  age: Age,
  educationLevel: EducationLevel,
  workExperienceMonths: Months,
  frenchAbilities: FrenchAbilities,
  labourMarketDiagnosis: LabourMarketDiagnosis,
  workExperiencePrincipalProfessionMonths: Months,
  quebecDiploma: Schema.optional(EducationLevel),
  workExperienceQuebecMonths: Months,
  residenceOutsideMontrealMonths: Months,
  validatedJobOffer: Schema.optional(JobOfferLocation),
  authorizationToPractice: Schema.Boolean,
  studyStayQuebecCompletedMonths: Months,
  studyStayQuebecOngoingMonths: Months,
  hasFamilyInQuebec: Schema.Boolean,
  intendsToResideOutsideMontreal: Schema.Boolean
});
export type ApplicantInput = Schema.Schema.Type<typeof ApplicantInput>;

export const SpouseInput = Schema.Struct({
  frenchAbilities: FrenchAbilities,
  age: Age,
  workExperienceQuebecMonths: Months,
  educationLevel: EducationLevel,
  quebecDiploma: Schema.optional(EducationLevel),
  hasFamilyInQuebec: Schema.Boolean
});
export type SpouseInput = Schema.Schema.Type<typeof SpouseInput>;

export const CalculatorInput = Schema.Struct({
  applicant: ApplicantInput,
  spouse: Schema.optional(SpouseInput)
});
export type CalculatorInput = Schema.Schema.Type<typeof CalculatorInput>;

export const CategoryPoints = Schema.Struct({
  capitalHuman: Schema.Number,
  labourMarketNeeds: Schema.Number,
  adaptationFactors: Schema.Number
});
export type CategoryPoints = Schema.Schema.Type<typeof CategoryPoints>;

export const DetailedPoints = Schema.Struct({
  capitalHuman: Schema.Struct({
    frenchKnowledge: Schema.Number,
    age: Schema.Number,
    workExperience: Schema.Number,
    educationLevel: Schema.Number,
    total: Schema.Number
  }),
  labourMarketNeeds: Schema.Struct({
    labourMarketDiagnosis: Schema.Number,
    quebecDiploma: Schema.Number,
    workExperienceQuebec: Schema.Number,
    residenceOutsideMontreal: Schema.Number,
    validatedJobOffer: Schema.Number,
    authorizationToPractice: Schema.Number,
    total: Schema.Number
  }),
  adaptationFactors: Schema.Struct({
    studyStayCompleted: Schema.Number,
    studyStayOngoing: Schema.Number,
    familyMember: Schema.Number,
    spouseFrench: Schema.Number,
    spouseAge: Schema.Number,
    spouseWorkExperienceQuebec: Schema.Number,
    spouseEducation: Schema.Number,
    spouseQuebecDiploma: Schema.Number,
    total: Schema.Number
  })
});
export type DetailedPoints = Schema.Schema.Type<typeof DetailedPoints>;

export const CalculationResult = Schema.Struct({
  totalPoints: Schema.Number,
  categoryPoints: CategoryPoints,
  detailedPoints: DetailedPoints,
  hasSpouse: Schema.Boolean
});
export type CalculationResult = Schema.Schema.Type<typeof CalculationResult>;

export const decodeCalculatorInput = Schema.decodeUnknownEither(CalculatorInput);
export const encodeCalculationResult = Schema.encodeEither(CalculationResult);
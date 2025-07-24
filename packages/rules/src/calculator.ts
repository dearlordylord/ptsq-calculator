import type {
  CalculatorInput,
  CalculationResult,
  FrenchLevel,
  EducationLevel,
  Months,
  Age,
  LabourMarketDiagnosis
} from "./types-interface.js";

const getFrenchPoints = (level: FrenchLevel, isSpouse: boolean): number => {
  if (!isSpouse) {
    // Applicant scoring according to official 2025 rules
    if (level >= 1 && level <= 4) return 0;
    if (level >= 5 && level <= 6) return 38;
    if (level >= 7 && level <= 8) return 44;
    if (level >= 9 && level <= 12) return 50;
  } else {
    // Spouse scoring according to official 2025 rules  
    if (level >= 1 && level <= 4) return 0;
    if (level >= 5 && level <= 6) return 30;
    if (level >= 7 && level <= 8) return 35;
    if (level >= 9 && level <= 12) return 40;
  }
  return 0;
};

const getSpouseFrenchAdaptationPoints = (level: FrenchLevel): number => {
  if (level >= 1 && level <= 3) return 0;
  if (level === 4) return 4;
  if (level >= 5 && level <= 6) return 6;
  if (level >= 7 && level <= 8) return 8;
  if (level >= 9 && level <= 12) return 10;
  return 0;
};

const getAgePoints = (age: Age, hasSpouse: boolean): number => {
  const ageRanges = hasSpouse ? [
    { min: 18, max: 19, points: 90 },
    { min: 20, max: 30, points: 100 },
    { min: 31, max: 31, points: 95 },
    { min: 32, max: 32, points: 90 },
    { min: 33, max: 33, points: 81 },
    { min: 34, max: 34, points: 72 },
    { min: 35, max: 35, points: 68 },
    { min: 36, max: 36, points: 63 },
    { min: 37, max: 37, points: 59 },
    { min: 38, max: 38, points: 54 },
    { min: 39, max: 39, points: 50 },
    { min: 40, max: 40, points: 45 },
    { min: 41, max: 41, points: 36 },
    { min: 42, max: 42, points: 27 },
    { min: 43, max: 43, points: 18 },
    { min: 44, max: 44, points: 9 }
  ] : [
    { min: 18, max: 19, points: 110 },
    { min: 20, max: 30, points: 120 },
    { min: 31, max: 31, points: 110 },
    { min: 32, max: 32, points: 100 },
    { min: 33, max: 33, points: 90 },
    { min: 34, max: 34, points: 80 },
    { min: 35, max: 35, points: 75 },
    { min: 36, max: 36, points: 70 },
    { min: 37, max: 37, points: 65 },
    { min: 38, max: 38, points: 60 },
    { min: 39, max: 39, points: 55 },
    { min: 40, max: 40, points: 50 },
    { min: 41, max: 41, points: 40 },
    { min: 42, max: 42, points: 30 },
    { min: 43, max: 43, points: 20 },
    { min: 44, max: 44, points: 10 }
  ];

  for (const range of ageRanges) {
    if (age >= range.min && age <= range.max) return range.points;
  }
  return 0;
};

const getSpouseAgeAdaptationPoints = (age: Age): number => {
  const ageRanges = [
    { min: 16, max: 19, points: 18 },
    { min: 20, max: 30, points: 20 },
    { min: 31, max: 31, points: 18 },
    { min: 32, max: 32, points: 17 },
    { min: 33, max: 33, points: 16 },
    { min: 34, max: 34, points: 15 },
    { min: 35, max: 35, points: 14 },
    { min: 36, max: 36, points: 12 },
    { min: 37, max: 37, points: 10 },
    { min: 38, max: 38, points: 8 },
    { min: 39, max: 39, points: 7 },
    { min: 40, max: 40, points: 6 },
    { min: 41, max: 41, points: 5 },
    { min: 42, max: 42, points: 4 },
    { min: 43, max: 43, points: 3 },
    { min: 44, max: 44, points: 2 }
  ];

  for (const range of ageRanges) {
    if (age >= range.min && age <= range.max) return range.points;
  }
  return 0;
};

const getWorkExperiencePoints = (months: Months, hasSpouse: boolean): number => {
  if (months < 12) return 0;
  if (months >= 12 && months <= 23) return hasSpouse ? 15 : 20;
  if (months >= 24 && months <= 35) return hasSpouse ? 30 : 40;
  if (months >= 36 && months <= 47) return hasSpouse ? 35 : 50;
  if (months >= 48) return hasSpouse ? 50 : 70;
  return 0;
};

const getEducationPoints = (level: EducationLevel, isSpouse: boolean): number => {
  const points: Record<EducationLevel, { applicant: number; spouse: number }> = {
    "none": { applicant: 0, spouse: 0 },
    "general_secondary": { applicant: 13, spouse: 11 },
    "professional_secondary_600_899": { applicant: 13, spouse: 11 },
    "professional_secondary_900_plus": { applicant: 26, spouse: 22 },
    "professional_secondary_1_year_non_qc": { applicant: 26, spouse: 22 },
    "postsecondary_general_2_years": { applicant: 39, spouse: 33 },
    "postsecondary_technical_900_plus": { applicant: 52, spouse: 44 },
    "postsecondary_technical_1_2_years_non_qc": { applicant: 52, spouse: 44 },
    "postsecondary_technical_3_years": { applicant: 78, spouse: 66 },
    "university_1st_cycle_1_year": { applicant: 78, spouse: 66 },
    "university_1st_cycle_2_years": { applicant: 91, spouse: 77 },
    "university_1st_cycle_3_4_years": { applicant: 104, spouse: 88 },
    "university_1st_cycle_5_plus_years": { applicant: 110, spouse: 93 },
    "university_2nd_cycle_1_year": { applicant: 110, spouse: 93 },
    "university_2nd_cycle_2_plus_years": { applicant: 117, spouse: 99 },
    "medical_specialization_2_plus_years": { applicant: 130, spouse: 110 },
    "university_3rd_cycle": { applicant: 130, spouse: 110 }
  };

  return isSpouse ? points[level].spouse : points[level].applicant;
};

const getSpouseEducationAdaptationPoints = (level: EducationLevel): number => {
  const points: Record<EducationLevel, number> = {
    "none": 0,
    "general_secondary": 2,
    "professional_secondary_600_899": 2,
    "professional_secondary_900_plus": 4,
    "professional_secondary_1_year_non_qc": 4,
    "postsecondary_general_2_years": 6,
    "postsecondary_technical_900_plus": 8,
    "postsecondary_technical_1_2_years_non_qc": 8,
    "postsecondary_technical_3_years": 12,
    "university_1st_cycle_1_year": 12,
    "university_1st_cycle_2_years": 14,
    "university_1st_cycle_3_4_years": 16,
    "university_1st_cycle_5_plus_years": 17,
    "university_2nd_cycle_1_year": 17,
    "university_2nd_cycle_2_plus_years": 18,
    "medical_specialization_2_plus_years": 20,
    "university_3rd_cycle": 20
  };

  return points[level];
};

const getLabourMarketPoints = (
  diagnosis: LabourMarketDiagnosis,
  months: Months
): number => {
  if (months < 12) return 0;

  const points: Record<LabourMarketDiagnosis, number[]> = {
    "balanced": [5, 10, 15, 25],
    "slight_shortage": [70, 80, 90, 100],
    "shortage": [90, 100, 110, 120]
  };

  const monthRanges = [
    { min: 12, max: 23, index: 0 },
    { min: 24, max: 35, index: 1 },
    { min: 36, max: 47, index: 2 },
    { min: 48, max: 60, index: 3 }
  ];

  for (const range of monthRanges) {
    if (months >= range.min && months <= range.max) {
      return points[diagnosis][range.index] || 0;
    }
  }
  
  if (months > 60) return points[diagnosis][3] || 0;
  return 0;
};

const getQuebecDiplomaPoints = (level: EducationLevel): number => {
  const points: Record<EducationLevel, number> = {
    "none": 0,
    "general_secondary": 20,
    "professional_secondary_600_899": 20,
    "professional_secondary_900_plus": 40,
    "professional_secondary_1_year_non_qc": 0,
    "postsecondary_general_2_years": 60,
    "postsecondary_technical_900_plus": 80,
    "postsecondary_technical_1_2_years_non_qc": 0,
    "postsecondary_technical_3_years": 120,
    "university_1st_cycle_1_year": 120,
    "university_1st_cycle_2_years": 140,
    "university_1st_cycle_3_4_years": 160,
    "university_1st_cycle_5_plus_years": 170,
    "university_2nd_cycle_1_year": 170,
    "university_2nd_cycle_2_plus_years": 180,
    "medical_specialization_2_plus_years": 200,
    "university_3rd_cycle": 200
  };

  return points[level];
};

const getSpouseQuebecDiplomaPoints = (level: EducationLevel): number => {
  const points: Record<EducationLevel, number> = {
    "none": 0,
    "general_secondary": 3,
    "professional_secondary_600_899": 3,
    "professional_secondary_900_plus": 6,
    "professional_secondary_1_year_non_qc": 0,
    "postsecondary_general_2_years": 9,
    "postsecondary_technical_900_plus": 12,
    "postsecondary_technical_1_2_years_non_qc": 0,
    "postsecondary_technical_3_years": 18,
    "university_1st_cycle_1_year": 18,
    "university_1st_cycle_2_years": 21,
    "university_1st_cycle_3_4_years": 24,
    "university_1st_cycle_5_plus_years": 25,
    "university_2nd_cycle_1_year": 25,
    "university_2nd_cycle_2_plus_years": 27,
    "medical_specialization_2_plus_years": 30,
    "university_3rd_cycle": 30
  };

  return points[level];
};

const getWorkExperienceQuebecPoints = (months: Months): number => {
  if (months < 12) return 0;
  if (months >= 12 && months <= 23) return 40;
  if (months >= 24 && months <= 35) return 80;
  if (months >= 36 && months <= 47) return 120;
  if (months >= 48 && months <= 60) return 160;
  if (months > 60) return 160;
  return 0;
};

const getSpouseWorkExperienceQuebecPoints = (months: Months): number => {
  if (months < 6) return 0;
  if (months >= 6 && months <= 11) return 5;
  if (months >= 12 && months <= 23) return 10;
  if (months >= 24 && months <= 35) return 15;
  if (months >= 36 && months <= 47) return 23;
  if (months >= 48 && months <= 60) return 30;
  if (months > 60) return 30;
  return 0;
};

const getResidenceOutsideMontrealPoints = (months: Months): number => {
  if (months < 6) return 0;
  if (months >= 6 && months <= 11) return 6;
  if (months >= 12 && months <= 23) return 16;
  if (months >= 24 && months <= 35) return 24;
  if (months >= 36 && months <= 47) return 32;
  if (months >= 48) return 40;
  return 0;
};

const getStudyStayCompletedPoints = (months: Months): number => {
  if (months < 6) return 0;
  if (months >= 6 && months <= 11) return 1;
  if (months >= 12 && months <= 23) return 3;
  if (months >= 24 && months <= 35) return 5;
  if (months >= 36 && months <= 47) return 8;
  if (months >= 48) return 10;
  return 0;
};

const getStudyStayOngoingPoints = (months: Months): number => {
  if (months < 6) return 0;
  if (months >= 6 && months <= 11) return 5;
  if (months >= 12 && months <= 23) return 12;
  if (months >= 24 && months <= 35) return 18;
  if (months >= 36 && months <= 47) return 24;
  if (months >= 48) return 30;
  return 0;
};

export const calculatePoints = (input: CalculatorInput): CalculationResult => {
  const hasSpouse = input.spouse !== undefined;
  const applicant = input.applicant;
  const spouse = input.spouse;

  const capitalHuman = {
    frenchKnowledge: 
      getFrenchPoints(applicant.frenchAbilities.oralComprehension, false) +
      getFrenchPoints(applicant.frenchAbilities.oralProduction, false) +
      getFrenchPoints(applicant.frenchAbilities.writtenComprehension, false) +
      getFrenchPoints(applicant.frenchAbilities.writtenProduction, false),
    age: getAgePoints(applicant.age, hasSpouse),
    workExperience: getWorkExperiencePoints(applicant.workExperienceMonths, hasSpouse),
    educationLevel: getEducationPoints(applicant.educationLevel, false),
    total: 0
  };
  capitalHuman.total = capitalHuman.frenchKnowledge + capitalHuman.age + 
    capitalHuman.workExperience + capitalHuman.educationLevel;

  const labourMarketNeeds = {
    labourMarketDiagnosis: getLabourMarketPoints(
      applicant.labourMarketDiagnosis,
      applicant.workExperiencePrincipalProfessionMonths
    ),
    quebecDiploma: applicant.quebecDiploma 
      ? getQuebecDiplomaPoints(applicant.quebecDiploma) 
      : 0,
    workExperienceQuebec: getWorkExperienceQuebecPoints(applicant.workExperienceQuebecMonths),
    residenceOutsideMontreal: getResidenceOutsideMontrealPoints(applicant.residenceOutsideMontrealMonths),
    validatedJobOffer: applicant.validatedJobOffer
      ? (applicant.validatedJobOffer === "outside_montreal" ? 50 : 30)
      : 0,
    authorizationToPractice: applicant.authorizationToPractice ? 50 : 0,
    total: 0
  };
  labourMarketNeeds.total = labourMarketNeeds.labourMarketDiagnosis +
    labourMarketNeeds.quebecDiploma + labourMarketNeeds.workExperienceQuebec +
    labourMarketNeeds.residenceOutsideMontreal + labourMarketNeeds.validatedJobOffer +
    labourMarketNeeds.authorizationToPractice;

  const adaptationFactors = {
    studyStayCompleted: getStudyStayCompletedPoints(applicant.studyStayQuebecCompletedMonths),
    studyStayOngoing: getStudyStayOngoingPoints(applicant.studyStayQuebecOngoingMonths),
    familyMember: 0,
    spouseFrench: 0,
    spouseAge: 0,
    spouseWorkExperienceQuebec: 0,
    spouseEducation: 0,
    spouseQuebecDiploma: 0,
    total: 0
  };

  if (applicant.hasFamilyInQuebec && applicant.intendsToResideOutsideMontreal) {
    adaptationFactors.familyMember = 10;
  }

  if (spouse) {
    adaptationFactors.spouseFrench = 
      getSpouseFrenchAdaptationPoints(spouse.frenchAbilities.oralComprehension) +
      getSpouseFrenchAdaptationPoints(spouse.frenchAbilities.oralProduction) +
      getSpouseFrenchAdaptationPoints(spouse.frenchAbilities.writtenComprehension) +
      getSpouseFrenchAdaptationPoints(spouse.frenchAbilities.writtenProduction);
    adaptationFactors.spouseAge = getSpouseAgeAdaptationPoints(spouse.age);
    adaptationFactors.spouseWorkExperienceQuebec = getSpouseWorkExperienceQuebecPoints(spouse.workExperienceQuebecMonths);
    adaptationFactors.spouseEducation = getSpouseEducationAdaptationPoints(spouse.educationLevel);
    adaptationFactors.spouseQuebecDiploma = spouse.quebecDiploma 
      ? getSpouseQuebecDiplomaPoints(spouse.quebecDiploma)
      : 0;

    if (spouse.hasFamilyInQuebec && applicant.intendsToResideOutsideMontreal) {
      adaptationFactors.familyMember = Math.max(adaptationFactors.familyMember, 5);
    }
  }

  adaptationFactors.total = adaptationFactors.studyStayCompleted +
    adaptationFactors.studyStayOngoing + adaptationFactors.familyMember +
    adaptationFactors.spouseFrench + adaptationFactors.spouseAge +
    adaptationFactors.spouseWorkExperienceQuebec + adaptationFactors.spouseEducation +
    adaptationFactors.spouseQuebecDiploma;

  const categoryPoints = {
    capitalHuman: capitalHuman.total,
    labourMarketNeeds: labourMarketNeeds.total,
    adaptationFactors: adaptationFactors.total
  };

  const totalPoints = categoryPoints.capitalHuman + 
    categoryPoints.labourMarketNeeds + 
    categoryPoints.adaptationFactors;

  return {
    totalPoints,
    categoryPoints,
    detailedPoints: {
      capitalHuman,
      labourMarketNeeds,
      adaptationFactors
    },
    hasSpouse
  };
};
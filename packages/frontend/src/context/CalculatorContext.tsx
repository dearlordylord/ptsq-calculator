import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Either } from 'effect';
import {
  calculatePoints,
  decodeCalculatorInput,
  type CalculatorInput,
  type CalculationResult,
  type ApplicantInput,
  type SpouseInput
} from '@ptsq-calculator/rules';

// State
interface CalculatorState {
  hasSpouse: boolean;
  applicant: Partial<ApplicantInput>;
  spouse: Partial<SpouseInput>;
  result: CalculationResult | null;
  showSummary: boolean;
}

// Actions
type CalculatorAction =
  | { type: 'SET_HAS_SPOUSE'; payload: boolean }
  | { type: 'UPDATE_APPLICANT_FIELD'; payload: { field: keyof ApplicantInput; value: any } }
  | { type: 'UPDATE_APPLICANT_FRENCH'; payload: { ability: keyof ApplicantInput['frenchAbilities']; value: number } }
  | { type: 'UPDATE_SPOUSE_FIELD'; payload: { field: keyof SpouseInput; value: any } }
  | { type: 'UPDATE_SPOUSE_FRENCH'; payload: { ability: keyof SpouseInput['frenchAbilities']; value: number } }
  | { type: 'SET_SHOW_SUMMARY'; payload: boolean }
  | { type: 'SET_RESULT'; payload: CalculationResult | null }
  | { type: 'LOAD_EASTER_EGG' };

// Initial state
const initialState: CalculatorState = {
  hasSpouse: false,
  applicant: {
    age: 30,
    educationLevel: 'none',
    workExperienceMonths: 0,
    frenchAbilities: {
      oralComprehension: 1,
      oralProduction: 1,
      writtenComprehension: 1,
      writtenProduction: 1
    },
    labourMarketDiagnosis: 'balanced',
    workExperiencePrincipalProfessionMonths: 0,
    workExperienceQuebecMonths: 0,
    residenceOutsideMontrealMonths: 0,
    authorizationToPractice: false,
    studyStayQuebecCompletedMonths: 0,
    studyStayQuebecOngoingMonths: 0,
    hasFamilyInQuebec: false,
    intendsToResideOutsideMontreal: false
  },
  spouse: {
    frenchAbilities: {
      oralComprehension: 1,
      oralProduction: 1,
      writtenComprehension: 1,
      writtenProduction: 1
    },
    age: 30,
    workExperienceQuebecMonths: 0,
    educationLevel: 'none',
    hasFamilyInQuebec: false
  },
  result: null,
  showSummary: false
};

// Computer programmer test case data
const computerProgrammerData = {
  applicant: {
    age: 36,
    educationLevel: "university_1st_cycle_3_4_years" as const,
    workExperienceMonths: 60,
    frenchAbilities: {
      oralComprehension: 7 as const,
      oralProduction: 7 as const,  
      writtenComprehension: 5 as const,
      writtenProduction: 5 as const
    },
    labourMarketDiagnosis: "slight_shortage" as const,
    workExperiencePrincipalProfessionMonths: 18,
    workExperienceQuebecMonths: 18,
    residenceOutsideMontrealMonths: 0,
    authorizationToPractice: false,
    studyStayQuebecCompletedMonths: 0,
    studyStayQuebecOngoingMonths: 0,
    hasFamilyInQuebec: false,
    intendsToResideOutsideMontreal: false
  },
  spouse: {
    frenchAbilities: {
      oralComprehension: 5 as const,
      oralProduction: 5 as const,
      writtenComprehension: 4 as const,
      writtenProduction: 4 as const
    },
    age: 36,
    workExperienceQuebecMonths: 0,
    educationLevel: "university_2nd_cycle_2_plus_years" as const,
    quebecDiploma: "professional_secondary_900_plus" as const,
    hasFamilyInQuebec: false
  }
};

// Reducer
function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'SET_HAS_SPOUSE':
      return {
        ...state,
        hasSpouse: action.payload,
        spouse: action.payload ? state.spouse : initialState.spouse
      };

    case 'UPDATE_APPLICANT_FIELD':
      return {
        ...state,
        applicant: {
          ...state.applicant,
          [action.payload.field]: action.payload.value
        }
      };

    case 'UPDATE_APPLICANT_FRENCH':
      return {
        ...state,
        applicant: {
          ...state.applicant,
          frenchAbilities: {
            ...state.applicant.frenchAbilities!,
            [action.payload.ability]: action.payload.value
          }
        }
      };

    case 'UPDATE_SPOUSE_FIELD':
      return {
        ...state,
        spouse: {
          ...state.spouse,
          [action.payload.field]: action.payload.value
        }
      };

    case 'UPDATE_SPOUSE_FRENCH':
      return {
        ...state,
        spouse: {
          ...state.spouse,
          frenchAbilities: {
            ...state.spouse.frenchAbilities!,
            [action.payload.ability]: action.payload.value
          }
        }
      };

    case 'SET_SHOW_SUMMARY':
      return {
        ...state,
        showSummary: action.payload
      };

    case 'SET_RESULT':
      return {
        ...state,
        result: action.payload
      };

    case 'LOAD_EASTER_EGG':
      console.log('🥚 Computer Programmer Test Case Loaded! (Quebec PTSQ 2025 Sample)', computerProgrammerData);
      return {
        ...state,
        hasSpouse: true,
        applicant: computerProgrammerData.applicant,
        spouse: computerProgrammerData.spouse
      };

    default:
      return state;
  }
}

// Context
const CalculatorContext = createContext<{
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
} | null>(null);

// Provider
export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  // Calculate points when relevant state changes
  useEffect(() => {
    const isApplicantComplete = (data: Partial<ApplicantInput>): data is ApplicantInput => {
      return !!(
        data.age !== undefined &&
        data.educationLevel &&
        data.workExperienceMonths !== undefined &&
        data.frenchAbilities &&
        data.labourMarketDiagnosis &&
        data.workExperiencePrincipalProfessionMonths !== undefined &&
        data.workExperienceQuebecMonths !== undefined &&
        data.residenceOutsideMontrealMonths !== undefined &&
        data.authorizationToPractice !== undefined &&
        data.studyStayQuebecCompletedMonths !== undefined &&
        data.studyStayQuebecOngoingMonths !== undefined &&
        data.hasFamilyInQuebec !== undefined &&
        data.intendsToResideOutsideMontreal !== undefined
      );
    };

    const isSpouseComplete = (data: Partial<SpouseInput>): data is SpouseInput => {
      return !!(
        data.frenchAbilities &&
        data.age !== undefined &&
        data.workExperienceQuebecMonths !== undefined &&
        data.educationLevel &&
        data.hasFamilyInQuebec !== undefined
      );
    };

    if (!isApplicantComplete(state.applicant) || (state.hasSpouse && !isSpouseComplete(state.spouse))) {
      dispatch({ type: 'SET_RESULT', payload: null });
      return;
    }

    const input: CalculatorInput = {
      applicant: state.applicant as ApplicantInput,
      spouse: state.hasSpouse ? (state.spouse as SpouseInput) : undefined
    };

    const decoded = decodeCalculatorInput(input);
    
    if (Either.isRight(decoded)) {
      const validInput = decoded.right;
      const calculationResult = calculatePoints(validInput);
      dispatch({ type: 'SET_RESULT', payload: calculationResult });
    } else {
      dispatch({ type: 'SET_RESULT', payload: null });
    }
  }, [state.applicant, state.spouse, state.hasSpouse]);

  // Expose easter egg globally
  useEffect(() => {
    (window as any).egg = () => dispatch({ type: 'LOAD_EASTER_EGG' });
    return () => {
      delete (window as any).egg;
    };
  }, []);

  // Handle scroll for summary
  useEffect(() => {
    const handleScroll = () => {
      dispatch({ type: 'SET_SHOW_SUMMARY', payload: window.scrollY > 100 });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <CalculatorContext.Provider value={{ state, dispatch }}>
      {children}
    </CalculatorContext.Provider>
  );
};

// Hook
export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
};
import React from 'react';
import type { SpouseInput } from '@ptsq-calculator/rules';
import { useCalculator } from '../context/CalculatorContext.js';

export const SpouseForm: React.FC = () => {
  const { state, dispatch } = useCalculator();
  const formData = state.spouse;

  const updateField = (field: keyof SpouseInput, value: any) => {
    dispatch({ type: 'UPDATE_SPOUSE_FIELD', payload: { field, value } });
  };

  const updateFrenchAbility = (ability: keyof SpouseInput['frenchAbilities'], value: number) => {
    dispatch({ type: 'UPDATE_SPOUSE_FRENCH', payload: { ability, value } });
  };

  return (
    <div className="form-container">
      <fieldset className="form-group">
        <legend>French Language Knowledge</legend>
        
        <div>
          <label htmlFor="spouse-oralComp">Oral Comprehension (Level 1-12)</label>
          <input
            type="number"
            id="spouse-oralComp"
            min="1"
            max="12"
            value={formData.frenchAbilities?.oralComprehension}
            onChange={(e) => updateFrenchAbility('oralComprehension', parseInt(e.target.value) || 1)}
          />
        </div>

        <div>
          <label htmlFor="spouse-oralProd">Oral Production (Level 1-12)</label>
          <input
            type="number"
            id="spouse-oralProd"
            min="1"
            max="12"
            value={formData.frenchAbilities?.oralProduction}
            onChange={(e) => updateFrenchAbility('oralProduction', parseInt(e.target.value) || 1)}
          />
        </div>

        <div>
          <label htmlFor="spouse-writtenComp">Written Comprehension (Level 1-12)</label>
          <input
            type="number"
            id="spouse-writtenComp"
            min="1"
            max="12"
            value={formData.frenchAbilities?.writtenComprehension}
            onChange={(e) => updateFrenchAbility('writtenComprehension', parseInt(e.target.value) || 1)}
          />
        </div>

        <div>
          <label htmlFor="spouse-writtenProd">Written Production (Level 1-12)</label>
          <input
            type="number"
            id="spouse-writtenProd"
            min="1"
            max="12"
            value={formData.frenchAbilities?.writtenProduction}
            onChange={(e) => updateFrenchAbility('writtenProduction', parseInt(e.target.value) || 1)}
          />
        </div>
      </fieldset>

      <div className="form-group">
        <label htmlFor="spouse-age">Age</label>
        <input
          type="number"
          id="spouse-age"
          min="16"
          max="100"
          value={formData.age}
          onChange={(e) => updateField('age', parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="spouse-workExpQuebec">Work Experience in Quebec (months, last 5 years)</label>
        <input
          type="number"
          id="spouse-workExpQuebec"
          min="0"
          max="60"
          value={formData.workExperienceQuebecMonths}
          onChange={(e) => updateField('workExperienceQuebecMonths', parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="spouse-educationLevel">Education Level</label>
        <select
          id="spouse-educationLevel"
          value={formData.educationLevel}
          onChange={(e) => updateField('educationLevel', e.target.value)}
        >
          <option value="none">No formal education</option>
          <option value="general_secondary">Completed general secondary</option>
          <option value="professional_secondary_600_899">Professional secondary 600-899 hours (Quebec)</option>
          <option value="professional_secondary_900_plus">Professional secondary 900+ hours (Quebec)</option>
          <option value="professional_secondary_1_year_non_qc">Professional secondary 1+ years (non-Quebec)</option>
          <option value="postsecondary_general_2_years">Postsecondary general 2 years</option>
          <option value="postsecondary_technical_900_plus">Postsecondary technical 900+ hours (Quebec)</option>
          <option value="postsecondary_technical_1_2_years_non_qc">Postsecondary technical 1-2 years (non-Quebec)</option>
          <option value="postsecondary_technical_3_years">Postsecondary technical 3 years</option>
          <option value="university_1st_cycle_1_year">University 1st cycle 1 year</option>
          <option value="university_1st_cycle_2_years">University 1st cycle 2 years</option>
          <option value="university_1st_cycle_3_4_years">University 1st cycle 3-4 years</option>
          <option value="university_1st_cycle_5_plus_years">University 1st cycle 5+ years</option>
          <option value="university_2nd_cycle_1_year">University 2nd cycle 1 year</option>
          <option value="university_2nd_cycle_2_plus_years">University 2nd cycle 2+ years</option>
          <option value="medical_specialization_2_plus_years">Medical specialization 2+ years</option>
          <option value="university_3rd_cycle">University 3rd cycle</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="spouse-quebecDiploma">Quebec Diploma (if applicable)</label>
        <select
          id="spouse-quebecDiploma"
          value={formData.quebecDiploma || ''}
          onChange={(e) => updateField('quebecDiploma', e.target.value || undefined)}
        >
          <option value="">None</option>
          <option value="general_secondary">Completed general secondary</option>
          <option value="professional_secondary_600_899">Professional secondary 600-899 hours</option>
          <option value="professional_secondary_900_plus">Professional secondary 900+ hours</option>
          <option value="postsecondary_general_2_years">Postsecondary general 2 years</option>
          <option value="postsecondary_technical_900_plus">Postsecondary technical 900+ hours</option>
          <option value="postsecondary_technical_3_years">Postsecondary technical 3 years</option>
          <option value="university_1st_cycle_1_year">University 1st cycle 1 year</option>
          <option value="university_1st_cycle_2_years">University 1st cycle 2 years</option>
          <option value="university_1st_cycle_3_4_years">University 1st cycle 3-4 years</option>
          <option value="university_1st_cycle_5_plus_years">University 1st cycle 5+ years</option>
          <option value="university_2nd_cycle_1_year">University 2nd cycle 1 year</option>
          <option value="university_2nd_cycle_2_plus_years">University 2nd cycle 2+ years</option>
          <option value="medical_specialization_2_plus_years">Medical specialization 2+ years</option>
          <option value="university_3rd_cycle">University 3rd cycle</option>
        </select>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.hasFamilyInQuebec}
            onChange={(e) => updateField('hasFamilyInQuebec', e.target.checked)}
          />
          Spouse has a family member in Quebec (18+, citizen/PR)
        </label>
      </div>
    </div>
  );
};
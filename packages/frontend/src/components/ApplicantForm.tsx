import React from 'react';
import type { ApplicantInput } from '@ptsq-calculator/rules';
import { useCalculator } from '../context/CalculatorContext.js';

export const ApplicantForm: React.FC = () => {
  const { state, dispatch } = useCalculator();
  const formData = state.applicant;

  const updateField = (field: keyof ApplicantInput, value: any) => {
    dispatch({ type: 'UPDATE_APPLICANT_FIELD', payload: { field, value } });
  };

  const updateFrenchAbility = (ability: keyof ApplicantInput['frenchAbilities'], value: number) => {
    dispatch({ type: 'UPDATE_APPLICANT_FRENCH', payload: { ability, value } });
  };

  return (
    <div className="form-container">
      <div className="form-group">
        <label htmlFor="age">Age</label>
        <input
          type="number"
          id="age"
          min="18"
          max="100"
          value={formData.age}
          onChange={(e) => updateField('age', parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="educationLevel">Education Level</label>
        <select
          id="educationLevel"
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
        <label htmlFor="workExperience">Work Experience (months, last 5 years)</label>
        <input
          type="number"
          id="workExperience"
          min="0"
          max="60"
          value={formData.workExperienceMonths}
          onChange={(e) => updateField('workExperienceMonths', parseInt(e.target.value) || 0)}
        />
      </div>

      <fieldset className="form-group">
        <legend>French Language Knowledge</legend>
        
        <div>
          <label htmlFor="oralComp">Oral Comprehension (Level 1-12)</label>
          <input
            type="number"
            id="oralComp"
            min="1"
            max="12"
            value={formData.frenchAbilities?.oralComprehension}
            onChange={(e) => updateFrenchAbility('oralComprehension', parseInt(e.target.value) || 1)}
          />
        </div>

        <div>
          <label htmlFor="oralProd">Oral Production (Level 1-12)</label>
          <input
            type="number"
            id="oralProd"
            min="1"
            max="12"
            value={formData.frenchAbilities?.oralProduction}
            onChange={(e) => updateFrenchAbility('oralProduction', parseInt(e.target.value) || 1)}
          />
        </div>

        <div>
          <label htmlFor="writtenComp">Written Comprehension (Level 1-12)</label>
          <input
            type="number"
            id="writtenComp"
            min="1"
            max="12"
            value={formData.frenchAbilities?.writtenComprehension}
            onChange={(e) => updateFrenchAbility('writtenComprehension', parseInt(e.target.value) || 1)}
          />
        </div>

        <div>
          <label htmlFor="writtenProd">Written Production (Level 1-12)</label>
          <input
            type="number"
            id="writtenProd"
            min="1"
            max="12"
            value={formData.frenchAbilities?.writtenProduction}
            onChange={(e) => updateFrenchAbility('writtenProduction', parseInt(e.target.value) || 1)}
          />
        </div>
      </fieldset>

      <div className="form-group">
        <label htmlFor="labourMarket">Labour Market Diagnosis</label>
        <select
          id="labourMarket"
          value={formData.labourMarketDiagnosis}
          onChange={(e) => updateField('labourMarketDiagnosis', e.target.value)}
        >
          <option value="balanced">Balanced or no diagnosis</option>
          <option value="slight_shortage">Slight shortage</option>
          <option value="shortage">Shortage</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="workExpPrincipal">Work Experience in Principal Profession (months)</label>
        <input
          type="number"
          id="workExpPrincipal"
          min="0"
          max="60"
          value={formData.workExperiencePrincipalProfessionMonths}
          onChange={(e) => updateField('workExperiencePrincipalProfessionMonths', parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="quebecDiploma">Quebec Diploma (if applicable)</label>
        <select
          id="quebecDiploma"
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
        <label htmlFor="workExpQuebec">Work Experience in Quebec (months, last 5 years)</label>
        <input
          type="number"
          id="workExpQuebec"
          min="0"
          max="60"
          value={formData.workExperienceQuebecMonths}
          onChange={(e) => updateField('workExperienceQuebecMonths', parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="residenceOutside">Residence Outside Montreal (months)</label>
        <input
          type="number"
          id="residenceOutside"
          min="0"
          value={formData.residenceOutsideMontrealMonths}
          onChange={(e) => updateField('residenceOutsideMontrealMonths', parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="jobOffer">Validated Job Offer</label>
        <select
          id="jobOffer"
          value={formData.validatedJobOffer || ''}
          onChange={(e) => updateField('validatedJobOffer', e.target.value || undefined)}
        >
          <option value="">No job offer</option>
          <option value="inside_montreal">Inside Montreal Metropolitan Community</option>
          <option value="outside_montreal">Outside Montreal Metropolitan Community</option>
        </select>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.authorizationToPractice}
            onChange={(e) => updateField('authorizationToPractice', e.target.checked)}
          />
          Authorization to practice profession or recognition of diplomas
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="studyCompleted">Study Stay in Quebec - Completed (months)</label>
        <input
          type="number"
          id="studyCompleted"
          min="0"
          value={formData.studyStayQuebecCompletedMonths}
          onChange={(e) => updateField('studyStayQuebecCompletedMonths', parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="studyOngoing">Study Stay in Quebec - Ongoing (months)</label>
        <input
          type="number"
          id="studyOngoing"
          min="0"
          value={formData.studyStayQuebecOngoingMonths}
          onChange={(e) => updateField('studyStayQuebecOngoingMonths', parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.hasFamilyInQuebec}
            onChange={(e) => updateField('hasFamilyInQuebec', e.target.checked)}
          />
          I have a family member in Quebec (18+, citizen/PR)
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.intendsToResideOutsideMontreal}
            onChange={(e) => updateField('intendsToResideOutsideMontreal', e.target.checked)}
          />
          I intend to reside outside Montreal Metropolitan Community
        </label>
      </div>
    </div>
  );
};
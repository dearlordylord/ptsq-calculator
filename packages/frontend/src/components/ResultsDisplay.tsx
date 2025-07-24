import React from 'react';
import type { CalculationResult } from '@ptsq-calculator/rules';

interface ResultsDisplayProps {
  result: CalculationResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  return (
    <div className="results-container">
      <div className="total-points">
        <h3>Total Points</h3>
        <div className="points-value">{result.totalPoints}</div>
        <div className="points-max">out of 1400</div>
      </div>

      <div className="category-breakdown">
        <div className="category">
          <h4>Capital Human</h4>
          <div className="category-total">{result.categoryPoints.capitalHuman} / 520</div>
          <ul className="detail-list">
            <li>
              <span>French Knowledge:</span>
              <span>{result.detailedPoints.capitalHuman.frenchKnowledge}</span>
            </li>
            <li>
              <span>Age:</span>
              <span>{result.detailedPoints.capitalHuman.age}</span>
            </li>
            <li>
              <span>Work Experience:</span>
              <span>{result.detailedPoints.capitalHuman.workExperience}</span>
            </li>
            <li>
              <span>Education Level:</span>
              <span>{result.detailedPoints.capitalHuman.educationLevel}</span>
            </li>
          </ul>
        </div>

        <div className="category">
          <h4>Labour Market Needs & Government Priorities</h4>
          <div className="category-total">{result.categoryPoints.labourMarketNeeds} / 700</div>
          <ul className="detail-list">
            <li>
              <span>Labour Market Diagnosis:</span>
              <span>{result.detailedPoints.labourMarketNeeds.labourMarketDiagnosis}</span>
            </li>
            <li>
              <span>Quebec Diploma:</span>
              <span>{result.detailedPoints.labourMarketNeeds.quebecDiploma}</span>
            </li>
            <li>
              <span>Work Experience in Quebec:</span>
              <span>{result.detailedPoints.labourMarketNeeds.workExperienceQuebec}</span>
            </li>
            <li>
              <span>Residence Outside Montreal:</span>
              <span>{result.detailedPoints.labourMarketNeeds.residenceOutsideMontreal}</span>
            </li>
            <li>
              <span>Validated Job Offer:</span>
              <span>{result.detailedPoints.labourMarketNeeds.validatedJobOffer}</span>
            </li>
            <li>
              <span>Authorization to Practice:</span>
              <span>{result.detailedPoints.labourMarketNeeds.authorizationToPractice}</span>
            </li>
          </ul>
        </div>

        <div className="category">
          <h4>Adaptation Factors</h4>
          <div className="category-total">{result.categoryPoints.adaptationFactors} / 180</div>
          <ul className="detail-list">
            <li>
              <span>Study Stay (Completed):</span>
              <span>{result.detailedPoints.adaptationFactors.studyStayCompleted}</span>
            </li>
            <li>
              <span>Study Stay (Ongoing):</span>
              <span>{result.detailedPoints.adaptationFactors.studyStayOngoing}</span>
            </li>
            <li>
              <span>Family Member in Quebec:</span>
              <span>{result.detailedPoints.adaptationFactors.familyMember}</span>
            </li>
            {result.hasSpouse && (
              <>
                <li>
                  <span>Spouse French Knowledge:</span>
                  <span>{result.detailedPoints.adaptationFactors.spouseFrench}</span>
                </li>
                <li>
                  <span>Spouse Age:</span>
                  <span>{result.detailedPoints.adaptationFactors.spouseAge}</span>
                </li>
                <li>
                  <span>Spouse Work Experience in Quebec:</span>
                  <span>{result.detailedPoints.adaptationFactors.spouseWorkExperienceQuebec}</span>
                </li>
                <li>
                  <span>Spouse Education:</span>
                  <span>{result.detailedPoints.adaptationFactors.spouseEducation}</span>
                </li>
                <li>
                  <span>Spouse Quebec Diploma:</span>
                  <span>{result.detailedPoints.adaptationFactors.spouseQuebecDiploma}</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
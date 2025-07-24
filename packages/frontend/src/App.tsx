import React from 'react';
import { CalculatorProvider, useCalculator } from './context/CalculatorContext.js';
import { ApplicantForm } from './components/ApplicantForm.js';
import { SpouseForm } from './components/SpouseForm.js';
import { ResultsDisplay } from './components/ResultsDisplay.js';

const AppContent: React.FC = () => {
  const { state, dispatch } = useCalculator();

  return (
    <div className="app">
      {/* Sticky header with points summary - only show when scrolled */}
      {state.showSummary && (
        <div className="points-summary">
          <div className="summary-item">
            <span className="summary-label">Capital Human:</span>
            <span className="summary-value">{state.result?.categoryPoints.capitalHuman || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Labour Market:</span>
            <span className="summary-value">{state.result?.categoryPoints.labourMarketNeeds || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Adaptation:</span>
            <span className="summary-value">{state.result?.categoryPoints.adaptationFactors || 0}</span>
          </div>
          <div className="summary-item total">
            <span className="summary-label">Total:</span>
            <span className="summary-value">{state.result?.totalPoints || 0} / 1400</span>
          </div>
        </div>
      )}

      <header>
        <h1>Quebec Immigration Points Calculator</h1>
        <p>Calculate your points for the Quebec Skilled Worker Program</p>
      </header>

      <main>
        <div className="form-section">
          <div className="spouse-toggle">
            <label>
              <input
                type="checkbox"
                checked={state.hasSpouse}
                onChange={(e) => dispatch({ type: 'SET_HAS_SPOUSE', payload: e.target.checked })}
              />
              I am applying with a spouse or common-law partner
            </label>
          </div>

          <section className="applicant-section">
            <h2>Applicant Information</h2>
            <ApplicantForm />
          </section>

          {state.hasSpouse && (
            <section className="spouse-section">
              <h2>Spouse Information</h2>
              <SpouseForm />
            </section>
          )}
        </div>

        {state.result && (
          <section className="results-section">
            <h2>Detailed Breakdown</h2>
            <ResultsDisplay result={state.result} />
          </section>
        )}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CalculatorProvider>
      <AppContent />
    </CalculatorProvider>
  );
};
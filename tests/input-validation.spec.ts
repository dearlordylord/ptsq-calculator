import { test, expect } from '@playwright/test';
import { calculatePoints } from '../packages/rules/src/calculator.js';
import type { CalculatorInput, FrenchLevel, EducationLevel, LabourMarketDiagnosis } from '../packages/rules/src/types-interface.js';

test.describe('Input Field Validation vs Core Logic', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
  });

  test('validates work experience months calculations', async ({ page }) => {
    // Test work experience thresholds: 0, 11, 12, 23, 24, 35, 36, 47, 48+
    const testCases = [
      { months: 0, expectedPoints: 0 },
      { months: 11, expectedPoints: 0 },
      { months: 12, expectedPoints: 20 }, // single applicant
      { months: 23, expectedPoints: 20 },
      { months: 24, expectedPoints: 40 },
      { months: 35, expectedPoints: 40 },
      { months: 36, expectedPoints: 50 },
      { months: 47, expectedPoints: 50 },
      { months: 48, expectedPoints: 70 },
      { months: 60, expectedPoints: 70 }
    ];
    
    for (const testCase of testCases) {
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Fill required fields
      await page.fill('input[placeholder="Age"]', '30');
      await page.selectOption('select:near(:text("Education Level"))', 'general_secondary');
      await page.fill('input[placeholder="Work experience (months)"]', testCase.months.toString());
      
      const frenchInputs = await page.locator('.french-abilities input[type="number"]').all();
      for (const input of frenchInputs) {
        await input.fill('5');
      }
      
      await page.selectOption('select:near(:text("Labour Market"))', 'balanced');
      await page.fill('input[placeholder*="principal profession"]', '24');
      
      await page.waitForTimeout(100);
      
      // Validate against core logic
      const testInput: CalculatorInput = {
        applicant: {
          age: 30,
          educationLevel: 'general_secondary' as EducationLevel,
          workExperienceMonths: testCase.months,
          frenchAbilities: {
            oralComprehension: 5 as FrenchLevel,
            oralProduction: 5 as FrenchLevel,
            writtenComprehension: 5 as FrenchLevel,
            writtenProduction: 5 as FrenchLevel
          },
          labourMarketDiagnosis: 'balanced',
          workExperiencePrincipalProfessionMonths: 24,
          workExperienceQuebecMonths: 0,
          residenceOutsideMontrealMonths: 0,
          authorizationToPractice: false,
          studyStayQuebecCompletedMonths: 0,
          studyStayQuebecOngoingMonths: 0,
          hasFamilyInQuebec: false,
          intendsToResideOutsideMontreal: false
        }
      };
      
      const coreResult = calculatePoints(testInput);
      expect(coreResult.detailedPoints.capitalHuman.workExperience).toBe(testCase.expectedPoints);
      
      // Get UI total and validate it matches core calculation
      let uiTotal = await page.locator('.summary-value').last().textContent();
      uiTotal = uiTotal?.split(' ')[0] || '0';
      expect(parseInt(uiTotal)).toBe(coreResult.totalPoints);
    }
  });

  test('validates labour market diagnosis with principal profession months', async ({ page }) => {
    const diagnosisTests = [
      { diagnosis: 'balanced', months: 12, expectedPoints: 5 },
      { diagnosis: 'balanced', months: 24, expectedPoints: 10 },
      { diagnosis: 'balanced', months: 36, expectedPoints: 15 },
      { diagnosis: 'balanced', months: 48, expectedPoints: 25 },
      { diagnosis: 'slight_shortage', months: 12, expectedPoints: 70 },
      { diagnosis: 'slight_shortage', months: 24, expectedPoints: 80 },
      { diagnosis: 'slight_shortage', months: 36, expectedPoints: 90 },
      { diagnosis: 'slight_shortage', months: 48, expectedPoints: 100 },
      { diagnosis: 'shortage', months: 12, expectedPoints: 90 },
      { diagnosis: 'shortage', months: 24, expectedPoints: 100 },
      { diagnosis: 'shortage', months: 36, expectedPoints: 110 },
      { diagnosis: 'shortage', months: 48, expectedPoints: 120 }
    ];
    
    for (const testCase of diagnosisTests) {
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Fill form
      await page.fill('input[placeholder="Age"]', '30');
      await page.selectOption('select:near(:text("Education Level"))', 'general_secondary');
      await page.fill('input[placeholder="Work experience (months)"]', '24');
      
      const frenchInputs = await page.locator('.french-abilities input[type="number"]').all();
      for (const input of frenchInputs) {
        await input.fill('5');
      }
      
      await page.selectOption('select:near(:text("Labour Market"))', testCase.diagnosis);
      await page.fill('input[placeholder*="principal profession"]', testCase.months.toString());
      
      await page.waitForTimeout(100);
      
      // Validate against core
      const testInput: CalculatorInput = {
        applicant: {
          age: 30,
          educationLevel: 'general_secondary' as EducationLevel,
          workExperienceMonths: 24,
          frenchAbilities: {
            oralComprehension: 5 as FrenchLevel,
            oralProduction: 5 as FrenchLevel,
            writtenComprehension: 5 as FrenchLevel,
            writtenProduction: 5 as FrenchLevel
          },
          labourMarketDiagnosis: testCase.diagnosis as LabourMarketDiagnosis,
          workExperiencePrincipalProfessionMonths: testCase.months,
          workExperienceQuebecMonths: 0,
          residenceOutsideMontrealMonths: 0,
          authorizationToPractice: false,
          studyStayQuebecCompletedMonths: 0,
          studyStayQuebecOngoingMonths: 0,
          hasFamilyInQuebec: false,
          intendsToResideOutsideMontreal: false
        }
      };
      
      const coreResult = calculatePoints(testInput);
      expect(coreResult.detailedPoints.labourMarketNeeds.labourMarketDiagnosis).toBe(testCase.expectedPoints);
      
      let uiTotal = await page.locator('.summary-value').last().textContent();
      uiTotal = uiTotal?.split(' ')[0] || '0';
      expect(parseInt(uiTotal)).toBe(coreResult.totalPoints);
    }
  });

  test('validates Quebec work experience scoring', async ({ page }) => {
    const quebecWorkTests = [
      { months: 0, expectedPoints: 0 },
      { months: 11, expectedPoints: 0 },
      { months: 12, expectedPoints: 40 },
      { months: 23, expectedPoints: 40 },
      { months: 24, expectedPoints: 80 },
      { months: 35, expectedPoints: 80 },
      { months: 36, expectedPoints: 120 },
      { months: 47, expectedPoints: 120 },
      { months: 48, expectedPoints: 160 },
      { months: 60, expectedPoints: 160 },
      { months: 72, expectedPoints: 160 } // Over 60 months
    ];
    
    for (const testCase of quebecWorkTests) {
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Fill form with Quebec work experience
      await page.fill('input[placeholder="Age"]', '30');
      await page.selectOption('select:near(:text("Education Level"))', 'general_secondary');
      await page.fill('input[placeholder="Work experience (months)"]', '24');
      
      const frenchInputs = await page.locator('.french-abilities input[type="number"]').all();
      for (const input of frenchInputs) {
        await input.fill('5');
      }
      
      await page.selectOption('select:near(:text("Labour Market"))', 'balanced');
      await page.fill('input[placeholder*="principal profession"]', '24');
      await page.fill('input[placeholder*="Quebec work experience"]', testCase.months.toString());
      
      await page.waitForTimeout(100);
      
      const testInput: CalculatorInput = {
        applicant: {
          age: 30,
          educationLevel: 'general_secondary' as EducationLevel,
          workExperienceMonths: 24,
          frenchAbilities: {
            oralComprehension: 5 as FrenchLevel,
            oralProduction: 5 as FrenchLevel,
            writtenComprehension: 5 as FrenchLevel,
            writtenProduction: 5 as FrenchLevel
          },
          labourMarketDiagnosis: 'balanced',
          workExperiencePrincipalProfessionMonths: 24,
          workExperienceQuebecMonths: testCase.months,
          residenceOutsideMontrealMonths: 0,
          authorizationToPractice: false,
          studyStayQuebecCompletedMonths: 0,
          studyStayQuebecOngoingMonths: 0,
          hasFamilyInQuebec: false,
          intendsToResideOutsideMontreal: false
        }
      };
      
      const coreResult = calculatePoints(testInput);
      expect(coreResult.detailedPoints.labourMarketNeeds.workExperienceQuebec).toBe(testCase.expectedPoints);
      
      let uiTotal = await page.locator('.summary-value').last().textContent();
      uiTotal = uiTotal?.split(' ')[0] || '0';
      expect(parseInt(uiTotal)).toBe(coreResult.totalPoints);
    }
  });

  test('validates residence outside Montreal scoring', async ({ page }) => {
    const residenceTests = [
      { months: 0, expectedPoints: 0 },
      { months: 5, expectedPoints: 0 },
      { months: 6, expectedPoints: 6 },
      { months: 11, expectedPoints: 6 },
      { months: 12, expectedPoints: 16 },
      { months: 23, expectedPoints: 16 },
      { months: 24, expectedPoints: 24 },
      { months: 35, expectedPoints: 24 },
      { months: 36, expectedPoints: 32 },
      { months: 47, expectedPoints: 32 },
      { months: 48, expectedPoints: 40 },
      { months: 60, expectedPoints: 40 }
    ];
    
    for (const testCase of residenceTests) {
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      await page.fill('input[placeholder="Age"]', '30');
      await page.selectOption('select:near(:text("Education Level"))', 'general_secondary');
      await page.fill('input[placeholder="Work experience (months)"]', '24');
      
      const frenchInputs = await page.locator('.french-abilities input[type="number"]').all();
      for (const input of frenchInputs) {
        await input.fill('5');
      }
      
      await page.selectOption('select:near(:text("Labour Market"))', 'balanced');
      await page.fill('input[placeholder*="principal profession"]', '24');
      await page.fill('input[placeholder*="residence outside Montreal"]', testCase.months.toString());
      
      await page.waitForTimeout(100);
      
      const testInput: CalculatorInput = {
        applicant: {
          age: 30,
          educationLevel: 'general_secondary' as EducationLevel,
          workExperienceMonths: 24,
          frenchAbilities: {
            oralComprehension: 5 as FrenchLevel,
            oralProduction: 5 as FrenchLevel,
            writtenComprehension: 5 as FrenchLevel,
            writtenProduction: 5 as FrenchLevel
          },
          labourMarketDiagnosis: 'balanced',
          workExperiencePrincipalProfessionMonths: 24,
          workExperienceQuebecMonths: 0,
          residenceOutsideMontrealMonths: testCase.months,
          authorizationToPractice: false,
          studyStayQuebecCompletedMonths: 0,
          studyStayQuebecOngoingMonths: 0,
          hasFamilyInQuebec: false,
          intendsToResideOutsideMontreal: false
        }
      };
      
      const coreResult = calculatePoints(testInput);
      expect(coreResult.detailedPoints.labourMarketNeeds.residenceOutsideMontreal).toBe(testCase.expectedPoints);
      
      let uiTotal = await page.locator('.summary-value').last().textContent();
      uiTotal = uiTotal?.split(' ')[0] || '0';
      expect(parseInt(uiTotal)).toBe(coreResult.totalPoints);
    }
  });

  test('validates study stay completed vs ongoing scoring', async ({ page }) => {
    const studyTests = [
      { completed: 0, ongoing: 0, expectedCompleted: 0, expectedOngoing: 0 },
      { completed: 6, ongoing: 0, expectedCompleted: 1, expectedOngoing: 0 },
      { completed: 12, ongoing: 0, expectedCompleted: 3, expectedOngoing: 0 },
      { completed: 24, ongoing: 0, expectedCompleted: 5, expectedOngoing: 0 },
      { completed: 36, ongoing: 0, expectedCompleted: 8, expectedOngoing: 0 },
      { completed: 48, ongoing: 0, expectedCompleted: 10, expectedOngoing: 0 },
      { completed: 0, ongoing: 6, expectedCompleted: 0, expectedOngoing: 5 },
      { completed: 0, ongoing: 12, expectedCompleted: 0, expectedOngoing: 12 },
      { completed: 0, ongoing: 24, expectedCompleted: 0, expectedOngoing: 18 },
      { completed: 0, ongoing: 36, expectedCompleted: 0, expectedOngoing: 24 },
      { completed: 0, ongoing: 48, expectedCompleted: 0, expectedOngoing: 30 }
    ];
    
    for (const testCase of studyTests) {
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      await page.fill('input[placeholder="Age"]', '30');
      await page.selectOption('select:near(:text("Education Level"))', 'general_secondary');
      await page.fill('input[placeholder="Work experience (months)"]', '24');
      
      const frenchInputs = await page.locator('.french-abilities input[type="number"]').all();
      for (const input of frenchInputs) {
        await input.fill('5');
      }
      
      await page.selectOption('select:near(:text("Labour Market"))', 'balanced');
      await page.fill('input[placeholder*="principal profession"]', '24');
      await page.fill('input[placeholder*="study stay completed"]', testCase.completed.toString());
      await page.fill('input[placeholder*="study stay ongoing"]', testCase.ongoing.toString());
      
      await page.waitForTimeout(100);
      
      const testInput: CalculatorInput = {
        applicant: {
          age: 30,
          educationLevel: 'general_secondary' as EducationLevel,
          workExperienceMonths: 24,
          frenchAbilities: {
            oralComprehension: 5 as FrenchLevel,
            oralProduction: 5 as FrenchLevel,
            writtenComprehension: 5 as FrenchLevel,
            writtenProduction: 5 as FrenchLevel
          },
          labourMarketDiagnosis: 'balanced',
          workExperiencePrincipalProfessionMonths: 24,
          workExperienceQuebecMonths: 0,
          residenceOutsideMontrealMonths: 0,
          authorizationToPractice: false,
          studyStayQuebecCompletedMonths: testCase.completed,
          studyStayQuebecOngoingMonths: testCase.ongoing,
          hasFamilyInQuebec: false,
          intendsToResideOutsideMontreal: false
        }
      };
      
      const coreResult = calculatePoints(testInput);
      expect(coreResult.detailedPoints.adaptationFactors.studyStayCompleted).toBe(testCase.expectedCompleted);
      expect(coreResult.detailedPoints.adaptationFactors.studyStayOngoing).toBe(testCase.expectedOngoing);
      
      let uiTotal = await page.locator('.summary-value').last().textContent();
      uiTotal = uiTotal?.split(' ')[0] || '0';
      expect(parseInt(uiTotal)).toBe(coreResult.totalPoints);
    }
  });

  test('validates education level scoring differences', async ({ page }) => {
    const educationTests = [
      { level: 'none', expectedPoints: 0 },
      { level: 'general_secondary', expectedPoints: 13 },
      { level: 'professional_secondary_900_plus', expectedPoints: 26 },
      { level: 'postsecondary_general_2_years', expectedPoints: 39 },
      { level: 'postsecondary_technical_900_plus', expectedPoints: 52 },
      { level: 'postsecondary_technical_3_years', expectedPoints: 78 },
      { level: 'university_1st_cycle_3_4_years', expectedPoints: 104 },
      { level: 'university_2nd_cycle_2_plus_years', expectedPoints: 117 },
      { level: 'university_3rd_cycle', expectedPoints: 130 }
    ];
    
    for (const testCase of educationTests) {
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      await page.fill('input[placeholder="Age"]', '30');
      await page.selectOption('select:near(:text("Education Level"))', testCase.level);
      await page.fill('input[placeholder="Work experience (months)"]', '24');
      
      const frenchInputs = await page.locator('.french-abilities input[type="number"]').all();
      for (const input of frenchInputs) {
        await input.fill('5');
      }
      
      await page.selectOption('select:near(:text("Labour Market"))', 'balanced');
      await page.fill('input[placeholder*="principal profession"]', '24');
      
      await page.waitForTimeout(100);
      
      const testInput: CalculatorInput = {
        applicant: {
          age: 30,
          educationLevel: testCase.level as EducationLevel,
          workExperienceMonths: 24,
          frenchAbilities: {
            oralComprehension: 5 as FrenchLevel,
            oralProduction: 5 as FrenchLevel,
            writtenComprehension: 5 as FrenchLevel,
            writtenProduction: 5 as FrenchLevel
          },
          labourMarketDiagnosis: 'balanced',
          workExperiencePrincipalProfessionMonths: 24,
          workExperienceQuebecMonths: 0,
          residenceOutsideMontrealMonths: 0,
          authorizationToPractice: false,
          studyStayQuebecCompletedMonths: 0,
          studyStayQuebecOngoingMonths: 0,
          hasFamilyInQuebec: false,
          intendsToResideOutsideMontreal: false
        }
      };
      
      const coreResult = calculatePoints(testInput);
      expect(coreResult.detailedPoints.capitalHuman.educationLevel).toBe(testCase.expectedPoints);
      
      let uiTotal = await page.locator('.summary-value').last().textContent();
      uiTotal = uiTotal?.split(' ')[0] || '0';
      expect(parseInt(uiTotal)).toBe(coreResult.totalPoints);
    }
  });

  test('validates spouse work experience Quebec scoring', async ({ page }) => {
    // Enable spouse first
    await page.check('input[type="checkbox"]:has-text("I am applying with a spouse")');
    
    const spouseWorkTests = [
      { months: 0, expectedPoints: 0 },
      { months: 5, expectedPoints: 0 },
      { months: 6, expectedPoints: 5 },
      { months: 11, expectedPoints: 5 },
      { months: 12, expectedPoints: 10 },
      { months: 23, expectedPoints: 10 },
      { months: 24, expectedPoints: 15 },
      { months: 35, expectedPoints: 15 },
      { months: 36, expectedPoints: 23 },
      { months: 47, expectedPoints: 23 },
      { months: 48, expectedPoints: 30 },
      { months: 60, expectedPoints: 30 },
      { months: 72, expectedPoints: 30 }
    ];
    
    for (const testCase of spouseWorkTests) {
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Re-enable spouse after reload
      await page.check('input[type="checkbox"]:has-text("I am applying with a spouse")');
      
      // Fill applicant data
      await page.fill('input[placeholder="Age"]', '30');
      await page.selectOption('select:near(:text("Education Level"))', 'general_secondary');
      await page.fill('input[placeholder="Work experience (months)"]', '24');
      
      const applicantFrench = await page.locator('.applicant-section .french-abilities input[type="number"]').all();
      for (const input of applicantFrench) {
        await input.fill('5');
      }
      
      await page.selectOption('select:near(:text("Labour Market"))', 'balanced');
      await page.fill('input[placeholder*="principal profession"]', '24');
      
      // Fill spouse data
      const spouseSection = page.locator('.spouse-section');
      await spouseSection.locator('input[placeholder="Age"]').fill('30');
      await spouseSection.locator('select').first().selectOption('general_secondary');
      await spouseSection.locator('input[placeholder*="Quebec months"]').fill(testCase.months.toString());
      
      const spouseFrench = await spouseSection.locator('.french-abilities input[type="number"]').all();
      for (const input of spouseFrench) {
        await input.fill('1');
      }
      
      await page.waitForTimeout(100);
      
      const testInput: CalculatorInput = {
        applicant: {
          age: 30,
          educationLevel: 'general_secondary' as EducationLevel,
          workExperienceMonths: 24,
          frenchAbilities: {
            oralComprehension: 5 as FrenchLevel,
            oralProduction: 5 as FrenchLevel,
            writtenComprehension: 5 as FrenchLevel,
            writtenProduction: 5 as FrenchLevel
          },
          labourMarketDiagnosis: 'balanced',
          workExperiencePrincipalProfessionMonths: 24,
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
            oralComprehension: 1 as FrenchLevel,
            oralProduction: 1 as FrenchLevel,
            writtenComprehension: 1 as FrenchLevel,
            writtenProduction: 1 as FrenchLevel
          },
          age: 30,
          workExperienceQuebecMonths: testCase.months,
          educationLevel: 'general_secondary' as EducationLevel,
          hasFamilyInQuebec: false
        }
      };
      
      const coreResult = calculatePoints(testInput);
      expect(coreResult.detailedPoints.adaptationFactors.spouseWorkExperienceQuebec).toBe(testCase.expectedPoints);
      
      let uiTotal = await page.locator('.summary-value').last().textContent();
      uiTotal = uiTotal?.split(' ')[0] || '0';
      expect(parseInt(uiTotal)).toBe(coreResult.totalPoints);
    }
  });
});
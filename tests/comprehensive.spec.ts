import { test, expect } from '@playwright/test';
import { calculatePoints } from '../packages/rules/src/calculator.js';
import type { CalculatorInput, FrenchLevel, EducationLevel } from '../packages/rules/src/types-interface.js';

test.describe('Comprehensive React Component vs Core Logic Validation', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
  });

  test('validates spouse checkbox creates correct form fields', async ({ page }) => {
    // Check initial state - no spouse form
    await expect(page.locator('.spouse-section')).not.toBeVisible();
    
    // Click spouse checkbox
    await page.check('input[type="checkbox"]:has-text("I am applying with a spouse")');
    
    // Verify spouse form appears
    await expect(page.locator('.spouse-section')).toBeVisible();
    await expect(page.locator('h2:has-text("Spouse Information")')).toBeVisible();
    
    // Verify spouse form has expected fields
    const spouseSection = page.locator('.spouse-section');
    await expect(spouseSection.locator('input[type="number"]')).toHaveCount(5); // age + 4 french levels + quebec months
    await expect(spouseSection.locator('select')).toHaveCount(2); // education + quebec diploma
    await expect(spouseSection.locator('input[type="checkbox"]')).toHaveCount(1); // family in quebec
    
    // Uncheck spouse - form should disappear
    await page.uncheck('input[type="checkbox"]:has-text("I am applying with a spouse")');
    await expect(page.locator('.spouse-section')).not.toBeVisible();
  });

  test('validates authorization to practice checkbox affects scoring', async ({ page }) => {
    // Fill minimum required fields
    await page.fill('input[placeholder="Age"]', '30');
    await page.selectOption('select:near(:text("Education Level"))', 'general_secondary');
    await page.fill('input[placeholder="Work experience (months)"]', '24');
    
    // Set french levels
    const frenchInputs = await page.locator('.french-abilities input[type="number"]').all();
    for (const input of frenchInputs) {
      await input.fill('5');
    }
    
    // Fill other required fields
    await page.selectOption('select:near(:text("Labour Market"))', 'balanced');
    await page.fill('input[placeholder*="principal profession"]', '24');
    
    // Check initial score without authorization
    let initialTotal = await page.locator('.summary-value').last().textContent();
    initialTotal = initialTotal?.split(' ')[0] || '0';
    
    // Check authorization checkbox
    await page.check('input[type="checkbox"]:has-text("Authorization to practice")');
    
    // Wait for calculation
    await page.waitForTimeout(100);
    
    // Check new score
    let newTotal = await page.locator('.summary-value').last().textContent();
    newTotal = newTotal?.split(' ')[0] || '0';
    
    // Should have increased by 50 points (authorization to practice bonus)
    expect(parseInt(newTotal) - parseInt(initialTotal)).toBe(50);
    
    // Validate against core logic
    const baseInput: CalculatorInput = {
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
      }
    };
    
    const withAuthInput = { ...baseInput, applicant: { ...baseInput.applicant, authorizationToPractice: true } };
    
    const withoutAuth = calculatePoints(baseInput);
    const withAuth = calculatePoints(withAuthInput);
    
    expect(withAuth.totalPoints - withoutAuth.totalPoints).toBe(50);
    expect(parseInt(newTotal)).toBe(withAuth.totalPoints);
  });

  test('validates family in quebec checkbox with outside montreal interaction', async ({ page }) => {
    // Fill required fields
    await page.fill('input[placeholder="Age"]', '30');
    await page.selectOption('select:near(:text("Education Level"))', 'general_secondary');
    await page.fill('input[placeholder="Work experience (months)"]', '24');
    
    const frenchInputs = await page.locator('.french-abilities input[type="number"]').all();
    for (const input of frenchInputs) {
      await input.fill('5');
    }
    
    await page.selectOption('select:near(:text("Labour Market"))', 'balanced');
    await page.fill('input[placeholder*="principal profession"]', '24');
    
    // Get baseline score
    let baseline = await page.locator('.summary-value').last().textContent();
    baseline = baseline?.split(' ')[0] || '0';
    
    // Check family in quebec only (should not give points without outside montreal)
    await page.check('input[type="checkbox"]:has-text("I have a family member in Quebec")');
    await page.waitForTimeout(100);
    
    let withFamilyOnly = await page.locator('.summary-value').last().textContent();
    withFamilyOnly = withFamilyOnly?.split(' ')[0] || '0';
    
    expect(parseInt(withFamilyOnly)).toBe(parseInt(baseline)); // No change
    
    // Now check outside montreal too
    await page.check('input[type="checkbox"]:has-text("I intend to reside outside Montreal")');
    await page.waitForTimeout(100);
    
    let withBoth = await page.locator('.summary-value').last().textContent();
    withBoth = withBoth?.split(' ')[0] || '0';
    
    // Should now have 10 additional points
    expect(parseInt(withBoth) - parseInt(baseline)).toBe(10);
    
    // Validate against core logic
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
        hasFamilyInQuebec: true,
        intendsToResideOutsideMontreal: true
      }
    };
    
    const coreResult = calculatePoints(testInput);
    expect(coreResult.detailedPoints.adaptationFactors.familyMember).toBe(10);
    expect(parseInt(withBoth)).toBe(coreResult.totalPoints);
  });

  test('validates outside montreal checkbox affects scoring correctly', async ({ page }) => {
    // Fill minimum fields
    await page.fill('input[placeholder="Age"]', '30');
    await page.selectOption('select:near(:text("Education Level"))', 'general_secondary');
    await page.fill('input[placeholder="Work experience (months)"]', '24');
    
    const frenchInputs = await page.locator('.french-abilities input[type="number"]').all();
    for (const input of frenchInputs) {
      await input.fill('5');
    }
    
    await page.selectOption('select:near(:text("Labour Market"))', 'balanced');
    await page.fill('input[placeholder*="principal profession"]', '24');
    
    // Get baseline
    let baseline = await page.locator('.summary-value').last().textContent();
    baseline = baseline?.split(' ')[0] || '0';
    
    // Check outside montreal checkbox only
    await page.check('input[type="checkbox"]:has-text("I intend to reside outside Montreal")');
    await page.waitForTimeout(100);
    
    let withOutsideMontreal = await page.locator('.summary-value').last().textContent();
    withOutsideMontreal = withOutsideMontreal?.split(' ')[0] || '0';
    
    // Should be same as baseline (no points without family)
    expect(parseInt(withOutsideMontreal)).toBe(parseInt(baseline));
  });

  test('validates complex scoring scenario with spouse', async ({ page }) => {
    // Enable spouse
    await page.check('input[type="checkbox"]:has-text("I am applying with a spouse")');
    
    // Fill applicant data
    await page.fill('input[placeholder="Age"]', '35');
    await page.selectOption('select:near(:text("Education Level"))', 'university_2nd_cycle_2_plus_years');
    await page.fill('input[placeholder="Work experience (months)"]', '60');
    
    // Applicant French levels
    const applicantFrench = await page.locator('.applicant-section .french-abilities input[type="number"]').all();
    for (const input of applicantFrench) {
      await input.fill('10');
    }
    
    await page.selectOption('select:near(:text("Labour Market"))', 'balanced');
    await page.fill('input[placeholder*="principal profession"]', '24');
    await page.check('input[type="checkbox"]:has-text("I have a family member in Quebec")');
    await page.check('input[type="checkbox"]:has-text("I intend to reside outside Montreal")');
    
    // Fill spouse data
    const spouseSection = page.locator('.spouse-section');
    await spouseSection.locator('input[placeholder="Age"]').fill('32');
    await spouseSection.locator('select').first().selectOption('university_1st_cycle_2_years');
    await spouseSection.locator('input[placeholder*="Quebec months"]').fill('12');
    
    // Spouse French levels  
    const spouseFrench = await spouseSection.locator('.french-abilities input[type="number"]').all();
    for (const input of spouseFrench) {
      await input.fill('7');
    }
    
    // Quebec diploma for spouse
    await spouseSection.locator('select').last().selectOption('university_1st_cycle_2_years');
    
    await page.waitForTimeout(200);
    
    // Get final total
    let finalTotal = await page.locator('.summary-value').last().textContent();
    finalTotal = finalTotal?.split(' ')[0] || '0';
    
    // Validate against core logic calculation
    const complexInput: CalculatorInput = {
      applicant: {
        age: 35,
        educationLevel: 'university_2nd_cycle_2_plus_years' as EducationLevel,
        workExperienceMonths: 60,
        frenchAbilities: {
          oralComprehension: 10 as FrenchLevel,
          oralProduction: 10 as FrenchLevel,
          writtenComprehension: 10 as FrenchLevel,
          writtenProduction: 10 as FrenchLevel
        },
        labourMarketDiagnosis: 'balanced',
        workExperiencePrincipalProfessionMonths: 24,
        workExperienceQuebecMonths: 0,
        residenceOutsideMontrealMonths: 0,
        authorizationToPractice: false,
        studyStayQuebecCompletedMonths: 0,
        studyStayQuebecOngoingMonths: 0,
        hasFamilyInQuebec: true,
        intendsToResideOutsideMontreal: true
      },
      spouse: {
        frenchAbilities: {
          oralComprehension: 7 as FrenchLevel,
          oralProduction: 7 as FrenchLevel,
          writtenComprehension: 7 as FrenchLevel,
          writtenProduction: 7 as FrenchLevel
        },
        age: 32,
        workExperienceQuebecMonths: 12,
        educationLevel: 'university_1st_cycle_2_years' as EducationLevel,
        quebecDiploma: 'university_1st_cycle_2_years' as EducationLevel,
        hasFamilyInQuebec: false
      }
    };
    
    const coreResult = calculatePoints(complexInput);
    
    // Validate key components
    expect(coreResult.hasSpouse).toBe(true);
    expect(coreResult.detailedPoints.adaptationFactors.familyMember).toBe(10);
    expect(coreResult.detailedPoints.adaptationFactors.spouseFrench).toBe(32); // 8*4 for level 7-8
    expect(coreResult.detailedPoints.adaptationFactors.spouseAge).toBe(17); // age 32
    expect(coreResult.detailedPoints.adaptationFactors.spouseWorkExperienceQuebec).toBe(10); // 12 months
    expect(coreResult.detailedPoints.adaptationFactors.spouseEducation).toBe(14);
    expect(coreResult.detailedPoints.adaptationFactors.spouseQuebecDiploma).toBe(21);
    
    // Total should match
    expect(parseInt(finalTotal)).toBe(coreResult.totalPoints);
  });

  test('validates age scoring changes with spouse status', async ({ page }) => {
    // Test age 35 without spouse first
    await page.fill('input[placeholder="Age"]', '35');
    await page.selectOption('select:near(:text("Education Level"))', 'general_secondary');
    await page.fill('input[placeholder="Work experience (months)"]', '24');
    
    const frenchInputs = await page.locator('.french-abilities input[type="number"]').all();
    for (const input of frenchInputs) {
      await input.fill('5');
    }
    
    await page.selectOption('select:near(:text("Labour Market"))', 'balanced');
    await page.fill('input[placeholder*="principal profession"]', '24');
    
    await page.waitForTimeout(100);
    
    // Get single applicant total
    let singleTotal = await page.locator('.summary-value').last().textContent();
    singleTotal = singleTotal?.split(' ')[0] || '0';
    
    // Add spouse
    await page.check('input[type="checkbox"]:has-text("I am applying with a spouse")');
    
    // Fill minimal spouse data
    const spouseSection = page.locator('.spouse-section');
    await spouseSection.locator('input[placeholder="Age"]').fill('30');
    await spouseSection.locator('select').first().selectOption('general_secondary');
    
    const spouseFrench = await spouseSection.locator('.french-abilities input[type="number"]').all();
    for (const input of spouseFrench) {
      await input.fill('1');
    }
    
    await page.waitForTimeout(100);
    
    // Get with spouse total
    let spouseTotal = await page.locator('.summary-value').last().textContent();
    spouseTotal = spouseTotal?.split(' ')[0] || '0';
    
    // Validate age scoring difference
    const singleInput: CalculatorInput = {
      applicant: {
        age: 35,
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
      }
    };
    
    const withSpouseInput: CalculatorInput = {
      ...singleInput,
      spouse: {
        frenchAbilities: {
          oralComprehension: 1 as FrenchLevel,
          oralProduction: 1 as FrenchLevel,
          writtenComprehension: 1 as FrenchLevel,
          writtenProduction: 1 as FrenchLevel
        },
        age: 30,
        workExperienceQuebecMonths: 0,
        educationLevel: 'general_secondary' as EducationLevel,
        hasFamilyInQuebec: false
      }
    };
    
    const singleResult = calculatePoints(singleInput);
    const spouseResult = calculatePoints(withSpouseInput);
    
    // Age 35 should give 75 points without spouse, 68 with spouse
    expect(singleResult.detailedPoints.capitalHuman.age).toBe(75);
    expect(spouseResult.detailedPoints.capitalHuman.age).toBe(68);
    
    expect(parseInt(singleTotal)).toBe(singleResult.totalPoints);
    expect(parseInt(spouseTotal)).toBe(spouseResult.totalPoints);
  });

  test('validates french level scoring boundaries', async ({ page }) => {
    // Test different French level boundaries
    const testCases = [
      { level: 4, expectedPoints: 0 },
      { level: 5, expectedPoints: 25 },
      { level: 6, expectedPoints: 25 },
      { level: 7, expectedPoints: 40 },
      { level: 8, expectedPoints: 40 },
      { level: 9, expectedPoints: 50 },
      { level: 12, expectedPoints: 50 }
    ];
    
    for (const testCase of testCases) {
      // Reset form
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Fill basic data
      await page.fill('input[placeholder="Age"]', '30');
      await page.selectOption('select:near(:text("Education Level"))', 'general_secondary');
      await page.fill('input[placeholder="Work experience (months)"]', '24');
      await page.selectOption('select:near(:text("Labour Market"))', 'balanced');
      await page.fill('input[placeholder*="principal profession"]', '24');
      
      // Set all French levels to test value
      const frenchInputs = await page.locator('.french-abilities input[type="number"]').all();
      for (const input of frenchInputs) {
        await input.fill(testCase.level.toString());
      }
      
      await page.waitForTimeout(100);
      
      // Validate against core logic
      const testInput: CalculatorInput = {
        applicant: {
          age: 30,
          educationLevel: 'general_secondary' as EducationLevel,
          workExperienceMonths: 24,
          frenchAbilities: {
            oralComprehension: testCase.level as FrenchLevel,
            oralProduction: testCase.level as FrenchLevel,
            writtenComprehension: testCase.level as FrenchLevel,
            writtenProduction: testCase.level as FrenchLevel
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
      const expectedFrenchTotal = testCase.expectedPoints * 4; // 4 abilities
      
      expect(coreResult.detailedPoints.capitalHuman.frenchKnowledge).toBe(expectedFrenchTotal);
    }
  });
});
import { test, expect } from '@playwright/test';

test.describe('PTSQ Calculator', () => {
  test('should visit localhost:3000 and test checkbox interactions', async ({ page }) => {
    // Visit the page
    await page.goto('http://localhost:3000/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot to see the initial state
    await page.screenshot({ path: 'initial-state.png' });
    
    // Look for checkboxes on the page
    const checkboxes = await page.locator('input[type="checkbox"]').all();
    console.log(`Found ${checkboxes.length} checkboxes`);
    
    // Test each checkbox
    for (let i = 0; i < checkboxes.length; i++) {
      const checkbox = checkboxes[i];
      
      // Get initial state
      const initialChecked = await checkbox.isChecked();
      console.log(`Checkbox ${i}: initial state = ${initialChecked}`);
      
      // Click the checkbox
      await checkbox.click();
      
      // Wait a bit for any state changes
      await page.waitForTimeout(100);
      
      // Check new state
      const newChecked = await checkbox.isChecked();
      console.log(`Checkbox ${i}: new state = ${newChecked}`);
      
      // Verify the state changed
      expect(newChecked).toBe(!initialChecked);
      
      // Take screenshot after each click
      await page.screenshot({ path: `checkbox-${i}-clicked.png` });
      
      // Look for any value changes on the page (numbers, text, etc.)
      const pageContent = await page.textContent('body');
      console.log(`Page content after clicking checkbox ${i}:`, pageContent?.substring(0, 200));
    }
    
    // Look for any elements that might show calculated values
    const valueElements = await page.locator('[data-testid*="value"], [class*="value"], [id*="value"], input[type="number"], .result, .calculation, .total').all();
    
    for (let i = 0; i < valueElements.length; i++) {
      const element = valueElements[i];
      const value = await element.textContent() || await element.inputValue();
      console.log(`Value element ${i}:`, value);
    }
    
    // Final screenshot
    await page.screenshot({ path: 'final-state.png' });
  });
  
  test('should test specific checkbox behavior and value changes', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    
    // Find all checkboxes and their labels/associated text
    const checkboxes = await page.locator('input[type="checkbox"]').all();
    
    for (let i = 0; i < checkboxes.length; i++) {
      const checkbox = checkboxes[i];
      
      // Try to find associated label or nearby text
      const labelFor = await checkbox.getAttribute('id');
      let labelText = '';
      
      if (labelFor) {
        const label = page.locator(`label[for="${labelFor}"]`);
        if (await label.count() > 0) {
          labelText = await label.textContent() || '';
        }
      }
      
      // If no label found, look for parent element text
      if (!labelText) {
        const parent = checkbox.locator('..');
        labelText = await parent.textContent() || '';
      }
      
      console.log(`Checkbox ${i}: "${labelText.trim()}"`);
      
      // Record initial state of the page
      const initialValues = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input[type="number"], input[type="text"]'));
        return inputs.map(input => (input as HTMLInputElement).value);
      });
      
      // Click checkbox
      await checkbox.click();
      await page.waitForTimeout(200); // Wait for any calculations
      
      // Record new state
      const newValues = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input[type="number"], input[type="text"]'));
        return inputs.map(input => (input as HTMLInputElement).value);
      });
      
      // Compare values
      const valuesChanged = JSON.stringify(initialValues) !== JSON.stringify(newValues);
      console.log(`Checkbox ${i} click resulted in value changes: ${valuesChanged}`);
      
      if (valuesChanged) {
        console.log(`Initial values:`, initialValues);
        console.log(`New values:`, newValues);
      }
    }
  });
});
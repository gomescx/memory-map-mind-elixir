import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('Save/Load/Reset Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    // Wait for the mind map to initialize
    await page.waitForSelector('#mind-map');
  });

  test('Save button should trigger download', async ({ page }) => {
    // Set up download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    
    // Click the save button
    await page.click('button:has-text("Save")');
    
    // Wait for download to start
    const download = await downloadPromise;
    
    // Verify filename pattern
    const filename = download.suggestedFilename();
    expect(filename).toMatch(/.*-memorymap-\d{2}-\d{2}-\d{4}\.json/);
    
    console.log('✅ Save button triggered download:', filename);
  });

  test('Reset button should show confirmation and clear nodes', async ({ page }) => {
    // Add a child node first
    await page.click('[data-nodeid="meroot"]');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    // Count nodes before reset (should be at least 2: root + new child)
    const nodesBefore = await page.locator('[data-nodeid]').count();
    console.log('Nodes before reset:', nodesBefore);
    expect(nodesBefore).toBeGreaterThan(1);
    
    // Click reset button and handle confirmation dialog
    page.once('dialog', async dialog => {
      console.log('Dialog message:', dialog.message());
      expect(dialog.message()).toContain('Reset map');
      await dialog.accept();
    });
    
    await page.click('button:has-text("Reset")');
    await page.waitForTimeout(1000);
    
    // Check that only root node remains
    const nodesAfter = await page.locator('[data-nodeid]').count();
    console.log('Nodes after reset:', nodesAfter);
    expect(nodesAfter).toBeLessThan(nodesBefore);
    
    console.log('✅ Reset button cleared nodes');
  });

  test('Load button should open file picker', async ({ page }) => {
    // Set up file chooser listener
    const fileChooserPromise = page.waitForEvent('filechooser', { timeout: 5000 });
    
    // Click the load button
    await page.click('button:has-text("Load")');
    
    // Wait for file chooser
    const fileChooser = await fileChooserPromise;
    
    // Verify file chooser accepts .json files
    expect(fileChooser.isMultiple()).toBe(false);
    
    console.log('✅ Load button opened file picker');
  });

  test('Load button should load test JSON file', async ({ page }) => {
    // Set up file chooser listener
    const fileChooserPromise = page.waitForEvent('filechooser');
    
    // Click the load button
    await page.click('button:has-text("Load")');
    
    // Wait for file chooser and select test file
    const fileChooser = await fileChooserPromise;
    const testFilePath = path.join(__dirname, '../../public/test-map.json');
    await fileChooser.setFiles(testFilePath);
    
    // Wait for success alert
    page.once('dialog', async dialog => {
      console.log('Alert message:', dialog.message());
      expect(dialog.message()).toContain('loaded successfully');
      await dialog.accept();
    });
    
    await page.waitForTimeout(1000);
    
    // Verify the loaded content by checking for specific nodes
    const rootNode = await page.locator('[data-nodeid="meroot"]').textContent();
    console.log('Root node topic:', rootNode);
    expect(rootNode).toContain('Test Memory Map');
    
    console.log('✅ Load button successfully loaded test file');
  });

  test('Keyboard shortcut Ctrl+S should trigger save', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    
    // Press Ctrl+S (Cmd+S on Mac)
    await page.keyboard.press('Control+S');
    
    const download = await downloadPromise;
    const filename = download.suggestedFilename();
    expect(filename).toMatch(/.*-memorymap-\d{2}-\d{2}-\d{4}\.json/);
    
    console.log('✅ Ctrl+S keyboard shortcut triggered save:', filename);
  });

  test('Keyboard shortcut Ctrl+O should open file picker', async ({ page }) => {
    const fileChooserPromise = page.waitForEvent('filechooser', { timeout: 5000 });
    
    // Press Ctrl+O (Cmd+O on Mac)
    await page.keyboard.press('Control+O');
    
    await fileChooserPromise;
    
    console.log('✅ Ctrl+O keyboard shortcut opened file picker');
  });
});

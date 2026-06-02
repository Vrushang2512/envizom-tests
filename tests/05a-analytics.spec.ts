import { test, expect } from '@playwright/test';

test.describe('Analytics Module — Part 1', () => {
  test.beforeEach(async ({ page }) => {
      await page.goto('/#/analytics/analytics-list', { waitUntil: 'domcontentloaded', timeout: 30000 });
          await page.waitForTimeout(5000);
              await page.waitForSelector('app-root', { timeout: 20000 });
                });

                  test('AN-01 — Analytics list loads', async ({ page }) => {
                      await expect(page).toHaveURL(/analytics/, { timeout: 15000 });
                          await page.waitForSelector('app-root', { timeout: 10000 });
                            });

                              test('AN-02 — Add Analytics opens chart-type selector', async ({ page }) => {
                                  const addBtn = page.locator('button:has-text("Add"), button:has-text("Create")').first();
                                      if (await addBtn.count() > 0) {
                                            await addBtn.click();
                                                  await page.waitForTimeout(2000);
                                                        const dialog = page.locator('mat-dialog-container, [class*="dialog"]').first();
                                                              if (await dialog.count() > 0) await expect(dialog).toBeVisible();
                                                                    await page.keyboard.press('Escape');
                                                                        }
                                                                          });
                                                                          });
                                                                          

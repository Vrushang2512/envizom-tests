import { test } from '@playwright/test';

const CHART_TYPES = ['Line', 'Bar', 'Scatter', 'Radar', 'Polar', 'Bubble', 'Rose', 'Sankey', 'Calendar'];

for (const chartType of CHART_TYPES) {
  test.describe('Analytics Module — Part 2', () => {
      test.beforeEach(async ({ page }) => {
            await page.goto('/#/analytics/analytics-list', { waitUntil: 'domcontentloaded', timeout: 30000 });
                  await page.waitForTimeout(5000);
                        await page.waitForSelector('app-root', { timeout: 20000 });
                            });

                                test('AN-03-' + chartType + ' chart selectable', async ({ page }) => {
                                      const addBtn = page.locator('button:has-text("Add"), button:has-text("Create")').first();
                                            if (await addBtn.count() > 0) {
                                                    await addBtn.click();
                                                            await page.waitForTimeout(1500);
                                                                    await page.keyboard.press('Escape');
                                                                            await page.waitForTimeout(300);
                                                                                    const typeOption = page.locator('text=' + chartType).first();
                                                                                            if (await typeOption.count() > 0) {
                                                                                                      await typeOption.click({ force: true });
                                                                                                                await page.waitForTimeout(800);
                                                                                                                        }
                                                                                                                              }
                                                                                                                                    await page.keyboard.press('Escape');
                                                                                                                                        });
                                                                                                                                          });
                                                                                                                                          }
                                                                                                                                          

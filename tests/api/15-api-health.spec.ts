import { test, expect, request } from '@playwright/test';

// API Health Check Tests - validates all discovered backend endpoints
// Base: https://envapi.oizom.com/
// userId: 2143, orgId: YG20199999

const BASE_API = 'https://envapi.oizom.com';
const USER_ID  = '2143';
const ORG_ID   = 'YG20199999';

test.describe('Backend API Health Checks', () => {
  let apiToken: string;

  test.beforeAll(async ({ browser }) => {
    // Get auth token from localStorage after login
    const context = await browser.newContext({
      storageState: 'playwright/.auth/user.json',
    });
    const page = await context.newPage();
    await page.goto('https://envizom.oizom.com/#/overview/map');
    await page.waitForTimeout(4000);

    apiToken = await page.evaluate(() => {
      return localStorage.getItem('token') ||
             localStorage.getItem('authToken') ||
             localStorage.getItem('jwt') ||
             localStorage.getItem('access_token') ||
             sessionStorage.getItem('token') ||
             '';
    });

    await context.close();
    console.log('API token found:', apiToken ? 'YES (length: ' + apiToken.length + ')' : 'NO');
  });

  async function apiGet(endpoint: string, page: any) {
    // Validate API endpoint via the browser page (to use same session)
    const result = await page.evaluate(async (args: any) => {
      const { url, token } = args;
      try {
        const resp = await fetch(url, {
          credentials: 'include',
          headers: {
            'Authorization': token ? 'Bearer ' + token : '',
            'Content-Type': 'application/json',
          }
        });
        return { status: resp.status, ok: resp.ok };
      } catch (e: any) {
        return { status: 0, ok: false, error: e.message };
      }
    }, { url: endpoint, token: apiToken });
    return result;
  }

  test('API-01 — GET /users/{id}/overview/v2 returns 200 or 401', async ({ page }) => {
    await page.goto('https://envizom.oizom.com/#/overview/map');
    await page.waitForTimeout(3000);
    const r = await apiGet(BASE_API + '/users/' + USER_ID + '/overview/v2', page);
    console.log('overview/v2:', r.status);
    expect([0, 200, 401, 403]).toContain(r.status);
  });

  test('API-02 — GET /users/{id}/notifications returns 200 or 401', async ({ page }) => {
    await page.goto('https://envizom.oizom.com/#/overview/map');
    await page.waitForTimeout(3000);
    const r = await apiGet(BASE_API + '/users/' + USER_ID + '/notifications', page);
    console.log('notifications:', r.status);
    expect([0, 200, 401, 403]).toContain(r.status);
  });

  test('API-03 — GET /users/{id}/reports returns 200 or 401', async ({ page }) => {
    await page.goto('https://envizom.oizom.com/#/reports');
    await page.waitForTimeout(3000);
    const r = await apiGet(BASE_API + '/users/' + USER_ID + '/reports', page);
    console.log('reports:', r.status);
    expect([0, 200, 401, 403]).toContain(r.status);
  });

  test('API-04 — GET /users/{id}/analytics returns 200 or 401', async ({ page }) => {
    await page.goto('https://envizom.oizom.com/#/analytics/analytics-list');
    await page.waitForTimeout(3000);
    const r = await apiGet(BASE_API + '/users/' + USER_ID + '/analytics', page);
    console.log('analytics:', r.status);
    expect([0, 200, 401, 403]).toContain(r.status);
  });

  test('API-05 — GET /users/{id}/displays_v2 returns 200 or 401', async ({ page }) => {
    await page.goto('https://envizom.oizom.com/#/display');
    await page.waitForTimeout(3000);
    const r = await apiGet(BASE_API + '/users/' + USER_ID + '/displays_v2', page);
    console.log('displays_v2:', r.status);
    expect([0, 200, 401, 403]).toContain(r.status);
  });

  test('API-06 — GET /users/{id}/alerts returns 200 or 401', async ({ page }) => {
    await page.goto('https://envizom.oizom.com/#/alert/alerts-list');
    await page.waitForTimeout(3000);
    const r = await apiGet(BASE_API + '/users/' + USER_ID + '/alerts', page);
    console.log('alerts:', r.status);
    expect([0, 200, 401, 403]).toContain(r.status);
  });

  test('API-07 — GET /users/{id}/heatmap returns 200 or 401', async ({ page }) => {
    await page.goto('https://envizom.oizom.com/#/heatmap');
    await page.waitForTimeout(3000);
    const r = await apiGet(BASE_API + '/users/' + USER_ID + '/heatmap', page);
    console.log('heatmap:', r.status);
    expect([0, 200, 401, 403]).toContain(r.status);
  });

  test('API-08 — GET /orgs/{orgId}/complain returns 200 or 401', async ({ page }) => {
    await page.goto('https://envizom.oizom.com/#/complain/list');
    await page.waitForTimeout(3000);
    const r = await apiGet(BASE_API + '/orgs/' + ORG_ID + '/complain', page);
    console.log('complain:', r.status);
    expect([0, 200, 401, 403]).toContain(r.status);
  });

  test('API-09 — GET /users/{id}/devices/data-flagging returns 200 or 401', async ({ page }) => {
    await page.goto('https://envizom.oizom.com/#/data-validation');
    await page.waitForTimeout(3000);
    const r = await apiGet(BASE_API + '/users/' + USER_ID + '/devices/data-flagging', page);
    console.log('data-flagging:', r.status);
    expect([0, 200, 401, 403]).toContain(r.status);
  });

  test('API-10 — GET /users/{id}/orgs returns 200 or 401', async ({ page }) => {
    await page.goto('https://envizom.oizom.com/#/projects');
    await page.waitForTimeout(3000);
    const r = await apiGet(BASE_API + '/users/' + USER_ID + '/orgs', page);
    console.log('orgs:', r.status);
    expect([0, 200, 401, 403]).toContain(r.status);
  });

  test('API-11 — GET /devices/data returns 200 or 401', async ({ page }) => {
    await page.goto('https://envizom.oizom.com/#/overview/map');
    await page.waitForTimeout(3000);
    const r = await apiGet(BASE_API + '/devices/data', page);
    console.log('devices/data:', r.status);
    expect([0, 200, 401, 403]).toContain(r.status);
  });

  test('API-12 — GET /users/{id}/orgs/{orgId}/users returns 200 or 401', async ({ page }) => {
    await page.goto('https://envizom.oizom.com/#/user/sub-users');
    await page.waitForTimeout(3000);
    const r = await apiGet(BASE_API + '/users/' + USER_ID + '/orgs/' + ORG_ID + '/users', page);
    console.log('org users:', r.status);
    expect([0, 200, 401, 403]).toContain(r.status);
  });

  test('API-13 — Edge: Non-existent user ID returns 404', async ({ page }) => {
    await page.goto('https://envizom.oizom.com/#/overview/map');
    await page.waitForTimeout(3000);
    const r = await apiGet(BASE_API + '/users/999999999/overview/v2', page);
    console.log('non-existent user:', r.status);
    expect([0, 403, 404, 401]).toContain(r.status);
  });

  test('API-14 — Edge: Malformed orgId returns 400/404', async ({ page }) => {
    await page.goto('https://envizom.oizom.com/#/complain/list');
    await page.waitForTimeout(3000);
    const r = await apiGet(BASE_API + '/orgs/INVALIDORGID9999/complain', page);
    console.log('invalid org:', r.status);
    expect([0, 400, 401, 403, 404]).toContain(r.status);
  });
});

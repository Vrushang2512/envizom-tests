// Split into 05a-analytics.spec.ts and 05b-analytics.spec.ts
// This file is intentionally disabled to avoid duplicate test runs.

import { test } from '@playwright/test';

test.describe.skip('Analytics (disabled - see 05a and 05b)', () => {
    test('placeholder', async () => {});
});

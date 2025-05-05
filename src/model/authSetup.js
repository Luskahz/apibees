import { chromium } from 'playwright';
import fs from 'fs';

const BEES_USERNAME = 'monitoramento@imaruilitoral.com.br';
const BEES_PASSWORD = 'Imarui@29';

(async () => {
  const browser = await chromium.launch({ headless: false }); // para você ver o login
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://deliver-portal.bees-platform.com/', { waitUntil: 'networkidle' });

  await page.fill('input#signInName', BEES_USERNAME);
  await page.fill('input#password', BEES_PASSWORD);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button#next'),
  ]);

  console.log('✅ Login feito. Salvando sessão...');
  await context.storageState({ path: 'auth.json' });

  await browser.close();
})();

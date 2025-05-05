import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const {
  DOWNLOAD_DIR = path.resolve(process.cwd(), 'downloads'),
} = process.env;

async function getBeesApiController() {
  console.log('🔄 Iniciando download do Bees Delivery CSV…');

  if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    acceptDownloads: true,
    downloadsPath: DOWNLOAD_DIR,
    storageState: 'auth.json', // Usa o login salvo
  });
  const page = await context.newPage();

  try {
    await page.goto('https://deliver-portal.bees-platform.com/control-tower', { waitUntil: 'networkidle' });

    console.log('✅ Sessão restaurada com sucesso');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('button[data-test-id="download-btn"]'),
    ]);

    const filename = `bees-visits-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
    const filePath = path.join(DOWNLOAD_DIR, filename);
    await download.saveAs(filePath);
    console.log(`📥 CSV salvo com sucesso: ${filePath}`);
  } catch (err) {
    console.error('❌ Erro no download:', err);
  } finally {
    await browser.close();
    console.log('🔒 Navegador fechado');
  }
}

export default getBeesApiController;

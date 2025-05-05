import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const {
  DOWNLOAD_DIR = path.resolve(process.cwd(), 'downloads'),
} = process.env;

async function getCSV() {
  console.log('🔄 Iniciando download do Bees Delivery CSV…');

  if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
    console.log(`📂 Diretório de downloads criado: ${DOWNLOAD_DIR}`);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    acceptDownloads: true,
    downloadsPath: DOWNLOAD_DIR,
    storageState: 'auth.json', // Usa o login salvo
  });
  const page = await context.newPage();

  try {
    console.log('🔗 Acessando o portal de controle...');
    await page.goto('https://deliver-portal.bees-platform.com/control-tower', { waitUntil: 'networkidle' });
    console.log('✅ Página carregada com sucesso');

    console.log('⏳ Esperando o botão de download ficar visível...');
    // Espera o botão de download estar visível
    await page.waitForSelector('[data-test-id="download-btn"]', { state: 'visible', timeout: 60000 });
    console.log('✅ Botão de download encontrado');

    // Aumenta o timeout e aguarda o evento de download
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }), // espera até 60 segundos
      page.click('[data-test-id="download-btn"]'), // Clica no botão de download
    ]);
    console.log('🚀 Iniciando o download...');

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

export default getCSV;

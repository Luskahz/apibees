import { chromium } from 'playwright';
import fs from 'fs';

const BEES_USERNAME = 'monitoramento@imaruilitoral.com.br';
const BEES_PASSWORD = 'Imarui@29';

(async () => {
  try {
    console.log('🔄 Iniciando o processo de login...');

    const browser = await chromium.launch({ headless: false }); // para ver o login
    console.log('🌐 Navegador iniciado.');

    const context = await browser.newContext();
    const page = await context.newPage();
    console.log('📄 Nova página criada.');

    console.log('🔗 Acessando a página de login...');
    await page.goto('https://deliver-portal.bees-platform.com/', { waitUntil: 'networkidle' });
    console.log('✅ Página carregada com sucesso.');

    console.log('⏳ Preenchendo campo de login...');
    await page.fill('input#signInName', BEES_USERNAME);
    console.log('🔑 Campo de nome de usuário preenchido.');

    console.log('⏳ Preenchendo campo de senha...');
    await page.fill('input#password', BEES_PASSWORD);
    console.log('🔑 Campo de senha preenchido.');

    console.log('🚀 Realizando login...');
    await page.click('button#next');
    
    // Usando o método recomendado para aguardar a navegação
    await page.waitForLoadState('networkidle');
    console.log('✅ Login realizado com sucesso.');

    console.log('💾 Salvando o estado da sessão...');
    await context.storageState({ path: 'auth.json' });
    console.log('✅ Sessão salva com sucesso.');

    console.log('🔒 Fechando navegador...');
    await browser.close();
    console.log('✔️ Navegador fechado.');
  } catch (error) {
    console.error(`❌ !Erro: ${error.message}`);
  }
})();

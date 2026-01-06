const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const baseUrl = 'http://localhost:5173';
const outputDir = path.join(__dirname, '../play-store-assets/screenshots');

// Criar diretório de screenshots
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const screenshots = [
  {
    name: '01-landing',
    url: '/',
    description: 'Tela inicial do VITAS',
    waitFor: 'h1'
  },
  {
    name: '02-login',
    url: '/login',
    description: 'Tela de login',
    waitFor: 'input[type="email"]'
  },
  {
    name: '03-cadastro',
    url: '/cadastro',
    description: 'Tela de cadastro',
    waitFor: 'input[name="nome"]'
  },
  {
    name: '04-chamados',
    url: '/chamados',
    description: 'Lista de chamados (requer login)',
    waitFor: '.chamado-card',
    needsAuth: true
  },
  {
    name: '05-checkout',
    url: '/checkout',
    description: 'Checkout PIX (requer dados)',
    waitFor: '.checkout-container',
    needsAuth: true
  },
  {
    name: '06-faq',
    url: '/faq',
    description: 'Perguntas Frequentes',
    waitFor: '.faq-container'
  }
];

async function takeScreenshots() {
  console.log('🚀 Iniciando captura de screenshots...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Configurar viewport para smartphone (1080x1920 - 9:16)
  await page.setViewport({
    width: 1080,
    height: 1920,
    deviceScaleFactor: 2
  });

  for (const screenshot of screenshots) {
    try {
      console.log(`📸 Capturando: ${screenshot.description}...`);
      
      // Navegar para página
      await page.goto(`${baseUrl}${screenshot.url}`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Aguardar elemento específico (ou timeout de 3s)
      try {
        await page.waitForSelector(screenshot.waitFor, { timeout: 3000 });
      } catch (e) {
        console.log(`  ⚠️  Elemento ${screenshot.waitFor} não encontrado, continuando...`);
      }

      // Aguardar um pouco para animações
      await page.waitForTimeout(1000);

      // Tirar screenshot
      const screenshotPath = path.join(outputDir, `${screenshot.name}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: false
      });

      console.log(`  ✅ Salvo: ${screenshot.name}.png`);
    } catch (error) {
      console.log(`  ❌ Erro ao capturar ${screenshot.name}: ${error.message}`);
    }
  }

  await browser.close();
  
  console.log('\n🎉 Screenshots capturados com sucesso!');
  console.log(`📁 Localização: ${outputDir}`);
  console.log('\n📋 Arquivos gerados:');
  
  const files = fs.readdirSync(outputDir);
  files.forEach(file => {
    const stats = fs.statSync(path.join(outputDir, file));
    console.log(`  - ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  });
}

takeScreenshots().catch(console.error);

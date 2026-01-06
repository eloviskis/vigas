import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [192, 512];
const publicDir = join(__dirname, '../public');

async function generateIcons() {
  // SVG base
  const svg = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#2563eb" rx="64"/>
  <text x="256" y="380" font-family="Arial, sans-serif" font-size="320" font-weight="bold" fill="white" text-anchor="middle">V</text>
</svg>`;

  for (const size of sizes) {
    const outputPath = join(publicDir, `icon-${size}x${size}.png`);
    
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`✓ Criado ${outputPath}`);
  }
  
  console.log('\n✅ Ícones PNG gerados com sucesso!');
}

generateIcons().catch(console.error);

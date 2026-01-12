import { test, expect } from '@playwright/test';

test.describe('VITAS Full Flow E2E', () => {
  test('cliente faz login e cria chamado', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"]', 'cliente@example.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button:has-text("Entrar")');
    await expect(page).toHaveURL('/chamados', { timeout: 5000 });
    
    await page.click('button:has-text("Novo Chamado")');
    await page.fill('textarea[name="descricao"]', 'Conserto de torneira com vazamento');
    await page.click('button:has-text("Criar")');
    await expect(page.locator('text=Chamado criado com sucesso')).toBeVisible();
  });

  test('operador faz triagem', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"]', 'operador@example.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button:has-text("Entrar")');
    
    await page.click('a:has-text("Triagem")');
    await page.click('button:has-text("Processar")');
    await expect(page.locator('text=Profissional selecionado')).toBeVisible();
  });

  test('cliente faz checkout PIX', async ({ page }) => {
    await page.goto('/checkout/orc-123');
    await page.click('button:has-text("PIX")');
    await expect(page.locator('canvas')).toBeVisible(); // QR Code
  });

  test('admin gerencia pagamentos', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button:has-text("Entrar")');
    
    await page.click('a:has-text("Pagamentos")');
    await page.fill('input[placeholder*="Buscar"]', 'João');
    await expect(page.locator('table tbody tr')).toHaveCount(1, { timeout: 3000 });
  });
});

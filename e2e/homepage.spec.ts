import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the homepage correctly', async ({ page }) => {
    await page.goto('/');

    // Check main elements are present
    await expect(
      page.getByRole('heading', { name: 'LezzetKeşif' })
    ).toBeVisible();
    await expect(
      page.getByText("Ankara'nın en iyi restoranlarını keşfedin")
    ).toBeVisible();

    // Check CTA buttons
    await expect(
      page.getByRole('link', { name: 'Restoranları Keşfet' })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: "Blog'u Oku" })).toBeVisible();
  });

  test('should navigate to restaurants page', async ({ page }) => {
    await page.goto('/');

    // Use footer link for reliable click across devices
    await page
      .getByRole('contentinfo')
      .getByRole('link', { name: 'Restoranlar' })
      .click();
    await expect(page).toHaveURL('/restaurants');
  });

  test('should navigate to blog page', async ({ page }) => {
    await page.goto('/');

    // Use footer link for reliable click across devices
    await page
      .getByRole('contentinfo')
      .getByRole('link', { name: 'Blog' })
      .click();
    await expect(page).toHaveURL('/blog');
  });

  test('should display featured restaurants', async ({ page }) => {
    await page.goto('/');

    // Check featured restaurants section
    await expect(
      page.getByRole('heading', { name: 'Öne Çıkan Restoranlar' })
    ).toBeVisible();

    // Check that restaurant cards are displayed
    const restaurantCards = page.locator('[data-testid="restaurant-card"]');
    await expect(restaurantCards).toHaveCount(3);
  });

  test('should display latest blog posts', async ({ page }) => {
    await page.goto('/');

    // Check latest blog posts section
    await expect(
      page.getByRole('heading', { name: 'Son Blog Yazıları' })
    ).toBeVisible();

    // Check that blog cards are displayed
    const blogCards = page.locator('[data-testid="blog-card"]');
    await expect(blogCards).toHaveCount(2);
  });

  test('should display stats section', async ({ page }) => {
    await page.goto('/');

    // Check stats section
    await expect(page.getByText('50+')).toBeVisible();
    await expect(page.getByText('1000+')).toBeVisible();
    await expect(page.getByText('500+')).toBeVisible();
    await expect(page.getByText('Değerlendirme')).toBeVisible();
    await expect(page.getByText('Mutlu Müşteri')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check that mobile navigation is accessible
    await expect(page.locator('button[aria-label="Menu"]')).toBeVisible();

    // Check that content is still readable
    await expect(
      page.getByRole('heading', { name: 'LezzetKeşif' })
    ).toBeVisible();
  });
});

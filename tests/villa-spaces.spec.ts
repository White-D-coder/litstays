import { test, expect } from '@playwright/test';

test('merged villa explorer switches decoded photos and supports keyboard tabs without moving the frame', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/#bungalow');
  const section = page.locator('#bungalow');
  await expect(section.getByRole('heading', { level: 2 })).toHaveText('Designed fortime well spent.');
  await expect(page.locator('section#spaces')).toHaveCount(0);
  const tabs = section.getByRole('tablist');
  const stage = section.locator('.villa-stage');
  await stage.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const before = await stage.boundingBox();
  const pool = tabs.getByRole('tab', { name: 'Private pool' });
  await pool.click();
  await expect(pool).toHaveAttribute('aria-selected', 'true');
  const panel = section.getByRole('tabpanel', { name: 'Private pool' });
  await expect(panel).toContainText('Take a dip. Stay a while. Repeat.');
  expect(await panel.locator('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(panel).toHaveCSS('opacity', '1');
  expect(await stage.boundingBox()).toEqual(before);

  await page.keyboard.press('ArrowRight');
  const bedroom = tabs.getByRole('tab', { name: 'Bedrooms' });
  await expect(bedroom).toBeFocused();
  await expect(bedroom).toHaveAttribute('aria-selected', 'true');
  await expect(section.getByRole('tabpanel', { name: 'Bedrooms' })).toContainText('Three bedrooms');
  await page.keyboard.press('End');
  await expect(tabs.getByRole('tab', { name: 'The arrival' })).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Home');
  await expect(tabs.getByRole('tab', { name: 'Living room' })).toHaveAttribute('aria-selected', 'true');
  await expect(section.getByRole('link', { name: 'Explore the photo journal' })).toHaveAttribute('href', '#gallery');
});

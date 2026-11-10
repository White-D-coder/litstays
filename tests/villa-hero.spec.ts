import { test, expect } from '@playwright/test';
import { villas } from '../src/lib/villas';

for (const villa of villas) {
  test(`${villa.name} hero crossfades its own photos and can be paused`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`/villas/${villa.slug}/`);
    const hero = page.getByRole('region', { name: `${villa.name} hero slideshow`, exact: true });
    const title = page.locator('#villa-heading');
    await expect(title).toHaveCSS('-webkit-text-fill-color', 'rgb(255, 255, 255)');
    await expect(title).toHaveCSS('-webkit-text-stroke-width', '0px');
    await expect(hero).toHaveAttribute('data-active-slide', `${villa.slug}-hero`);
    const before = await title.boundingBox();
    await expect(hero).not.toHaveAttribute('data-active-slide', `${villa.slug}-hero`, { timeout: 10000 });
    const active = await hero.getAttribute('data-active-slide');
    const photo = villa.photos!.find(photo => photo.id === active)!;
    expect(photo).toBeTruthy();
    await expect(hero.locator('img').first()).toHaveAttribute('src', photo.src.replace('-1920.webp', /./.source ? '-1920.webp' : '-1920.webp'));
    expect(await title.boundingBox()).toEqual(before);
    await page.getByRole('button', { name: 'Pause villa slideshow', exact: true }).click();
    await expect(hero).toHaveAttribute('data-playing', 'false');
    await page.waitForTimeout(5400);
    await expect(hero).toHaveAttribute('data-active-slide', active!);
    await page.getByRole('button', { name: 'Play villa slideshow', exact: true }).click();
    await expect(hero).toHaveAttribute('data-playing', 'true');
  });
}

test('villa hero stays static with reduced motion and stops while covered by page content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/villas/villa-avante/');
  const hero = page.getByRole('region', { name: 'Villa Avante hero slideshow', exact: true });
  await expect(hero).toHaveAttribute('data-playing', 'false');
  await page.waitForTimeout(5400);
  await expect(hero).toHaveAttribute('data-active-slide', 'villa-avante-hero');
  await expect(page.getByRole('button', { name: 'Pause villa slideshow' })).toBeHidden();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => window.scrollTo({ top: innerHeight + 300, behavior: 'instant' }));
  await expect(hero).toHaveAttribute('data-playing', 'false');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(hero).toHaveAttribute('data-playing', 'true');
});

test('a failed next hero photo is skipped without clearing the current image', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.route('**/avante-15-*.webp', route => route.abort());
  await page.goto('/villas/villa-avante/');
  const hero = page.getByRole('region', { name: 'Villa Avante hero slideshow', exact: true });
  await expect(hero).toHaveAttribute('data-active-slide', 'villa-avante-hero');
  await expect(hero).toHaveAttribute('data-active-slide', 'avante-1', { timeout: 18000 });
  expect(await hero.locator('img').first().evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
});

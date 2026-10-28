import { test, expect } from '@playwright/test';

test('headings stay upright, wrap naturally and select their complete text together', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('h1 br, h2 br, h3 br')).toHaveCount(0);
  expect(await page.locator('h1, h2, h3, h1 em, h2 em, h3 em').evaluateAll(elements => elements.every(element => getComputedStyle(element).fontStyle === 'normal'))).toBe(true);
  const title = page.locator('#hero-heading');
  await title.dblclick();
  expect(await page.evaluate(() => getSelection()?.toString())).toBe('Some places stay with you.');
  await expect(page.locator('#location')).toHaveCount(0);
  await expect(page.locator('a[href="#location"]')).toHaveCount(0);
});

test('the full scrapbook stays in one viewport while scroll turns its pages', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#bungalow');
  const track = page.locator('.villa-book-track');
  await expect(track).toHaveAttribute('data-scroll-book', 'true');
  await page.evaluate(() => {
    const track = document.querySelector<HTMLElement>('.villa-book-track')!;
    const book = track.querySelector<HTMLElement>('.villa-explorer')!;
    const top = track.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(book).top);
    scrollTo({ top: top + (track.offsetHeight - book.offsetHeight) * .6, behavior: 'instant' });
  });
  await expect(page.getByRole('tab', { name: 'Bedrooms', exact: true })).toHaveAttribute('aria-selected', 'true');
  const heading = await page.locator('#bungalow-heading').boundingBox();
  const footer = await page.locator('.villa-explorer-footer').boundingBox();
  expect(heading!.y).toBeGreaterThanOrEqual(80);
  expect(footer!.y + footer!.height).toBeLessThanOrEqual(900);
});

test('property details use real icons on green and the journal contains six masonry frames', async ({ page }) => {
  await page.goto('/');
  const facts = page.locator('#property-details');
  await expect(facts).toHaveCSS('background-color', 'rgb(14, 31, 13)');
  await expect(page.locator('#experience')).toHaveCSS('background-color', 'rgb(221, 222, 207)');
  await expect(facts.locator('.facts-inventory dt > svg')).toHaveCount(5);
  await expect(page.locator('.gallery-journal > .reveal')).toHaveCount(6);
  const watermark = page.locator('.intro-leaf-watermark');
  await expect(watermark).toHaveAttribute('src', '/images/intro-leaves.webp');
  expect(await watermark.evaluate(element => Number(getComputedStyle(element).opacity))).toBeLessThan(.15);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => document.fonts.ready);
  const sectionBounds = await facts.boundingBox();
  const linkBounds = await facts.getByRole('link', { name: 'Full property details' }).boundingBox();
  expect(linkBounds!.y + linkBounds!.height).toBeLessThanOrEqual(sectionBounds!.y + sectionBounds!.height);
});

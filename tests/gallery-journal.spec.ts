import { test, expect } from '@playwright/test';
import { galleryMotion, galleryScenes } from '../src/lib/gallery-slides';

test.use({ reducedMotion: 'no-preference' });

test('journal photographs and ivory captions crossfade together and open the matching photograph', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/#gallery');
  const journal = page.locator('.gallery-journal');
  await journal.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(journal).toHaveAttribute('data-playing', 'true');
  await expect(journal).toHaveAttribute('data-scene', '0');
  await page.waitForTimeout(900);
  const before = await journal.boundingBox();
  const incoming = journal.locator('.gallery-journal-slide.is-incoming.is-fading');
  await expect(incoming).toHaveCount(galleryScenes[1].photos.length, { timeout: galleryMotion.holdMs + 5000 });
  expect(await incoming.locator('img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await page.waitForTimeout(300);
  const opacity = await incoming.first().evaluate(element => Number(getComputedStyle(element).opacity));
  expect(opacity).toBeGreaterThan(0);
  expect(opacity).toBeLessThan(1);
  await expect(incoming.first().locator('.gallery-journal-caption')).toHaveCSS('color', 'rgb(243, 239, 223)');
  await expect(journal).toHaveAttribute('data-scene', '1', { timeout: 3000 });
  expect(await journal.boundingBox()).toEqual(before);
  await expect(journal.getByRole('button', { name: 'Open photograph: Room for good company', exact: true })).toBeVisible();
  await expect(journal.getByRole('button', { name: 'Open photograph: Nowhere to rush to', exact: true })).toBeVisible();
  await journal.getByRole('button', { name: 'Open photograph: Take the afternoon off', exact: true }).click();
  const gallery = page.getByRole('dialog', { name: 'Property photo gallery' });
  await expect(gallery).toBeVisible();
  await expect(gallery.locator('.lightbox-image img')).toHaveAttribute('alt', /Blue private swimming pool/);
  await expect(journal).toHaveAttribute('data-playing', 'false');
});

test('reduced motion retains the original journal photographs without automatic transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#gallery');
  const journal = page.locator('.gallery-journal');
  await journal.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(journal).toHaveAttribute('data-playing', 'false');
  await page.waitForTimeout(galleryMotion.holdMs + 200);
  await expect(journal).toHaveAttribute('data-scene', '0');
  await expect(journal.locator('.is-incoming')).toHaveCount(0);
  await expect(journal.getByRole('button', { name: 'Open photograph: A warm arrival', exact: true })).toBeVisible();
});

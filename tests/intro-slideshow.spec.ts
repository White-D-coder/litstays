import { test, expect } from '@playwright/test';
import { introSlideshow } from '../src/lib/intro-slides';

test.use({ reducedMotion: 'no-preference' });

test('photos crossfade only after loading, can be paused, and keep the frame and text stable', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const frame = page.getByRole('region', { name: 'Villa Archway photo slideshow' });
  await frame.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(frame).toHaveAttribute('data-active-slide', 'balcony');
  await expect(frame).toHaveAttribute('data-playing', 'true');
  await page.waitForTimeout(1400);
  const before = await page.locator('#introduction-heading').boundingBox();
  const frameBefore = await frame.boundingBox();
  const incoming = frame.locator('.intro-slide-layer.is-incoming.is-fading');
  await incoming.waitFor({ state: 'attached', timeout: introSlideshow.holdMs + 5000 });
  await expect(frame).toHaveAttribute('data-active-slide', 'balcony');
  expect(await incoming.locator('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await page.waitForTimeout(300);
  const opacity = await incoming.evaluate(element => Number(getComputedStyle(element).opacity));
  expect(opacity).toBeGreaterThan(0);
  expect(opacity).toBeLessThan(1);
  await expect(frame).toHaveAttribute('data-active-slide', 'bedroom', { timeout: 4000 });
  expect(await frame.boundingBox()).toEqual(frameBefore);
  expect(await page.locator('#introduction-heading').boundingBox()).toEqual(before);

  await frame.getByRole('button', { name: 'Pause photo slideshow' }).click();
  await page.mouse.move(0, 0);
  await expect(frame.getByRole('button', { name: 'Play photo slideshow' })).toBeVisible();
  await page.waitForTimeout(introSlideshow.holdMs + 400);
  await expect(frame).toHaveAttribute('data-active-slide', 'bedroom');
  const next = frame.getByRole('button', { name: 'Next slideshow photograph' });
  await next.focus(); await page.keyboard.press('Enter');
  await expect(frame).toHaveAttribute('data-active-slide', 'living', { timeout: 4000 });
  expect(await frame.boundingBox()).toEqual(frameBefore);
});

test('off-screen slideshow stays still and title and paragraphs fade once into view', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const frame = page.locator('.intro-slideshow');
  await expect(frame).toHaveAttribute('data-playing', 'false');
  await page.waitForTimeout(introSlideshow.holdMs + 300);
  await expect(frame).toHaveAttribute('data-active-slide', 'balcony');
  const heading = page.locator('#introduction-heading');
  await heading.scrollIntoViewIfNeeded();
  await expect.poll(() => heading.evaluate(element => element.getAnimations().some(animation => animation.playState === 'running'))).toBe(true);
  await heading.evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)));
  await expect(heading).toHaveCSS('opacity', '1');
  await expect(heading).toContainText('the everyday.');
  const paragraph = page.locator('.intro-copy > p').last();
  await paragraph.scrollIntoViewIfNeeded();
  await paragraph.evaluate(async element => {
    await new Promise(resolve => requestAnimationFrame(resolve));
    await Promise.all(element.getAnimations().map(animation => animation.finished));
  });
  await expect(paragraph).toHaveCSS('opacity', '1');
});

test('reduced motion disables autoplay and fades, while manual photo navigation still works', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  const frame = page.locator('.intro-slideshow');
  await frame.scrollIntoViewIfNeeded();
  await expect(frame).toHaveAttribute('data-playing', 'false');
  await expect(frame.getByRole('button', { name: 'Pause photo slideshow' })).toHaveCount(0);
  await page.waitForTimeout(introSlideshow.holdMs + 300);
  await expect(frame).toHaveAttribute('data-active-slide', 'balcony');
  expect(await page.locator('#introduction-heading').evaluate(element => element.getAnimations().length)).toBe(0);
  await frame.getByRole('button', { name: 'Next slideshow photograph' }).click();
  await expect(frame).toHaveAttribute('data-active-slide', 'bedroom');
  await expect(frame.locator('.is-incoming')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

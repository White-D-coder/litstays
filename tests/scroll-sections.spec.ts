import { test, expect } from '@playwright/test';

for (const viewport of [{ width: 1440, height: 768 }, { width: 390, height: 844 }]) {
  test(`scrapbook shows its four pages before releasing the next section at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/#bungalow');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.villa-book-track')).toHaveAttribute('data-scroll-book', 'true');
    const geometry = await page.evaluate(() => {
      const track = document.querySelector<HTMLElement>('.villa-book-track')!;
      const book = track.querySelector<HTMLElement>('.villa-explorer')!;
      return { start: track.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(book).top), distance: track.offsetHeight - book.offsetHeight };
    });
    const labels = ['Living room', 'Private pool', 'Bedrooms', 'The arrival'];
    for (const [index, label] of labels.entries()) {
      await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), geometry.start + geometry.distance * ((index + .4) / 4));
      await expect(page.getByRole('tab', { name: label, exact: true })).toHaveAttribute('aria-selected', 'true');
      const heading = await page.locator('#bungalow-heading').boundingBox();
      const footer = await page.locator('.villa-explorer-footer').boundingBox();
      expect(heading!.y).toBeGreaterThanOrEqual(70);
      expect(footer!.y + footer!.height).toBeLessThanOrEqual(viewport.height);
      expect((await page.locator('#experience').boundingBox())!.y).toBeGreaterThanOrEqual(viewport.height);
      await expect(page.locator('.villa-turn-sheet')).toHaveCount(0, { timeout: 2500 });
    }
    await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), geometry.start + geometry.distance + viewport.height * .55);
    await expect(page.locator('#experience')).toBeInViewport();
    await expect(page.getByRole('tab', { name: 'The arrival', exact: true })).toHaveAttribute('aria-selected', 'true');
    await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), geometry.start + geometry.distance * .6);
    await expect(page.getByRole('tab', { name: 'Bedrooms', exact: true })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.villa-turn-sheet')).toHaveCSS('animation-name', 'villa-page-backward');
  });

  test(`FAQ reveals all eight questions downwards and restores More questions upwards at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/#faq');
    const more = page.locator('.lit-faq-more');
    await expect(more).toHaveAttribute('data-scroll-reveal', 'true');
    await page.mouse.wheel(0, 220);
    await expect(more).toHaveAttribute('open', '');
    await expect(page.locator('.lit-faq-item:visible')).toHaveCount(8);
    await expect(more.locator(':scope > summary')).not.toBeVisible();
    await page.waitForTimeout(550);
    await page.mouse.wheel(0, -100);
    await expect(more).not.toHaveAttribute('open', '');
    await expect(page.locator('.lit-faq-item:visible')).toHaveCount(4);
    await expect(more.locator(':scope > summary')).toBeVisible();
  });
}

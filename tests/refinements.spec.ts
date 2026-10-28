import { test, expect } from '@playwright/test';

test('scrolling the villa book turns a photo page instead of crossfading it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/#bungalow');
  const track = page.locator('.villa-book-track');
  await expect(track).toHaveAttribute('data-scroll-book', 'true');
  await page.evaluate(() => {
    const track = document.querySelector<HTMLElement>('.villa-book-track')!;
    const spread = track.querySelector<HTMLElement>('.villa-explorer')!;
    const top = track.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(spread).top);
    window.scrollTo({ top: top + (track.offsetHeight - spread.offsetHeight) * .32, behavior: 'instant' });
  });
  await expect(page.getByRole('tab', { name: 'Private pool', exact: true })).toHaveAttribute('aria-selected', 'true');
  const sheet = page.locator('.villa-turn-sheet');
  await expect(sheet).toBeAttached();
  await expect(sheet).toHaveCSS('animation-name', 'villa-page-forward');
  expect(await sheet.evaluate(element => (element.getAnimations()[0].effect as KeyframeEffect).getKeyframes().at(-1)?.transform)).toBe('rotateY(-180deg)');
  await expect(page.locator('.villa-panel.is-active')).toHaveCSS('transition-duration', '0s');
  await expect(sheet).toHaveCount(0, { timeout: 2500 });
  await page.evaluate(() => {
    const track = document.querySelector<HTMLElement>('.villa-book-track')!;
    const spread = track.querySelector<HTMLElement>('.villa-explorer')!;
    window.scrollTo({ top: track.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(spread).top), behavior: 'instant' });
  });
  await expect(page.getByRole('tab', { name: 'Living room', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(sheet).toHaveCSS('animation-name', 'villa-page-backward');
  expect(await sheet.evaluate(element => (element.getAnimations()[0].effect as KeyframeEffect).getKeyframes().at(0)?.transform)).toBe('rotateY(-180deg)');
});

test('gallery refresh changes the frame arrangement and hover highlights text without zooming photos', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#gallery');
  const journal = page.locator('.gallery-journal');
  await expect(journal).toHaveAttribute('data-layout', /^[012]$/);
  const first = await journal.getAttribute('data-layout');
  await page.reload();
  await expect(journal).toHaveAttribute('data-layout', String((Number(first) + 1) % 3));
  expect(await journal.evaluate(element => parseFloat(getComputedStyle(element).gap))).toBeLessThanOrEqual(13);
  const photo = journal.getByRole('button').first();
  await photo.hover();
  await expect(photo.locator('img')).toHaveCSS('transform', 'none');
  await expect(photo.locator('.gallery-journal-caption')).toHaveCSS('background-color', 'rgb(243, 239, 223)');
  await expect(photo.locator('.gallery-journal-caption')).toHaveCSS('color', 'rgb(14, 31, 13)');
});

test('scrolling up restores the initial four FAQ questions', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/#faq');
  const more = page.locator('.lit-faq-more');
  await more.locator(':scope > summary').click();
  await expect(more).toHaveAttribute('open', '');
  await page.waitForTimeout(550);
  await page.evaluate(() => {
    const faq = document.querySelector('#faq')!;
    window.scrollTo({ top: faq.getBoundingClientRect().top + scrollY + 120, behavior: 'instant' });
  });
  await page.waitForTimeout(100);
  await page.mouse.wheel(0, -70);
  await expect(more).not.toHaveAttribute('open', '');
  await expect(page.locator('.lit-faq-item[open]')).toHaveCount(0);
  await expect(page.getByText('Is parking available?', { exact: true })).not.toBeVisible();
});

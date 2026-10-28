import { test, expect } from '@playwright/test';

test('all requested breakpoints render without overflow or broken images', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Some places stay with you.');
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
      await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `No overflow at ${width}px`).toBe(true);
    expect(await page.locator('img').evaluateAll(elements => (elements as HTMLImageElement[]).filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src)), `Images load at ${width}px`).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('hero photograph remains stationary as the following surface rises', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const hero = page.locator('.hero-photo');
  const before = await hero.boundingBox();
  await page.evaluate(() => window.scrollTo({ top: 350, behavior: 'instant' }));
  const after = await hero.boundingBox();
  expect(after?.y).toBe(before?.y);
  expect((await page.locator('#introduction').boundingBox())?.y).toBeLessThan(900);
});

test('mobile navigation traps focus, closes with Escape and follows anchors', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open navigation menu' });
  await toggle.click();
  const menu = page.getByRole('dialog', { name: 'Site navigation' });
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).not.toBeVisible();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await menu.getByRole('link', { name: 'The gallery' }).click();
  await expect(menu).not.toBeVisible();
  await expect(page).toHaveURL(/#gallery$/);
});

test('gallery is navigable by keyboard and returns focus to its trigger', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: /View all photographs/ });
  await trigger.click();
  const gallery = page.getByRole('dialog', { name: 'Property photo gallery' });
  await expect(gallery).toBeVisible();
  await expect(gallery.getByText('01 / 09', { exact: true })).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(gallery.getByText('02 / 09', { exact: true })).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(gallery.getByText('01 / 09', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(gallery).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('enquiry validates contact and dates, then prepares an accurate message without sending it', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.locator('[name=name]').fill('Test Guest');
  await page.locator('[name=contact]').fill('invalid-contact');
  const date = new Date(); date.setDate(date.getDate() + 10);
  const checkIn = date.toISOString().slice(0, 10); date.setDate(date.getDate() + 2);
  const checkOut = date.toISOString().slice(0, 10);
  await page.locator('[name=checkIn]').fill(checkIn);
  await page.locator('[name=checkOut]').fill(checkOut);
  await page.locator('[name=guests]').fill('6');
  await page.getByRole('button', { name: 'Prepare my enquiry' }).click();
  await expect(page.locator('#enquiry-error')).toContainText('valid email address or phone');
  await page.locator('[name=contact]').fill('guest@example.com');
  await page.locator('[name=checkOut]').fill(checkIn);
  expect(await page.locator('[name=checkOut]').evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(false);
  await page.locator('[name=checkOut]').fill(checkOut);
  await page.locator('[name=message]').fill('A quiet weekend together.');
  await page.getByRole('button', { name: 'Prepare my enquiry' }).click();
  const dialog = page.getByRole('dialog', { name: 'Let’s make plans.' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Your enquiry has not been sent yet.');
  const message = dialog.getByRole('textbox', { name: 'Your enquiry message' });
  await expect(message).toHaveValue(/Name: Test Guest[\s\S]*Contact: guest@example.com[\s\S]*Guests: 6[\s\S]*A quiet weekend together/);
  await dialog.getByRole('button', { name: 'Copy enquiry' }).click();
  await expect(dialog.getByRole('status')).toContainText('Ready to paste');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('Guests: 6');
  await expect(dialog.getByRole('link', { name: 'Continue on Instagram' })).toHaveAttribute('href', 'https://ig.me/m/the_lit_stays');
});

test('experience choices switch the story and photograph', async ({ page }) => {
  await page.goto('/');
  const choice = page.getByRole('button', { name: /Together, a little longer/ });
  await choice.click();
  await expect(choice).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.experience-photo img')).toHaveAttribute('alt', /Round dining table/);
  await expect(page.getByText('Gather around the table, settle into a game, or let a good conversation take the whole afternoon.')).toBeVisible();
});

test('sample calendar enforces occupied nights, allows boundary checkout, and fills the enquiry dates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const calendar = page.locator('.availability-calendar');
  await expect(calendar.getByText('SAMPLE AVAILABILITY', { exact: true })).toBeVisible();
  await expect(page.getByText('These are sample dates for exploring the website. Ask your host for actual availability.')).toBeVisible();
  await calendar.getByRole('button', { name: 'Next month', exact: true }).click();
  await expect(calendar).toHaveAttribute('aria-busy', 'false');
  const date = new Date(); date.setUTCMonth(date.getUTCMonth() + 1, 1);
  const month = date.toISOString().slice(0, 7);
  const day = (value: number) => calendar.locator(`[data-day="${month}-${String(value).padStart(2, '0')}"]`);
  await expect(day(12)).toBeDisabled();
  await day(11).click();
  await expect(day(12)).toBeEnabled();
  await expect(day(13)).toBeDisabled();
  await day(12).click();
  await expect(page.locator('[name=checkIn]')).toHaveValue(`${month}-11`);
  await expect(page.locator('[name=checkOut]')).toHaveValue(`${month}-12`);
  await calendar.getByRole('button', { name: 'Clear', exact: true }).click();
  await day(1).click();
  await page.keyboard.press('ArrowRight');
  await expect(day(2)).toBeFocused();
  await expect(calendar.getByRole('link', { name: /Plan this stay/ })).toHaveCount(0);
});

test('FAQ matches the supplied disclosure pattern and shows the owner-provided answers', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const faq = page.locator('#faq');
  const checkIn = faq.locator('.lit-faq-item').filter({ hasText: 'What are the check-in & check-out timings?' });
  await checkIn.locator('summary').click();
  await expect(checkIn).toHaveAttribute('open', '');
  await expect(checkIn.locator('.lit-faq-answer')).toContainText('1:00 PM');
  const meals = faq.locator('.lit-faq-item').filter({ hasText: 'Are meals included?' });
  await meals.locator('summary').click();
  await expect(meals).toHaveAttribute('open', '');
  await expect(checkIn).not.toHaveAttribute('open', '');
  await expect(meals.locator('.lit-faq-answer')).toContainText('₹1,400 per person');
  await faq.locator('.lit-faq-more > summary').click();
  await expect(faq.locator('.lit-faq-more')).toHaveAttribute('open', '');
  await expect(faq.getByText('Is parking available?', { exact: true })).toBeVisible();
  const parking = faq.locator('.lit-faq-item').filter({ hasText: 'Is parking available?' });
  await parking.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(parking).toHaveAttribute('open', '');
  await expect(parking.locator('.lit-faq-answer')).toContainText('complimentary parking');
});

test('reduced motion and no-JavaScript modes retain all primary content and enquiry contact', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  expect(await page.locator('html').evaluate(el => getComputedStyle(el).scrollBehavior)).toBe('auto');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('#hero-heading')).toHaveCSS('font-style', 'normal');
  await context.close();
  const staticContext = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await staticContext.newPage();
  await staticPage.goto('/');
  await expect(staticPage.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(staticPage.getByRole('link', { name: /A little of life here/ })).toHaveAttribute('href', 'https://www.instagram.com/the_lit_stays/');
  await staticContext.close();
});

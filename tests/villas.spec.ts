import { test, expect } from '@playwright/test';
import { villas, formatRupees } from '../src/lib/villas';
import { site } from '../src/lib/site-content';

test('villa navigation opens the shared detail page with its own quotation and home links', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Villa Avante' }).click();
  await expect(page).toHaveURL(/\/villas\/villa-avante\/$/);
  await expect(page).toHaveTitle(/Villa Avante — 2BHK Balinese villa/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Villa Avante');
  const quote = page.getByRole('complementary', { name: 'Villa Avante stay quotation' });
  await expect(quote).toContainText('₹18,000');
  await expect(quote).toContainText('₹8,000');
  await expect(quote).toContainText('Stay & amenities included.');
  await expect(quote).toContainText('Refundable on checkout.');
  const amenities = page.getByRole('region', { name: 'The comforts.' });
  await expect(amenities.getByRole('listitem')).toHaveCount(11);
  await expect(amenities).toContainText('wireless microphone');
  await expect(amenities).toContainText('Foosball');
  const food = page.getByRole('region', { name: 'Good food. Great company.' });
  await expect(food).toContainText('₹1,400');
  await expect(food).toContainText('₹1,900');
  await expect(food.getByRole('list', { name: 'Included meals' }).getByRole('listitem')).toHaveCount(4);
  await expect(food).toContainText('High tea');
  const nav = page.getByRole('navigation', { name: 'Main navigation', exact: true });
  await expect(nav.getByRole('link', { name: 'Villa Avante' })).toHaveAttribute('aria-current', 'page');
  await expect(nav.getByRole('link', { name: 'The gallery' })).toHaveAttribute('href', '/#gallery');
  await expect(page.locator('header').getByRole('link', { name: 'Plan your stay' })).toHaveAttribute('href', site.instagramMessage);
  await nav.getByRole('link', { name: 'The gallery' }).click();
  await expect(page).toHaveURL(/\/#gallery$/);
});

test('villa pages offer direct contact without enquiry forms or unrelated calendar requests', async ({ page }) => {
  const availabilityRequests: string[] = [];
  page.on('request', request => { if (request.url().includes('/api/availability')) availabilityRequests.push(request.url()); });
  for (const villa of villas) {
    await page.goto(`/villas/${villa.slug}/`);
    await expect(page.locator('form')).toHaveCount(0);
    await expect(page.locator('a[href="#enquire"]')).toHaveCount(0);
    const contact = page.locator('#home').getByRole('link', { name: 'Plan your stay' });
    await expect(contact).toHaveAttribute('href', site.instagramMessage);
    await expect(contact).toHaveAttribute('target', '_blank');
    await expect(page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'Contact', exact: true })).toHaveAttribute('href', site.instagramMessage);
  }
  expect(availabilityRequests).toEqual([]);
});

test('villa navigation works on mobile and detail pages have no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  const menu = page.getByRole('dialog', { name: 'Site navigation' });
  await menu.getByRole('link', { name: 'Villa Avante' }).click();
  await expect(page).toHaveURL(/\/villas\/villa-avante\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Villa Avante');
  for (const width of [320, 390, 768, 900, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No overflow at ${width}px`).toBe(true);
    const hero = await page.locator('#home').boundingBox();
    const photo = await page.locator('#home img').first().boundingBox();
    expect(hero?.width, `Hero spans the viewport at ${width}px`).toBe(width);
    expect(photo?.width, `Hero photo covers the viewport at ${width}px`).toBeGreaterThanOrEqual(width);
    expect(photo?.height).toBeGreaterThanOrEqual(hero?.height || 0);
    expect(photo?.x).toBeLessThanOrEqual(0);
  }
});

test('registered villas have matching static routes and unknown properties return 404', async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const villa of villas) {
    const response = await page.goto(`/villas/${villa.slug}/`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(villa.name);
    await expect(page.getByRole('complementary', { name: `${villa.name} stay quotation` })).toContainText(villa.stayPrice !== undefined ? formatRupees(villa.stayPrice) : 'Price on request');
    const photo = page.locator('#home img').first();
    await expect(photo).toHaveCSS('object-fit', 'cover');
    expect((await photo.boundingBox())?.width).toBeGreaterThanOrEqual(1440);
  }
  expect((await request.get('/villas/unknown-villa/')).status()).toBe(404);
});

test('Aurania has its own amenities and pricing and clearly states it has no pool', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Villa Aurania' }).click();
  await expect(page).toHaveURL(/\/villas\/villa-aurania\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Villa Aurania');
  await expect(page.locator('#home')).toContainText(/without pool/i);
  const quote = page.getByRole('complementary', { name: 'Villa Aurania stay quotation' });
  await expect(quote).toContainText('₹12,000');
  await expect(quote).toContainText('₹3,000');
  const amenities = page.getByRole('region', { name: 'The comforts.' });
  await expect(amenities.getByRole('listitem')).toHaveCount(12);
  await expect(amenities).toContainText('Jacuzzi');
  await expect(amenities).toContainText('Rain dance');
  await expect(amenities).toContainText('Badminton, playing cards, carrom, lagori');
  await expect(amenities).toContainText('AC in all bedrooms.');
  await expect(amenities).toContainText('Water cooler');
  await expect(amenities).toContainText('Available in the hall.');
  await expect(amenities).not.toContainText('Swimming pool');
  await expect(amenities).not.toContainText('Netflix');
  await amenities.locator('summary').filter({ hasText: 'Air conditioning' }).click();
  await expect(amenities.getByText('AC in all bedrooms.', { exact: true })).toBeVisible();
  await amenities.locator('summary').filter({ hasText: 'Water cooler' }).click();
  await expect(amenities.getByText('Available in the hall.', { exact: true })).toBeVisible();
  await expect(amenities.getByText('AC in all bedrooms.', { exact: true })).not.toBeVisible();
  await expect(quote).not.toContainText('₹18,000');
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Aurania fits at ${width}px`).toBe(true);
  }
});

test('Avante gallery opens all supplied photos, supports navigation and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/villas/villa-avante/');
  await expect(page.locator('#home img').first()).toHaveAttribute('src', /\/avante\/optimized\/avante-38-\d+\.webp$/);
  const collection = page.locator('#villa-photos');
  await expect(collection.getByRole('button', { name: 'View all 42 photos' })).toBeVisible();
  const trigger = collection.getByRole('button', { name: 'Open photograph: A slower start' });
  await trigger.click();
  const gallery = page.getByRole('dialog', { name: 'Villa Avante photo gallery' });
  await expect(gallery).toBeVisible();
  await expect(gallery.getByText('02 / 42', { exact: true })).toBeVisible();
  await expect(gallery.getByRole('img')).toHaveAttribute('alt', /A warm bedroom/);
  await expect(gallery.getByRole('img')).toHaveCSS('object-fit', 'contain');
  await page.keyboard.press('ArrowRight');
  await expect(gallery.getByText('03 / 42', { exact: true })).toBeVisible();
  await expect(gallery.getByRole('img')).toHaveAttribute('alt', /open living and dining space/);
  await page.keyboard.press('End');
  await expect(gallery.getByText('42 / 42', { exact: true })).toBeVisible();
  await expect(gallery.getByRole('img')).toHaveAttribute('alt', /shower fittings and stone-finished walls/);
  await page.keyboard.press('ArrowRight');
  await expect(gallery.getByText('01 / 42', { exact: true })).toBeVisible();
  await expect(gallery.getByRole('img')).toHaveAttribute('alt', /blue swimming pool, outdoor table/);
  await page.keyboard.press('ArrowLeft');
  await expect(gallery.getByText('42 / 42', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(gallery).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('Avante thumbnails work on mobile and its photos do not appear on Aurania', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/villas/villa-avante/');
  await page.getByRole('button', { name: 'View all 42 photos' }).click();
  const gallery = page.getByRole('dialog', { name: 'Villa Avante photo gallery' });
  await gallery.getByRole('button', { name: 'View photograph 42: An easy start', exact: true }).click();
  await expect(gallery.getByText('42 / 42', { exact: true })).toBeVisible();
  await expect(gallery.getByRole('button', { name: 'View photograph 42: An easy start', exact: true })).toHaveAttribute('aria-current', 'true');
  await gallery.getByRole('button', { name: 'Next villa photograph' }).click();
  await expect(gallery.getByText('01 / 42', { exact: true })).toBeVisible();
  await gallery.getByRole('button', { name: 'Close villa photo gallery' }).click();
  await expect(page.getByRole('button', { name: 'View all 42 photos' })).toBeFocused();
  for (const width of [768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('#villa-photos img').evaluateAll(images => images.length === 5 && images.every(image => image.getBoundingClientRect().height > 100))).toBe(true);
  }
  await page.goto('/villas/villa-aurania/');
  await expect(page.locator('#villa-photos').getByRole('button', { name: 'View all 75 photos' })).toBeVisible();
  await expect(page.locator('img[src*="/avante/"]')).toHaveCount(0);
});

test('Aurania and Archway open their own complete collections on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [property, count] of [['aurania', 75], ['archway', 66]] as const) {
    await page.goto(`/villas/villa-${property}/`);
    const name = `Villa ${property[0].toUpperCase()}${property.slice(1)}`;
    await page.getByRole('button', { name: `View all ${count} photos` }).click();
    const gallery = page.getByRole('dialog', { name: `${name} photo gallery` });
    await expect(gallery.getByRole('img')).toHaveAttribute('src', new RegExp(`/${property}/optimized/`));
    await expect(gallery.locator('[data-photo-index]')).toHaveCount(count);
    await page.keyboard.press('End');
    await expect(gallery.getByText(`${count} / ${count}`, { exact: true })).toBeVisible();
    await gallery.getByRole('button', { name: 'Next villa photograph' }).click();
    await expect(gallery.getByText(`01 / ${count}`, { exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: `View all ${count} photos` })).toBeFocused();
    await expect(page.locator('img[src*="/avante/"]')).toHaveCount(0);
  }
});

test('Archway has a separate navigation entry, confirmed details and pricing on request', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Villa Archway' }).click();
  await expect(page).toHaveURL(/\/villas\/villa-archway\/$/);
  await expect(page).toHaveTitle(/Villa Archway — 3BHK/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Villa Archway');
  await expect(page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Villa Archway' })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('#villa-details')).toContainText('20 guests');
  const amenities = page.getByRole('region', { name: 'The comforts.' });
  await expect(amenities).toContainText('Four bathrooms');
  await expect(amenities).toContainText('Private swimming pool');
  await expect(page.getByRole('complementary', { name: 'Villa Archway stay quotation' })).toContainText('Price on request');
  await expect(page.locator('form')).toHaveCount(0);
});

test('every villa hero keeps its title and stay controls readable across viewport sizes', async ({ page }) => {
  for (const villa of villas) {
    await page.goto(`/villas/${villa.slug}/`);
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${villa.name} fits at ${width}px`).toBe(true);
      const title = await page.getByRole('heading', { level: 1 }).boundingBox();
      const bar = page.getByLabel(`${villa.name} at a glance`);
      const control = await bar.getByRole('link', { name: 'Plan your stay' }).boundingBox();
      expect(title!.x).toBeGreaterThanOrEqual(0);
      expect(title!.x + title!.width).toBeLessThanOrEqual(width);
      expect(control!.y).toBeGreaterThan(title!.y + title!.height);
      expect(control!.y + control!.height).toBeLessThanOrEqual(900);
      await expect(bar).toContainText(villa.hasPool ? 'Private swimming pool' : 'Jacuzzi · without pool');
    }
  }
});

test('each villa brochure previews the correct PDF on the page and downloads the original', async ({ page, request }) => {
  for (const villa of villas) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/villas/${villa.slug}/`);
    const title = `${villa.name} brochure`;
    const view = page.getByRole('button', { name: `View ${title}`, exact: true });
    const response = await request.head(villa.brochure.href);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
    await expect(page.getByRole('link', { name: `Download ${title}`, exact: true })).toHaveAttribute('download', villa.brochure.filename);
    await view.click();
    const dialog = page.getByRole('dialog', { name: title, exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('iframe')).toHaveAttribute('src', `${villa.brochure.href}#view=FitH`);
    await expect(dialog.getByRole('link', { name: 'Open PDF in a new tab' })).toHaveAttribute('href', villa.brochure.href);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
    await dialog.getByRole('button', { name: `Close ${title}`, exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(view).toBeFocused();
    const downloadEvent = page.waitForEvent('download');
    await page.getByRole('link', { name: `Download ${title}`, exact: true }).click();
    const download = await downloadEvent;
    expect(download.suggestedFilename()).toBe(villa.brochure.filename);
    expect(await download.failure()).toBeNull();
  }
});

test('all three villas share brochure-priced dining, deferred food PDFs and reduced-motion support', async ({ page, request }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const response = await request.head('/TLS%20-%20Food%20Package.pdf');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
  for (const villa of villas) {
    const pdfRequests: string[] = [];
    const onRequest = (request: { url(): string }) => { if (request.url().includes('Food%20Package.pdf')) pdfRequests.push(request.url()); };
    page.on('request', onRequest);
    await page.goto(`/villas/${villa.slug}/`);
    const dining = page.getByRole('region', { name: 'Good food. Great company.' });
    for (const price of ['₹1,400', '₹1,650', '₹1,600', '₹1,900']) await expect(dining).toContainText(price);
    await expect(dining.getByRole('list', { name: 'Included meals' }).getByRole('listitem')).toHaveCount(4);
    await expect(dining).toContainText('Premium packages for 5 or more guests.');
    expect(pdfRequests).toEqual([]);
    const view = dining.getByRole('button', { name: 'View Food packages brochure' });
    await view.click();
    const dialog = page.getByRole('dialog', { name: 'Food packages brochure', exact: true });
    await expect(dialog.locator('iframe')).toHaveAttribute('src', '/TLS%20-%20Food%20Package.pdf#view=FitH');
    await page.keyboard.press('Escape');
    await expect(view).toBeFocused();
    await expect(dialog.locator('iframe')).toHaveCount(0);
    await dining.getByText('Dining details', { exact: false }).click();
    await expect(dining).toContainText('Finalise your menu at least 4 days');
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${villa.name} dining fits at ${width}px`).toBe(true);
    }
    page.off('request', onRequest);
  }
});

test('villa content scrolls over the pinned hero and the navigation changes with the content', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/villas/villa-avante/');
    await expect(page.locator('#home')).toHaveCSS('position', 'sticky');
    await page.evaluate(() => window.scrollTo({ top: 450, behavior: 'instant' }));
    await expect.poll(async () => (await page.locator('#home').boundingBox())?.y).toBe(0);
    const content = await page.locator('#villa-content').boundingBox();
    expect(content!.y).toBe(450);
    expect(await page.evaluate(() => document.elementFromPoint(30, 500)?.closest('#villa-content') !== null)).toBe(true);
    await page.evaluate(() => window.scrollTo({ top: 1100, behavior: 'instant' }));
    await expect(page.locator('header')).toHaveClass(/is-scrolled/);
    expect((await page.locator('#home').boundingBox())?.y).toBe(0);
    expect((await page.locator('#villa-content').boundingBox())!.y).toBeLessThan(0);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(page.locator('header')).not.toHaveClass(/is-scrolled/);
  }
});

test('Our Story has company and founder content, navigation, villa links and a sitemap entry', async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Our Story' }).click();
  await expect(page).toHaveURL(/\/our-story\/$/);
  await expect(page).toHaveTitle('Our Story | The LIT Stays');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Some placesstay with you.');
  await expect(page.getByRole('heading', { name: 'Hardik Panchal' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Our Story' })).toHaveAttribute('aria-current', 'page');
  const collection = page.getByRole('region', { name: 'Find your kind of stay.' });
  for (const villa of villas) await expect(collection.getByRole('link', { name: new RegExp(villa.name) })).toHaveAttribute('href', `/villas/${villa.slug}/`);
  await expect(page.locator('form')).toHaveCount(0);
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Our Story fits at ${width}px`).toBe(true);
  }
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  const menu = page.getByRole('dialog', { name: 'Site navigation' });
  await expect(menu.getByRole('link', { name: 'Our Story' })).toHaveAttribute('aria-current', 'page');
  await menu.getByRole('link', { name: 'Villa Aurania' }).click();
  await expect(page).toHaveURL(/\/villas\/villa-aurania\/$/);
  const sitemap = await request.get('/sitemap.xml');
  expect(await sitemap.text()).toContain('/our-story/');
});

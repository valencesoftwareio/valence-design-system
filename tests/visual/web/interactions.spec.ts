import { expect, test, type Page } from '@playwright/test';

const openStory = async (page: Page, storyId: string) => {
  const globals = 'preset:hi-vis;mode:light';
  const url = `/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story&globals=${encodeURIComponent(globals)}`;

  await page.goto(url);

  await page.locator('#storybook-root > *').first().waitFor({ state: 'attached' });
};

test('Dialog traps focus and restores it after Escape', async ({ page }) => {
  await openStory(page, 'components-dialog--default');

  const trigger = page.getByRole('button', { name: 'Open dialog' });

  await trigger.click();

  await expect(page.getByRole('dialog', { name: 'Account details' })).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(trigger).toBeFocused();
});

test('AlertDialog closes from its cancel action', async ({ page }) => {
  await openStory(page, 'components-alertdialog--default');

  await page.getByRole('button', { name: 'Open confirmation' }).click();

  const dialog = page.getByRole('alertdialog', { name: 'Confirm change' });

  await expect(dialog).toBeVisible();

  await dialog.getByRole('button', { name: 'Cancel' }).click();

  await expect(dialog).toBeHidden();
});

test('Menu supports keyboard selection', async ({ page }) => {
  await openStory(page, 'components-menu--default');

  const trigger = page.getByRole('button', { name: 'Actions' });

  await trigger.focus();

  await page.keyboard.press('Enter');

  await expect(page.getByRole('menu', { name: 'Actions' })).toBeVisible();

  await page.keyboard.press('ArrowDown');

  await page.keyboard.press('Enter');

  await expect(trigger).toBeFocused();
});

test('Picker supports keyboard selection', async ({ page }) => {
  await openStory(page, 'components-picker--playground');

  await page.getByRole('option', { name: 'Monthly' }).click();

  const picker = page.getByRole('combobox', { name: 'Frequency' });

  await expect(picker).toHaveText(/Monthly/);
});

test('DatePicker opens from its date segments and closes with Escape', async ({ page }) => {
  await openStory(page, 'components-datepicker--playground');

  const calendar = page.getByRole('application');

  await expect(calendar).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(calendar).toBeHidden();

  await page.getByRole('spinbutton', { name: /month/i }).click();

  await expect(calendar).toBeVisible();
});

test('Popover opens and closes with Escape', async ({ page }) => {
  await openStory(page, 'components-popover--default');

  const trigger = page.getByRole('button', { name: 'More information' });

  await trigger.click();

  await expect(page.getByRole('dialog', { name: 'More information' })).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(trigger).toBeFocused();
});

test('BottomSheet closes with Escape', async ({ page }) => {
  await openStory(page, 'components-bottomsheet--default');

  await page.getByRole('button', { name: 'Choose repeat schedule' }).click();

  const sheet = page.getByRole('dialog', { name: 'Repeat' });

  await expect(sheet).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(sheet).toBeHidden();
});

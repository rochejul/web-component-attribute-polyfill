/* global page*/
import { describe, test, beforeAll, beforeEach, expect } from '@jest/globals';

describe('opened shadow dom', () => {
  let pageModel;
  let element;

  beforeAll(async () => {
    await page.goto('https://localhost:4444/');
  });

  beforeEach(async () => {
    element = await page.$('article[border-styling]');
  });

  test('it should find our element', async () => {
    // Assert
    await expect(pageModel.exists()).toBeTruthy();
  });

  test('the element should have a black border color', async () => {
    // Arrange
    const borderColor = await page.evaluate(
      (el) => el.style.borderColor,
      element,
    );

    // Assert
    expect(borderColor).toBe('black');
  });

  test('the element should have a red border color when we click on the toggler button', async () => {
    // Act
    (await page.$('#toggler'))?.click();

    const borderColor = await page.evaluate(
      (el) => el.style.borderColor,
      element,
    );

    // Assert
    expect(borderColor).toBe('black');
  });
});

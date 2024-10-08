import { describe, test, expect } from '@jest/globals';

import {
  CustomAttribute,
  instantiateCustomAttribute,
} from '../../src/api/customAttribute.js';

describe('core - api - customAttribute', () => {
  describe('instantiateCustomAttribute', () => {
    test('it generates an instance of CustomAttribute', () => {
      // Arrange
      const element = document.createElement('div');
      let instance;

      // Assert
      instance = instantiateCustomAttribute(element, CustomAttribute);

      // Arrange
      expect(instance).toBeInstanceOf(CustomAttribute);
    });
  });
});

import { describe, test, expect, afterEach } from '@jest/globals';

import { defineAttribute, getRegistry } from '../../src/api/defineAttribute.js';

describe('core - api - defineAttribute', () => {
  const registry = getRegistry();

  afterEach(() => {
    registry.clear();
  });

  test('it should be a function', () => {
    // Assert
    expect(defineAttribute).toStrictEqual(expect.any(Function));
  });

  describe('validation', () => {
    test(`it should raise an exception if we don't provide arguments`, () => {
      // Arrange
      const t = () => {
        defineAttribute();
      };

      // Act && Assert
      expect(t).toThrow(TypeError);
      expect(t).toThrow(
        "Failed to execute 'defineAttribute' on 'CustomElementRegistry': 2 arguments required, but only 0 present.",
      );
    });

    test(`it should raise an exception if we provide only one argument argument`, () => {
      // Arrange
      const t = () => {
        defineAttribute('hx-post');
      };

      // Act && Assert
      expect(t).toThrow(TypeError);
      expect(t).toThrow(
        "Failed to execute 'defineAttribute' on 'CustomElementRegistry': 2 arguments required, but only 1 present.",
      );
    });

    const scenarriiFirstArgumentNotValid = [
      { type: 'undefined', value: undefined },
      { type: 'null', value: null },
      { type: 'empty string', value: '' },
      { type: 'with spaces', value: ' a-a' },
      { type: 'with partial dash (begin)', value: 'a-' },
      { type: 'with partial dash (end)', value: 'a-' },
      { type: 'with data attributes', value: 'data-a' },
    ];

    test.each(scenarriiFirstArgumentNotValid)(
      `it should raise an exception if the first argument is not valid - $type`,
      ({ value }) => {
        // Arrange
        const t = () => {
          defineAttribute(value, function () {});
        };

        // Act && Assert
        expect(t).toThrow(DOMException);
        expect(t).toThrow(
          `Failed to execute 'defineAttribute' on 'CustomElementRegistry': "${value}" is not a valid custom element name`,
        );
      },
    );

    const scenarriiSecondArgumentNotAFunction = [
      { type: 'null', value: null },
      { type: 'string', value: 'someValue' },
      { type: 'number', value: 25 },
      { type: 'array', value: [] },
      { type: 'json', value: {} },
    ];

    test.each(scenarriiSecondArgumentNotAFunction)(
      `it should raise an exception if the second argument is not a Function - $type`,
      ({ value }) => {
        // Arrange
        const t = () => {
          defineAttribute('hx-post', value);
        };

        // Act && Assert
        expect(t).toThrow(TypeError);
        expect(t).toThrow(
          "Failed to execute 'defineAttribute' on 'CustomElementRegistry': parameter 2 is not of type 'Function'",
        );
      },
    );

    test('it should not raise exception if the arguments are valid - Function', () => {
      // Arrange
      const t = () => {
        defineAttribute('hx-post', function () {});
      };

      // Act && Assert
      expect(t).not.toThrow();
    });

    test('it should not raise exception if the arguments are valid - Class', () => {
      // Arrange
      const t = () => {
        defineAttribute('hx-post', class MyImplementation {});
      };

      expect(t).not.toThrow();
    });
  });

  test('it should register the custom attribute', () => {
    // Arrange
    const implementation = class MyImplementation {};

    // Act
    defineAttribute('hx-post', implementation);

    // Assert
    expect(registry.size()).toBe(1);
    expect(registry.get('hx-post')).toStrictEqual(implementation);
  });

  test('it should raise an exception if we register the custom attribute more than once', () => {
    // Arrange
    defineAttribute('hx-post', class MyImplementation {});

    const t = () => {
      defineAttribute('hx-post', class MyImplementation {});
    };

    // Act && Assert
    expect(t).toThrow(DOMException);
    expect(t).toThrow(
      `Failed to execute 'defineAttribute' on 'CustomElementRegistry': the name "hx-post" has already been used with this registry`,
    );
  });
});

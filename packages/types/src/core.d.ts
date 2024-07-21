declare module '@web-component-attribute-polyfill/core' {
  type AttributeName = string;

  class CustomAttribute {
    readonly element: Element;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(
      attributeName: AttributeName,
      oldValue: any,
      newValue: any,
    ): void;
  }

  type AttributeImplType = Function | CustomAttribute;
  type defineAttribute = (
    attributeName: NonNullable<AttributeName>,
    attributeImpl: NonNullable<AttributeImplType>,
  ) => void;

  type stopObserveMutation = () => void;
  type observeAttributes = (root?: Element) => stopObserveMutation;
  type enableClosedShadowRoot = (context: NonNullable<Window>) => void;

  export {
    AttributeName,
    CustomAttribute,
    defineAttribute,
    observeAttributes,
    enableClosedShadowRoot,
  };
}

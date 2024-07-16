interface CustomAttribute {
  readonly element: Element;
  connectedCallack(): void;
  disconnectedCallack(): void;
  attributeChangedCallback(
    attributeName: string,
    oldValue: any,
    newValue: any,
  ): void;
}

type AttributeImplType = Function | CustomAttribute;
type DefineAttribute = (
  attributeName: string,
  attributeImpl: AttributeImplType,
) => void;

export { CustomAttribute, DefineAttribute };

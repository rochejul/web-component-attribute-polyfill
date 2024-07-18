type AttributeName = string;

interface CustomAttribute {
  readonly element: Element;
  connectedCallack(): void;
  disconnectedCallack(): void;
  attributeChangedCallback(
    attributeName: AttributeName,
    oldValue: any,
    newValue: any,
  ): void;
}

type AttributeImplType = Function | CustomAttribute;
type DefineAttribute = (
  attributeName: NonNullable<AttributeName>,
  attributeImpl: NonNullable<AttributeImplType>,
) => void;

export { CustomAttribute, DefineAttribute };

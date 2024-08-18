import '@web-component-attribute-polyfill/browser';

class BorderStylingAttribute extends globalThis.CustomAttribute {
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    this.applyColor(newValue);
  }

  connectedCallback() {
    super.connectedCallback();
    this.element.style.padding = '1rem';
    this.element.style.border = '3px solid black';
    this.element.style.borderRadius = '1rem';
    this.applyColor();
  }

  applyColor(styling) {
    if (styling === 'variant') {
      this.element.style.borderColor = 'red';
    } else {
      this.element.style.borderColor = 'black';
    }
  }
}

globalThis.customElements.defineAttribute(
  'border-styling',
  BorderStylingAttribute,
);

globalThis.addEventListener('DOMContentLoaded', () => {
  let state = 'default';
  const toChangeElement = document.querySelector('#to-change');
  document.querySelector('#toggler').addEventListener('click', () => {
    state = state === 'variant' ? 'default' : 'variant';
    toChangeElement.setAttribute('border-styling', state);
  });
});

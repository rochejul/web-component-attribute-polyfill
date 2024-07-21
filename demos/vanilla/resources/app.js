// eslint-disable-next-line no-unused-vars
import * as polyfill from '@web-component-attribute-polyfill/browser';

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

customElements.define(
  'my-paragraph',
  class MyParagraphOpen extends HTMLElement {
    constructor() {
      super();

      let template = document.querySelector('#custom-paragraph');
      let templateContent = template.content;

      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(templateContent.cloneNode(true));
    }
  },
);

customElements.defineAttribute('border-styling', BorderStylingAttribute);
customElements.define(
  'my-closed-paragraph',
  class MyParagraphClosed extends HTMLElement {
    constructor() {
      super();

      let template = document.querySelector('#custom-paragraph-closed');
      let templateContent = template.content;

      const shadowRoot = this.attachShadow({ mode: 'closed' });
      shadowRoot.appendChild(templateContent.cloneNode(true));
    }
  },
);

globalThis.addEventListener('DOMContentLoaded', () => {
  let state = 'default';
  const toChangeElement = document.querySelector('#to-change');
  document.querySelector('#toggler').addEventListener('click', () => {
    state = state === 'variant' ? 'default' : 'variant';
    toChangeElement.setAttribute('border-styling', state);
  });

  let state2 = 'default';
  const toChangeElement2 = document
    .querySelector('#shadow-root-open')
    .shadowRoot.querySelector('#to-change');
  document.querySelector('#toggler2').addEventListener('click', () => {
    state2 = state2 === 'variant' ? 'default' : 'variant';
    toChangeElement2.setAttribute('border-styling', state2);
  });
});

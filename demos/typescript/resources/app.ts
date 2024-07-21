import type { AttributeName } from '@web-component-attribute-polyfill/core';
import type {
  Window,
  CustomElementRegistry,
} from '@web-component-attribute-polyfill/browser';

import '@web-component-attribute-polyfill/browser';
import { CustomAttribute } from '@web-component-attribute-polyfill/core';

const window = globalThis.window as unknown as Window;
const customElements = window.customElements as CustomElementRegistry;

class BorderStylingAttribute extends CustomAttribute {
  attributeChangedCallback(
    name: AttributeName,
    oldValue: string,
    newValue: string,
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    this.applyColor(newValue);
  }

  connectedCallback() {
    super.connectedCallback();

    const element = this.element as HTMLElement;

    element.style.padding = '1rem';
    element.style.border = '3px solid black';
    element.style.borderRadius = '1rem';
    this.applyColor();
  }

  applyColor(styling: string = 'default') {
    const element = this.element as HTMLElement;

    if (styling === 'variant') {
      element.style.borderColor = 'red';
    } else {
      element.style.borderColor = 'black';
    }
  }
}

customElements.define(
  'my-paragraph',
  class MyParagraphOpen extends HTMLElement {
    constructor() {
      super();

      let template = document.querySelector('#custom-paragraph') as HTMLElement;
      let templateContent = (template as HTMLTemplateElement).content;

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

      let template: HTMLElement = document.querySelector(
        '#custom-paragraph-closed',
      ) as HTMLElement;
      let templateContent = (template as HTMLTemplateElement).content;

      const shadowRoot = this.attachShadow({ mode: 'closed' });
      shadowRoot.appendChild(templateContent.cloneNode(true));
    }
  },
);

globalThis.addEventListener('DOMContentLoaded', () => {
  let state = 'default';
  const toChangeElement = document.querySelector('#to-change');

  document.querySelector('#toggler')?.addEventListener('click', () => {
    state = state === 'variant' ? 'default' : 'variant';
    toChangeElement?.setAttribute('border-styling', state);
  });

  let state2 = 'default';
  const toChangeElement2 = document
    .querySelector('#shadow-root-open')
    ?.shadowRoot?.querySelector('#to-change');

  document.querySelector('#toggler2')?.addEventListener('click', () => {
    state2 = state2 === 'variant' ? 'default' : 'variant';
    toChangeElement2?.setAttribute('border-styling', state2);
  });
});

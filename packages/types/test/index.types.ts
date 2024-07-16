import {
  CustomAttribute,
  defineAttribute,
} from '@web-component-attribute-polyfill/core';

class MyCustomAttribute extends CustomAttribute {}

function Es5Constructor() {}
Es5Constructor.prototype.connectedCallback();
Es5Constructor.prototype.disconnectedCallback();
Es5Constructor.prototype.attributeChangedCallback();

defineAttribute('xhr-post', CustomAttribute);
defineAttribute('xhr-get', MyCustomAttribute);
defineAttribute('xhr-put', Es5Constructor);

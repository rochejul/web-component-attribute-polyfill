import { defineAttribute } from '@web-component-attribute-polyfill/core';

defineAttribute();
defineAttribute(undefined);
defineAttribute(null);
defineAttribute(55);
defineAttribute('xhr-post', undefined);
defineAttribute('xhr-get', null);
defineAttribute('xhr-put', '');

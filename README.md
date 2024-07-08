# web-component-attribute-polyfill

Create a polyfill to allow to have an "attribute" web component (rather a tag web component)

## Motivation

We are into the age of Web components, but we could at this time only create custom elements, and not custom attributes.

## What we could find in frameworks

A long time, we used a framework called [AngularJs](https://docs.angularjs.org/) and this framework allowed to create `attribute directive`.

With this approach we could introduce the behavior approach such as [Wicket](https://nightlies.apache.org/wicket/apidocs/8.x/org/apache/wicket/behavior/Behavior.html) where we augment the capability of our component with delegations.

## Web community position

It seems some people such as [Rob Eisenberg](https://eisenbergeffect.medium.com/) started some discussion on [this topic](https://x.com/EisenbergEffect/status/1802009857488285966):

![Rob Eisenberg's tweet](./images/tweet-rob-eisenberg.png)

At this time there is no official polyfill, because there is no official proposition yet

## Usage

On the [customElements](https://developer.mozilla.org/fr/docs/Web/API/Window/customElements) property, we will find the `defineAttribute` method used to declare the name of the custom attribute, and the implementation.

We should extend the `CustomAttribute` class which exposes:

- the `connectedCallback` method used when the element where is used the custom attribute is injected into the DOM
- the `disconnectedCallback` method used when the element where is used the custom attribute is removed from the DOM
- the `attributeChangedCallback` method used when the custom attribute's value has changed
- the `element` property which reflects the element where is used the custom attribute

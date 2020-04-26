# Rescoped

Scoped styles made easy.

## Why rescoped？

Scoping css in React app is not that easy. Most people use CSS modules, but it's just a trade-off. Rescoped uses Shadow DOM and custom elements to make your components **really** css scoped.

## Installation

```bash
yarn add rescoped
# Or
npm install --save rescoped
```

## Usage

Just wrap your component with the `scoped` HOC.

```jsx
import {scoped} from 'rescoped'

const Foo = scoped(function() { // <- A normal React Component
  return (
    // ...
  )
}, { // <- The config object, optional
  styleUrl: 'xxx'
})
```

The config object:

```typescript
interface Config {
  style?: string | string[] // The raw css string
  styleUrl?: string | string[] // The external stylesheet link
  mode?: ShadowRootMode // 'open' or 'closed'. The default value is 'closed'
}
```

## Demo

<code src="./demo/basic.tsx" title="Basic Usage" desc="We import the bootstrap stylesheet in this component, without violating the external DOM elements." />

<code src="./demo/slots.tsx" title="Slots" desc="Use slots to control where the React element is rendered." />

## Reference

[MDN: Using Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)

[Shadow DOM styling](https://javascript.info/shadow-dom-style#host-context-selector)

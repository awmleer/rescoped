import * as React from 'react'
import {useEffect, useState, useRef, FC, ComponentType, ReactNode} from 'react'
import * as ReactDOM from 'react-dom'

customElements.define('rescoped-custom-element', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'})
  }
})

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'rescoped-custom-element': any;
    }
  }
}


interface Props {
  tagName?: string
  slotContent?: ReactNode
}

export const Scoped: FC<Props> = (props) => {
  const shadowRef = useRef<HTMLElement>()
  const [shadow, setShadow] = useState<ShadowRoot>()
  
  useEffect(() => {
    const shadow = shadowRef.current.shadowRoot
    setShadow(shadow)
  }, [])
  
  return (
    <rescoped-custom-element ref={shadowRef}>
      <Inner shadow={shadow}>
        {props.children}
      </Inner>
      {props.slotContent}
    </rescoped-custom-element>
  )
}

const Inner: FC<{
  shadow?: ShadowRoot
}> = (props) => {
  if (!props.shadow) return null
  return ReactDOM.createPortal(props.children, props.shadow as any as Element)
}

export function scoped<P>(C: ComponentType<P>) {
  const ScopedComponent: FC<P> = (props) => {
    const handledProps = {
      ...props,
      children: (
        <slot/>
      )
    }
    return (
      <Scoped slotContent={props.children}>
        <C {...handledProps}/>
      </Scoped>
    )
  }
  if (C.displayName) {
    ScopedComponent.displayName = C.displayName
  }
  return ScopedComponent
}

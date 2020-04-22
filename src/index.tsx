import * as React from 'react'
import {useEffect, useState, useRef, FC, ComponentType, ReactElement} from 'react'
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

const Inner: FC<{
  shadow?: ShadowRoot
}> = (props) => {
  if (!props.shadow) return null
  return ReactDOM.createPortal(props.children, props.shadow as any as Element)
}

export function scoped<P>(C: ComponentType<P>) {
  const ScopedComponent: FC<P> = (props) => {
    const handledProps: any = {...props}
    handledProps.children = (
      <slot />
    )
    const slotContents: ReactElement[] = []
    for (const key in handledProps) {
      if (!handledProps.hasOwnProperty(key)) continue
      const prop = handledProps[key]
      if (prop instanceof SlottedProp) {
        handledProps[key] = (
          <slot name={key}/>
        )
        const {element} = prop
        slotContents.push(React.cloneElement(element, {
          ...element.props,
          key,
          slot: key,
        }))
      }
    }
  
    const shadowRef = useRef<HTMLElement>()
    const [shadow, setShadow] = useState<ShadowRoot>()
  
    useEffect(() => {
      const shadow = shadowRef.current.shadowRoot
      setShadow(shadow)
    }, [])
    
    return (
      <rescoped-custom-element ref={shadowRef}>
        <Inner shadow={shadow}>
          <C {...handledProps}/>
        </Inner>
        {props.children}
        {slotContents}
      </rescoped-custom-element>
    )
  }
  if (C.displayName) {
    ScopedComponent.displayName = C.displayName
  }
  return ScopedComponent
}

class SlottedProp {
  constructor(
    public element: ReactElement
  ) {}
}

export function slotted(node: ReactElement) {
  return new SlottedProp(node)
}

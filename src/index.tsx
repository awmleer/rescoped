import * as React from 'react'
import {useEffect, useState, useRef, FC, ComponentType, ReactElement} from 'react'
import * as ReactDOM from 'react-dom'
import {StyleSheets} from './style-sheets'

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

const Portal: FC<{
  shadow?: ShadowRoot
}> = (props) => {
  if (!props.shadow) return null
  return ReactDOM.createPortal(props.children, props.shadow as any as Element)
}

interface Config {
  style?: string | string[]
  styleUrl?: string | string[]
}

export function scoped<P>(C: ComponentType<P>, config?: Config) {
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
      <>
        <rescoped-custom-element ref={shadowRef}>
          {props.children}
          {slotContents}
        </rescoped-custom-element>
        <Portal shadow={shadow}>
          <C {...handledProps}/>
          <StyleSheets style={config?.style} styleUrl={config?.styleUrl}/>
        </Portal>
      </>
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

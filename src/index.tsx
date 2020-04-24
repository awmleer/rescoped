import * as React from 'react'
import {useEffect, useState, useRef, FC, ComponentType, ReactElement} from 'react'
import * as ReactDOM from 'react-dom'
import {StyleSheets} from './style-sheets'

class RescopedCustomElement extends HTMLElement {
  public _shadow: ShadowRoot
  connectedCallback() {
    const mode = this.getAttribute('mode')
    this._shadow = this.attachShadow({mode: mode === 'open' ? 'open' : 'closed'})
  }
}

customElements.define('rescoped-custom-element', RescopedCustomElement)

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
  mode?: ShadowRootMode
}

export function scoped<P={}>(C: ComponentType<P>, config?: Config) {
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
  
    const customElementRef = useRef<RescopedCustomElement>()
    const [shadow, setShadow] = useState<ShadowRoot>()
  
    useEffect(() => {
      const shadow = customElementRef.current._shadow
      setShadow(shadow)
    }, [])
    
    return (
      <>
        <rescoped-custom-element ref={customElementRef} mode={config?.mode}>
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

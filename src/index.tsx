import * as React from 'react'
import {useEffect, useState, useRef, FC, ComponentType, ReactElement, forwardRef, PropsWithChildren} from 'react'
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
  element?: Element
}> = (props) => {
  if (!props.element) return null
  return ReactDOM.createPortal(props.children, props.element)
}

interface Config {
  style?: string | string[]
  styleUrl?: string | string[]
  mode?: ShadowRootMode
}

export function scoped<P={}>(C: ComponentType<P>, config?: Config) {
  const ScopedComponent = forwardRef<any, PropsWithChildren<P>>((props, ref) => {
    const customElementRef = useRef<RescopedCustomElement>()
    const [shadow, setShadow] = useState<ShadowRoot>()
  
    useEffect(() => {
      const shadow = customElementRef.current._shadow
      ReactDOM.createPortal(props.children, customElementRef.current)
      setShadow(shadow)
    }, [])
  
    const handledProps: any = {...props}
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
    
    handledProps.children = (
      <>
        <slot />
        <Portal element={customElementRef.current}>
          {props.children}
          {slotContents}
        </Portal>
      </>
    )
    
    return (
      <>
        <rescoped-custom-element ref={customElementRef} mode={config?.mode} />
        <Portal element={shadow as any as Element}>
          <C {...handledProps} ref={ref}/>
          <StyleSheets style={config?.style} styleUrl={config?.styleUrl}/>
        </Portal>
      </>
    )
  })
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

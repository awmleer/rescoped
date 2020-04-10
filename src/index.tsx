import * as React from 'react'
import {useEffect, useState, useRef, FC, createElement} from 'react'
import * as ReactDOM from 'react-dom'

interface Props {
  tagName?: string
}

export const Scoped: FC<Props> = (props) => {
  const shadowRef = useRef<HTMLElement>()
  const [shadow, setShadow] = useState<ShadowRoot>()
  
  useEffect(() => {
    const shadow = shadowRef.current.attachShadow({mode: 'open'})
    setShadow(shadow)
  }, [])
  
  const host = createElement(props.tagName ?? 'div', {
    ref: shadowRef
  })
  
  return (
    <>
      {host}
      <Inner shadow={shadow}>
        {props.children}
      </Inner>
    </>
  )
}

const Inner: FC<{
  shadow?: ShadowRoot
}> = (props) => {
  console.log(props.shadow)
  if (!props.shadow) return null
  return ReactDOM.createPortal(props.children, props.shadow as any as Element)
}

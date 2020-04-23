import * as React from 'react'
import {memo, ReactElement} from 'react'

interface Props {
  style?: string | string[]
  styleUrl?: string | string[]
}

export const StyleSheets = memo<Props>((props) => {
  let {style, styleUrl} = props
  
  const styleElements: ReactElement[] = []
  
  
  if (style) {
    if (!Array.isArray(style)) {
      style = [style]
    }
    for (const item of style) {
      styleElements.push(
        <style key={item}>{item}</style>
      )
    }
  }
  if (styleUrl) {
    if (!Array.isArray(styleUrl)) {
      styleUrl = [styleUrl]
    }
    for (const item of styleUrl) {
      styleElements.push(
        <link key={item} rel='stylesheet' href={item}/>
      )
    }
  }
  
  return (
    <>
      {styleElements}
    </>
  )
})

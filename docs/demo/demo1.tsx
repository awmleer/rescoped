import * as React from 'react'
import {scoped} from 'rescoped'

const Foo = scoped((props) => {
  return (
    <div>
      <p>foo self</p>
      {props.children}
    </div>
  )
})

const appStyle = `
  p {
    font-size: 32px;
    font-weight: bold;
  }
`

const App = scoped(() => {
  return (
    <>
      <style>
        {appStyle}
      </style>
      <p>app</p>
      <Foo>
        <p>foo children</p>
      </Foo>
    </>
  )
})

export default App

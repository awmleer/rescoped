import * as React from 'react'
import {scoped, slotted} from 'rescoped'
import {ReactNode} from 'react'

const Foo = scoped<{
  part: ReactNode
}>((props) => {
  return (
    <div>
      {props.part}
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
      <Foo part={slotted(
          <p>part 1</p>
      )}>
        <p>foo children</p>
      </Foo>
    </>
  )
})

export default App

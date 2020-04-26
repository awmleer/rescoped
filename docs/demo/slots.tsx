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
      <button>test</button>
      {props.children}
    </div>
  )
})

const Red = scoped((props) => {
  return (
    <span>{props.children}</span>
  )
}, {
  style: `
    span {
      color: red;
    }
    button {
      color: red;
    }
    p {
      color: yellow;
    }
  `
})

const appStyle = `
  p {
    color: blue;
  }
  button {
    color: green;
  }
`

const App = scoped(() => {
  return (
    <>
      <p>app</p>
      <Red>
        <Foo part={slotted(
          <p>part 1</p>
        )}>
          <p>foo children</p>
        </Foo>
      </Red>
      <Red>red 1</Red>
      <Red>red 2</Red>
    </>
  )
}, {
  style: appStyle,
  mode: 'open',
})

export default App

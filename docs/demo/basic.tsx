import * as React from 'react'
import {scoped} from 'rescoped'

const App = scoped(() => {
  return (
    <>
      <div className="alert alert-primary" role="alert">
        This is a bootstrap alert!
      </div>
    </>
  )
}, {
  styleUrl: 'https://gw.alipayobjects.com/os/lib/bootstrap/4.4.1/dist/css/bootstrap.min.css'
})

export default App

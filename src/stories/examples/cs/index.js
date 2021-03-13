import React from 'react'

import { AsyncYield, WithAwait, WithPromises } from './bar'

const CodeSplitting = () => {
  return (
    <div>
      <h3>With Promises</h3>
      <WithPromises />
      <h3>Async & Yield</h3>
      <AsyncYield />
      <h3>Just Await</h3>
      <WithAwait />
    </div>
  )
}

export default CodeSplitting

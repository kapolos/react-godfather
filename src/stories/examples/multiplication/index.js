import React from 'react'

import { toC } from '../../../lib/toc'

const SubB = ({ a, b }) => (<span>{a * b}</span>)

const B = toC(({ secondNum = 2 }) => {
  let a = 1
  let b = secondNum

  const handleOnClickA = () => {
    a++
  }
  const handleOnClickB = () => {
    b++
  }

  return () => (
    <div>
      <button
        style={{ marginTop: '20px', background: 'none', padding: '5px' }}
        onClick={handleOnClickA}
      >
        {a}
      </button>

      <button
        style={{ marginTop: '20px', background: 'none', padding: '5px' }}
        onClick={handleOnClickB}
      >
        {b}
      </button>

      <h3>Product: <SubB a={a} b={b} /></h3>
    </div>
  )
}, ['onClick'], { id: 'ToC', stopPropagation: false })

export default B

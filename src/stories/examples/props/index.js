import React from 'react'

import { toC } from '../../../lib/toc'

const Inner = toC(() => {
  let counter = 0

  return ({ v }) => {
    counter++
    console.log(`Counter: ${counter}`)

    return <div>{v}</div>
  }
}, [], { id: 'Inner', stopPropagation: true })

const Outer = toC(() => {
  let value = 1

  const handleClick = () => {
    value += 1
  }

  return () => {
    console.log(value)

    return (
      <div>
        <button onClick={handleClick}>
          Add
        </button>
        <Inner v={value} />
      </div>
    )
  }
}, ['onClick'], { id: 'Outer' })

export default () => (
  <div>
    <Outer />
  </div>
)

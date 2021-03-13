import React from 'react'

import { toC } from '../../../lib/toc'

const Button = toC(({ label, submit }) => {
  let hits = 0

  const handleClick = () => {
    hits++
    submit(label)
  }

  return ({ vote }) => (
    <div>
      <p>You've hit {label} {hits} times</p>
      <button
        onClick={handleClick}
        disabled={vote === label}
      >{label}
      </button>
    </div>
  )
}, [])

const Booth = toC(() => {
  let vote

  const handleButton = label => {
    vote = label
  }

  return () => (
    <div>
      <p>Current vote is: {vote}</p>

      <Button label='yes' submit={handleButton} vote={vote} />
      <Button label='no' submit={handleButton} vote={vote} />
    </div>
  )
}, ['onClick'])

export default Booth

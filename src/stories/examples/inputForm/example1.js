import React from 'react'

import { toC } from '../../../lib/toc'

const Example1 = ({ tick }) => {
  let value = 'foo'

  const handleOnChange = e => {
    value = e.target.value
    tick()
  }

  return () => (
    <form spellCheck={false}>
      <div style={{ color: 'blue' }}>{value}</div>
      <input
        key='zzz'
        type='text'
        className='input'
        value={value}
        onChange={handleOnChange}
      />
    </form>
  )
}

export default toC(Example1)

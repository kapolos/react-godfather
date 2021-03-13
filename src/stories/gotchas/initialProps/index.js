import React from 'react'

import { toC } from '../../../lib/toc'

const InputWithInitialPropsValue = toC(({ value, handleOnChange }) => {
  return () => (
    <input
      type='text'
      className='input'
      value={value}
      onChange={handleOnChange}
    />
  )
}, ['onChange'], { stopPropagation: false, id: 'InputWithInitialPropsValue' })

export default InputWithInitialPropsValue

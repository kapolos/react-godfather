import React from 'react'

import { toC } from '../../../lib/toc.js'

function Form ({ add }) {
  let value = ''

  const handleOnChange = e => {
    value = e.target.value
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!value) {
      return
    }

    add(value)
    value = ''
  }

  return () => (
    <form onSubmit={handleSubmit} spellCheck={false}>
      <input
        type='text'
        className='input'
        value={value}
        onChange={handleOnChange}
      />
      <button>Add</button>
    </form>
  )
}

export default toC(Form, ['onChange', 'onSubmit', 'onClick'], false, 'Form')

import React from 'react'

import { toC } from '../lib/toc.js'
import InputWithInitialPropsValue from './gotchas/initialProps'

export default { title: 'Gotchas' }

const InputForm = toC(() => {
  let value = 'foo'

  const handleOnChange = e => {
    value = e.target.value
  }

  return () => (
    <form spellCheck={false}>
      <div style={{ color: 'blue' }}>{value}</div>
      <InputWithInitialPropsValue value={value} handleOnChange={handleOnChange} />
    </form>
  )
}, ['onChange'])

export const InitialProps = () => {
  return (
    <div>
      <h3>Using initialProps instead of renderProps by mistake</h3>
      <InputForm />
    </div>
  )
}

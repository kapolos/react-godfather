import React from 'react'

import Mul from './examples/multiplication'
import Booth from './examples/votes'
import InputForm from './examples/inputForm'
import Outer from './examples/props'
import Cs from './examples/cs'
import Cl from './examples/cleanup'

export default { title: 'Examples' }

export const Multiplication = () => {
  return (
    <div>
      <Mul secondNum={3} />
    </div>
  )
}

export const Voting = () => (
  <div>
    <Booth />
  </div>
)

export const FormInput = InputForm

export const Props = Outer

export const CodeSplitting = Cs

export const Cleanup = Cl

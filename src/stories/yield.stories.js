import React from 'react'
import { toC } from '../lib'

export default { title: 'Yield' }

function delay (delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}

const Example1 = toC(({ withTick }) => {
  let data = null

  const getMyData = withTick(async () => {
    await delay(1200)

    data = '"But, for my own part, it was Greek to me."'
  })

  return function * () {
    getMyData()

    yield <div>Fetching...</div>

    getMyData()

    yield <div>Fetching some more...</div>

    return (
      <div>{data}</div>
    )
  }
}, [])

const Example2 = toC(({ withTick }) => {
  let data = null

  const getMyData = withTick(async () => {
    await delay(1200)

    data = '"But, for my own part, it was Greek to me."'
  })

  return async function * () {
    getMyData()

    yield <div>Fetching, with extra delay...</div>

    await delay(800)

    getMyData()

    yield <div>Fetching some more...</div>

    return (
      <div>{data}</div>
    )
  }
}, [])

export const HolyYield = () => {
  return (
    <div>
      <h3>Yield, `withTick`</h3>
      <Example1 />
      <h3>Await, Yield, `withTick`</h3>
      <Example2 />
    </div>
  )
}

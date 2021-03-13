import React from 'react'

import { toC } from '../../../lib/toc'

const delay = (ms) => new Promise((resolve) => {
  setTimeout(() => resolve(), ms)
})

export const AsyncYield = toC(({ tick }) => {
  let Foo
  return async function * () {
    import('./foo.js')
      .then(C => { Foo = C.default })
      .then(() => delay(1000))
      .then(tick)

    yield <div>Fetching...</div>

    return <Foo />
  }
})

export const WithAwait = toC(() => {
  return async () => {
    await delay(1000)

    const Foo = (await import('./foo.js')).default

    return <Foo />
  }
})

export const WithPromises = toC(({ tick }) => {
  let Foo
  let error

  delay(1000)
    .then(() => import('./foo.js'))
    .then(obj => {
      Foo = obj.default
    })
    .catch(e => {
      error = e
    })
    .finally(tick)

  return () => {
    if (error) {
      return <div>Whooops, I did it again.</div>
    }

    if (!Foo) {
      return <div>Loading...</div>
    }

    return <Foo />
  }
})

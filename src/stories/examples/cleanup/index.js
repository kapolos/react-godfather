import React from 'react'

import { toC } from '../../../lib/toc'

const MockAPI = {
  subscribe: v => {
    console.log(`Subscribed to ${v}`)
  },
  unsubscribe: v => {
    console.log(`Unsubscribed from ${v}`)
  }
}

const WithCleanup = toC(({ onUnmount }) => {
  const topic = 'foo'
  let subscribed = false

  const handleClick = () => {
    MockAPI.subscribe(topic)
    subscribed = true
  }

  onUnmount(() => {
    if (subscribed) {
      MockAPI.unsubscribe(topic)
    }
  })

  return () => {
    return (
      <div>
        <button onClick={handleClick}>
          Subscribe
        </button>
      </div>
    )
  }
}, ['onClick'], { id: 'Outer' })

export default () => (
  <div>
    <WithCleanup />
  </div>
)

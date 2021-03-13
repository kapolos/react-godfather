import React from 'react'
import { toC, Wait } from '../lib'

export default { title: 'Helpers' }

function delay (delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}

const Demo = toC(() => {
  let data = null

  const getMyData = async () => {
    await delay(1000)
    data = 1

    return data
  }

  return async (props) => {
    const handleClick = () => {
      data = null
    }

    return (
      <Wait
        until={() => data}
        launch={() => getMyData().then(props.tick)}
        lounge={(<div>Loading......</div>)}
      >
        <div><button onClick={handleClick}>{data}</button></div>
      </Wait>
    )
  }
}, ['onClick'], { id: 'b', stopPropagation: true })

export const Helper = () => {
  return (
    <div>
      <Demo />
    </div>
  )
}

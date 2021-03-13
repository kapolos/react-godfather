import React from 'react'
import PT from 'prop-types'

import { toC } from '../../../lib/toc.js'

const Item = () => {
  return ({ item, markDone, remove }) => {
    const handleDone = () => {
      markDone(item.id)
    }

    const handleRemove = () => {
      remove(item.id)
    }

    return (
      <div
        className='item'
        style={{ textDecoration: item.done ? 'line-through' : '' }}
      >
        {item.text}

        <div className='actionWrapper'>
          <button onClick={handleDone}><span role='img' aria-label='Ok'>✅</span></button>
          <button onClick={handleRemove}><span role='img' aria-label='Cancel'>❌</span></button>
        </div>
      </div>
    )
  }
}

Item.propTypes = {
  item: PT.shape({
    text: PT.string,
    done: PT.bool,
    id: PT.number
  }),
  markDone: PT.func,
  remove: PT.func
}

export default toC(Item, ['onClick'], { id: 'Item', stopPropagation: false })

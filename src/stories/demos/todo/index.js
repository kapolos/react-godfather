import React from 'react'

import { toC } from '../../../lib/toc.js'
import Item from './item'
import Form from './form'
import FilterBar from './filter'

const sampleData = [
  {
    id: 1,
    text: 'Learn about React',
    done: false
  },
  {
    id: 2,
    text: 'Meet friend for lunch',
    done: false
  },
  {
    id: 3,
    text: 'Build really cool todo app',
    done: false
  }
]

const getFilteredList = (list, filter) => {
  switch (filter) {
    case 'all':
      return list
    case 'active':
      return list.filter(item => !item.done)
    case 'done':
      return list.filter(item => item.done)
  }
}

const dummyResponse = () => new Promise((resolve) => {
  setTimeout(() => resolve([...sampleData]), 1000)
})

const Demo = () => {
  let list
  let activeFilter = 'all'
  let error = false

  const add = value => {
    list = [...list, {
      text: value,
      done: false,
      id: list.length + 1
    }]
  }

  const remove = id => {
    list = list.filter(item => item.id !== id)
  }

  const markDone = id => {
    list = list.map(item => {
      if (item.id !== id) {
        return item
      }

      const cloned = Object.assign({}, item)
      cloned.done = true

      return cloned
    })
  }

  const updateFilter = v => { activeFilter = v }

  const fetchData = async () => {
    try {
      list = await dummyResponse()
    } catch (e) {
      error = true
    }
  }

  const handleOnRefetchClicked = () => {
    list = null
    fetchData()
  }

  return async ({ tick }) => {
    if (error) {
      return <div>Something went wrong.</div>
    }

    if (!list) {
      fetchData().then(tick)

      return <div>Loading...</div>
    }

    const filteredList = getFilteredList(list, activeFilter)

    return (
      <div className='demo'>
        <div className='list'>
          {filteredList.map((item) => {
            return (
              <Item
                item={item}
                key={`item-${item.id}`}
                markDone={markDone}
                remove={remove}
              />
            )
          })}
          <Form add={add} />
          <FilterBar filter={activeFilter} update={updateFilter} />
          <div>
            <button onClick={handleOnRefetchClicked}>Refetch</button>
          </div>
        </div>
      </div>
    )
  }
}

export default toC(Demo, ['onSubmit', 'onClick'], {
  id: 'Todo Demo',
  stopPropagation: false,
  extraClass: 'todoApp'
})

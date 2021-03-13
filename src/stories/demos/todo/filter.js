import React from 'react'
import PT from 'prop-types'

const FilterBar = ({ filter, update }) => {
  const handleAll = () => {
    update('all')
  }

  const handleActive = () => {
    update('active')
  }

  const handleDone = () => {
    update('done')
  }

  return (
    <section>
      <header>Filter: </header>
      <main>
        <button onClick={handleAll} disabled={filter === 'all'}>All</button>
        <button onClick={handleActive} disabled={filter === 'active'}>Active</button>
        <button onClick={handleDone} disabled={filter === 'done'}>Done</button>
      </main>
    </section>
  )
}

FilterBar.propTypes = {
  filter: PT.string,
  update: PT.func
}

export default FilterBar

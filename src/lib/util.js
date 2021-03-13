// Don't die on old Edge
import { useEffect, useRef } from 'react'

if (typeof globalThis === 'undefined') {
  // eslint-disable-next-line no-global-assign
  globalThis = {}
}

// noinspection JSUnresolvedVariable
// globalThis._react_js_dbg = true

export const logState = (type, opts) => {
  if (!opts) {
    return
  }

  const { id, instance, props, prevProps } = opts

  return globalThis._react_js_dbg && console.log(`
    ${type} on ${id}, 
    ToC Instance: ${instance}, 
    prevProps: ${JSON.stringify(prevProps)}, 
    props: ${JSON.stringify(props)}
    `)
}

export const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

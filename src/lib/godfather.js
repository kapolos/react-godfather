import React, { useState, useRef, useEffect } from 'react'

import render from './render'
import step from './step'
import { logState, usePrevious } from './util'
import { dequal } from './dequal'

const getProps = (events, handleEvent) => Object.fromEntries(events.map(event => ([event, handleEvent])))
const shouldRender = (props, prevProps) => !dequal(props, prevProps)

/**
 * An offer you can't refuse.
 *
 * @param fc the functional component to manage
 * @param props the props to pass to the managed functional component
 * @param events the events we want to monitor
 * @param tocOpts configuration options : { id, stopPropagation, classnames }
 * @returns {JSX.Element}
 */
export const Godfather = (
  fc, props, events = [],
  tocOpts = { id: 'unnamed ToC', stopPropagation: false, extraClass: null }
) => {
  const { id, stopPropagation, extraClass } = tocOpts
  const gRef = useRef()
  const prevProps = usePrevious(props)
  const [generatorValue, setGeneratorValue] = useState()
  const onUnmountRef = useRef() // Hold the user function to execute on unmount

  const onUnmountReceiver = f => {
    onUnmountRef.current = f
  }

  const handleEvent = (e) => {
    const opts = { id, gRef, props, prevProps, dbg: { event: 'eventHandler' }, onUnmountReceiver }

    // noinspection JSIgnoredPromiseFromCall
    step(opts, setGeneratorValue)

    if (stopPropagation && e) { // TODO Consider allowing selective stop propagation based on an list of events
      e.stopPropagation()
    }
  }

  /**
   * Run user-provided cleanup function on unmount
   */
  useEffect(() => {
    return () => {
      if (onUnmountRef.current) {
        onUnmountRef.current()
      }
    }
  }, [])

  useEffect(() => {
    const opts = { id, gRef, props, prevProps, dbg: { event: 'Props' } }

    if (!gRef.current) { // Happens only on the first run
      const tick = () => { // noinspection JSIgnoredPromiseFromCall
        step(opts, setGeneratorValue)
      }
      const withTick = x => () => x().then(tick)
      // Create the GeneratorFunction object
      const g = render(fc({ ...props, tick, withTick, onUnmount: onUnmountReceiver }))

      g.id = Math.random() // Give it an id
      gRef.current = g // Set the ref

      opts.dbg = { event: 'Init' }

      /**
       * First call is a dud, exists to initialize `payloadProps` in `render` via `yield`
       * Second call actually runs the functional component using the props
       */
      step(opts, setGeneratorValue).then(() => step(opts, setGeneratorValue))
    } else { // Rerender on updated props
      if (shouldRender(props, prevProps)) {
        // noinspection JSIgnoredPromiseFromCall
        step(opts, setGeneratorValue)
      }
    }
  }, [fc, id, props, prevProps])

  if (globalThis._react_js_dbg) {
    return (
      <div {...getProps(events, handleEvent)} className={`ticTok-container-${id}`}>
        <span style={{ fontSize: '0.8em', color: 'yellow', backgroundColor: 'black' }}>{id}</span>
        {logState('ToC Render', { id, instance: gRef.current?.id, props, prevProps })}
        {generatorValue}
      </div>
    )
  }

  return (
    <div {...getProps(events, handleEvent)} className={`react-godfather ${extraClass}`}>
      {generatorValue}
    </div>
  )
}

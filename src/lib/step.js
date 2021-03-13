import { logState } from './util'

const step = async (opts, cb) => {
  const { id, gRef, props, prevProps, dbg, onUnmountReceiver } = opts
  const instance = gRef.current?.id
  const { event } = dbg

  logState(`Tick via ${event}`, { id, instance, props, prevProps })

  const tick = () => { return step(opts, cb) }

  const componentProps = {
    ...props,
    prevProps,
    __dbg: dbg,
    tick,
    withTick: x => () => x().then(tick),
    onUnmount: onUnmountReceiver
  }

  const { value } = await gRef.current.next(componentProps)

  cb(value)
}

export default step

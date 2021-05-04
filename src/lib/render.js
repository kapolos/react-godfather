const render = async function * (payloadF) {
  let generator // In case the user component provides a generator function

  let payloadProps = yield null

  // Dry run to see if we are dealing with a user provided generator
  const init = payloadF(payloadProps)
  if (init && init._invoke) {
    generator = init
  }

  while (true) {
    if (!generator) {
      payloadProps = yield Promise.resolve(payloadF(payloadProps))
    } else {
      const { value, done } = await generator.next(payloadProps)
      payloadProps = yield Promise.resolve(value)

      // Rewind after user-provided generator `return` statement
      if (done) {
        generator = payloadF(payloadProps)
      }
    }
  }
}

export default render

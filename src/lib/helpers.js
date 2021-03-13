export const Wait = ({ until, launch, lounge, children }) => {
  if (!until()) {
    launch()

    return lounge
  }

  return children
}

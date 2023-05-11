const requestAnimationFrameInterval = (callback: () => Promise<void>, delay: number) => {
  let start = Date.now()
  let stop = false
  let requestAnimationFrameId: number

  const tickCallback = async (): Promise<void> => {
    try {
      const now = Date.now()
      if (now - start >= delay) {
        await callback()
        start = Date.now() + delay
      }
      if (!stop) {
        cancelAnimationFrame(requestAnimationFrameId)
        requestAnimationFrameId = requestAnimationFrame(tickCallback)
      }
    } catch (e) {
      cancelAnimationFrame(requestAnimationFrameId)
      throw e
    }
  }
  requestAnimationFrameId = requestAnimationFrame(tickCallback)

  return (): void => {
    stop = true
    cancelAnimationFrame(requestAnimationFrameId)
  }
}

export { requestAnimationFrameInterval }

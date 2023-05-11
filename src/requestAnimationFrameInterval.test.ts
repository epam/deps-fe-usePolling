import flushPromises from 'flush-promises'
import { requestAnimationFrameInterval } from './requestAnimationFrameInterval'

interface TrackingConfig {
  start: number;
  then: number;
}

const callback = jest.fn(() => Promise.resolve())

const mockDate = (stepMs: number): TrackingConfig => {
  const start = Date.parse('2023-03-01T00:00:00.000Z')
  const trackingConfig = {
    start,
    then: start
  }
  global.Date.now = jest.fn(() => {
    trackingConfig.then = trackingConfig.then + stepMs
    return trackingConfig.then
  }).mockImplementationOnce(() => start)

  return trackingConfig
}

describe('Util: requestAnimationFrameInterval', () => {
  const explicitMockDurationOfInterval = 2001
  const delayForInterval = Math.floor(explicitMockDurationOfInterval / 4)
  const countOfTickDateNowExecution = 2
  const mockStepForDateNow = delayForInterval / 2
  const expectedCountOfCallbackCalls = Math.floor(
    explicitMockDurationOfInterval / delayForInterval / countOfTickDateNowExecution
  )
  const expectedCountOfRequestAnimationFrameCalls = Math.floor(explicitMockDurationOfInterval / mockStepForDateNow)
  let dateTracking: TrackingConfig
  const mockStopId = 1
  let counter: number

  beforeEach(() => {
    counter = 0
    dateTracking = mockDate(mockStepForDateNow)

    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      if (dateTracking.then - dateTracking.start >= explicitMockDurationOfInterval) {
        return mockStopId
      }
      cb(0)
      return ++counter
    })

    jest.spyOn(window, 'cancelAnimationFrame')
    jest.clearAllMocks()
  })

  it('should call the requestAnimationFrame function expected number of times', async () => {
    const stopInterval = requestAnimationFrameInterval(callback, delayForInterval)
    await flushPromises()

    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(expectedCountOfRequestAnimationFrameCalls)
    stopInterval()
  })

  it('should call the callback function expected number of times', async () => {
    const stopInterval = requestAnimationFrameInterval(callback, delayForInterval)
    await flushPromises()

    expect(callback).toHaveBeenCalledTimes(expectedCountOfCallbackCalls)
    stopInterval()
  })

  it('should call cancelAnimationFrame function nth times with correct id', async () => {
    const stopInterval = requestAnimationFrameInterval(callback, delayForInterval)
    stopInterval()

    expect(window.cancelAnimationFrame).nthCalledWith(2, counter)
  })

  it('should calls cancelAnimationFrame and requestAnimationFrame once and if callback rejected', async () => {
    jest.clearAllMocks()
    callback.mockImplementation(() => Promise.reject(new Error('test')))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(async(cb: FrameRequestCallback) => {
      try {
        if (dateTracking.then - dateTracking.start >= explicitMockDurationOfInterval) {
          return mockStopId
        }
        await cb(0)
        return ++counter
      // eslint-disable-next-line no-empty
      } catch  {}
    })

    requestAnimationFrameInterval(callback, 0)
    await flushPromises()

    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1)
    expect(window.cancelAnimationFrame).toHaveBeenCalledTimes(1)
  })
})

import  React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import flushPromises from 'flush-promises'
import { requestAnimationFrameInterval } from './requestAnimationFrameInterval'
import { usePolling, UsePollingProps, UsePollingApi } from './usePolling'

interface PollingDivProps extends UsePollingApi, React.HTMLAttributes<HTMLDivElement> {}

interface UsePollingReturn extends UsePollingProps, UsePollingApi {}

// eslint-disable-next-line vars-on-top, no-var
var mockAbort: null | object

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: jest.fn((fn) => fn),
  useRef: jest.fn(() => ({ current: mockAbort })),
  useEffect: jest.fn((f) => f()),
  useState: jest.fn((state) => {
    if (typeof state === 'function') {
      state = state()
    }
    const setState = jest.fn((changes) => {
      state = changes
    })
    return [state, setState]
  })
}))

jest.mock('./requestAnimationFrameInterval', () => (() => {
  mockAbort = jest.fn()
  return {
    requestAnimationFrameInterval: jest.fn((fn) => {
      fn()
      return mockAbort
    })
  }
})())

jest.mock('./usePrevious', () => ({
  usePrevious: jest.fn(() => true)
}))

const INTERVAL_TIME = 1000

// eslint-disable-next-line no-undef
const HookWrapper = ({ callback, condition, interval, onPollingSucceed, onPollingFailed }: UsePollingProps): JSX.Element => {
  const pollingProps: PollingDivProps = usePolling({
    callback,
    condition,
    interval,
    onPollingSucceed,
    onPollingFailed
  })
  return (
    <div {...pollingProps} />
  )
}

describe('Hook: usePolling', () => {
  let defaultProps: UsePollingProps
  let wrapper: ShallowWrapper<UsePollingReturn>

  beforeEach(() => {
    defaultProps = {
      callback: jest.fn(() => Promise.resolve()),
      condition: true,
      interval: INTERVAL_TIME,
      onPollingSucceed: jest.fn(() => Promise.resolve()),
      onPollingFailed: jest.fn()
    }
    wrapper = shallow(<HookWrapper {...defaultProps} />)
    jest.clearAllMocks()
  })

  it('should provide expected API', () => {
    const expectedKeys = [
      'isPolling',
      'startPolling',
      'stopPolling',
      'restartPolling'
    ]
    const props = wrapper.props()
    expect(Object.keys(props)).toHaveLength(expectedKeys.length)

    expectedKeys.forEach((key) => {
      expect(Object.keys(props)).toContain(key)
    })
  })

  it('should not start polling initially', () => {
    const { isPolling } = wrapper.props()
    expect(isPolling).toEqual(false)
  })

  it('should call/register interval with correct args when start polling', () => {
    const { startPolling } = wrapper.props()
    startPolling()
    expect(requestAnimationFrameInterval).nthCalledWith(1, expect.any(Function), defaultProps.interval)
    expect(defaultProps.callback).toHaveBeenCalled()
  })

  it('should stop polling, in case of callback rejections', async () => {
    const error = new Error('mock error message')
    defaultProps = {
      ...defaultProps,
      callback: jest.fn(() => Promise.reject(error))
    }
    wrapper.setProps(defaultProps)
    const { startPolling } = wrapper.props()
    startPolling()
    await flushPromises()
    expect(defaultProps.callback).toHaveBeenCalled()
    expect(mockAbort).toHaveBeenCalled()
  })

  it('should stop polling in case of calling stopPolling', () => {
    const { stopPolling } = wrapper.props()
    stopPolling()
    expect(mockAbort).toHaveBeenCalled()
  })

  it('should stop polling and start new in case of calling restartPolling', () => {
    const { restartPolling } = wrapper.props()
    restartPolling()
    expect(mockAbort).toHaveBeenCalled()
    expect(requestAnimationFrameInterval).nthCalledWith(1, expect.any(Function), defaultProps.interval)
  })

  it('should call onPollingSucceed', async () => {
    defaultProps = {
      ...defaultProps,
      condition: false
    }
    wrapper.setProps(defaultProps)

    const { startPolling } = wrapper.props()
    startPolling()
    await flushPromises()

    expect(defaultProps.onPollingSucceed).toHaveBeenCalled()
  })

  it('should call onPollingFailed in case of callback rejection', async () => {
    const error = new Error('mock error message')
    defaultProps = {
      ...defaultProps,
      callback: jest.fn(() => Promise.reject(error))
    }
    wrapper.setProps(defaultProps)

    const { startPolling } = wrapper.props()
    startPolling()
    await flushPromises()

    expect(defaultProps.onPollingFailed).toHaveBeenCalled()
  })
})

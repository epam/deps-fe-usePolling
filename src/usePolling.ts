import {
  useState,
  useCallback,
  useRef,
  useEffect
} from 'react'
import { requestAnimationFrameInterval } from './requestAnimationFrameInterval'
import { usePrevious } from './usePrevious'

interface UsePollingProps {
  callback: () => void;
  condition: boolean;
  interval: number;
  onPollingFailed?: () => void;
  onPollingSucceed?: () => void;
}

interface UsePollingApi {
  isPolling: boolean;
  restartPolling: () => void;
  startPolling: () => void;
  stopPolling: () => void;
}

const usePolling = ({
  callback,
  condition,
  interval,
  onPollingFailed,
  onPollingSucceed
}: UsePollingProps): UsePollingApi => {
  const abort = useRef<(() => void) | null>(null)
  const [isPolling, setIsPolling] = useState<boolean>(false)
  const prevCondition = usePrevious<boolean>(condition)

  const terminateInterval = useCallback((): void => {
    if (!abort?.current) {
      return
    }
    abort.current()
    abort.current = null
  }, [abort])

  const stopPolling = useCallback((): void => {
    terminateInterval()
    setIsPolling(false)
  }, [terminateInterval])

  const startPolling = useCallback(() => {
    setIsPolling(true)
    abort.current = requestAnimationFrameInterval(
      async () => {
        try {
          await callback()
        } catch {
          onPollingFailed?.()
          stopPolling()
        }
      },
      interval
    )
  }, [
    stopPolling,
    callback,
    interval,
    onPollingFailed
  ])

  const restartPolling = useCallback(() => {
    stopPolling()
    startPolling()
  }, [stopPolling, startPolling])

  useEffect(() => {
    if (condition) {
      startPolling()
    }

    if (!condition && prevCondition) {
      onPollingSucceed?.()
      stopPolling()
    }

    return stopPolling
  }, [
    startPolling,
    stopPolling,
    condition,
    prevCondition,
    onPollingSucceed
  ])

  return {
    isPolling,
    restartPolling,
    startPolling,
    stopPolling
  }
}

export {
  usePolling,
  UsePollingProps,
  UsePollingApi
}

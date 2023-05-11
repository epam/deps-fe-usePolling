import React, { useCallback, useState } from 'react'
import './App.css'
import axios from "axios";
import { usePolling } from 'usePolling'

const POLLING_INTERVAL = 2_000
const MAX_ITEMS_LENGTH = 15

type Dog = {
  message: string
  status: string
}

const App = () => {
  const [dogs, setDogs] = useState<Dog[]>([])
  const [startFetching, setStartFetching] = useState(false)

  const fetchData = useCallback(async () => {
    const { data } = await axios.get('https://dog.ceo/api/breeds/image/random')
    setDogs((prev) => [...prev, data])
    dogs.length === MAX_ITEMS_LENGTH && setStartFetching(false)
  }, [dogs.length])

  const onSuccess = useCallback(() => console.log("It's success"), [])

  const onFail = useCallback(() => console.log("Oops.. something went wrong"), [])

  const { isPolling } = usePolling({
    callback: fetchData,
    condition: startFetching,
    interval: POLLING_INTERVAL,
    onPollingSucceed: onSuccess,
    onPollingFailed: onFail
  })

  const onClickHandler = () => {
    setDogs([])
    setStartFetching(true)
  }

  return (
    <div className="wrapper">
      <button
        className="button"
        onClick={onClickHandler}
        disabled={isPolling}
      >
        Start polling and get cute images
      </button>
      <div className="content">
        {dogs.map((d, i) => (
          <img
            key={i}
            src={d.message}
            className="image"
            alt={`dog ${i}`}
          />
        ))}
      </div>
      <div>
        {isPolling && (<>Loading...</>)}
      </div>
    </div>
  )
}

export default App

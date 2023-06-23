# use-raf-polling

## Overview

*use-raf-polling* is a lightweight npm package that provides a simple and intuitive hook for polling in React applications. It allows you to repeatedly execute a callback function at a specified interval, and provides convenient features for controlling the polling behavior.

Here are some scenarios where *use-raf-polling* could come in handy:

- Data Visualization: usePolling can be used to update visual data representations, such as charts, graphs, or maps, at regular intervals.
- Background Data Sync: usePolling can be used to sync data between a client and server on a regular basis, for instance updating data in a real-time monitoring application.
- Real-time Notifications: usePolling can be used to check for new updates or notifications on a web page without the user having to manually refresh the page.

## Features and benefits

- Easy to use: *use-raf-polling* provides a straightforward way to implement polling in your React components, with no complex configuration required.
- Flexible: you can customize the polling interval, polling condition, callback functions to suit your specific use case.
- Efficient: *use-raf-polling* uses requestAnimationFrame to ensure smooth and performant polling, without blocking the main thread. Besides, the callback function will not be executed, for example, when the browser tab is not active. This can help reduce the performance impact.
- Reliable: the hook includes error handling and retry logic.

## Usage

Here's a basic example of how to use *use-raf-polling*:

```typescript
import { usePolling, UsePollingProps } from 'react-polling-hook'

const MyComponent = () => {
  const pollingProps: UsePollingProps = {
    callback: async () => {
      // Your polling logic here
    },
    condition: true, // Use this property to start/stop polling. If set to 'true', the API polling will start immediately 
    interval: 5000, // Set this to your desired polling interval in milliseconds
    onPollingFailed: () => {
      console.error("Polling failed!") // Handle failed polling requests here
    },
    onPollingSucceed: () => {
      console.log("Polling succeeded!") // Handle successful polling requests here
    }
  }
  const {
    isPolling,
    restartPolling,
    startPolling,
    stopPolling
  } = usePolling(pollingProps)

  return (
    <div>
      <p>Polling is currently {isPolling ? 'enabled' : 'disabled'}</p>
      <button onClick={startPolling}>Start polling</button>
      <button onClick={stopPolling}>Stop polling</button>
      <button onClick={restartPolling}>Restart polling</button>
    </div>
  )
}
```

For more information of usage, please refer to the [example](https://github.com/example/example) folder.  
Also, check the [demo](https://epam.github.io/deps-fe-usePolling/index.html).

## Installation

To install *use-raf-polling* in your project, simply run:

```bash
# If you use npm:
npm install use-raf-polling

# Or if you use Yarn:
yarn add use-raf-polling
```

And then import it in your React components as shown in the above example.

## License

This package is distributed under the MIT License.

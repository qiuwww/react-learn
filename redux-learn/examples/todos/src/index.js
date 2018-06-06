import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import App from './components/App'
import rootReducer from './reducers'

const store = createStore(rootReducer)

// 提供上下文环境，提供到组件的各个地方，都可以调用，没有层级限制
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
// react 组件 Counter
import Counter from './components/Counter'
// reducers
import counter from './reducers'

const store = createStore(counter)
const rootEl = document.getElementById('root')

// 渲染函数
// render(reactEle, dom)，讲reactEle构建，然后插入到dom节点位置
const render = () => ReactDOM.render(
  <Counter
    value={store.getState()}
    onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
    onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
  />,
  rootEl
)

render()
store.subscribe(render)

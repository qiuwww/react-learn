import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'

// 组合/结合的reducers
// 随着应用变得越来越复杂，可以考虑将 reducer 函数 拆分成多个单独的函数，拆分后的每个函数负责独立管理 state 的一部分。
// combineReducers 辅助函数的作用是，把一个由多个不同 reducer 函数作为 value 的 object，合并成一个最终的 reducer 函数，
// 然后就可以对这个 reducer 调用 createStore 方法。
export default combineReducers({
  todos,
  visibilityFilter
})

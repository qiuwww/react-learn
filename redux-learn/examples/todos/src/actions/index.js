

// Action 是把数据从应用（译者注：这里之所以不叫 view 是因为这些数据有可能是服务器响应，
// 用户输入或其它非 view 的数据 ）传到 store 的有效载荷。
// 它是 store 数据的唯一来源。一般来说你会通过 store.dispatch() 将 action 传到 store。

// Action 创建函数 就是生成 action 的方法。“action” 和 “action 创建函数” 这两个概念很容易混在一起，使用时最好注意区分。
let nextTodoId = 0
// action 创建函数，说明参数改变类型，并传入需要改变的参数
// 就像是一个模板
export const addTodo = text => ({
  type: 'ADD_TODO', // action的类型
  id: nextTodoId++,
  text
})

export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})

export const toggleTodo = id => ({
  type: 'TOGGLE_TODO',
  id
})
// 可见操作的选择状态
// 定义的常量
export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}
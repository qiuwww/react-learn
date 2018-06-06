
// 改变函数，reducers
const todos = (state = [], action) => {
  switch (action.type) {
    // 新增进去的
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false // 默认为false
        }
      ]
    case 'TOGGLE_TODO':
    // 返回一个新数组，如果被选中就反转computed属性
      return state.map(todo =>
        (todo.id === action.id) ? {...todo, completed: !todo.completed} : todo
      )
    default:
      return state
  }
}

export default todos

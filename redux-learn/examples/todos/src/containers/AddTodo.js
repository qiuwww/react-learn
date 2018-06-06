
// 新增的输入框与按钮组
import React from 'react'

import { connect } from 'react-redux'
import { addTodo } from '../actions'

const AddTodo = ({ dispatch }) => {
  let input

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        // 直接使用redux是store.dispatch({}) => connect + dispatch(storeName)
        dispatch(addTodo(input.value))
        input.value = ''
      }}>
        <input ref={node => input = node} />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  )
}
// 也就是说，结合redux与react的桥梁，1. Provide：提供store对象；2. connect：需要使用的state，必须被connect包装。 
export default connect()(AddTodo)

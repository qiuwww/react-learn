import React, { useReducer } from 'react';
import useMyState from './custom-hooks/useMyState.js';

const initialState = {
  count: 0,
};

// 1. 用法跟 Redux 基本上是一致的，用法也很简单，算是提供一个 mini 的 Redux 版本。
// 2. useState 的替代方案。它接收一个形如 (state, action) => newState 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法。
// 3. 在某些场景下，useReducer 会比 useState 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等。
// 4. 答案是useState 是使用 useReducer 构建的。

// 提前预设处理逻辑
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + action.payload };
    case 'decrement':
      return { count: state.count - action.payload };
    default:
      throw new Error();
  }
}

export default function Index() {
  // const [state, dispatch] = useReducer(reducer, initialArg, init);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [num, setNum] = useMyState(1);

  return (
    <>
      Count: {state.count}- {num}
      <button
        onClick={() => {
          dispatch({ type: 'increment', payload: 5 });
          setNum(state.count);
        }}
      >
        +
      </button>
      <button onClick={() => dispatch({ type: 'decrement', payload: 5 })}>-</button>
    </>
  );
}

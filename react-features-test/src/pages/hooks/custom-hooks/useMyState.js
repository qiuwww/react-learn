import { useReducer } from 'react';

function reducer(state, action) {
  return action;
}

// 只处理一般的参数
export default function useMyState(initialState) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return [state, dispatch];
}

import React, { useState } from 'react';
import { Button } from 'antd';

// 编写我们自己Hook，名字以use开头
function useCounter(initialValue) {
  const [count, changeCount] = useState(initialValue);

  const decrease = () => {
    changeCount(count - 1);
  };

  const increase = () => {
    changeCount(count + 1);
  };

  const resetCounter = () => {
    changeCount(0);
  };

  // 返回包含了更多逻辑的 state 以及改变 state 方法的钩子
  return [count, { decrease, increase, resetCounter }];
}

export default function MyHook() {
  const [count, controlCount] = useCounter(10);
  return (
    <div>
      <span>{'当前数量：' + count}</span>
      <Button onClick={controlCount.decrease}>减少</Button>
      <Button onClick={controlCount.increase}>增加</Button>
      <Button onClick={controlCount.resetCounter}>重置</Button>
    </div>
  );
}

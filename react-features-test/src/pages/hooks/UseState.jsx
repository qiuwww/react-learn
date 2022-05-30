import React, { useState } from 'react';
function Index() {
  // 1. 一般来说，在函数退出后变量就会”消失”，而 state 中的变量会被 React 保留。这里因为hooks是闭包
  // 2. useState() 方法里面唯一的参数就是初始 state。不同于 class 的是，我们可以按照需要使用数字或字符串对其进行赋值，而不一定是对象。 可以用于初始化的参数 数字、字符串、对象
  // 3. 值得注意的是 useState 不帮助你处理状态，相较于 setState 非覆盖式更新状态，useState 覆盖式更新状态，需要开发者自己处理逻辑。也就是下边的用原有的obj的状态与新的count状态合并成一个新的对象，作为新的状态，这个与Mutation/Reducer类似
  // 4. React 怎么知道 useState 对应的是哪个组件，因为我们并没有传递 this 给 React。
  // <https://zh-hans.reactjs.org/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components>
  // 每个组件内部都有一个「记忆单元格」列表。它们只不过是我们用来存储一些数据的 JavaScript 对象。当你用 useState() 调用一个 Hook 的时候，它会读取当前的单元格（或在首次渲染时将其初始化），然后把指针移动到下一个。这就是多个 useState() 调用会得到各自独立的本地 state 的原因。也就是按照顺序的

  // 5. 对比setState和useState
  // 1. 在正常的react的事件流里（如onClick等）：
  //     1. setState和useState是异步执行的（不会立即更新state的结果）
  //     2. 多次执行setState和useState，只会调用一次重新渲染render
  //     3. 不同的是，setState会进行state的合并，而useState则不会
  // 2. 在setTimeout，Promise.then等异步事件中
  //     1. setState和useState是同步执行的（立即更新state的结果）
  //     2. 多次执行setState和useState，每一次的执行setState和useState，都会调用一次render

  // 6. useState 传入的状态值没有变化，则不重新渲染

  const arrayLike = useState({
    count: 0,
    name: 'alife',
  });

  const [obj, setObject] = arrayLike;

  console.log('UseState', obj, setObject, arrayLike);

  return (
    <div className="App">
      Count: {obj.count}
      <button onClick={() => setObject({ ...obj, count: obj.count + 1 })}>+</button>
      <button onClick={() => setObject({ ...obj, count: obj.count - 1 })}>-</button>
    </div>
  );
}

export default Index;

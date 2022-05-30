import React, { useState, useMemo } from 'react';
// useCallback 的功能完全可以由 useMemo 所取代，如果你想通过使用 useMemo 返回一个记忆函数也是完全可以的。

// useCallback(fn, inputs) is equivalent to useMemo(() => fn, inputs).

// 所以 useCallback 常用记忆事件函数，生成记忆后的事件函数并传递给子组件使用。而 useMemo 更适合经过函数计算得到一个确定的值，比如记忆组件。

// 传入 useMemo 的函数会在渲染期间执行。

// 简单理解呢 useCallback 与 useMemo 一个缓存的是函数，一个缓存的是函数的返回值。useCallback 是来优化子组件的，防止子组件的重复渲染。useMemo 可以优化当前组件也可以优化子组件，优化当前组件主要是通过 memoize 来将一些复杂的计算逻辑进行缓存。

function UserCard({ children, userInfo }) {
  console.log('UserCard', userInfo);
  return <div>{userInfo.age}</div>;
}

export default function Index() {
  console.log('UseMemo 运行了');
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);

  const userInfo = {
    age: count,
    name: 'Jace',
  };

  // 很明显的上面的 userInfo 每次都将是一个新的对象，无论 count 发生改变没，都会导致 UserCard 重新渲染，而下面的则会在 count2 改变后才会返回新的对象。
  const userInfo2 = useMemo(() => {
    return {
      // ...
      name: 'Jace2',
      age: count2,
    };
  }, [count2]);

  return (
    <>
      <button onClick={() => setCount(2)}>setCount</button>
      <button onClick={() => setCount2(2)}>setCount2</button>

      <UserCard userInfo={userInfo} />
      <UserCard userInfo={userInfo2} />
    </>
  );
}

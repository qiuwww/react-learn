import React, { useState, useEffect } from 'react';
import useUpdate from './custom-hooks/useUpdate.js';

let timer = null;

export default function Index() {
  const [count, setCount] = useState(0);

  // 1. useEffect 第一个参数传递函数，可以用来做一些副作用比如异步请求，修改外部参数等行为，
  // 2. 而第二个参数是个数组，如果数组中值改变才会触发 useEffect 第一个参数中的函数。返回值(如果有)则在组件销毁或者调用函数前调用。
  // 3. 你可以把 useEffect Hook 看做 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合。
  // 3.1 useEffect(() => {}, []); 相当于componentDidMount，如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。这并不属于特殊情况 —— 它依然遵循依赖数组的工作方式。
  // 3.2 useEffect(() => {}), 实现组合 componentDidMount componentDidUpdate 的功能, 当useEffect没有第二个参数时,组件的初始化和更新都会执行。
  // 3.3 useEffect(() => { componentDidMount, return { componentWillUnmount  }}, []);useEffect返回一个函数，这个函数会在组件卸载时执行。实现组合 componentDidMount componentWillUnmount 的功能
  // 3.4 useEffect(() => {}, [props.id]); props.id改变的时候执行

  // 4. useEffect源码解析
  // 4.1 首先我们要牢记 effect hook 的一些属性：
  // 4.1.1 它们在渲染时被创建，但是在浏览器绘制后运行。
  // 4.1.2 如果给出了销毁指令，它们将在下一次绘制前被销毁。
  // 4.1.3 它们会按照定义的顺序被运行。

  // count改变才会导致这里的回调函数被执行
  useEffect(() => {
    document.title = 'componentDidMount' + count;
  }, [count]);

  // useEffect 中数组没有传值，代表不监听任何参数变化，即只有在组件初始化或销毁的时候才会触发，用来代替 componentDidMount 和 componentWillUnmount
  useEffect(() => {
    // componentDidMount
    console.log('componentDidMount');
    timer = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);
    // componentWillUnmount
    return () => {
      console.log('componentWillUnmount');
      document.title = 'componentWillUnmount';
      clearInterval(timer);
    };
  }, []);

  useUpdate(() => {
    // 这里每次都会被打印，这里先隐藏
    // console.log('componentUpdate');
  });

  return (
    <div>
      Count: {count}
      <button onClick={() => clearInterval(timer)}>clear</button>
    </div>
  );
}

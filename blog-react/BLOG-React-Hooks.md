---
title: React-Hooks
date: 2019-3-2
tags:
  - React
  - Hooks
categories:
  - [React, Hooks]
top: 6
---

组件的最佳写法应该是函数，而不是类。

React Hooks 的设计目的，就是**加强版函数组件**，完全不使用"类"，就能写出一个全功能的组件。

你可以使用 Hook 从组件中**提取状态逻辑**，**使得这些逻辑可以单独测试并复用**。Hook 使你在无需修改组件结构的情况下复用状态逻辑。 这使得在组件间或社区内共享 Hook 变得更便捷。

## 解决的问题

1. React 需要为**共享状态逻辑**提供更好的原生途径。
2. 难以理解的 class，你必须去理解 JavaScript 中 this 的工作方式。
3. Hooks 的许多卖点之一是**避免了类和高阶组件的复杂性**。

```js
// Example 0
function useState(initialValue) {
  var _val = initialValue; //_val是useState创建的局部变量
  function state() {
    // state 是一个内部函数, 也是一个闭包
    return _val; // state() 使用了_val, 该变量由父函数声明
  }
  function setState(newVal) {
    // 同样是内部函数
    _val = newVal; // 给_val赋值，而不用暴露_val
  }
  return [state, setState]; //将这两个函数暴露到外部
}
var [foo, setFoo] = useState(0); // 使用了数组解构方法
console.log(foo()); // logs 0 - 我们给的初始值
setFoo(1); // 在useState的作用域内给_val赋值
console.log(foo()); // logs 1 - 尽管使用了相同的函数调用，得到的是新的初始值
```

## Hook 是什么

Hook 这个单词的意思是"钩子"。

React Hooks 的意思是，**组件尽量写成纯函数**，**如果需要外部功能和副作用，就用钩子把外部代码"钩"进来**。

**所有的钩子都是为函数引入外部功能**，所以 React 约定，**钩子一律使用 use 前缀命名**，便于识别。你要使用 xxx 功能，钩子就命名为 usexxx。

下面介绍 React 默认提供的几个最常用的钩子。

1. useState()，用于为函数组件引入状态（state）。
2. useContext()，**组件之间共享状态**。
3. useReducer()，React 本身不提供状态管理功能，通常需要使用**外部库**。这方面最常用的库是 Redux。
   1. **useState 的替代方案**。**它接收一个形如 (state, action) => newState 的 reducer**，并返回当前的 state 以及与其配套的 dispatch 方法。
4. useEffect()，useEffect()：**副作用钩子**，替代 componentDidMount，每次**组件渲染时**，就会执行 useEffect()。
5. useMemo()，`const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])`;
   1. **把“创建”函数和依赖项数组作为参数传入 useMemo**，它仅会在某个依赖项改变时才重新计算 memoized 值。**这种优化有助于避免在每次渲染时都进行高开销的计算**。
6. useCallback，**它将返回该回调函数的 memoized 版本**，该回调函数仅在某个依赖项改变时才会更新。
   1. useCallback(fn, deps) 相当于 useMemo(() => fn, deps)。
7. useRef，返回一个可变的 ref 对象，类似 class 组件的 createRef
   1. useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变。

### useReducer

useReducers()钩子用来引入 Reducer 功能。

`const [state, dispatch] = useReducer(reducer, initialState);`

```jsx
import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

// 数组的第一个成员是状态的当前值，第二个成员是发送 action 的 dispatch 函数。
const myReducer = (state, action) => {
  switch (action.type) {
    case 'countUp':
      return {
        ...state,
        count: state.count + 1,
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(myReducer, { count: 0 });

  return (
    <div className='App'>
      <button onClick={() => dispatch({ type: 'countUp' })}>+1</button>
      <p>Count: {state.count}</p>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
```

由于 Hooks 可以提供共享状态和 Reducer 函数，所以它在这些方面可以取代 Redux。但是，它**没法提供中间件（middleware）和时间旅行（time travel）**，如果你需要这两个功能，还是要用 Redux。

### 尽量使用 useReducer，不要使用 useState

可以用作多个复合属性，嵌套状态，useReducer 比 useState 更适合做状态管理。

useState 有一个与 class 组件里面的 setState 明显不同的地方，那就是 useState 不对状态做浅层合并了，而 useReducer 会合并。

### useEffects

useEffect()用来引入具有副作用的操作，最常见的就是向服务器请求数据。以前，放在 componentDidMount 里面的代码，现在可以放在 useEffect()。

`componentDidMount + componentDidUpdate + componentWillUnmount = useEffect`。

默认情况下，React 会在**每次渲染后调用副作用函数** —— 包括第一次渲染的时候。副作用函数还可以通过返回一个函数来指定如何“清除”副作用。相当于在以上生命周期内修改状态。

```js
useEffect(() => {
  // Async Action
  // compomentDidMount & componentDidUpdate
  return () => {
    // compomponentWillUnmount
  };
  // dependencies为空就不执行componentDidUpdate
  // 如果你传入了一个空数组（[]），effect 内部的 props 和 state 就会一直拥有其初始值。尽管传入 [] 作为第二个参数更接近大家更熟悉的 componentDidMount 和 componentWillUnmount 思维模式
}, [dependencies]);
```

useEffect()接受两个参数。

第一个参数是一个函数，**异步操作的代码放在里面**。

useEffect 的第二个参数可选，如果用上的话，**这个参数必须是一个数组**。

useEffect 在每次被调用的时候，**都会“记住”这个数组参数**，当下一次被调用的时候，会**逐个比较数组中的元素**，**看是否和上一次调用的数组元素一模一样，如果一模一样，第一个参数（那个函数参数）也就不用被调用了**，如果不一样，就调用那个第一个参数。

## 创建自己的 Hooks | 自定义 Hooks

当我们想在两个函数之间共享逻辑时，我们会把它提取到第三个函数中。自定义 Hook 就是为了共享逻辑。

自定义 Hook 是一个函数，其名称以 “use” 开头，函数内部可以调用其他的 Hook。

### usePerson

```js
const usePerson = (personId) => {
  const [loading, setLoading] = useState(true);
  const [person, setPerson] = useState({});
  useEffect(() => {
    setLoading(true);
    fetch(`https://swapi.co/api/people/${personId}/`)
      .then((response) => response.json())
      .then((data) => {
        setPerson(data);
        setLoading(false);
      });
  }, [personId]);
  return [loading, person];
};
```

### [自定义 useInterval](https://blog.csdn.net/hesongGG/article/details/86771224)

如果你玩 React Hooks 有一些时间，你可能会遇到一个有趣的问题：**使用 setInterval 并不会按照你的预期工作**。

```js
import React, { useState, useEffect, useRef } from 'react';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
```

### 自定义 [useFullScreen](https://blog.csdn.net/qq_41614928/article/details/103756012)

```js
function useFullScreen(initFullScreen) {
  const [fullScreenState, setFullScreen] = useState(initFullScreen);
  const handleFullScreen = () => {
    if (!fullScreenState) {
      fullScreen();
    } else {
      exitFullscreen();
    }
    setFullScreen(!fullScreenState);
  };

  //全屏
  function fullScreen() {
    var element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
  }

  //退出全屏
  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
  return [fullScreenState, handleFullScreen];
}
```

## react hooks 原理是什么

hooks 是用**闭包实现**的，因为**纯函数不能记住状态，只能通过闭包来实现**。

## useState 中的状态是怎么存储的

通过**单向链表**，**fiber tree** 就是一个单向链表的**树形结构**。

## 为什么 Hooks 不能在 class 组件内使用

你不能在 class 组件内部使用 Hook，但毫无疑问你可以在组件树里混合使用 class 组件和使用了 Hook 的函数组件。

### 最新的功能的使用，最新功能了解，hooks

它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。也就是用在无状态组件中，充当一下简单的 state。

用法参见`react-learn/react-features-test/components/hooks`

```js
// 声明一个变量count,来保存中间值
// useState返回两个参数，一个是当前state的值，还有一个其实是一个函数，用来改变state的值，就是setCount。
// 它不会将旧的state跟新的state合并在一起，而是覆盖式的重写state的值。
const [count, setCount] = useState(0);

// Similar to componentDidMount and componentDidUpdate:
// 在hooks里，这些生命周期函数都被统一成一个方法 useEffect。
useEffect(() => {
  // Update the document title using the browser API
  document.title = `You clicked ${count} times`;
});
// 需要改变状态的时候
onClick={() => setCount(count + 1)}
```

## 参考文章

1. [深入理解：React hooks 是如何工作的](https://zhuanlan.zhihu.com/p/81528320)
2. [Hook 简介](https://zh-hans.reactjs.org/docs/hooks-intro.html)

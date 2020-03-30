---
title: ReactHooks
date: 2019-2-6
tags:
  - js
  - react
---

再读相关文档。

Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

React Native 从 0.59 版本开始支持 Hook。

没有计划从 React 中移除 class。

你可以使用 Hook 从组件中**提取状态逻辑**，**使得这些逻辑可以单独测试并复用**。Hook 使你在无需修改组件结构的情况下复用状态逻辑。 这使得在组件间或社区内共享 Hook 变得更便捷。

Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。Hook 不能在 class 组件中使用 —— 这使得你不使用 class 也能使用 React。

## 解决的问题

React 需要为**共享状态逻辑**提供更好的原生途径。

难以理解的 class，你必须去理解 JavaScript 中 this 的工作方式

## 基本使用

### useState，生成一个状态及修改函数

useState 就是一个 Hook。通过在函数组件里调用它来**给组件添加一些内部 state**。
useState 会返回一对值：当前状态和一个让你更新它的函数。

```js
// 声明一个叫 “count” 的 state 变量。，这里的第二个参数对应的就是更新函数。
const [count, setCount] = useState(0);
// 声明多个 state 变量！
const [age, setAge] = useState(42);
const [fruit, setFruit] = useState('banana');
const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
```

### useEffect，副作用，在挂载、更新、卸载的时候调用

useEffect 就是一个 Effect Hook，**给函数组件增加了操作副作用的能力**。它跟 class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途，只不过被**合并成了一个 API**。

`componentDidMount + componentDidUpdate + componentWillUnmount = useEffect`

这里通常代码不会使用 componentDidUpdate 的原因是，在渲染函数 render 中，添加了不修改 state 的副作用，所以这个生命周期就感觉没什么用了。

可以访问到组件的 props 和 state。

默认情况下，React 会在**每次渲染后调用副作用函数** —— 包括第一次渲染的时候。副作用函数还可以通过返回一个函数来指定如何“清除”副作用。相当于在以上生命周期内修改状态。

跟 useState 一样，你可以在组件中多次使用 useEffect，多次使用内部的代码应该是要被合并处理。查看 react-features-test 中的 hooks 文件实例。

### useContext

比如，useContext 让你不使用组件嵌套就可以订阅 React 的 **Context**。

### [useReducer](https://react.docschina.org/docs/hooks-reference.html#usereducer)

可以让你**通过 reducer** 来管理组件本地的复杂 state。类似 redux 了。

useState 的替代方案。它接收一个形如 (state, action) => newState 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法。（如果你熟悉 Redux 的话，就已经知道它如何工作了。）

## 跨组件如何共用状态

有时候我们会想要在**组件之间重用一些状态逻辑**。

目前为止，有两种主流方案来解决这个问题：

- 高阶组件和 render props。**自定义 Hook** 可以让你在不增加组件的情况下达到同样的目的。
- Hook 是一种复用状态逻辑的方式，它不复用 state 本身。事实上 Hook 的每次调用都有一个完全独立的 state。

这里的自定义 hook，**基本就是把公共方法（不包括状态）抽离到共同的组件的意思**，像是一个类（状态不同，方法相同），但是这个 hook 可以不依赖组件的嵌套关系而进行传递，更类似与 redux。所以在有 redux 的时候，函数式组件只做局部的渲染之用。

## 如何在组件加载时发起异步任务

发送请求也属于 React 定义的副作用之一，因此应当**使用 useEffect 来编写**。

在 Hook 中出现异步任务尤其是 timeout 的时候，我们要格外注意。useState 只能保证多次重绘之间的状态值是一样的，但不保证它们就是同一个对象，因此出现闭包引用的时候，尽量使用 useRef 而不是直接使用 state 本身，否则就容易踩坑。反之如果的确碰到了设置了新值但读取到旧值的情况，也可以往这个方向想想，可能就是这个原因所致。

effect hook 在组件 mount 和 update 的时候都会执行。所以在 useEffect 中直接修改 state，会导致一直运行，陷入死循环。

你可以在 effect hook 提供的**第二个参数中**，传入一个空数组，这样做**可以避免组件更新**的时候执行 effect hook ，但是组件在 mount 依然会执行它。**也就是说第一个参数是 DidMount，第二个是 DidUpdate，第三个 return 是，WillUnmount。**

## react hooks 原理是什么

hooks 是用**闭包实现**的，因为**纯函数不能记住状态，只能通过闭包来实现**。

## useState 中的状态是怎么存储的

通过**单向链表**，fiber tree 就是一个单向链表的**树形结构**。

## [自定义 Hook](https://react.docschina.org/docs/hooks-custom.html)，操作可复用的组件逻辑

Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

通过自定义 Hook，可以将**组件逻辑**提取到可重用的函数中。

自定义 Hook 是一个函数，其名称以 “use” 开头，函数内部可以调用其他的 Hook。 例如，下面的 useFriendStatus 是我们第一个自定义的 Hook:

```jsx
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

与 React 组件不同的是，**自定义 Hook 不需要具有特殊的标识**。我们可以自由的决定它的参数是什么，以及它应该返回什么（如果需要的话）。

换句话说，它就像一个正常的函数。但是它的名字应该始终以 use 开头，这样可以一眼看出其符合 Hook 的规则。

自定义 hook 的目的：去除组件中重复的逻辑。

### [自定义 useInterval](https://blog.csdn.net/hesongGG/article/details/86771224)

如果你玩 React Hooks 有一些时间，你可能会遇到一个有趣的问题：使用 setInterval 并不会按照你的预期工作。

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

## useEffect

useEffect 的第二个参数可选，如果用上的话，**这个参数必须是一个数组**。

useEffect 在每次被调用的时候，**都会“记住”这个数组参数**，当下一次被调用的时候，会逐个比较数组中的元素，看是否和上一次调用的数组元素一模一样，如果一模一样，第一个参数（那个函数参数）也就不用被调用了，如果不一样，就调用那个第一个参数。

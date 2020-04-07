---
title: setState原理
date: 2020-3-6
tags:
  - React
  - setState
categories:
  - [React, setState]
---

[TOC]

[react setState](https://zh-hans.reactjs.org/docs/react-component.html#setstate)

[查看接口源码](/Users/qiuww/code/laboratory/react/packages/react/src/ReactBaseClasses.js)

[react 组件状态](https://zh-hans.reactjs.org/docs/faq-state.html#what-does-setstate-do)

不同于上述**生命周期方法**（**React 主动调用**），以下方法是**你可以在组件中调用的方法**。

只有两个方法：

- setState() 和
- forceUpdate()。

[参见 demo](../react-features-test/src/pages/SetStateTest/index.jsx)

## setState 是什么 ｜ setState 的原理 | setState 实际做了什么 ｜ 调用 setState 的时候都发生了什么

`setState(updater, [callback])`

1. setState 用于更新组件内 state 的状态，并通知 React 更新使用此状态的组件；
2. setState 可以**理解为一次更新数据及页面的请求**，React 会将这次请求放在**更新队列中(enqueueSetState)**；
3. React 会**批量推迟更新（在生命周期函数和合成事件中）**，然后通过一次传递更新多个组件。React 并不会保证 state 的变更会立即生效；
4. setState 的**第一个参数**可以是一个对象，或者一个函数（可保证下次调用 this.state 获取的是最新值）；
5. setState() 的**第二个参数**为可选的回调函数，它将在 setState 完成合并并重新渲染组件后执行(render 之后执行)。通常，我们建议使用 componentDidUpdate() 来代替此方式；
6. 除非 **shouldComponentUpdate() 返回 false**，无论是否，state 都是修改了的，否则 setState() 将始终执行重新渲染操作；
7. setState 做的事情**不仅仅只是修改了 this.state** 的值，另外最重要的是它会触发 React 的**更新机制**，**会进行 diff ，然后将 patch 部分更新到真实 dom 里**。所以，如果你直接 `this.state.xx == oo` 的话，**state 的值确实会改，但是改了不会触发 UI 的更新，那就不是数据驱动了**。这样的话，在不需要触发 ui 更新的时候倒是**可以一用**啊。
8. 在 React 的 setState 函数实现中，会根据 `isBatchingUpdates(默认是 false)` 变量判断是否直接更新 this.state 还是放到队列中稍后更新。然后有一个 **batchedUpdate 函数**，可以修改 isBatchingUpdates 为 true，

## react 的两次连续 setState 状态修改 ｜ 多次 setState 的时候，内部调用机制，渲染几次。如果被包裹在 setTimeout 内呢

这里主要区分一下，代码所在的代码块：

1. 在生命周期函数和合成事件(react 会对原生的 dom 事件进行收集拦截合成分发，就是有自己的事件系统，**除了自己手动使用 addeventlistener 或者 on 监听的事件都会走 react 合成事件系统**。)中，会合并多个 setState，合并执行，函数中是“异步”的。
2. 在 setTimeout 和原生事件中都是同步的；
3. **setState 的“异步”并不是说内部由异步代码实现**，其实本身执行的过程和代码都是同步的，**只是合成事件和钩子函数的调用顺序在更新之前**，导致在合成事件和钩子函数中没法立马拿到更新后的值，形式了所谓的“异步”，当然可以通过第二个参数 setState(partialState, callback) 中的 **callback 拿到更新后的结果**；
4. setState 的**批量更新优化也是建立在“异步”（合成事件、钩子函数）之上**的，**在原生事件和 setTimeout 中不会批量更新**，在“异步”中如果对同一个值进行多次 setState ， setState 的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时 setState 多个不同的值，在更新时会对其进行合并批量更新。

[react 中放到定时器中的多个 setState 为什么不会合并再执行？](https://segmentfault.com/q/1010000015805834)

## setState 之后都发生了什么

新的状态存入更新队列中，判断当前是不是处在批量更新模式，如果是的，就保存到 dirtyComponents，否则就 updateComponent 更新 pending state or props。

1. `this.setState(newState)` =>
2. newState **存入 pending 队列** =>
3. 调用 enqueueUpdate =>
4. 是否处于**批量更新模式** => 是的话将组件保存到 dirtyComponents，不是的话遍历 dirtyComponents，调用 updateComponent，更新 pending state or props。

enqueueUpdate 的源码如下：

```js
function enqueueUpdate(component) {
  // injected 注入的
  ensureInjected();
  //如果不处于批量更新模式
  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }
  //如果处于批量更新模式
  dirtyComponents.push(component);
}
```

如果 isBatchingUpdates 为 false，则对所有队列中的更新执行 batchedUpdates 方法，否则只把当前组件(即调用了 setState 的组件)放入 dirtyComponents 数组中。

连续调用了多次 setState，但是只引发了一次更新生命周期，因为 React 会将多个 this.setState 产生的修改放在一个队列里，缓一缓，攒在一起，觉得差不多了在引发一次更新过程。所以攒的过程中如果你不停的 set 同一个 state 的值，只会触发最后一次，

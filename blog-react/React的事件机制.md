---
title: React的事件机制
date: 2020-3-6
tags:
  - React
  - React的事件机制
categories:
  - [React, React的事件机制]
---

## dom 的事件委托

1. 事件委托原理：**事件冒泡机制**。
2. 优点：
   1. 可以大量节省内存占用，**减少事件注册**。比如 ul 上代理所有 li 的 click 事件就很不错。
   2. 可以实现当新增子对象时，无需再对其进行事件绑定，**对于动态内容部分尤为合适**。

## React 的事件机制 - SyntheticEvent

[React 事件处理](https://react.docschina.org/docs/handling-events.html)
[React 合成事件](https://react.docschina.org/docs/events.html)

React 中绑定的事件，都会被 React 的事件处理机制，委托到SyntheticEvent 实例将被传递给你的事件处理函数，**它是浏览器的原生事件的跨浏览器包装器**。除兼容所有浏览器外，它还拥有和浏览器原生事件相同的接口，包括 stopPropagation() 和 preventDefault()。

[React 事件池](https://react.docschina.org/docs/events.html#event-pooling)

1. SyntheticEvent 是合并而来。这意味着 SyntheticEvent 对象**可能会被重用**，而且在事件**回调函数被调用后，所有的属性都会无效**。
2. 出于性能考虑，你不能通过异步访问事件。
3. 事件处理函数在**冒泡阶段被触发**。**如需注册捕获阶段的事件处理函数，则应为事件名添加 Capture**。例如，处理捕获阶段的点击事件请使用 onClickCapture，而不是 onClick。

### React 事件注册、处理及移除

![React合成事件](./imgs/React合成事件.png)

1. 组件装载 / 更新。
2. 通过 lastProps、nextProps **判断是否新增、删除事件分别调用事件注册、卸载方法**。
3. 调用 EventPluginHub 的 enqueuePutListener 进行**事件存储**；
4. 获取 **document** 对象。
5. 根据事件名称（如 onClick、onCaptureClick）**判断是进行冒泡还是捕获**。
6. 判断是否存在 addEventListener 方法，否则使用 attachEvent（兼容 IE）。
   **给 document 注册原生事件回调为 dispatchEvent（统一的事件分发机制）**。

### 事件触发 / 执行

1. 这里的事件执行利用了 React 的批处理机制；
2. 触发 document 注册原生事件的回调 dispatchEvent；
3. 获取到触发这个事件最深一级的元素（eventTarget）；

## React 在事件处理的优点，基本也就事件委托的优点-大量节省内存占用

1. 几乎所有的**事件代理(delegate)**到 document ，达到性能优化的目的
2. 对于**每种类型的事件，拥有统一的分发函数 dispatchEvent**
3. 事件对象(event)是合成对象(SyntheticEvent)，不是原生的，其具有**跨浏览器兼容的特性**
4. react 内部事件系统实现可以分为两个阶段: 事件注册、事件分发，几乎所有的事件均委托到 document 上，而 document 上事件的回调函数只有一个:ReactEventListener.dispatchEvent，然后进行相关的分发
5. 对于冒泡事件，是在 document 对象的冒泡阶段触发。对于非冒泡事件，例如 focus，blur，是在 document 对象的捕获阶段触发，最后在 dispatchEvent 中决定真正回调函数的执行

总结描述：

1. 大量节省内存占用，避免同类型子节点重复绑定，也就是事件委托的优点；
2. 可以自动的移除事件，不像自己绑定的时候，有的时候就容易忘记移除；
3. 规范化，性能都不会太差；

## React v17 中

React v17 中，React 不会再将事件处理添加到 document 上，而是将事件处理添加到渲染 React 树的根 DOM 容器中。

React v17 开始会通过调用 rootNode.addEventListener() 来代替。

## 参考文章

[【React 深入】React 事件机制](https://juejin.im/post/5c7df2e7f265da2d8a55d49d)

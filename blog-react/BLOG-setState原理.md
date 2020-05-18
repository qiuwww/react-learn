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

[【React 深入】setState 的执行机制](https://juejin.im/post/5c71050ef265da2db27938b5)

不同于上述**生命周期方法**（**React 主动调用**），以下方法是**你可以在组件中调用的方法**。

只有两个方法：

- setState() 和
- forceUpdate()。

[参见 demo](../react-features-test/src/pages/SetStateTest/index.jsx)

## setState 的主要流程

**setState 的特点是批处理和延迟更新**。

1. props 与 setState 会引起页面**重新渲染**；
2. setState，主要**在 updater 中操作**，参数首先会被记录下来：
   1. callback，会被添加到 updater 的**pendingCallbacks**中；
   2. nextState，会被添加到更新器 updater 的**pendingStates**，并且判断当前是否是正在更新`isPending`：
      1. 如果不是就去执行自身的`emitUpdate`方法，**开始更新**；
      2. 如果是的话，就会**被添加到当前更新队列中，当次执行**；
3. `emitUpdate`更新函数有两种情形会被调用：
   1. props 改变了，就会把新的 props 传递过来，就会调用`updateComponent`立即更新；
   2. 否则如果是 state 改变：
      1. `updateQueue.isPending`，正在更新，就会添加一条；
      2. 否则就会立即更新；
4. `updateComponent`，函数**收集**当前的实例、上下文、state、props 等，然后调用`shouldUpdate`去更新；
5. `shouldUpdate`，会有一个`shouldComponentUpdate`的**调用结果进行判断**，是否需要更新；
6. 如果需要更新就调用`forceUpdate`，去更新；
   1. 收集上一次的**虚拟 dom，真实 dom 节点，状态，props** 等；
   2. 调用 render，生成新的 VNode(js 对象)；
   3. 使用`compareTwoVnodes`对比两次的 VNode，同时去修改真实的 dom；
   4. 最后，调用一下 `emitUpdate`，这里是一个递归，一直被调用的，避免前面前面没执行的更新不能映射到页面上。
7. compareTwoVnodes 对比 vDom，**递归的进行对比组件**，就是对比两个 js 对象，遵循同级比较/不同类型不同节点/key 的原则，对应操作 dom，主要包括增删改；
8. Fiber 对于对比过程，可以：
   1. 设计优先级；
   2. 暂停/恢复执行；
   3. 删除任务；
      内部通过 requestIdCallbacks 来实现，这个是在**每次更新完成之后调用**。

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

1. 在**生命周期函数和合成事件**(react 会对原生的 dom 事件进行收集拦截合成分发，就是有自己的事件系统，**除了自己手动使用 addeventlistener 或者 on 监听的事件都会走 react 合成事件系统**。)中，会合并多个 setState，合并执行，函数中是“异步”的。
   1. 由执行机制看，setState 本身并不是异步的，而是如果在调用 setState 时，**如果 react 正处于更新过程，当前更新会被暂存**，等上一次更新执行后在执行，这个过程给人一种异步的假象。
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

## setState 的执行流程

[setState 的执行流程](https://user-gold-cdn.xitu.io/2019/2/23/169197bbdc7ae14e?imageslim)

1. partialState：setState 传入的第一个参数，对象或函数
2. \_pendingStateQueue：当前组件**等待执行更新的 state 队列**
3. **isBatchingUpdates**：react 用于**标识当前是否处于批量更新状态**，所有组件公用
4. dirtyComponent：当前所有处于待更新状态的组件队列
5. transcation：react 的事务机制，在被事务调用的方法外包装 n 个 waper 对象，并一次执行：waper.init、被调用方法、waper.close
6. FLUSH_BATCHED_UPDATES：用于执行更新的 waper，只有一个 close 方法

### 执行过程

对照上面流程图的文字说明，大概可分为以下几步：

1. 将 setState 传入的**partialState 参数**存储在**当前组件实例的 state 暂存队列**中。
2. 判断当前**React 是否处于批量更新状态（isBatchingUpdates）**，
   1. 如果是，将当前组件加入待更新的组件队列中。
   2. 如果未处于批量更新状态，**将批量更新状态标识设置为 true**，用事务再次调用前一步方法，保证当前组件加入到了待更新组件队列中。
3. 调用事务的 **waper** 方法，**遍历待更新组件队列依次执行更新**。
4. 执行生命周期 componentWillReceiveProps。
5. **将组件的 state 暂存队列中的 state 进行合并，获得最终要更新的 state 对象，并将队列置为空**。
6. 执行生命周期 componentShouldUpdate，**根据返回值判断是否要继续更新**。
7. 执行生命周期 componentWillUpdate。
8. 执行真正的更新，render。
9. 执行生命周期 componentDidUpdate。

## 是否可以在 componentWillUpdate 中调用 setState

[正确掌握 React 生命周期 (Lifecycle)](https://juejin.im/entry/587de1b32f301e0057a28897)

在更新的这两个生命周期中，都是不能调用 setState 的，会造成死循环。

1. 千万不要在这个函数中调用 this.setState()方法.;
2. 如果确实需要**响应 props 的改变**，那么你可以在 componentWillReceiveProps(nextProps)中做响应操作;
3. 如果 shouldComponentUpdate(nextProps, nextState)返回 false，那么 componentWillUpdate()不会被触发;

## 参考资料

[react 原理剖析](http://deal.kaikeba.com/link/112b8489-0f9e-4c4d-a59f-f0496a920337?share_token=Ao4i2TdC&utm_source=%E8%B5%84%E6%96%99%E9%93%BE%E6%8E%A5%E5%85%A5%E5%BA%93&utm_medium=%E5%BE%AE%E4%BF%A1&utm_content=react%E5%8E%9F%E7%90%86%E5%89%96%E6%9E%90)

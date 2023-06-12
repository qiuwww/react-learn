---
title: Fiber
date: 2020-3-6
tags:
  - React
  - Fiber
  - Diffing
  - reconcilers，调解器
categories:
  - [React, Fiber]
---

[React Fiber 是什么](https://zhuanlan.zhihu.com/p/26027085)
[Virtual DOM 及内核](https://zh-hans.reactjs.org/docs/faq-internals.html#what-is-react-fiber)
[浅析 React Fiber](https://juejin.im/post/5be969656fb9a049ad76931f)
[React Fiber 原理介绍](https://segmentfault.com/a/1190000018250127)
[协调](https://zh-hans.reactjs.org/docs/reconciliation.html)
[完全理解 fiber](https://www.zhihu.com/question/49496872)

**React 框架内部的运作可以分为 3 层**：

- **Virtual DOM** 层，**描述页面**长什么样。
- **Reconciler** 层，**负责调用组件生命周期方法，进行 Diff 运算**等。
- **Renderer** 层，根据**不同的平台**，**渲染出相应的页面**，比较常见的是 **ReactDOM 和 ReactNative**。

## react15 之前可能出现的问题 -> 页面卡顿

在 react15 中，更新过程是**同步的**，这可能会导致性能问题。

当 React 决定要加载或者更新组件树时，**会做很多事，比如调用各个组件的生命周期函数，计算和比对 Virtual DOM，最后更新 DOM 树**，这整个过程是同步进行的，也就是说只要一个加载或者更新过程开始，那 React 就不能停止了，一鼓作气运行到底，中途绝不停歇。

当组件**树越来越大，递归遍历的成本就越高**，**持续占用主线程**，这样主线程上的**布局、动画等周期性任务**以及**交互响应**就无法立即得到处理，**造成顿卡的视觉效果，大于 16ms（1000/60）**。

### 视觉卡顿的原因

理论上人眼最高能识别的帧数不超过 30 帧，电影的帧数大多固定在 24，**浏览器最优的帧率是 60**，即 16.5ms 左右渲染一次。 浏览器正常的工作流程应该是这样的，运算 -> 渲染 -> 运算 -> 渲染 -> 运算 -> 渲染 …

### 在 react@15 中，更新主要分为两个步骤完成

1. **diff** diff 的实际工作是对比 prevInstance 和 nextInstance 的状态，找出差异及其对应的 VDOM change。**diff 本质上是一些计算（遍历、比较）**，是可拆分的（算一半待会儿接着算）。
2. **patch** 将 diff 算法计算出来的**差异队列更新到真实的 DOM 节点上**。React 并不是计算出一个差异就执行一次 patch，而是**计算出全部的差异并放入差异队列后，再一次性的去执行 patch 方法完成真实的 DOM 更新**。

## React16 版本如何解决这个问题 -> 重写核心算法 ｜ Fiber 为什么会出现 ｜ Fiber reconciler

破解 JavaScript 中同步操作时间过长的方法其实很简单——分片。React Fiber 把更新过程**碎片化**，执行过程如下面的图所示，每执行完一段更新过程，就把控制权交还给 React 负责任务协调的模块，看看有没有其他紧急任务要做，**如果没有就继续去更新，如果有紧急任务，那就去做紧急任务**。

维护每一个分片的数据结构，就是 Fiber。

重写 reconciler 算法，**从 Stack Reconciler 到 Fiber Reconciler**。

Fiber：纤维，光纤；
Fiber reconciler：光纤调节器；

源代码在 `react/packages/react-reconciler` 目录下。

它的主要目标是：

1. 能够把**可中断的任务切片处理**。
2. 能够**调整优先级**，**重置并复用任务**。
3. 能够在**父元素与子元素之间交错处理**，以支持 React 中的布局。
4. 能够在 render() 中**返回多个元素**。
5. 更好地支持错误边界。

### Fiber 树

Fiber Reconciler 在阶段一进行 Diff 计算的时候，会生成一棵 **Fiber 树**。这棵树是在 Virtual DOM 树的基础上增加额外的信息来生成的，**它本质来说是一个链表**。

![Fiber树](./imgs/Fiber树.png)

Fiber 树在首次渲染的时候会一次过生成。在后续需要 Diff 的时候，会根据已有树和最新 Virtual DOM 的信息，生成一棵新的树。这颗新树每生成一个新的节点，都会将控制权交回给主线程，去检查有没有优先级更高的任务需要执行。

### 时间分片 Time Slicing，任务分片处理

react fiber，算法，可以**暂停，删除，继续任务，避免了阻塞渲染**。使用了时间分片技术。

### requestIdleCallback(callback[, options])

1. requestAnimationFrame 每一帧必定会执行不同，
2. requestIdleCallback 是捡浏览器空闲来执行任务。
3. timeout。**表示超过这个时间后，如果任务还没执行，则强制执行，不必等待空闲**。

requestIdleCallback **会让一个低优先级的任务在空闲期被调用**，而 requestAnimationFrame **会让一个高优先级的任务在下一个栈帧被调用**，从而保证了主线程按照优先级执行 fiber 单元。

优先级顺序为：文本框输入 > 本次调度结束需完成的任务 > 动画过渡 > 交互反馈 > 数据更新 > 不会显示但以防将来会显示的任务。

### Fiber 是什么

1. React Fiber 是对核心算法的一次**重新实现**。避免**渲染大量节点**的时候的**界面卡顿**的问题。
2. Fiber Reconciler 每执行一段时间，都会**将控制权交回给浏览器**，**也就是可以分段执行**。
3. 对任务进行**分层级**，通过**任务调度器**，优先级高的任务（如键盘输入）可以打断优先级低的任务（如 Diff）的执行，从而更快的生效。

### Fiber 如何实现

生成将一棵树转换成另一棵树的**最小操作数**，即使在最前沿的算法中，该算法的复杂程度为 O(n 3 )，几乎不能用。于是 React 在以下**两个假设**的基础之上提出了**一套 O(n)** 的启发式算法：

1. 两个**不同类型的元素会产生出不同的树**；
2. 开发者可以通过 **key prop 来暗示哪些子元素在不同的渲染下能保持稳定**；

当对比两颗树时，React 首先比较两棵树的**根节点**。不同类型的根节点元素会有不同的形态。

### Fiber 迭代元素的顺序

Fiber 依次通过 return、child 及 sibling 的顺序对 ReactElement 做处理，将之前简单的树结构，变成了基于单链表的树结构，维护了更多的节点关系。

### Fiber Reconciler 算法在 react 渲染过程中的主要功能

1. 负责**调用组件生命周期方法**
2. 进行 **Diff 运算**
3. 将要执行的 **JS 做拆分**，保证不会阻塞主线程（Main thread）即可
4. 实现了自己的**组件调用栈**，可以灵活的暂停、继续和丢弃执行的任务

### react 常见 diff 操作，处理方式如下

1. **比对不同类型的元素，卸载**，当根节点为不同类型的元素时，React 会**拆卸原有的树并且建立起新的树**。
2. **比对同一类型的元素，保留 dom 节点**，当比对两个相同类型的 React 元素时，React 会保留 DOM 节点，**仅比对及更新有改变的属性**。
3. 比对**同类型的组件元素**，React 将**更新该组件实例的 props 以跟最新的元素保持一致**，并且调用该实例的 componentWillReceiveProps() 和 componentWillUpdate() 方法。
4. 对**子节点进行递归**，对应比较，当递归 DOM 节点的子元素时，React 会同时遍历两个子元素的列表；当产生差异时，生成一个 mutation。
5. **Keys**，当子元素拥有 key 时，**React 使用 key 来匹配（key 匹配就不变）**原有树上的子元素以及最新树上的子元素，也就是放弃了使用原来的递归一一对应的对比。这个 key 不需要全局唯一，但在列表中需要保持唯一。

### React Fiber 特点 ｜ Fiber 核心思想

1. 能够将渲染**工作分割成块并将其分散到多个帧中**。
2. 实现了**调度功能**，主要功能包括在**新更新**进入时**暂停**，**终止**或**重复**工作的能力;
3. 为不同类型的更新**分配优先级**的能力。

说白了，我们就是想实现一个**任务调度器**。它可以**暂停**一个任务，一会再回来执行，还能**给任务分配优先级**，或者重新启用一个已停止的任务，删掉某个不再使用的任务。

### Fiber 的执行过程，两个阶段

因为一个更新过程可能被打断，所以 React Fiber 一个更新过程被分为**两个阶段(Phase)**：

1. 第一个阶段 Reconciliation Phase（自顶向下构建一颗完整的 Fiber Tree） 和
2. 第二阶段 Commit Phase。

在第一阶段 Reconciliation Phase，React Fiber 会找出**需要更新哪些 DOM，这个阶段是可以被打断的**；但是到了第二阶段 Commit Phase，那就一鼓作气把 DOM 更新完，绝不会被打断。

这两个阶段大部分工作都是 React Fiber 做，和我们相关的也就是生命周期函数。

以 render 函数为界，第一阶段可能会调用下面这些生命周期函数，说是“可能会调用”是因为不同生命周期调用的函数不同。如果，在第一阶段，**有任务被打断了**，需要**重新执行**的话，这里的生命周期函数就可能会被执行多次。

1. componentWillMount
2. componentWillReceiveProps
3. shouldComponentUpdate
4. componentWillUpdate

下面这些生命周期函数则会在第二阶段调用。

1. componentDidMount
2. componentDidUpdate
3. componentWillUnmount

## 从 Fiber 看，setState 的更新原理（调用 setState 之后发生了什么），或者 props 变更后如何重新渲染的

真实 dom -> jsx 虚拟 dom -> 数据更改(props/setState) -> 新的虚拟 dom -> diff 计算(Fiber Reconciler) -> 真实 dom 重新 render。

1. 在代码中调用 setState 函数之后，**React 会将传入的参数对象与组件当前的状态合并**，然后触发所谓的**调和过程**（**Reconciliation**）。
2. 经过调和过程，React 会以相对高效的方式根据新的状态**构建 React 元素树并且着手重新渲染整个 UI 界面**。
3. 在 React 得到**元素树**之后，React 会**自动计算出新的树与老树的节点差异**，然后根据差异对界面进行**最小化重渲染**。
4. 在差异计算算法中，React 能够相对精确地知道哪些位置发生了改变以及应该如何改变，这就保证了按需更新，而不是全部重新渲染。

## React Fiber 的任务调度过程

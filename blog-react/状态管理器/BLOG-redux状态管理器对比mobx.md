---
layout: post
title: 状态管理器mobx与redux比较
date: 2019-02-01 15:46:36
# updated: 2013-7-13 20:46:29
# photos:
tags:
  - StateManager
  - React
categories:
  - React
comments: true
---

当我们使用 React 开发 web 应用程序时，在 React 组件内，可以使用 this.setState()和 this.state 处理或访问组件内状态，但是随着项目变大，状态变复杂，通常需要考虑组件间通信问题，主要包括以下两点：

- 某一个状态需要在**多个组件间**共享（访问，更新）；
- 某组件内交互需要触发**其他组件**的状态更新；

## 状态管理

状态管理库，无论是 Redux，还是 Mobx 这些，其本质都是为了解决状态管理混乱，无法有效同步的问题，它们**都支持**：

1. 统一维护管理应用状态；
2. 某一状态只有**一个可信数据来源**（通常命名为 store，指状态容器）；
3. 操作更新状态**方式统一，并且可控**（通常以 action 方式提供更新状态的途径）；
4. 支持将 store 与 React 组件连接，如 react-redux，mobx-react；

通常使用状态管理库后，我们将 React 组件**从业务上划分为两类**：

1. 容器组件（Container Components）：负责处理具体业务和状态数据，将业务或状态处理函数传入展示型组件；
2. 展示型组件（Presentation Components）：负责展示视图，视图交互回调内调用传入的处理函数；

## Redux 与 mobx 对比

Mobx 和 Redux 都是**JavaScript 应用状态管理库**，都适用于 React，Angular，VueJs 等框架或库，而不是局限于某一特定 UI 库。

### Flux -> Redux

Flux 是 Facebook 用来开发客户端-服务端 web 应用程序的**应用架构**，**它更多是一种架构模式**，而非一个特定框架。

而 Redux 更多的是遵循 Flux 模式的一种实现，是一个 JavaScript 库，它关注点主要是以下几方面：

1. Action(通常用于处理异步任务或者复杂的数据处理)：一个 JavaScript 对象，描述动作相关信息，主要包含 type 属性和 payload 属性：
   1. type：action 类型；
   2. payload：负载数据；
2. Reducer(同步的去修改数据)：定义应用状态如何响应不同动作（action），如何更新状态；
3. Store(状态存储中心，可以多个 module 组合)：管理 action 和 reducer 及其关系的对象，主要提供以下功能：
   1. 维护应用状态并支持访问状态（getState()）；
   2. 支持**监听**action 的分发，更新状态（dispatch(action)），满足条件触发事件；
   3. 支持**订阅**store 的变更（subscribe(listener)）；
4. 异步流：由于 Redux 所有对 store 状态的变更，都应该通过 action 触发，异步任务（通常都是业务或获取数据任务）也不例外，而为了不将业务或数据相关的任务混入 React 组件中，**就需要使用其他框架配合管理异步任务流程**，如`redux-thunk`，`redux-saga`等；

### mobx，就像是，给 redux 添加了一个自动执行

Mobx 是一个**透明函数响应式编程**（Transparently Functional Reactive Programming，TFRP）的状态管理库，它使得状态管理简单可伸缩。

1. Action：定义改变状态的**动作函数**，包括如何变更状态；
2. Store：集中管理模块状态（State）和动作（action）；
3. Derivation（衍生）：从应用状态中**派生而出**，且没有任何其他影响的数据，我们称为 derivation（衍生），衍生在以下情况下存在：

   1. 用户界面；
   2. 衍生数据；

衍生主要有两种：

   1. Computed Values（计算值）：计算值总是可以使用纯函数（pure function）**从当前可观察状态中获取**；
   2. Reactions（反应）：反应指状态变更时需要自动发生的副作用，这种情况下，我们需要实现其读写操作；

## 函数式和面向对象

Redux 更多的是遵循**函数式编程**（Functional Programming, FP）思想，而 Mobx 则更多从**面相对象角度考虑问题**。

Redux 提倡编写函数式代码，如 reducer 就是一个纯函数（pure function），如下：

```js
(state, action) => {
  return Object.assign({}, state, {
    ...
  })
}
```

纯函数，接受输入，然后输出结果，除此之外**不会有任何影响**，也包括不会影响接收的参数；**对于相同的输入总是输出相同的结果。**

**Mobx 设计更多偏向于面向对象编程（OOP）和响应式编程（Reactive Programming）**，通常将状态包装成可观察对象，于是我们就可以使用可观察对象的所有能力，**一旦状态对象变更，就能自动获得更新**。

当然对于“Redux 更规范，更靠谱，应该使用 Redux”或"Redux 模版太多，太复杂了，应该选择 Mobx"这类推断，我们也应该避免，这些都是相对而言，每个框架都有各自的实现，特色，及其适用场景，

- 正比如 Redux 流程更复杂，但熟悉流程后就更能把握它的一些基础／核心理念，使用起来可能更有心得及感悟；
- 而 Mobx 简单化，把**大部分东西隐藏起来**，如果不去特别研究就不能接触到它的核心／基本思想，也许使得开发者一直停留在使用层次。

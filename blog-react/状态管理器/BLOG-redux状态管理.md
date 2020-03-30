---
title: Redux 是 JavaScript 状态容器，提供可预测化的状态管理
date: 2017-5-6
tags:
  - js
  - redux
---

## 介绍 redux

- Redux **由 Flux 演变而来**，但受 Elm 的启发，**避开了 Flux 的复杂性**。
- 一般情况下人们认为 Redux 就是一些 **CommonJS 模块的集合**。这些模块就是你在使用 Webpack、Browserify、或者 Node 环境时引入的。
- 多数情况下，你还需要使用 React 绑定库和开发者工具。`react-redux、redux-devtools`
- React 和 Redux 的**最大优势**在于它们**相对简单和专注**。

三大原则：

- 单一数据源
- state 只读
- 通过纯函数来修改状态

主要概念：

- Action
- Reducer
- Store

## 主要解决什么问题

Redux 是 JavaScript **状态容器**，提供**可预测化的状态管理**。

Redux 试图让 state 的变化变得可预测。

跨组件状态共享更方便。

## 要点

应用中**所有的 state** 都以一个**对象树的形式储存在一个单一的 store 中**。
**惟一改变 state 的办法是触发 action**，一个描述发生什么的对象。
为了描述 action 如何改变 state 树，你需要**编写 reducers**。

## 介绍 Redux 数据流的流程

严格的单向数据流是 Redux 架构的设计核心。

view -> dispatch -> actions -> reducers -> 修改数据 -> 作为 props 注入到 component -> 页面重新渲染

Redux 应用中数据的生命周期遵循下面 4 个步骤：

1. 调用 store.dispatch(action)。Action 就是一个描述“发生了什么”的普通对象。
2. Redux store 调用传入的 reducer 函数。
3. 根 reducer 应该把多个子 reducer 输出合并成一个单一的 state 树。
4. Redux store 保存了根 reducer **返回的完整 state 树**。

### state 是怎么注入到组件的，从 reducer 到组件经历了什么样的过程

通过 connect（高阶组件 <- 属性代理） 和 mapStateToProps 将 state 注入到组件中，作为组件的 props。

```js
// connect高阶组件，属性代理的方式
// import { connect } from 'react-redux'
import React from 'react';
import PropTypes from 'prop-types';

// 高阶组件 contect
export const connect = (
  mapStateToProps,
  mapDispatchToProps
) => WrappedComponent => {
  class Connect extends React.Component {
    // 通过对context调用获取store
    static contextTypes = {
      store: PropTypes.object
    };

    constructor() {
      super();
      this.state = {
        allProps: {}
      };
    }

    // 第一遍需初始化所有组件初始状态
    componentWillMount() {
      const store = this.context.store;
      this._updateProps();
      store.subscribe(() => this._updateProps()); // 加入_updateProps()至store里的监听事件列表
    }

    // 执行action后更新props，使组件可以更新至最新状态（类似于setState）
    _updateProps() {
      const store = this.context.store;
      let stateProps = mapStateToProps
        ? mapStateToProps(store.getState(), this.props)
        : {}; // 防止 mapStateToProps 没有传入
      let dispatchProps = mapDispatchToProps
        ? mapDispatchToProps(store.dispatch, this.props)
        : {
            dispatch: store.dispatch
          }; // 防止 mapDispatchToProps 没有传入
      this.setState({
        allProps: {
          ...stateProps,
          ...dispatchProps,
          ...this.props
        }
      });
    }

    render() {
      return <WrappedComponent {...this.state.allProps} />;
    }
  }
  return Connect;
};
```

## redux 的三大原则

- **单一数据源**: 整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于**唯一一个 store 中**。
- **state 是只读的**: 唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。这样确保了视图和网络请求都不能直接修改 state，相反它们**只能表达想要修改的意图**。因为所有的修改都被集中化处理，**且严格按照一个接一个的顺序执行**，因此不用担心 race condition(竞争) 的出现。
- 使用**纯函数来执行修改**（只依赖自己的参数，无副作用）: 为了描述 action 如何改变 state tree ，你需要编写 reducers。

## 先前技术

### 与 flux 的关系

- Redux 的灵感来源于 Flux 的几个重要特性。和 Flux 一样，Redux 规定，**将模型的更新逻辑全部集中于一个特定的层（Flux 里的 store，Redux 里的 reducer）**。
- Flux 和 Redux 都不允许程序直接修改数据，而是用一个叫作 “action” 的普通对象来对更改进行描述。
- 而不同于 Flux ，Redux 并没有 dispatcher 的概念。原因是它依赖纯函数来替代事件处理器。
- 和 Flux 的另一个重要区别，是 Redux 设想你永远不会变动你的数据。

## Store

我们学会了使用 action 来描述“发生了什么”，和使用 reducers 来根据 action 更新 state 的用法。

Store 就是把它们联系到一起的对象。

## reducers

对于 reducers 中的 case，可以理解为改变这个变量值的操作类型

## action

Action 是把数据从应用（译者注：这里之所以不叫 view 是因为这些数据有可能是服务器响应，用户输入或其它非 view 的数据 ）**传到 store 的有效载荷**。

它是 store 数据的唯一来源。

一般来说你会通过 store.dispatch() 将 action 传到 store。

就是从页面元素内拿到数据，并更改 state。

Action 本质上是 JavaScript 普通对象。我们约定，**action 内必须使用一个字符串类型的 type 字段来表示将要执行的动作**。

多数情况下，type 会被定义成字符串常量。当应用规模越来越大时，建议使用单独的模块或文件来存放 action。

Action 创建函数 就是生成 action 的方法。“action” 和 “action 创建函数” 这两个概念很容易混在一起，使用时最好注意区分。

在 Redux 中的 action 创建函数只是简单的返回一个 action:

```js
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  };
}
```

这样做将使 action 创建函数更容易被移植和测试。

在 传统的 Flux 实现中，当调用 action 创建函数时，一般会触发一个 dispatch，直接触发更新 state。

## connect

高阶函数。

react-redux 提供了两个重要的对象，**Provider 和 connect**，

- 前者使 React 组件可被连接（connectable），
- 后者把 React 组件和 Redux 的 store 真正连接起来。

Provider 内的任何一个组件（比如这里的 Comp），如果需要使用 state 中的数据，就必须是「被 connect 过的」组件——使用 connect 方法对「你编写的组件（MyComp）」进行包装后的产物。

### connect 详解

究竟 connect 方法到底做了什么，我们来一探究竟。

首先看下函数的签名：

connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])

connect() 接收四个参数，它们分别是 mapStateToProps，mapDispatchToProps，mergeProps 和 options。

mapStateToProps(state, ownProps) : stateProps

这个函数允许我们将 store 中的数据作为 props 绑定到组件上。

## [中间件](http://cn.redux.js.org/docs/api/applyMiddleware.html)

### [Redux 中间件是什么东西，接受几个参数（两端的柯里化函数），柯里化函数两端的参数具体是什么东西](https://www.jianshu.com/p/ae7b5a2f78ae)

redux 利用中间件来扩展自身功能。

Redux middleware 提供了一个**分类处理 action 的机会**。在 middleware 中，我们可以**检阅每一个流过的 action**,并挑选出特定类型的 action 进行相应操作，以此来改变 action。

所以，middleware 的函数签名是 `({ getState, dispatch }) => next => action`。

```js
// 中间件实例
import { createStore, applyMiddleware } from 'redux';
import todos from './reducers';

// 每个 middleware 接受 Store 的 dispatch 和 getState 函数作为命名参数，并返回一个函数。
function logger({ getState }) {
  // 被称为 next 的下一个 middleware 的 dispatch 方法
  return next => action => {
    console.log('will dispatch', action);

    // 调用 middleware 链中下一个 middleware 的 dispatch。
    const returnValue = next(action);

    console.log('state after dispatch', getState());

    // 一般会是 action 本身，除非
    // 后面的 middleware 修改了它。
    return returnValue;
  };
}

const store = createStore(todos, ['Use Redux'], applyMiddleware(logger));

store.dispatch({
  type: 'ADD_TODO',
  text: 'Understand the middleware'
});
// (将打印如下信息:)
// will dispatch: { type: 'ADD_TODO', text: 'Understand the middleware' }
// state after dispatch: [ 'Use Redux', 'Understand the middleware' ]
```

### 中间件是怎么拿到 store 和 action，然后怎么处理

### 使用过的 Redux 中间件

它提供的是位于 action 被发起之后，到达 reducer 之前的扩展点。

你可以利用 Redux middleware 来进行日志记录、创建崩溃报告、调用异步接口或者路由等等。

[官方文档](https://www.redux.org.cn/docs/advanced/Middleware.html)

- redux-thunk
- redux-logger
- redux-saga

原理：

组合 compose，通过**将不同的 middlewares 一层一层包裹到原生的 dispatch 之上，然后对 middleware 的设计采用柯里化的方式**，以便于 compose ，从而可以动态产生 next 方法以及保持 store 的一致性。

## 经典案例

```js
import { createStore } from 'redux';

const reducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case 'INCREASE':
      return { count: state.count + 1 };
    case 'DECREASE':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

const actions = {
  increase: () => ({ type: 'INCREASE' }),
  decrease: () => ({ type: 'DECREASE' })
};

const store = createStore(reducer);

store.subscribe(() => console.log(store.getState()));

store.dispatch(actions.increase()); // {count: 1}
store.dispatch(actions.increase()); // {count: 2}
store.dispatch(actions.increase()); // {count: 3}
```

- Provider 内的任何一个组件（比如这里的 Comp），如果需要使用 state 中的数据，就必须是「被 connect 过的」组件——使用
- connect 方法对「你编写的组件（MyComp）」进行包装后的产物。这个函数允许我们将 store 中的数据作为 props 绑定到组件上。

## Redux 如何实现多个组件之间的通信，多个组件使用相同状态如何进行管理

保存这个状态的 store 分别注入 connect 到不同的组件中。

## React/Redux 中哪些功能用到了哪些设计模式

？？？

- 观察者模式
- 单例模式
- 中介者模式

## redux 性能优化，reselect（数据获取时优化）

那么处理优化渲染过程，获取数据的过程也是需要考虑的一个优化点。

reselect 只要相关的状态没有改变，那么就直接使用上一次的缓存结果。

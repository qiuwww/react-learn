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

## 使用要点

应用中**所有的 state** 都以一个**对象树的形式储存在一个单一的 store 中**。
**惟一改变 state 的办法是触发 action**，一个描述发生什么的对象。
为了描述 action 如何改变 state 树，你需要**编写 reducers**。

## 介绍 Redux 数据的流向

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
export const connect = (mapStateToProps, mapDispatchToProps) => (
  WrappedComponent
) => {
  class Connect extends React.Component {
    // 通过对context调用获取store
    static contextTypes = {
      store: PropTypes.object,
    };

    constructor() {
      super();
      this.state = {
        allProps: {},
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
            dispatch: store.dispatch,
          }; // 防止 mapDispatchToProps 没有传入
      this.setState({
        allProps: {
          ...stateProps,
          ...dispatchProps,
          ...this.props,
        },
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

1. **单一数据源**: 整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于**唯一一个 store 中**。
2. **state 是只读的**: 唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。这样确保了视图和网络请求都不能直接修改 state，相反它们**只能表达想要修改的意图**。因为所有的修改都被集中化处理，**且严格按照一个接一个的顺序执行**，因此不用担心 race condition(竞争) 的出现。
3. 使用**纯函数来执行修改**（只依赖自己的参数，无副作用）: 为了描述 action 如何改变 state tree ，你需要编写 reducers。

## 先前技术

### 与 flux 的关系

1. Redux 的灵感来源于 Flux 的几个重要特性。和 Flux 一样，Redux 规定，**将模型的更新逻辑全部集中于一个特定的层（Flux 里的 store，Redux 里的 reducer）**。
2. Flux 和 Redux 都不允许程序直接修改数据，而是用一个叫作 “action” 的普通对象来对更改进行描述。
3. 而不同于 Flux ，Redux 并没有 dispatcher 的概念。原因是它依赖纯函数来替代事件处理器。
4. 和 Flux 的另一个重要区别，是 Redux 设想你永远不会变动你的数据。

## 主要概念及接口

### Store

1. 我们学会了使用 action 来描述“发生了什么”，
2. 和使用 reducers 来根据 action 更新 state 的用法。

Store 就是把它们联系到一起的对象。

### reducers

对于 reducers 中的 case，**可以理解为改变这个变量值的操作类型**。

### action

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
    text,
  };
}
```

这样做将使 action 创建函数更容易被移植和测试。

在 传统的 Flux 实现中，当调用 action 创建函数时，一般会触发一个 dispatch，直接触发更新 state。

### connect

高阶函数，React-Redux 提供 connect 方法，用于**从 UI 组件生成容器组件**。

react-redux 提供了两个重要的对象，**Provider 和 connect**，

- 前者使 React 组件可被连接（connectable），
- 后者把 React 组件和 Redux 的 store 真正连接起来。

Provider 内的任何一个组件（比如这里的 Comp），如果需要使用 state 中的数据，就必须是「被 connect 过的」组件——使用 connect 方法对「你编写的组件（MyComp）」进行包装后的产物。

#### connect 详解

究竟 connect 方法到底做了什么，我们来一探究竟。

首先看下函数的签名：

connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])

connect() 接收四个参数，它们分别是 mapStateToProps，mapDispatchToProps，mergeProps 和 options。

mapStateToProps(state, ownProps) : stateProps

这个函数允许我们将 store 中的数据作为 props 绑定到组件上。

### Provide

[React-redux 框架之 connect()与 Provider 组件](https://www.jianshu.com/p/5f877993ebcc)

connect 方法生成容器组件以后，**需要让容器组件拿到 state 对象**，才能生成 UI 组件的参数。

1. 一种解决方法是将 state 对象作为参数，**传入容器组件**。但是，**这样做比较麻烦**，尤其是容器组件可能在很深的层级，一级级将 state 传下去就很麻烦。
2. React-Redux 提供 Provider 组件，可以让容器组件拿到 state。

```js
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import todoApp from './reducers';
import App from './components/App';

// 情形1，单独引入store的情形就是，需要用到的地方引入store作为参数传递给需要用到的组件，还是需要将store拆开，作为props传递进去
let store = createStore(todoApp);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

这里的 Provider 的原理是：它的原理是 React 组件的 **context 属性**，store 放在了上下文对象 context 上面。然后，子组件就可以从 context 拿到 store。

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
  return (next) => (action) => {
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
  text: 'Understand the middleware',
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
  decrease: () => ({ type: 'DECREASE' }),
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

## 如何设计状态树

1. 对于组件内状态，比如显示关闭弹框，只是局部使用的，状态放在组件内，hooks 或者 state；
2. 对于跨组件的状态，可以放在 redux 内，但是也要注意：
   1. 范式化，减少冗余数据；
   2. 扁平化，state 对象的层级结构不要太深；

## 为什么从 redux -> dva

目的是**简化开发体验**。

1. dva 首先是一个基于 redux 和 redux-saga 的**数据流方案**，然后为了**简化开发体验**，
2. dva 还额外内置了 react-router 和 fetch，所以也可以理解为一个轻量级的应用框架。

## 深入理解 redux 之 reducer 为什么是纯函数

### 纯函数

1. 一个函数的返回结果**只依赖于它的参数**，
2. 并且在执行过程里面**没有副作用**，我们就把这个函数叫做纯函数。

[参考文章](https://blog.csdn.net/weixin_34056162/article/details/91370744)

1. 纯函数条件之一：不得修改传入的参数；
2. 纯函数条件之二：不得调用非纯函数，如 Date.now() 或 Math.random()；
3. 纯函数条件之二：不得执行有副作用的操作，如 API 请求和路由跳转。

### 为什么 reducer 必须是一个纯函数

1. 文档说 reducer 的作用的，**接收旧的 state 和 action，返回新的 state**，他起的是一个**对数据做简单处理后返回 state 的作用**。

2. 副作用简单来说就是不确定性，如果 reducer 有副作用，那么返回的 state 就不确定。

## 为什么 reducer 要返回一个新的 state

[为什么 Redux 需要 reducers 是纯函数](https://www.zcfy.cc/article/why-redux-need-reducers-to-be-pure-functions-freecodecamp-2515.html)

1. Reducers 必须是一个**纯函数(需要相同的参数得到相同的结果)**，它根据 action 处理 state 的更新，如果没有更新或遇到未知 action，则返回**旧 state**；否则返回一个新 state 对象。
2. 注意：不能修改旧 state，必须先拷贝一份 state，再进行修改，也可以使用 Object.assign 函数生成新的 state。

永远不要在 reducer 里做这些操作：

1. 修改传入参数；
2. 执行有副作用的操作，如 API 请求和路由跳转；
3. 调用非纯函数，如 Date.now() 或 Math.random()；

### 这里是为什么 reducer 不能去修改 store，而只能返回一个新的 store

1. 我们阅读源码可以看到，**Redux 接收一个给定的 state（对象）**，然后通过循环将 state 的**每一部分传递给每个对应的 reducer**。

   1. 如果有发生任何改变，reducer 将返回一个**新的对象**（新的对象位置肯定不一样）。
   2. 如果不发生任何变化，reducer 将返回旧的 state。

2. Redux 只通过比较新旧两个对象的**存储位置来比较新旧两个对象是否相同**（译者注：也就是 Javascript 对象浅比较）。**如果你在 reducer 内部直接修改旧的 state 对象的属性值，那么新的 state 和旧的 state 将都指向同一个对象。因此 Redux 认为没有任何改变，返回的 state 将为旧的 state**。

3. 比较新旧存储位置来比较是不是改变了，如果直接修改了原来的 state，位置是不改变的。

### 为什么必须返回一个新的对象，不能在原来的对象上进行比较吗

1. 因为比较两个 Javascript**对象所有的属性**是否相同的的唯一方法是对它们进行深比较。
2. 但是深比较在真实的应用当中代价昂贵，因为通常 js 的对象都很大，同时需要比较的次数很多。
3. 因此一个**有效的解决方法是作出一个规定：无论何时发生变化时，开发者都要创建一个新的对象，然后将新对象传递出去**。同时，当没有任何变化发生时，开发者发送回旧的对象。
4. 也就是说，新的对象代表新的 state。

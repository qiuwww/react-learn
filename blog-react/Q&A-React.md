---
layout: post
title: React-all
date: 2019-01-31 11:46:36
# updated: 2013-7-13 20:46:29
photos: https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=507145764,1329185286&fm=26&gp=0.jpg
tags:
  - Framework
  - React
categories:
  - React
comments: true
---

# React

[TOC]

## 基础理论

### React 原理

一处开发，多处运行。重组件重用。

React 进行开发时所有的 DOM 构造都是通过**虚拟 DOM 进行**，每当数据变化时，React 都会重新构建整个 DOM 树，然后 React 将当前整个 DOM 树和上一次的 DOM 树进行对比，**得到 DOM 结构的区别，然后仅仅将需要变化的部分进行实际的浏览器 DOM 更新。**

尽管每一次都需要构造完整的虚拟 DOM 树，但是因为**虚拟 DOM 是内存数据**，性能是极高的，而对**实际 DOM 进行操作的仅仅是 Diff 部分**，因而能达到提高性能的目的。这样，在保证性能的同时，开发者将不再需要关注某个数据的变化如何更新到一个或多个具体的 DOM 元素，而只需要关心在任意一个数据状态下，整个界面是如何 Render 的。

### react 的数据流

- 在 React 中，数据流是**自上而下单向的从父节点传递到子节点**，所以组件是简单且容易把握的，他们只需要从父节点提供的 props 中获取数据并渲染即可。
- 如果顶层组件的某个**prop 改变**了，React 会**递归地向下遍历整棵组件数**，重新渲染所有使用这个属性的组件。
- 在组件内部，可以通过 this.props 来访问 props，props 是组件唯一的数据来源，**对于组件来说：props 永远是只读的。**
- React 的一大创新，就是**把每一个组件都看成是一个状态机**，组件**内部通过 state 来维护组件状态的变化，这也是 state 唯一的作用**。
- 你应该在应用中保持 自上而下的数据流，而不是尝试在不同组件中同步状态。

### 纯函数，没有副作用的函数

纯函数是指**不依赖于且不改变它作用域之外的变量状态的函数**。
也就是说，纯函数的返回值只由它调用时的参数决定，它的执行不依赖于系统的状态（比如：何时、何处调用它——译者注）。 纯函数是函数式编程的一个基础。

### react 设计理念

1. 组件单一功能原则：在理想状况下，一个组件应该只做一件事情。如果这个组件功能不断丰富，它应该被分成更小的组件。
2. 定义 UI 状态的最小(但完整)表示。
3. 确定你的 State（props|state） 应该位于哪里。

### 为什么要引入 React

`import React, {Component} from 'react'`，从本质上讲，JSX 只是为 React.createElement(component, props, ...children) 函数提供的语法糖。

这里的 React 在 babel 转化的过程中要用到，所以需要引入。

## state 与 props

### 正确地使用状态（state）

- 使用 setState 方法 来更新状态；
- 异步：React 可以将**多个 setState() 调用合并成一个调用来提高性能**。因为 this.props 和 this.state 可能是**异步更新**的，你不应该依靠它们的值来计算下一个状态。可以使用函数加参数的形式来解决这个问题；

```js
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment
});
// Correct
this.setState((prevState, props) => ({
  counter: prevState.counter + props.increment
}));
```

- 状态更新合并：当你调用 setState() 时，React 将你提供的对象合并到当前状态。

### 为什么 constructor 里要调用 super 和传递 props

```js
class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOn: true };
  }
  // ...
}

// 等价于如下
// class fields proposal形式，这使得像 state = {} 这类表达式能够在需要的情况下引用 this.props 和 this.context 的内容。
class Checkbox extends React.Component {
  state = { isOn: true };
  // ...
}
```

在 JavaScript 中，super 指的是父类（即超类）的构造函数。一般在 React 组件中，指代 React.Component 这个父类的构造函数。这里应该用到的是原型继承。

在调用父类的构造函数之前(也就是 super 之前)，你是不能在 constructor 中使用 this 关键字的。

在组件实例化的时候，会有如下`super(props); => this.props = props;`，这样在构造函数内的语句就可以使用 props 了，否则如果不传入 props，这个时候也会在实例生成的时候添加 props，这样就会导致**在构造函数内的语句**没法使用 props。

即便你调用 super() 的时候没有传入 props，你依然能够在 render 函数或其他方法中访问到 this.props。这是因为在生成实例的时候，props 会被添加到实例上。

```js
// React 内部
const instance = new YourComponent(props);
instance.props = props;
```

### 为什么要 setState

setState 做的事情**不仅仅只是修改了 this.state** 的值，另外最重要的是它会触发 React 的**更新机制**，会进行 diff ，然后将 patch 部分更新到真实 dom 里。

如果你直接 this.state.xx == oo 的话，**state 的值确实会改，但是改了不会触发 UI 的更新，那就不是数据驱动了**。这样的话，在不需要触发 ui 更新的时候倒是可以一用啊。

#### setState 的更新原理

#### setState 是同步还是异步，值的改变与页面重新渲染

**执行过程代码同步的**，只是**合成事件**和**钩子函数**的调用顺序**在更新之前**，导致在合成事件和钩子函数中**没法立马拿到更新后的值，形式了所谓的“异步”**，所以表现出来有时是同步，有时是“异步”。

只在合成事件和钩子函数中是“异步”的，在原生事件(获取 dom，手动绑定事件)和 setTimeout/setInterval 等原生 API 中都是同步的。

简单的可以理解为**被 React 控制的函数里面就会表现出“异步”**，反之表现为同步。

##### 那为什么会出现异步的情况呢

为了**做性能优化**，将 state 的更新延缓到最后**批量合并再去渲染**对于应用的性能优化是有极大好处的，**如果每次的状态改变都去重新渲染真实 dom，那么它将带来巨大的性能消耗**。

##### 那如何在表现出异步的函数里可以准确拿到更新后的 state 呢

通过第二个参数 setState(partialState, callback) 中的 callback 拿到更新后的结果。或者可以通过给 setState 传递函数来表现出同步的情况：

```js
this.setState(state => {
  return { val: newVal };
});
```

##### 那表现出异步的原理是怎么样的呢

在 React 的 setState 函数实现中，会根据 isBatchingUpdates(默认是 false) 变量判断是否直接更新 this.state 还是放到队列中稍后更新。然后有一个 batchedUpdate 函数，可以修改 isBatchingUpdates 为 true，

当 React **调用事件处理函数**之前，或者**生命周期函数**之前就会调用 batchedUpdate 函数，这样的话，setState 就不会同步更新 this.state，而是放到更新队列里面后续更新。

## 事件，构建 react 的反向数据流

React 通过将事件处理器**绑定到组件上来处理事件**。
React 事件**本质上和原生 JS 一样**，鼠标事件用来处理点击操作，表单事件用于表单元素变化等，Rreact 事件的命名、行为和原生 JS 差不多，不一样的地方是 React 事件名区分大小写。

### 概述下 React 中的事件处理逻辑

React 在组件加载(mount)和更新(update)时，将事件通过 addEventListener 统一注册到 document 上，然后**会有一个事件池存储了所有的事件**，当事件触发的时候，通过 dispatchEvent 进行事件分发。

#### 封装原生事件，传入内置事件处理器

为了解决**跨浏览器兼容性**问题，React 会将浏览器原生事件（Browser Native Event）**封装为合成事件**（SyntheticEvent）传入设置的事件处理器中。

#### 兼容多浏览器，事件委托到顶层处理

这里的合成事件**提供了与原生事件相同的接口**，不过它们**屏蔽了底层浏览器的细节差异**，保证了行为的一致性。

另外有意思的是，**React 并没有直接将事件附着到子元素上**，而是以**单一事件监听器的方式**将所有的事件**发送到顶层进行处理(委托事件)**。这样 React 在更新 DOM 的时候就不需要考虑如何去处理附着在 DOM 上的事件监听器，最终达到优化性能的目的。

#### 语法上的差异

- React 事件绑定属性的命名采用**驼峰式写法**，而不是小写。
- 如果采用 JSX 的语法你需要**传入一个函数作为事件处理函数**，而不是一个字符串(DOM 元素的写法)。

```js
// 向事件处理程序传递参数：this指代当前的组件
<button onClick={this.preventPop.bind(this, id)}>Delete Row</button>
preventPop(name, e){ // 事件对象e要放在最后
  e.preventDefault();
  alert(name);
}
```

值得注意的是，**通过 bind 方式向监听函数传参**，在类组件中定义的监听函数，事件对象 e 要排在所传递参数的后面。

- 在 React 中另一个不同是你不能使用返回 false 的方式阻止默认行为。你**必须明确的使用** preventDefault。
- 在这里，e 是一个合成事件。

### 事件调用的时候，回调中的 this

要看事件是如何绑定的，如果直接绑定 this，this(引用放最后)，就指向当前的组件或者元素。
如果绑定了组件，然后又使用函数的形式，通过函数的参数传递给回调函数。

### 为什么调用方法要 bind this

```js
// 如下代码是有问题的，发现会报 this 是 undefined 的错
class Foo extends React.Component {
  handleClick() {
    this.setState({ xxx: aaa });
  }

  render() {
    return <button onClick={this.handleClick}>Click me</button>;
  }
}
```

因为 render 多次调用每次都要 bind 会影响性能，所以官方建议你自己在 constructor 中手动 bind 达到性能优化。

在 JavaScript 中，**class 的方法默认不会绑定 this，这里对应的是一般函数，如果是尖头函数，就是哪里定义 this 指向哪里**。如果你忘记绑定 this.handleClick 并把它传入了 onClick，当你调用这个函数的时候 this 的值为 undefined。

所以通常有两种形式来处理这个问题

#### 添加 bind 绑定当前组件

```js
class Foo extends React.Component {
  handleClick() {
    this.setState({ xxx: aaa });
  }
  // 性能不太好，这种方式跟 react 内部帮你 bind 一样的，每次 render 都会进行 bind，而且如果有两个元素的事件处理函数式同一个，也还是要进行 bind
  render() {
    return <button onClick={this.handleClick.bind(this)}>Click me</button>;
  }
}

// 或者

class Foo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    // 相比于第一种性能更好，因为构造函数只执行一次，那么只会 bind 一次
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({ xxx: aaa });
  }

  render() {
    return <button onClick={this.handleClick}>Click me</button>;
  }
}
```

#### 使用箭头函数

```js
class Foo extends React.Component {
  handleClick() {
    this.setState({ xxx: aaa });
  }
  render() {
    // 每次 render 都会重复创建函数，性能会差一点。
    return <button onClick={e => this.handleClick(e)}>Click me</button>;
  }
}
class Foo extends React.Component {
  // 好看，性能好。没有明显缺点
  handleClick = () => {
    this.setState({ xxx: aaa });
  };
  render() {
    return <button onClick={this.handleClick}>Click me</button>;
  }
}
```

## 开发中遇到的问题

### React 中 keys 的作用是什么

keys 是 React 用于**追踪**哪些列表中元素被修改、**被添加或者被移除的辅助标识**。

在开发过程中，我们需要保证某个元素的 key 在其**同级元素中具有唯一性**。在 React Diff 算法中 React 会借助元素的 Key 值来判断该元素是**新近创建的还是被移动而来的元素**，**从而减少不必要的元素重渲染**。此外，React 还需要借助 Key 值来判断元素与本地状态的关联关系，因此我们绝不可忽视转换函数中 Key 的重要性。

#### react 中的遍历操作的时候需要 key 是可变的，不要使用 index 当做 key

- 设置 key 与 new Date().getTime() 相关就是每次强制刷新， 因为每次的 key 肯定不一致。
- new Date().toString() 的差异的时间最小是 1000ms。
- 这里还不能使用 Symbol 类型，因为 key 需要一个字符串，生成的 Symbol 转为字符串失去了本身存在的意义。

### 传入 setState 函数的第二个参数的作用是什么

> 该函数会在 setState 函数调用完成并且组件开始重渲染的时候被调用，我们可以用该函数来监听渲染是否完成：

```js
this.setState({ username: "tylermcginnis33" }, () =>
  console.log("setState has finished and the component has re-rendered.")
);
```

```js
this.setState((prevState, props) => {
  return {
    streak: prevState.streak + props.count
  };
});
```

### React 中 refs 的作用是什么

- Refs 是 React 提供给我们的安全访问 DOM 元素或者某个组件实例的句柄
- 可以为元素添加 ref 属性然后在回调函数中接受该元素在 DOM 树中的句柄，该值会作为回调函数的第一个参数返回。

直接去引用 react 的元素。

```jsx
  render: function() {
    return <TextInput ref={(c) => this._input = c} />;
  },
  componentDidMount: function() {
    this._input.focus();
  },
```

- 当连接一个 ref 到一个 DOM 组件如 `<div />`，你取回 DOM 节点;
- 当连接一个 ref 到一个复合组件如 `<TextInput />`，你会得到 React 类的实例。在后一种情况下，你可以调用任何那个组件的类暴露的方法。
- 注意当被引用的组件卸载和每当 ref 变动，旧的 ref 将会被以`null`做参数调用。这阻止了在实例被保存的情况下的内存泄露。

#### ref String 属性

- 赋值`ref`属性为任何从`render` 返回的东西，比如：

```jsx
<input ref="myInput" />
```

- 在其他一些代码中（典型的事件处理代码），通过`this.refs`访问 **支持实例(backing instance)**，如：

```jsx
var input = this.refs.myInput;
var inputValue = input.value;
var inputRect = input.getBoundingClientRect();
```

**Refs 是一种很好的发送消息给特定子实例(通过流式的 Reactive `props` 和 `state`来做会不方便)的方式。**

它们应该，不论怎样，不是你数据流通你的应用的首选。默认情况下，使用响应式数据流，并为本身不是 reactive 的用例保存`refs`。

#### 优点

- 你可以在你的组件类里**定义任何的公开方法**（比如在一个 Typeahead 的重置方法）然后通过 `refs` 调用那些公开方法（比如`this.refs.myTypeahead.reset()`）。在大多数情况下，使用内建的 React 数据流更清晰，而不是使用强制的 ref。
- 实行 DOM 测量几乎总是需要接触到 "原生" 组件比如 `<input />` 并且通过 ref 访问它的底层 DOM 节点。 **Refs 是唯一一个可靠的完成这件事的实际方式。**
- Refs 是为你自动管理的！**如果子级被销毁了，它的 ref 也同样为你销毁了**。这里不用担心内存（除非你做了一些疯狂的事情来自己保持一份引用）。

#### 注意事项

- 绝不在任何组件的 **render 方法中**访问 refs - 或者当任何组件的 render 方法还在调用栈上的任何地方运行时。
- 如果你想要保留 Google Closure Compiler advanced-mode crushing resilience，**务必不要以属性的方式访问指明为字符串的属性**。这意味这你必须用`this.refs['myRefString']`访问，如果你的 ref 被定义为`ref="myRefString"`。
- 如果你没有用 React 写过数个程序，你的第一反应通常是打算试着用 refs 来在你的应用里"让事情发生"。如果是这样，花一些时间并且更精密的思考`state`应该属于组件层级的哪个位置。常常，这会变得清晰：正确的"拥有"那个属性的地方应该在层级的更高层上。把 state 放在那里 往往消除了任何使用`ref`s 来 "让事情发生"的渴望 - 作为替代，数据流通常将完成你的目标。
- Refs 不能连接到一个 [stateless function（无状态函数）](https://react-cn.github.io/react/docs/reusable-components.html#stateless-functions)，因为这些组件没有支持实例。你总是可以包装一个无状态组件在一个标准复合组件里并且连接一个 ref 到这个复合组件。

#### 获取元素引用，使用 ref 获取元素

```jsx
<form action="" ref="form">
   <div class="radio">
       <label htmlFor="id">checkbox||radio</label>
       <input type="radio" id="id" value="value1" name="key1" defaultChecked>
   </div>
   <div class="radio">
       <label htmlFor="id2">checkbox||radio</label>
       <input type="radio" id="id2" value="value2" name="key1">
   </div>
   <hr/>
   <div class="checkbox">
       <label htmlFor="id3">checkbox||radio</label>
       <input type="checkbox" id="id3" value="value2" name="key2" >
   </div>
</form>
```

通过 let form = this.refs.form 获取 form 的引用；
通过 let key1 = form["key1"] 的表单特性获取，key1 的引用；
通过 let key1Value = key1.value 得到 key1 的值；
通过 let key2 = form["key2"] 的表单特性获取，key1 的引用；
通过 let key2Value = key2.checked 得到是不是 checkbox 被选中的一个 boolean 值；

##### 何时使用 Refs

下面是几个适合使用 refs 的情况：

1. 处理焦点、文本选择或媒体控制。
2. 触发强制动画。
3. 集成第三方 DOM 库

## 组件，component

### react 组件的生命周期函数

#### 初始化阶段，实例生成到挂载

- `constructor`: 这是给组件“带来生命”时调用的第一个方法。通常，你会在 constructor 方法中**初始化 state 和绑定事件处理程序**。
- `getDefaultProps`: 获取实例的默认属性，改为 component.defaultProps={}来设置
- `getInitialState`: 获取每个实例的**初始化状态**，React 在 ES6 的实现中去掉了 getInitialState 这个 hook 函数,规定 state 在**constructor 中实现**。
- `componentWillMount`：组件即将被装载、渲染到页面上，调用一次，相当于 jq 的 ready。
- `render`: 组件在这里**生成虚拟的 DOM 节点**
- `omponentDidMount`: 组件真正在被装载之后，相当于模板+数据生成代码片段插入页面之后的操作
  - 数据请求
  - 这个时候，页面已经挂载，可以获取节点，使用 setState()会触发重新渲染(re-render)。

##### componentWillReceiveProps()

```js
// 旧的形式
componentWillReceiveProps: function(nextProps) {
  this.setState({
    likesIncreasing: nextProps.likeCount > this.props.likeCount
  });
}
```

- 旧的 props 可以**通过 this.props 来获取**。在这个函数内调用 this.setState()方法不会增加一次新的 render.
- 该方法应该**用于比较 this.props 和 nextProps**，然后使用 this.setState()来改变 state。
- 需要注意的是，即使 Props 没有发生变化，**React 也有可能会调用该钩子函数**。所以如果你想要真正处理 Props 的变化，要记得比较当前 props 和 nextProps

#### 运行中状态

- `componentWillReceiveProps`: 组件**将要接收到新的 props 属性**的时候调用，初始化的时候不调用
- `shouldComponentUpdate`: 组件**接受到新属性或者新状态的时候**（可以返回 false，接收数据后不更新，阻止`render`调用，后面的函数不会被继续执行了）
- `componentWillUpdate`: 组件即**将更新**，不能修改属性和状态
- `render`: 组件重新描绘
- `componentDidUpdate`: 组件已经更新

##### shouldComponentUpdate(nextProps, nextState): boolean

组件更新: shouldComponentUpdate(nextProps, nextState): boolean，在组件挂载之后，再接收到**新的 props 或者 state 时被执行**。

- 在**初始化时**或者**使用 forceUpdate**时**不被执行**。可以在你确认不需要更新组件时使用。
- boolean 当组件做出**是否要更新 DOM 的决定的时候被调用**。
- 如果 shouldComponentUpdate 返回 false, render()则会在**下一个 state change 之前被完全跳过**。(另外 componentWillUpdate 和 componentDidUpdate 也不会被执行)；

#### 销毁阶段

- `componentWillUnmount`: 组件即将销毁

### react 性能优化是哪个周期函数

`shouldComponentUpdate`这个方法用来判断**是否需要调用 render 方法重新描绘 dom**。因为 dom 的描绘非常消耗性能，如果我们能在 shouldComponentUpdate 方法中能够写出更优化的 dom diff 算法，可以极大的提高性能

### 高阶组件：具体而言，高阶组件就是一个函数，且该函数接受一个组件作为参数，并返回一个新的组件

高阶组件（HOC）是 react 中**对组件逻辑进行重用的高级技术**。但高阶组件本身并不是 React API。它**只是一种模式**，这种模式是由 react 自身的组合性质必然产生的。

对比组件将 props 属性转变成 UI，高阶组件则是将一个组件转换成另一个新组件。

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

### 数据获取应该放在哪个阶段，componentWillMount|componentDidMount

1、通常我在 componentWillMount 发送 ajax(渲染 dom 之前做的操作)
2、componentDidMount 也可以做 ajax 操作（渲染 dom 完成之后做的操作）

那么，这 2 种情况如何区分呢？

需求 1：

当你的 render 函数需要有数据才能渲染的时候，就在 componentWillMount 做操作。

```js
render() {
  return data && <div>{data}</div>
}
```

需求 2：

当你的 render 不需要数据，先渲染 dom 结构，就在 componentDidMount 操作。

```js
render() {
  const { data } = this.props
  return (
    <div>
      <span>我要先渲染</span>
      <span>{data || ''}</span>
    </div>
  )
}
```

### 为什么虚拟 dom 会提高性能

虚拟 dom 相当于在 js 和真实 dom 中间**加了一个缓存**，利用 dom diff 算法**避免了没有必要的 dom 操作，从而提高性能**。

具体实现步骤如下：

- 用 JavaScript 对象结构表示 DOM 树的结构；然后用这个树构建一个**真正的 DOM 树**，插到文档当中。
- 当状态变更的时候，重新构造一棵新的**对象树**，虚拟 dom 结构。然后用新的树和旧的树进行比较，记录两棵树差异
- 把 2 所记录的差异应用到步骤 1 所构建的真正的 DOM 树上，视图就更新

### diff 算法

- 把树形结构**按照层级分解**，只比较同级元素。
- 给列表结构的每个单元添加唯一的 key 属性，方便比较。
- React 只会匹配相同 class 的 component（这里面的 class 指的是组件的名字）
- 合并操作，调用 component 的 setState 方法的时候, React 将其标记为 - dirty.到每一个事件循环结束, React 检查所有标记 dirty 的 component 重新绘制.
- **选择性子树渲染。开发人员可以重写 shouldComponentUpdate 提高 diff 的性能**

### 动态添加多个 class

拼接字符串的方式，或者写成一个字符串，原理应该也一样。

```jsx
let indexNum = 11;
<li className={`icon biaxial ${indexNum > 1 ? "unavailable" : ""}`}>
  拆分多图
</li>;
```

### react 的性能优化方案

- 重写`shouldComponentUpdate`来避免不必要的 dom 操作
- 使用 production 版本的 react.js
- 使用 key 来帮助 React 识别列表中所有子组件的最小变化

### react 的父子组件的每个生命周期是怎么触发的

是洋葱型的还是顺序执行的呢。

```js
// 参见react-features-test/feature4_6/Parent
```

父组件的状态改变的时候，相对于自组件多出来一个 componentWillReceiveProps 事件。
很明显的洋葱类型，父组件只有在子组件挂载完成的时候，才能算是挂载完成。

### render()

对于一个组件来说，render 是唯一一个必须的方法。render 方法需要满足这几点：

- 只能通过 this.props 或 this.state 访问数据
- 只能出现**一个顶级组件**
- 可以返回 null、false 或任何 React 组件
- 不能对 props、state 或 DOM 进行修改，会造成重复 componentWillUpdate

需要注意的是，render 方法返回的是虚拟 DOM。

#### 主动更新（重新渲染）

React 元素都是 **immutable** 不可变的。**当元素被创建之后，你是无法改变其内容或属性的**。一个元素就好像是动画里的**一帧**，**它代表应用界面在某一时间点的样子**。
根据我们现阶段了解的有关 React 知识，更新界面的**唯一办法是创建一个新的元素**，然后将它传入 ReactDOM.render() 方法。

React DOM 首先会比较**元素内容先后的不同**，而在渲染过程中只会更新改变了的部分。

### 定义一个组件时候，如何决定要用 Functional 还是 Class

- 简单的用 Functional，复杂的用 Class
- 不需要组件内状态的用 Functional，当初纯的渲染模版。需要的用 Class

### es5 原生方式 React.createClass 定义的组件

```js
var InputControlES5 = React.createClass({
  propTypes: {
    //定义传入props中的属性各种类型
    initialValue: React.PropTypes.string
  },
  defaultProps: {
    //组件默认的props对象
    initialValue: ""
  },
  // 设置 initial state
  getInitialState: function() {
    //组件相关的状态对象
    return {
      text: this.props.initialValue || "placeholder"
    };
  },
  handleChange: function(event) {
    this.setState({
      //this represents react component instance
      text: event.target.value
    });
  },
  render: function() {
    return (
      <div>
        Type something:
        <input onChange={this.handleChange} value={this.state.text} />
      </div>
    );
  }
});
InputControlES6.propTypes = {
  initialValue: React.PropTypes.string
};
InputControlES6.defaultProps = {
  initialValue: ""
};
```

### es6 形式的 extends React.Component 定义的组件

```js
class InputControlES6 extends React.Component {
  constructor(props) {
    super(props);

    // 设置 initial state
    this.state = {
      text: props.initialValue || "placeholder"
    };

    // ES6 类中函数必须手动绑定
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      text: event.target.value
    });
  }

  render() {
    return (
      <div>
        Type something:
        <input onChange={this.handleChange} value={this.state.text} />
      </div>
    );
  }
}
InputControlES6.propTypes = {
  initialValue: React.PropTypes.string
};
InputControlES6.defaultProps = {
  initialValue: ""
};
```

### from 表单的操作

#### 设置默认值

defaultValue="value"，设置默认选中 defaultChecked；

```js
<form onSubmit={this.handleSubmit}>
  {" "}
  // 这里可以设置确认按钮的操作，更加语义化
  <label>
    Name:
    <input
      defaultValue="Bob"
      type="text" // 一般的文本操作，设置defaultValue="value",与ref共同构建非受控组件。
      ref={input => (this.input = input)}
    />
  </label>
  <input type="submit" value="Submit" />
</form>
```

#### input 标签的 disabled 设置

```jsx
let disabled = isReadonly ? { disabled: "disabled" } : {};
<input {...disabled} />;
```

### 受控组件与非受控组件

**React 内部分别使用了 props, state 来区分组件的属性和状态**。props 用来定义组件外部传进来的属性, 属于那种经过外部定义之后, 组件内部就无法改变。而 state 维持组件内部的状态更新和变化, 组件渲染出来后响应用户的一些操作,更新组件的一些状态。

#### 非受控组件，与状态无关，通过 ref 获取节点，来获取值。用于表单统一，不需要控制外部变更 ui

非受控组件即组件的状态改变**不受 props 与 state 控制**，根据默认行为进行交互动作。

- HTML 表单元素与 React 中的其他 DOM 元素有所不同,因为表单元素**生来就保留一些内部状态**。
- 在 HTML 当中，像`<input>`,`<textarea>`, 和`<select>`这类表单元素**会维持自身状态**，并根据用户输入进行更新。但在 React 中，可变的状态通常保存在组件的状态属性中，并且只能用 setState()，方法进行更新。
- 使用”受控组件”,每个状态的改变**都有一个与之相关的处理函数**。这样就可以直接修改或验证用户输入。
- 非受控表单，设置 ref，便于引用操作。
- 设置 defaultValue || defaultCkecked 来设置初始状态

```jsx
<input
  ref={input => {
    this.input = input;
  }}
  defalutValue={defaultValue}
/>
```

#### 受控组件，设置的 value，对应 state 的值，逆向通过 onChange 事件回传

组件的可更改的位置的状态都保存在 state 与 props 中，每次页面操作都通过`onChange`回传反馈到 state 上。

- 初始值在初始 state|props 的时候给出
- 必须有事件来改变状态从而改变显示
- 可以对输入内容进行一些操作，比如**格式化**等
- 受控表单，需要设置 value，并且设置改变状态的函数 onchange

```jsx
<input
  value={value}
  onChange={this.handleChange.bind(this)}
  ref={ref => (this.input = ref)}
/>
```

当每次的输入结果都**会影响操作的时候**，事件操作在`onChange`事件中更改 state，同时触发响应的别的操作。

### setState 的工作原理

setState，合并渲染（渲染是异步的），但是**数据是实时更新**的。

```js
...
state = {
    count: 0
}
componentDidMount() {
  this.setState({count: this.state.count + 1})
  this.setState({count: this.state.count + 1})
  this.setState({count: this.state.count + 1})
}
...
```

看起来 state.count 被增加了三次，**但结果是增加了一次**。这并不奇怪：

React 快的原因之一就是，在执行`this.setState()`时，React 没有忙着立即更新`state`，只是把新的`state`存到一个**队列**（`batchUpdate`）中。上面三次执行`setState`只是对传进去的对象进行了合并,然后再**统一处理（批处理）**，触发重新渲染过程，因此只重新渲染一次，结果只增加了一次。这样做是非常明智的，因为在一个函数里调用多个 setState 是常见的，如果每一次调用 setState 都要引发重新渲染，显然不是最佳实践。React 官方文档里也说了：

把`setState()` 看作是重新 render 的**一次请求**而不是立刻更新组件的指令。

#### 那么调用 this.setState()后什么时候 this.state 才会更新

答案是即将要执行下一次的`render`函数时。

#### 这之间发生了什么

`setState`调用后，React 会执行一个**事务（Transaction）**，在这个事务中，React 将新 state 放进一个**队列**中，**当事务完成后，React 就会刷新队列**，然后启动另一个事务，这个事务包括执行 `shouldComponentUpdate` 方法来判断是否重新渲染，如果是，React 就会进行 state 合并（`state merge`）,生成新的 state 和 props；如果不是，React 仍然会更新`this.state`，只不过不会再`render`了。

#### `setState`可以接受函数作为参数

```js
...
state = {
  score: 0
}
componentDidMount() {
  this.setState( (prevState) => ({score : prevState.score + 1}) )
  this.setState( (prevState) => ({score : prevState.score + 1}) )
  this.setState( (prevState) => ({score : prevState.score + 1}) )
}
```

达到增加三次的目的。

这个`updater`可以为函数，该函数接受该组件**前一刻**的 state 以及**当前**的 props 作为参数，计算和返回下一刻的 state。

React 会把`setState`里传进去的**函数放在一个任务队列里**，React 会依次调用队列中的函数，传递给它们**前一刻**的 state。

`this.state`并未改变，并且只`render`了一次。

## changeblog

### 16.3 关于生命周期的问题

React 官方正式发布了 v16.3 版本。在这次的更新中，除了前段时间被热烈讨论的新 Context API 之外，

新引入的两个生命周期函数 getDerivedStateFromProps，getSnapshotBeforeUpdate 以及

在未来 v17.0 版本中即将被移除的三个生命周期函数

- componentWillMount
- componentWillReceiveProps
- componentWillUpdate

### 方法替代

要被废弃的方法：

componentWillMount--使用 componentDidMount 代替

componentWillUpdate--使用 componentDidUpdate 代替

componentWillReceiveProps--使用一个新的方法：static getDerivedStateFromProps 来代替。

### getDerivedStateFromProps，在挂载和更新阶段都会调用这个方法

这个方法以 props 和 state 作为参数。这个方法在组件**被初始挂载到 DOM 之前调用**。组件**被渲染之前更新它的状态**。组件更新的时候还会调用这里的参数。

getDerivedStateFromProps 内部不可以有副作用，因为现在是无论是 state 改变还是 props 改变，都会执行它。这个方法允许组件**基于 props 的变更来更新其内部状态**。

但是，问题来了。既然这个方法**没有办法访问 this**，那么如何调用 this.setState 呢？答案就是，不调用。这个方法**直接返回需要更新的 state 的数据**，或者返回 null，如果没有什么需要更新的话。

```js
static getDerivedStateFromProps(nextProps, prevState) {
  if(nextProps.currentRow === prevState.lastRow) {
    return null;
  }
  return {
    lastRow: nextProps.currentRow,
    isCrollingDown: nextProps.curentRow > prevState.lastRow
  }
}
```

调用这个方法和之前调用 this.setState 的效果是一样的。只会修改这些返回的值，如果是 null 的话则不修改 state。state 的其他值都会保留。

### getSnapshotBeforeUpdate()

你不一定会用到这个生命周期方法，但在某些特殊情况下它可能会派上用场，特别是当你需要在 DOM 更新后从中获取一些信息。

也就是如果需要在数据更新之后依据 dom 进行操作，就在这里操作。

## news

如果你能深入理解 React 的灵魂，包括虚拟 DOM， JSX ，函数式编程和 immutable，单向数据流，组件化抽象，生命周期等，在面对其他轮子时你也能做到得心应手。

### React 之所以这么受欢迎，得益于它自身优势

- 灵活性和响应性：React 提供最大的灵活性和响应能力。
- 虚拟 DOM：由于它基于文档对象模型，因此它允许浏览器友好地以 HTML，XHTML 或 XML 格式排列文档。
- 可扩展性：由于其灵活的结构和可扩展性，React 已被证明对大型应用程序更好。
- 不断发展：React 得到了 Facebook 专业开发人员的支持，他们不断寻找改进方法致力于使其更先进。
- 丰富的 JavaScript 库：来自世界各地的贡献者正在努力添加更多功能。
- Web 或移动平台： React 提供 React Native 平台，可通过相同的 React 组件模型为 iOS 和 Android 开发本机呈现的应用程序。

### PureComponent

React.PureComponent 类似于 React.Component。它们的不同之处在于 React.Component 没有实现 shouldComponentUpdate()，**但是 React.PureComponent 实现了它**。采用对属性和状态用浅比较的方式。

需要使用 shouldComponentUpdate 的时候再去继承 PureComponent。

在某些场景下你可以使用 React.PureComponent 来提升性能。

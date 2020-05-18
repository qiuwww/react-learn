---
title: React源码分析
---

## Component 实现

## createElement 实现 -> ReactDom

1. 渲染器，这里对应 html
2. 还有
   1. 泰罗的渲染器
   2. rn 的渲染器。

### JSX

[LIVE JSX EDITOR](https://react.docschina.org/)

打包工具做的事情：JSX -> createElement，所以页面必须引入 React。

1. JSX 最终还是 js，不是 html。
2. JSX 是 js 语法的扩展，像是一个**模板引擎**。

这里最终一段 JSX 会生成一个 js 对象，主要属性如下：

1. key
2. ref
3. type：
   1. 标签类型，如 div
   2. 组件，函数类型
4. props：
   1. children
   2. 别的一些属性

#### JSX 优点

1. 代码写的更快，相对于直接写 createElement；
2. 类型安全；
3. 开发效率更高；

#### [react-dom](https://reactjs.org/docs/react-dom.html)

ReactDOM.render(jsx, document.querySelector('#root'));

### 构建 vdom 渲染流程

最终所有的标签、class 组件、function 组件，都将转化为原生标签。

## 探究 diff 算法

第 7 小节讲的还不错。[查看](./demo/src/kkreact/Component.js)

### 状态更新逻辑

react 与 vue 很大的不同，

1. 就是 vue 做到了**数据的劫持**，可以清楚的知道哪些数据修改了，对应的 html 也会取修改，
2. 而 react 的 state 修改了，回去调用 render，如果每一次都调用 render，**就很消耗性能了**，所以需要虚拟 dom -> diff 算法对比 -> 更新真实的 dom。

#### render 更新机制

1. 状态变更 -> **批处理** updateQueue，异步的特性 -> 提高处理效率 -> patch 打补丁；
2. Updater 类的主要的一些属性：
   1. pendingStates=[]
   2. pendingCallbacks = []；
   3. isPending = false; // 是否正在更新中
   4. nextProps
   5. clearCallbacks
   6. emitUpdate：对于新来的 state，正在渲染与没有渲染的时候的处理。<对应查看这个函数>
      1. 属性 props 引起的更新会直接更新；
      2. 状态 state 引起的更新会批量更新；
   7. addState
   8. updateComponent
   9. getState
   10. \$updater 更新器
3. updateQueue，是一个变量，内部存放若干的更新器；
4. shouldUpdate

### diff 算法，[查看](./demo/src/kkreact/virtual-dom.js)，第八节，也不错

compareTwoVnodes，虚拟 dom 对比方法。

#### diff 的原则简化，让 dom 节点的对比的时间复杂度从 O(n^3) -> O(n)

1. 比较的时候，只会**同级比较**；
2. **拥有相同类的两个组件，拥有相似的结构**，不同类的组件，不同的结构；
3. **同级节点**中，通过唯一 key 进行区分；

#### diff 比较方式

1. 替换节点；
2. 移动、删除、新增节点；
3. 节点属性的修改；
4. 文本节点的内容变化；

### html 渲染的过程中

1. html 引擎
2. css 引擎
3. dom 引擎 ｜ js 引擎

## React Hooks 源码分析

### useState

1. 就是一个闭包；
2. React**第一次渲染函数组件时**，它同时会**创建一个对象与之共存**，**该对象是该组件实例的定制对象**，而不是全局对象。只要组件存在于 DOM 中，这个组件的对象就会一直存在。

```js
var _state; // 把 state 存储在外面

function useState(initialValue) {
  _state = _state | initialValue; // 如果没有 _state，说明是第一次执行，把 initialValue 复制给它
  function setState(newState) {
    _state = newState;
    render();
  }
  return [_state, setState];
}

// 使用
// var [count, setCount] = useState(0);
```

### useEffect

1. React 中是通过类似单链表的形式来代替数组的。**通过 next 按顺序串联所有的 hook**。
2. useEffect是异步执行的，这意味着更容易遇到闭包问题。

```js
let _deps; // _deps 记录 useEffect 上一次的 依赖

function useEffect(callback, depArray) {
  const hasNoDeps = !depArray; // 如果 dependencies 不存在
  const hasChangedDeps = _deps
    ? !depArray.every((el, i) => el === _deps[i]) // 两次的 dependencies 是否完全相等
    : true;
  /* 如果 dependencies 不存在，或者 dependencies 有变化*/
  if (hasNoDeps || hasChangedDeps) {
    callback();
    _deps = depArray;
  }
}
```

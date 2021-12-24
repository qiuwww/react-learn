# hooks

[hooks 官网](https://zh-hans.reactjs.org/docs/hooks-intro.html)

1. Hook 为已知的 React 概念提供了**更直接的 API：props， state，context，refs 以及生命周期**；
2. 可以自定义 hooks；
3. 在多数情况下，不可能将组件拆分为更小的粒度，因为状态逻辑无处不在。这也给测试带来了一定挑战。
    1. **同时，这也是很多人将 React 与状态管理库结合使用的原因之一**。但是，**这往往会引入了很多抽象概念，需要你在不同的文件之间来回切换，使得复用变得更加困难**。
4. 为了解决这些问题，Hook 使你在非 class 的情况下可以使用更多的 React 特性。 从概念上讲，React 组件一直更像是函数。而 Hook 则拥抱了函数，同时也没有牺牲 React 的精神原则。Hook 提供了问题的解决方案，无需学习复杂的函数式或响应式编程技术。
5. Hook 不能在 class 组件中使用 —— 这使得你不使用 class 也能使用 React。
6. Hook 就是 JavaScript 函数，但是使用它们会有两个额外的规则：
    1. 只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用。
    2. 只能在 React 的函数组件中调用 Hook。不要在其他 JavaScript 函数中调用。（还有一个地方可以调用 Hook —— 就是自定义的 Hook 中，我们稍后会学习到。）

## react 原始 hooks

1. State Hook =》 useState
2. Effect Hook =》 useEffect
    1. 你之前可能已经在 React 组件中执行过数据获取、订阅或者手动修改过 DOM。我们统一把这些操作称为“副作用”，或者简称为“作用”。
    2. 它跟 class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途，只不过被合并成了一个 API。
    3. useEffect 会在每次渲染后都执行吗？ 是的，默认情况下，它在第一次渲染之后和每次更新之后都会执行；
    4. 需要注意是否需要清楚副作用；
    5. 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），**可以传递一个空数组（[]）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行**。这并不属于特殊情况 —— 它依然遵循依赖数组的工作方式。
3. 自定义 Hook
    1. 有时候我们会想要在组件之间**重用一些状态逻辑**。
    2. 目前为止，有两种主流方案来解决这个问题：**高阶组件和 render props**。自定义 Hook 可以让你在不增加组件的情况下达到同样的目的（返回各种各样的组件）。
        1. 这里的 hook 返回的是一个状态，
4. 其他 Hook =》除此之外，还有一些使用频率较低的但是很有用的 Hook。
    1. useContext
    2. useRedux

## useRequest 这个 hook

1. useRequest，可以理解为一个插座，有电、没电、高压、低压，都会相应的触发相关的变量或者方法；
2. useRequest 只是执行请求方便，状态还是用 useState；
3. run 表示手动执行(manual: true)这个 hook；

## hooks.js 仓库

ahook

# ReactHooks

再读相关文档。

Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

React Native 从 0.59 版本开始支持 Hook。

没有计划从 React 中移除 class。

你可以使用 Hook 从组件中**提取状态逻辑**，**使得这些逻辑可以单独测试并复用**。Hook 使你在无需修改组件结构的情况下复用状态逻辑。 这使得在组件间或社区内共享 Hook 变得更便捷。

Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。Hook 不能在 class 组件中使用 —— 这使得你不使用 class 也能使用 React。

## 解决的问题

React 需要为**共享状态逻辑**提供更好的原生途径。

难以理解的 class，你必须去理解 JavaScript 中 this 的工作方式

## 基本使用

### useState

useState 就是一个 Hook。通过在函数组件里调用它来**给组件添加一些内部 state**。
useState 会返回一对值：当前状态和一个让你更新它的函数。

```js
// 声明一个叫 “count” 的 state 变量。，这里的第二个参数对应的就是更新函数。
const [count, setCount] = useState(0);
// 声明多个 state 变量！
const [age, setAge] = useState(42);
const [fruit, setFruit] = useState("banana");
const [todos, setTodos] = useState([{ text: "Learn Hooks" }]);
```

### useEffect

useEffect 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途，只不过被**合并成了一个 API**。

`componentDidMount + componentDidUpdate + componentWillUnmount = useEffect`

这里通常代码不会使用 componentDidUpdate 的原因是，在渲染函数 render 中，添加了不修改 state 的副作用，所以这个生命周期就感觉没什么用了。

可以访问到组件的 props 和 state。

默认情况下，React 会在**每次渲染后调用副作用函数** —— 包括第一次渲染的时候。副作用函数还可以通过返回一个函数来指定如何“清除”副作用。相当于在以上生命周期内修改状态。

跟 useState 一样，你可以在组件中多次使用 useEffect，多次使用内部的代码应该是要被合并处理。查看 react-features-test 中的 hooks 文件实例。

### useContext

比如，useContext 让你不使用组件嵌套就可以订阅 React 的 **Context**。

### useReducer

可以让你**通过 reducer** 来管理组件本地的复杂 state。类似 redux 了。

## 跨组件如何共用状态

有时候我们会想要在**组件之间重用一些状态逻辑**。目前为止，有两种主流方案来解决这个问题：高阶组件和 render props。**自定义 Hook** 可以让你在不增加组件的情况下达到同样的目的。

Hook 是一种复用状态逻辑的方式，它不复用 state 本身。事实上 Hook 的每次调用都有一个完全独立的 state。

这里的自定义 hook，基本就是把公共方法（不包括状态）抽离到共同的组件的意思，像是一个类（状态不同，方法相同），但是这个 hook 可以不依赖组件的嵌套关系而进行传递，更类似与 redux。所以在有 redux 的时候，函数式组件只做局部的渲染之用。

## 如何在组件加载时发起异步任务

发送请求也属于 React 定义的副作用之一，因此应当使用 useEffect 来编写。

在 Hook 中出现异步任务尤其是 timeout 的时候，我们要格外注意。useState 只能保证多次重绘之间的状态值是一样的，但不保证它们就是同一个对象，因此出现闭包引用的时候，尽量使用 useRef 而不是直接使用 state 本身，否则就容易踩坑。反之如果的确碰到了设置了新值但读取到旧值的情况，也可以往这个方向想想，可能就是这个原因所致。

effect hook 在组件 mount 和 update 的时候都会执行。所以在 useEffect 中直接修改 state，会导致一直运行，陷入死循环。

你可以在 effect hook 提供的**第二个参数中**，传入一个空数组，这样做**可以避免组件更新**的时候执行 effect hook ，但是组件在 mount 依然会执行它。**也就是说第一个参数是 DidMount，第二个是 DidUpdate，第三个 return 是，WillUnmount。**

## react hooks 原理是什么

hooks 是用**闭包实现**的，因为**纯函数不能记住状态**，只能通过闭包来实现。

## useState 中的状态是怎么存储的

通过**单向链表**，fiber tree 就是一个单向链表的**树形结构**。


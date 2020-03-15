# react-router 和 react-router-dom 的区别

- react-router: 实现了路由的核心功能
- react-router-dom: 基于 react-router，加入了在**浏览器运行环境下的一些功能**，例如：Link 组件，会渲染一个 a 标签，Link 组件源码 a 标签行; BrowserRouter 和 HashRouter 组件，前者使用 pushState 和 popState 事件构建路由，后者使用 window.location.hash 和 hashchange 事件构建路由。
- react-router-native: 基于 react-router，类似 react-router-dom，加入了 react-native 运行环境下的一些功能。

## 模块引用

写法 1:

```js
import { Swtich, Route, Router, HashHistory, Link } from 'react-router-dom';
```

写法 2:

```js
import { Switch, Route, Router } from 'react-router';
import { HashHistory, Link } from 'react-router-dom';
```

## 路由模式，history

[Histories](https://react-guide.github.io/react-router-cn/docs/guides/basics/Histories.html)

React Router 是建立在 history 之上的。 简而言之，一个 history 知道如何去监听浏览器地址栏的变化， 并解析这个 URL 转化为 location 对象， 然后 router 使用它匹配到路由，最后正确地渲染对应的组件。

三种形式：

### browserHistory

它使用浏览器中的 History API 用于处理 URL，创建一个像 example.com/some/path 这样真实的 URL 。**需要后端支持路由选择。只是指出路由，不包括数据**。

### hashHistory

Hash history 使用 URL 中的 hash（#）部分去创建形如 example.com/#/some/path 的路由。

基于[hashchange 事件](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/hashchange_event)。

### createMemoryHistory

Memory history 不会在地址栏被操作或读取。这就解释了我们是如何实现服务器渲染的。同时它也非常适合测试和其他的渲染环境（像 React Native ）。

### browserHistory 模式与 ssr 的区别

使用 Next.js，服务器端渲染 React 应用程序变得如此简单，无需关心数据来自何处。

服务端模板输出。

路由模式与 react-router 一致，接受 c 端请求，然后返回页面。

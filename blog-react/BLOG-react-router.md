---
title: react-router
date: 2018-4-5
---

## react-router 和 react-router-dom 的区别

- react-router: 实现了路由的核心功能。

- react-router-dom: 基于 react-router，加入了在**浏览器运行环境下的一些功能**，例如：Link 组件，会渲染一个 a 标签，Link 组件源码 a 标签行; BrowserRouter 和 HashRouter 组件，前者使用 pushState 和 popState 事件构建路由，后者使用 window.location.hash 和 hashchange 事件构建路由。

- react-router-native: 基于 react-router，类似 react-router-dom，加入了 react-native 运行环境下的一些功能。

### React-router

React-router 提供了一些 router 的核心 api，包括 Router, Route, Switch 等，但是它没有提供 dom 操作进行跳转的 api。

### React-router-dom

React-router-dom 提供了 BrowserRouter, Route, Link 等 api,我们可以通过 dom 的事件控制路由。

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

### browserHistory，就是路由请求

它使用浏览器中的 History API 用于处理 URL，创建一个像 `example.com/some/path` 这样真实的 URL 。**需要后端支持路由选择。只是指出路由，不包括数据**。

umi 使用 express 模拟了后端请求的情况，所以看起来像是可以直接支持。

### hashHistory,hashchange 事件

Hash history 使用 URL 中的 hash（#）部分去创建形如 `example.com/#/some/path` 的路由。

基于[hashchange 事件](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/hashchange_event)。

### createMemoryHistory

Memory history **不会在地址栏被操作或读取**。这就解释了我们是如何实现服务器渲染的。同时它也非常适合测试和其他的渲染环境（像 React Native ）。

### browserHistory 模式与 ssr 的区别

使用 Next.js，服务器端渲染 React 应用程序变得如此简单，无需关心数据来自何处。

类似服务端模板输出。

路由模式与 react-router 一致，接受 c 端请求，然后返回页面。

## 如何配置 React-Router

本质上就是根据不同的路由参数，映射不同的子组件。

```js
import { BrowserRouter as Router, Route } from 'react-router-dom';

<Router>
  <Route path="/" component={App}>
    <Route path="about" component={About} />
    <Route path="users" component={Users}>
      <Route path="/user/:userId" component={User} />
    </Route>
    <Route path="*" component={NoMatch} />
  </Route>
</Router>;
```

- Router 用来注入路由信息，解析路由信息。
- Route 来进行匹配路径，渲染子组件。

## 路由的动态加载模块

由于组件被引入路由文件中，引入的文件都会被打包到 index.js 中，所以对于不需要首次加载的文件，就需要组件首次不加载，用到的时候再去加载。

一、使用 lazy 加载。

```jsx
// 懒加载
import React, { Component, Suspense, lazy } from 'react';
const ErrorBoundaryTest = lazy(() =>
  import('./pages/ErrorBoundaryTest/index.jsx')
);
<Route path="/error-boundary-test" component={ErrorBoundaryTest} />;
```

这样打包之后，组件就单独成一个文件，不会同时加载。

二、自己添加组件进行动态加载子组件。

umi 是通过配置实现动态加载。dynamicImport

```js
['umi-plugin-react',{
  dva: {
    immer: true,
  },
  antd: true,
  routes: {
    exclude: [/models\//],
  },
  polyfills: ['ie9'],
  locale: {},
  library: 'react',
  dynamicImport: {
    webpackChunkName: true,
    loadingComponent: './components/Loading.js',
  },
  dll: {
    exclude: [],
  }
]
```

## 介绍路由的 history

简而言之，一个 history 知道如何去监听**浏览器地址栏**的变化， 并**解析这个 URL 转化为 location 对象**， 然后 router 使用它**匹配到路由**，最后正确地渲染对应的组件。

History 对象最初设计**来表示窗口的浏览历史。但出于隐私方面的原因**，History 对象不再允许脚本访问已经访问过的实际 URL。唯一保持使用的功能只有 back()、forward() 和 go() 方法。

所以只能借助

```js
window.history.pushState(stateObject, title, url);
window.history.replaceState(stateObject, title, url);
```

来自己维护历史信息。

## react-router 里的`<Link>`标签和`<a>`标签有什么区别

对比 a 标签，Link 组件**避免了不必要的重渲染**。

a 标签**可以给用户跳转的感觉**，适用于 toC。

link 这种类似 ajax，**用户感觉不到跳转**，在后台系统中给用户一种在操作 cs 应用的感觉

[`<Link>`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/modules/Link.js)

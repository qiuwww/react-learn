# react-router 和 react-router-dom 的区别

- react-router: 实现了路由的核心功能
- react-router-dom: 基于 react-router，加入了在**浏览器运行环境下的一些功能**，例如：Link 组件，会渲染一个 a 标签，Link 组件源码 a 标签行; BrowserRouter 和 HashRouter 组件，前者使用 pushState 和 popState 事件构建路由，后者使用 window.location.hash 和 hashchange 事件构建路由。
- react-router-native: 基于 react-router，类似 react-router-dom，加入了 react-native 运行环境下的一些功能。

## 模块引用

写法 1:

```js
import { Swtich, Route, Router, HashHistory, Link } from "react-router-dom";
```

写法 2:

```js
import { Switch, Route, Router } from "react-router";
import { HashHistory, Link } from "react-router-dom";
```

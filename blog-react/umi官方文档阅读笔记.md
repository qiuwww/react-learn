# umi 官方文档阅读笔记

<https://umijs.org/zh/guide/>

企业级的可插拔的 react 应用框架。

市面上的框架基本都是从源码到构建产物，很少会考虑到各种发布流程，而 umi 则多走了这一步。

## 他和 dva、roadhog 是什么关系

- roadhog 是基于 webpack 的封装工具，目的是简化 webpack 的配置；
- umi 可以简单地理解为 roadhog + 路由，思路类似 next.js/nuxt.js，辅以一套插件机制，目的是通过框架的方式简化 React 开发；
- dva 目前是**纯粹的数据流**，和 umi 以及 roadhog 之间并没有相互的依赖关系，可以分开使用也可以一起使用，个人觉得 umi + dva 是比较搭的。

## 通过脚手架创建项目

<https://umijs.org/zh/guide/create-umi-app.html#%E9%80%9A%E8%BF%87%E8%84%9A%E6%89%8B%E6%9E%B6%E5%88%9B%E5%BB%BA%E9%A1%B9%E7%9B%AE>

```sh
$ mkdir myapp && cd myapp
$ yarn create umi

# create 可以保证每次都是最新的，yarn create <starter-kit-package> [<args>]
# 全局安装 create-<starter-kit-package>，或更新包到最新版本（如果已存在）
# 执行新手工具包package.json中bin字段指向的程序，并向他转发所有的<args>
```

查看命令的 bin 地址`yarn global bin`

## 开发目录

### 开发阶段可以 mock 数据

<https://umijs.org/zh/guide/app-structure.html#mock>

### 全局布局，在路由外面套的一层路由，还是配置式的路由好一些，不然不好控制项目的结构

如果存在 `src/layouts/index.js` 文件就默认添加到最外层，除非重置这个文件。

### 默认的模板文件

`src/pages/document.ejs`

如果需要添加 cdn 库的时候，使用这种形式。

默认的模板文件在这里`https://github.com/umijs/umi/blob/master/packages/umi-build-dev/template/document.ejs`。

### src/global.(js|ts)

此文件会在入口文件的**最前面被自动引入**，可以在这里加载补丁，做一些初始化的操作等。

### src/app.(js|ts)

运行时配置文件，可以在这里**扩展运行时的能力**，比如修改路由、修改 render 方法等。

### .env

环境变量配置文件

## 路由

路由部分觉得还是直接声明式的比较好（config/config.router.js）。这里设置的规则太复杂。

### 动态路由

umi 里约定，带 \$ 前缀的**目录或文件为动态路由**。

也就是这里的动态匹配参数`$post -> /:post/`。

这里的参数在页面内是否可以拿到呢，当前页面肯定也知道当前页面的地址了，所以拿到拿不到无所谓了。

### 可选的动态路由，添加?也就是表示，可有可无

### 嵌套路由

umi 里约定目录下有 \_layout.js 时会生成嵌套路由，以 \_layout.js 为该目录的 layout 。

### 全局 layout

约定 src/layouts/index.js 为全局路由。

### 权限路由

umi 的权限路由是通过配置路由的 Routes 属性来实现。

<https://umijs.org/zh/guide/router.html#%E6%9D%83%E9%99%90%E8%B7%AF%E7%94%B1>

也就是使用 Routes 声明的组件包装一层。

### 路由动效

添加一定的效果

<https://umijs.org/zh/guide/router.html#%E8%B7%AF%E7%94%B1%E5%8A%A8%E6%95%88>

## 在页面间跳转

常用两种方式：

```js
// 1. 声明式;
import Link from 'umi/link';

export default () => <Link to="/list">Go to list page</Link>;
```

```js
// 2. 命令式;
import router from 'umi/router';

function goToListPage() {
  router.push('/list');
}
```

## 配置

umi 允许在 .umirc.js 或 config/config.js （二选一，.umirc.js 优先）中进行配置，支持 ES6 语法。

- .umirc.js
- config/config.js
- .umirc.local.js

[配置项文件](https://umijs.org/zh/config/#%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE)

主要有如下的配置：

- [plugin：配置插件列表。](https://umijs.org/zh/config/#plugins)
  - 这里的插件接受的参数；
  - [插件开发](https://umijs.org/zh/plugin/develop.html#%E5%88%9D%E5%A7%8B%E5%8C%96%E6%8F%92%E4%BB%B6)，该初始化方法会收到两个参数，第一个参数 api，umi 提供给插件的接口都是通过它暴露出来的。第二个参数 opts 是用户在初始化插件的时候填写的。
- routes
- disableRedirectHoist：禁用 redirect 上提。
- history：指定 history 类型，可选 browser、hash 和 memory。路由模式。
- outputPath：指定输出路径，默认值：./dist。
- base：指定 react-router 的 base，**部署到非根目录时需要配置**。这里就要看服务起的配置了。
- publicPath：默认值：/，指定 webpack 的 publicPath，指向静态资源文件所在的路径。指出相对地址。
- mountElementId： root，指定 react app 渲染到的 HTML 元素 id。
- hash：是否开启 hash 文件后缀。
- targets： **配置浏览器最低版本**，会自动引入 polyfill 和做语法转换，配置的 targets 会和合并到默认值，所以不需要重复配置。
- context： 配置全局 context，**会覆盖**到每个 pages 里的 [context](http://react.html.cn/docs/context.html)。Context 旨在共享一个组件树内可被视为 “**全局**” 的数据，例如当前**经过身份验证的用户**，**主题**或**首选语言**等。`const ThemeContext = React.createContext('light');`
- ssr: 用于服务端渲染（Server-Side Render）。
- chainWebpack：通过 webpack-chain 的 API [扩展或修改 webpack 配置。](https://umijs.org/zh/config/#chainwebpack)
- theme：配置主题，实际上是配 less 变量。
- treeShaking：默认值：false，tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。
- define：通过 webpack 的 DefinePlugin **传递给代码**，注入到代码中，值会自动做 JSON.stringify 处理。
- [externals](https://webpack.docschina.org/configuration/externals/)： 配置 代码 不打入代码。防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)。配置全局可用变量是在.eslintrc 中的 globals。**这里主要是说明，不打包的模块**。
- alias： 添加别名；设置相对地址。
- devServer
- devtool
- disableCSSModules
- disableCSSSourceMap
- copy： 定义需要单纯做复制的文件列表。
- manifest： 配置后会生成 asset-manifest.json。
- uglifyJSOptions： 配置传给 uglifyjs-webpack-plugin@2.x 的配置项。
- browserslist

## 配置模板

模板里可通过 context 来获取到 umi 提供的变量。

处理 loader 默认：

.js, .jsx, .mjs, .jsx, .json: 由 babel-loader 处理
.ts: 由 ts-loader 处理
.graphql, .gql: 由 graphql-tag/loader 处理
.css, .less, .sass: 由 css-loader, postcss-loader, less-loader 处理
.svg: 由 @svgr/core 处理。使用 umi，你可以用如下方式引入 svg
**所有其他未列出的模块，默认都会由 url-loader 处理**，所以在需要添加额外的 loader 的时候，需要设置排除文件。

## mock 数据

<https://umijs.org/zh/guide/mock-data.html#%E4%BD%BF%E7%94%A8-umi-%E7%9A%84-mock-%E5%8A%9F%E8%83%BD>

## Use umi with dva

内置 dva-loading 和 dva-immer，其中 dva-immer 需通过配置开启

model 分两类，一是全局 model，二是页面 model。全局 model 存于 /src/models/ 目录，所有页面都可引用；页面 model 不能被其他页面所引用。

- src/models/\*_/_.js 为 global model
- src/pages/**/models/**/\*.js 为 page model
- global model 全量载入，page model 在 production 时按需载入，在 development 时全量载入

### url 变化了，但页面组件不刷新，是什么原因

<https://umijs.org/zh/guide/with-dva.html#faq>

layouts/index.js 里如果用了 connect 传数据，需要用 umi/withRouter 高阶一下。

### 如何访问到 store 或 dispatch 方法

window.g_app.\_store
window.g_app.\_store.dispatch

这里 g_app 变量包含了很多的信息。

## 按需加载

出于性能的考虑，我们会对模块和组件进行按需加载。

- 按需加载组件,react-loadable
- 按需加载模块

```js
// require的按需加载，但不是条件判断加载
getComponent(nextState, cb) {
  require.ensure([], (require) => {
    I18N.load(I18N.getCurrentPath()).done(() => {
      cb(null, require('components/layer/HomePage'))
    })
  }, 'HomePage')
},
```

## 运行时配置

umi 约定 src 目录下的 app.js 为运行时的配置文件。

onRouteChange, 用于在初始加载和路由切换时做一些事情。

## 区块

在 umi 中，区块是快速搭建页面的代码片段。umi 定义了一个区块的规范，你可以开发自己的区块，也可以使用其它来源的区块。通过 umi 你能够快速简单的在你的项目中添加 umi 区块，用于快速初始化代码。

需要注意的是，区块只是用于开发时新建页面时的提效工具，一般来说区块要实际应用都需要针对项目需求去修改最后的代码，之后的维护都将和普通页面一样由开发者来维护，**不存在区块更新的说法**。

## 部署

### 部署 html 到非根目录

<https://umijs.org/zh/guide/deploy.html#%E9%83%A8%E7%BD%B2-html-%E5%88%B0%E9%9D%9E%E6%A0%B9%E7%9B%AE%E5%BD%95>

可通过配置 base 解决。

dynamic: n，动态。adj，动态的，按需的。

## UI 插件开发

## FAQ

### 查看 umi 的依赖版本

`umi -v --verbose`

### 如何引入 @babel/polyfill

### 如何配置额外的 loader

<https://umijs.org/zh/guide/faq.html#%E5%A6%82%E4%BD%95%E9%85%8D%E7%BD%AE%E9%A2%9D%E5%A4%96%E7%9A%84-loader>

1. 添加 url-loader 的 exclude
2. 添加文件的处理 loader

## .env 和环境变量

[环境变量参数](https://umijs.org/zh/guide/env-variables.html#env-%E5%92%8C%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F)

### UMI_ENV

- .umirc.local.js，开发模式下 .umirc.local.js 或者 config/config.local.js 中的配置永远是优先级最高的。
- .umirc.js，基础配置，会被覆盖
- .umirc.prod.js，需要指定 UMI_ENV=prod

---
title: 前端常用框架对比
date: 2020-2-6
tags:
  - 框架
  - 类库
  - React
  - Vue
  - Angular
  - jQuery
categories:
  - [框架]
  - [React]
  - [Vue]
  - [Angular]
  - [jQuery]
---

## 目标

1. 对比异同，更深刻的理解其中的原理；
2. 找到工作中最合适的工具，提高开发效率；
3. 对于常用的操作，进行一些**对比总结**；

## 对比 React 与 Vue

1. 定性：
   1. React 是用于**构建用户界面的 JavaScript 库**。
   2. Vue (读音 /vjuː/，类似于 view) 是**一套用于构建用户界面的渐进式框架**。
2. 数据流方面：
   1. React单向数据流：更清晰，方便控制；
   2. Vue双向数据绑定：操作更方便，太多的 watch、computered 容易引起混乱；
      1. 但是也可以使用单向数据流进行开发；
3. 渲染机制上：都有虚拟 dom，都有 diff 算法；
   1. react 完全使用虚拟 dom+diff 算法实现页面渲染；
   2. Vue **主要还是数据劫持**，**虚拟 dom 只是为了批量更新**；
4. 组件写法上：
   1. React 可以对组件做的更小，更容易切分，语法上也更流畅，jsx->js；
      1. 这里主要是stateLess组件的功劳；
   2. Vue 就把模板与渲染逻辑混在了一起，还有css，组件一般都写的代码比较多；
5. 设计思想上看：
   1. **react 主张函数式编程**，所以推崇**纯组件**，数据不可变，**单向数据流**，当然需要双向的地方也可以手动实现，比如借助 onChange 和 setState 来实现一个双向的数据流。
   2. 而 Vue 是**基于可变数据的，支持双向绑定**，**它提供了 v-model** 这样的指令来实现**文本框**的数据流双向绑定。

## 可能会遇到的问题

### 1.react Vue angular 对比，简要说明

### 2. React 对比 jQuery ｜ react 的优势表现在哪些方面与传统的 jq，js 手动渲染页面，优势的方面的具体场景，dom 更新过程对比

1. 可以**保证代码效率**，大部分情况下哦，效率都是可以的；
2. 使您可以从**属性操作、事件处理和手动 DOM 更新**这些在构建应用程序时必要的操作中**解放出来**；
3. react，vue 组件化开发的优势；
4. 维护的优势；
5. jquery 对比 react vue。好比 c 语言比 java；

### React 和 Vue 的区别

## jQuery

jQuery 是一个高效、精简并且功能丰富的 **JavaScript 工具库**。

1. 它提供的 API 易于使用且兼容众多浏览器，这让诸如
2. HTML 文档遍历和操作、
3. 事件处理、
4. 动画和
5. Ajax 操作

更加简单。

## MVVM(Model-View-ViewModel) || 数据双向绑定

MVVM 就是比 MVC 多一个数据绑定功能，但这数据绑定功能是非常难实现。

- V->VM, VM<->M
- **采用双向数据绑定：View 和 ViewModel 的变动都会相互映射到对象上面**
- Angular

MVVM 由以下三个内容组成：

- `View`：界面
- `Model`：数据模型
- `ViewModel`：作为桥梁负责沟通 `View` 和 `Model`

1. 在 JQuery 时期，如果需要刷新 UI 时，需要**先取到对应的 DOM 再更新 UI**，这样数据和业务的逻辑就和页面有强耦合。

2. 在 MVVM 中，**UI 是通过数据驱动的**，数据一旦改变就会相应的刷新对应的 UI，UI 如果改变，也会改变对应的数据。这种方式就可以在业务处理中只关心数据的流转，而无需直接和页面打交道。**ViewModel 只关心数据和业务的处理，不关心 View 如何处理数据**，在这种情况下，View 和 Model 都可以独立出来，任何一方改变了也不一定需要改变另一方，并且可以将一些可复用的逻辑放在一个 ViewModel 中，让多个 View 复用这个 ViewModel。
3. **在 MVVM 中，最核心的也就是数据双向绑定**，例如 Angluar 的脏数据检测，Vue 中的数据劫持。

### angular 脏数据检测

1. **当触发了指定事件**后会进入**脏数据检测**，这时会调用 $digest 循环遍历所有的数据观察者，判断当前值是否和先前的值有区别，如果检测到变化的话，会调用 $watch 函数，然后再次调用 \$digest 循环直到发现没有变化。循环至少为二次 ，至多为十次
2. 脏数据检测虽然存在低效的问题，但是不关心数据是通过什么方式改变的，都可以完成任务，但是这在 Vue 中的双向绑定是存在问题的。并且脏数据检测可以实现批量检测出更新的值，再去统一更新 UI，大大减少了操作 DOM 的次数

### Vue 数据劫持

- `Vue` 内部使用了 `Obeject.defineProperty()` 来实现**双向绑定**，通过这个函数可以监听到 `set` 和 `get`的事件。

## 比较 Angular、React、Vue

1. Angular 是一个**应用设计框架与开发平台**，用于创建高效、复杂、精致的单页面应用。
2. React 是用于**构建用户界面的 JavaScript 库**。
3. Vue (读音 /vjuː/，类似于 view) 是**一套用于构建用户界面的渐进式框架**。

### 1.介绍

#### angular

- Angular 是基于 TypeScript 的 **Javascript 框架**，由 Google 进行开发和维护。
- Angular**让你有效掌控可伸缩性**。基于 RxJS、Immutable.js 和其它推送模型，能适应海量数据需求。
- **数据双向绑定**：脏检测，Angular 一直基于值检测的这个原则来更新组件及界面的。Angular 的变更基于两个状态的对比，如果有变化，那么 Angular 就会执行组件及界面更新。

#### react

- React 被描述为 “用于**构建用户界面**的 JavaScript **库**”。
- React Fiber。它会改变 React 的底层 - 渲染速度应该会更快 - 但是在变化之后，版本会向后兼容。
- **dom diff**极致，比较新的 vDom 与旧的 vDom 的改变来改变实际的 dom 节点。

#### Vue

- Vue 将自己描述为一款“用于构建直观，快速和组件化交互式界面的**MVVM 框架**”。
- 数据双向绑定：**数据劫持** + **发布者-订阅者模式**（vue.js）

### 2.设计思想

1. **react 主张函数式编程**，所以推崇**纯组件**，数据不可变，**单向数据流**，当然需要双向的地方也可以手动实现，比如借助 onChange 和 setState 来实现一个双向的数据流。

2. 而 Vue 是**基于可变数据的，支持双向绑定**，**它提供了 v-model** 这样的指令来实现**文本框**的数据流双向绑定。

### 3.组件

1. React 和 Vue 都擅长处理组件：小型的无状态的函数接收输入和返回元素作为输出。

### 4.语法：Typescript，ES6 与 ES5

1. React 专注于使用 Javascript ES6。
2. Vue 使用 Javascript ES5 或 ES6。
3. Angular **依赖于 TypeScript**。

### 5.模板 —— JSX 还是 HTML

#### JSX 语法与 html 模板

**分离模板和逻辑仅仅是技术的分离**，而不是关注的分离。你应该构建组件而不是模板。组件是可重用的、可组合的、可单元测试的。

### 6.框架和库

1. Angular **是一个框架而不是一个库**，因为它提供了**关于如何构建应用程序的强有力的约束**，并且还提供了**更多开箱即用的功能**。Angular 是一个 “**完整的解决方案**” 功能齐全，你可以愉快的开始开发。

2. Vue 似乎是三个框架中**最轻量的**。Vue.js 完美的兼顾了**它将为你做什么和你需要做什么**。（...）Vue.js 始终是可及的，一个坚固，但灵活的安全网，保证编程效率和把操作 DOM 造成的痛苦降到最低。

3. React “是 JS 界在**意识层面**向前迈出的一大步，它以一种实用简洁的方式向人们展示了真正的**函数式编程**。和 Vue 相比，**React 的一大缺点是由于 JSX 的限制，组件的粒度会更小**。

### 7.数据绑定

#### Vue 是实现了双向数据绑定的 mvvm 框架

在 Vue 中，使用了**双向绑定技术**，就是 View 的变化能实时让 Model 发生变化，而 Model 的变化也能实时更新到 View。

Vue 采用**数据劫持**&**发布-订阅模式**的方式，vue 在创建 vm 的时候，**会将数据配置在实例当中**，然后通过`Object.defineProperty`对数据进行操作，`为数据动态添加了getter与setter方法`，当获取数据的时候会触发对应的 getter 方法，当设置数据的时候会触发对应的 setter 方法，从而进一步**触发 vm 的 watcher 方法**，然后数据更改，vm 则会进一步触发视图更新操作。

#### react 是单向数据流

react 中**属性是不允许更改的**，状态是允许更改的。

**tips：通过直接修改 this.state，可以实现 state 改变，而不用触发渲染到页面中**。

### 8.diff 算法，拿到差异的数据来渲染页面

#### Vue 中 diff 算法实现流程

1. 在内存中构建**虚拟 dom 树（少于真实 dom 节点属性的 js 对象）**；
2. 将内存中虚拟 dom 树渲染成真实 dom 结构；
3. 数据改变的时候，将之前的虚拟 dom 树结合新的数据生成新的虚拟 dom 树；
4. **将此次生成好的虚拟 dom 树和上一次的虚拟 dom 树进行一次比对**（diff 算法进行比对），来更新只需要被替换的 DOM，而**不是全部重绘**。在 Diff 算法中，只平层的比较前后两棵 DOM 树的节点，没有进行深度的遍历。
5. 会将对比出来的差异进行重新渲染；

#### react 中 diff 算法实现流程

1. DOM 结构发生改变-----**直接卸载并重新 create**（createElement）；
2. DOM 结构一样-----不会卸载,但是会 update 变化的内容；
3. 所有**同一层级的子节点，他们都可以通过 key 来区分**-----同时遵循 1.2 两点
   （其实这个 key 的存在与否**只会影响 diff 算法的复杂度**，换言之,你不加 key 的情况下，diff 算法就会以暴力的方式去根据一二的策略更新，但是你加了 key，diff 算法会引入一些另外的操作）。
4. React 会**逐个对节点进行更新**，转换到目标节点。而**最后插入新的节点，涉及到的 DOM 操作非常多**。diff 总共就是**移动、删除、增加**三个操作，而如果给每个节点唯一的标识（key），那么 React 优先采用移动的方式，能够找到正确的位置去插入新的节点。
5. Vue 会跟踪每一个**组件的依赖关系**，不需要重新渲染整个组件树。**而对于 React 而言，每当应用的状态被改变时，全部组件(使用到这个 state 的组件)都会重新渲染`render()`，**，**所以 react 中会需要 `shouldComponentUpdate` 这个生命周期函数方法来进行控制，而 Vue 不需要。**

### 9.状态管理和数据绑定

#### react 的状态管理工具 redux

React 经常与 **Redux** 在一起使用。

Redux 以**三个基本原则**来自述：

- 单一数据源（Single source of truth）
- State 是只读的（State is read-only）
- 使用**纯函数（没有副作用）**执行修改（Changes are made with pure functions）

换句话说：

- 整个应用程序的状态存储在**单个 store 的状态树**中。这有**助于调试应用程序**，一些功能更容易实现。
- 状态是**只读的**，只能通过 **action 来改变**，以避免**竞争条件**（这也有助于调试）。编写 **Reducer** 来指定如何通过 action 来转换 state。

#### react 常用的另一个状态管理工具 Mobx

Mobx,你可以把它看作是一个 “**自动的 Redux**”。

#### Vue 的 redux -> vuex

Vue 可以使用 Redux，但它提供了 Vuex 作为自己的解决方案。

### 10.数据流向，单向数据流与双向绑定

React 和 Angular 之间的巨大差异是 **单向与双向绑定**。

当 UI 元素（例如，用户输入）被更新时，Angular 的**双向绑定改变 model 状态**。React 只有一种方法：先更新 model，然后渲染 UI 元素。

Angular 的方式**实现起来代码更干净**，开发人员更容易实现。React 的方式会**有更好的数据总览**，因为数据只能在一个方向上流动（这使得调试更容易）。

### 11.性能优化

#### Vue 中的每个组件内部自动实现了 shouldComponentUpdate 的优化

在 Vue 里面由于依赖追踪系统的存在，**当任意数据变动的时**，**Vue 的每一个组件都精确地知道自己是否需要重绘**，所以并不需要手动优化。

而在 react 中我们需要手动去优化其性能，但是**当数据特别多的时候**Vue 中的 **watcher 也会特别多**，从而造成页面卡顿，所以**一般数据比较多的大型项目会倾向于使用 react**。

#### 在 react 中，当 props 或 state 发生改变的时候会触发 shouldComponentUpdate 生命周期函数

shouldComponentUpdate 返回 true 与 false 来控制是否重新渲染。

我们也可以创建一个继承 React.PureComponent 的 React 组件，它自带
shouldComponentUpdate，**可以对 props 进行浅比较**，发现更新之后的 props 与当前的 props 一样，就不会进行 render 了。

由于 React.PureComponent 进行的是浅比较（只能比较基本类型，不能比较引用类型），也就是说它只会对比原对象的**值是否相同**，当我们的 props 或 state 为**数组或者对象这种引用类型的时候**，我们修改它的数值，由于**数据引用指针没有发生改变**，所以组件也是不会重新渲染的。**所以在 state 是基本类型的时候，最好使用 PureComponent**。

### 12.ssr 服务端渲染

服务端渲染核心在于**方便 seo 优化**，**后端先调用数据库**，获得数据之后，将数据和页面元素进行拼装，组合成完整的 html 页面，再直接返回给浏览器，以便用户浏览。

服务端渲染支持流式渲染，因为 HTTP 请求也是流式。

#### Vue 实现方式

Nuxt.js

服务端渲染支持流式渲染，因为 HTTP 请求也是流式，Vue 的服务端渲染结果可以直接 pipe 到返回的请求里面。这样一来，就可以更早地在浏览器中呈现给用户内容，通过合理的缓存策略，可以有效地提升服务端渲染的性能。

#### react 实现方式

Next.js，允许使用 React 构建 SSR 和静态 web 应用。

### 13.组件销毁

react 执行完 componentWillUnmount 之后**把事件、数据、dom 都全部处理掉**了，也就是说当父组件从渲染这个子组件变成不渲染这个子组件的时候，**子组件相当于被销毁**，所以根本不需要其他的钩子函数了。

react 销毁组件的时候，会将组件的 dom 结构也移除，vue 则不然，**在调用 destory 方法销毁组件的时候，组件的 dom 结构还是存在于页面中的**，this.\$destory 组件结构还是存在的，**只是移除了事件监听**，

所以这就是为什么 Vue 中有 destroyed，而 react 却没有 componentDidUnmount。

### 14.体积和性能

任何框架都不会十全十美：Angular 框架非常臃肿。gzip 文件大小为 143k，而 Vue 为 23K，React 为 43k。

为了提高性能，**React 和 Vue 都使用了虚拟 DOM（Virtual DOM）**。

JSX 背后的虚拟 DOM 技术，虽然事实证明**虚拟 DOM 不会带来性能的巨大优势**，**但保证了你怎么写其性能不会太差**。

Vue 有着很好的性能和高深的内存分配技巧。如果比较快慢的话，这些框架都非常接近

### 15.测试

### 16.通用与原生 app

通用 app 正在将应用程序引入 web、搬上桌面，同样将深入原生 app 的世界。

React 和 Angular 都支持原生开发。Angular 拥有用于原生应用的 NativeScript（由 Telerik 支持）和用于混合开发的 Ionic 框架。

借助 React，你可以试试 react-native-renderer 来构建跨平台的 iOS 和 Android 应用程序，或者用 react-native 开发原生 app。许多 app（包括 Facebook；查看更多的展示）都是用 react-native 构建的。

Javascript 框架在客户端上渲染页面。这对于性能，整体用户体验和 SEO 是不利的。服务器端预渲染是一个好办法。所有这三个框架都有相应的库来实现服务端渲染。React 有 next.js，Vue 有 nuxt.js

### 17.虚拟 dom

所谓的 Virtual DOM 基本上说就是它名字的意思：**虚拟 DOM，DOM 树的虚拟表现**。

**它的诞生是基于这么一个概念：改变真实的 DOM 状态远比改变一个 JavaScript 对象的花销要大得多。**

Virtual DOM 是一个**映射真实 DOM 的 JavaScript 对象**，如果需要改变任何元素的状态，那么是先在 Virtual DOM 上进行改变，而不是直接改变真实的 DOM。当有变化产生时，**一个新的 Virtual DOM 对象会被创建并计算新旧 Virtual DOM 之间的差别**。之后这些差别会**应用（diff 算法）**在真实的 DOM 上。

计算差异的算法是高性能框架的秘密（diff 算法）所在，React 和 Vue 在实现上有点不同。

Vue 宣称可以更快地计算出 Virtual DOM 的差异，这是由于它在渲染过程中，会**跟踪（数据劫持）**每一个组件的依赖关系，不需要重新渲染整个组件树。

### 18.React 与 Vue 都鼓励组件化应用

这本质上说，是建议你**将你的应用分拆成一个个功能明确的模块**，每个模块之间可以通过合适的方式互相联系。

### 19.React 和 Vue 都有自己的构建工具，你可以使用它快速搭建开发环境

React 可以使用 Create React App (CRA)，而 Vue 对应的则是 Vue-cli。
两个工具都能让你得到一个根据最佳实践设置的项目模板。

### 20.React 和 Vue 都有很好的 Chrome 扩展工具去帮助你找出 bug

它们会检查你的应用，让你看到 Vue 或者 React 中的变化。
你也可以看到应用中的状态，并实时看到更新。

## 参考文档

[2017 年比较 Angular、React、Vue 三剑客](https://zhuanlan.zhihu.com/p/31224434)
[Vue、React 和 Angular 横向比对（数据对比）](https://segmentfault.com/a/1190000017538208)

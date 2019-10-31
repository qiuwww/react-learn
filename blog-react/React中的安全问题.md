# React 中的安全问题

## ReactJS 中的代码注入

React 已经实现了绝大部分的客户端逻辑（比如说 React 能自动编码字符串），因此开发者大抵不用担心 XSS 攻击。只要合理使用 React，你的应用就不会有太大的安全隐患。

然而这些防御措施还是会因为坏的编程习惯而失效，比方说：

- 使用客户端提供的对象来创建 React 组件
- 通过用户提供的 href 或者其它可注入的属性来渲染链接
- 在 React 中使用 [dangerouslySetInnerHTML](https://zh-hans.reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- 把用户提供的数据传给 eval()

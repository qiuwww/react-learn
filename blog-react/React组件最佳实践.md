# React 组件的最佳实践

## 优先使用 React Hooks 实现函数组件

参考`react-features-test/src/page/hooks`;

最好优先创建函数组件，相对于 class 定义的组件。

Hooks 允许你复用状态逻辑，而无需更改组件层次结构。

## 避免重复代码，或者类似结构的代码

发现类似结构的代码，最好写成组件，方便以后修改及测试，注意切分功能组件。

## 属性读取，多用解构

避免在一个函数内，多次调用`this.state`及`this.props`之类的进行操作。

## 添加类型检查

PropTypes，限制传入的 props 的类型

[使用 PropTypes 进行类型检查](https://react.docschina.org/docs/typechecking-with-proptypes.html)

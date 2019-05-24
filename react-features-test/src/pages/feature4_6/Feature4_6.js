import React, { Component } from "react";

export default class Feature4_6 extends Component {
  render() {
    return [
      <h2 key="h2">v16.4 ~ 16.6的新特性</h2>,
      <ul>
        <li>
          fix生命周期函数 - getDerivedStateFromProps: 在mounting和new
          props的时候触发，也就是整合了初始的挂载与更新
        </li>
        <li>
          Profiler DevTools:
          收集每个组件的渲染耗时，来帮助我们找到ReactApp的渲染瓶颈
        </li>
        <li>
          如果你想阻止组件的重复渲染，在class component里可以使用PureComponent,
          shouldComponentUpdate来帮助你。 React.PureComponent 类似于
          React.Component。
          
          它们的不同之处在于React.Component 没有实现
          shouldComponentUpdate()，但是
          React.PureComponent实现了它。采用对属性和状态用浅比较的方式。
        </li>
        <li>
          memo: 用于阻止无状态组件的重复渲染。为了全面拥抱function
          component,React团队写了memo来帮助function
          component实现这个阻止重复渲染的功能。
          <a href="https://react.docschina.org/docs/react-api.html#reactmemo">
            React.memo 文档
          </a>
        </li>
      </ul>
    ];
  }
}

/**
 * @description 属性代理实现高阶组件示例
 * @abstract 函数返回一个我们自己定义的组件，然后在 render中返回要包裹的组件，这样我们就可以代理所有传入的 props，并且决定如何渲染，实际上 ，这种方式生成的高阶组件就是原组件的父组件。
   对比原生组件增强的项：
    - 可操作所有传入的 props
    - 可操作组件的生命周期
    - 可操作组件的 static 方法
    - 获取 refs
 */

// 基于属性代理：操作组件的props
// 添加新的属性和方法，也就是对原组件进行了扩展
// 复用方法，这里的state定义的当前loading的属性，也就是两个事件

import React, { Component } from 'react';
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
const PropsProxy = WrappedComponent => {
  return class ppHOC extends Component {
    static displayName = `HOC(${getDisplayName(WrappedComponent)})`;
    constructor(props) {
      super(props);
      // 给每一个使用这个高阶组件的组件添加一个内置的属性，共用了属性和方法
      this.state = {
        value: '',
      };
      this.onNameChange = this.onNameChange.bind(this);
    }
    onNameChange(event) {
      this.setState({
        value: event.target.value,
      });
    }
    render() {
      const newProps = {
        name: {
          value: this.state.name,
          onChange: this.onNameChange,
        },
      };
      return (
        // 给所有使用这个高阶组件的组件，都添加一个外边框，共用样式
        <div style={{ border: '2px solid blue' }}>
          {/* 可以操作Wrapcomponent的props */}
          <WrappedComponent {...this.props} {...newProps} />
          <p>数据展示: {this.state.value}</p>
        </div>
      );
    }
  };
};
export default PropsProxy;

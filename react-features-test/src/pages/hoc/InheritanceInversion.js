/**
 * @desc: 反向继承高阶组件示例
 * @abstract: 返回一个组件，继承原组件，在 render中调用原组件的 render。由于继承了原组件，能通过this访问到原组件的 生命周期、props、state、render等，相比属性代理它能操作更多的属性。
 * 对比原生组件增强的项：
    - 可操作所有传入的 props
    - 可操作组件的生命周期
    - 可操作组件的 static方法
    - 获取 refs
    - 可操作 state
    - 可以渲染劫持
 */
// 基于反向继承：拦截生命周期、state、渲染过程
// 渲染劫持，操作state
import React, { Component } from 'react';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
const InheritanceInversion = WrappedComponent => {
  console.log('原组件', WrappedComponent);
  return class iiHOC extends WrappedComponent {
    static displayName = `HOC(${getDisplayName(WrappedComponent)})`;
    // 拦截生命周期
    componentDidMount() {
      console.log('iiHOC this.state', this.state);
    }

    render() {
      // 如果 this.props.loggedIn 是 true，这个高阶组件会原封不动地渲染 WrappedComponent，如果不是 true 则不渲染
      // 直接调用原render函数，这里也可以更改渲染视图
      if (this.props.loggedIn) {
        return (
          <div>
            {/* 高阶组件可以 『读取、修改、删除』WrappedComponent 实例的 state，如果需要也可以添加新的 state。 */}
            <h2>HOC Debugger Component</h2>
            <p>Props</p> <pre>{JSON.stringify(this.props, null, 2)}</pre>
            <p>State</p>
            <pre>{JSON.stringify(this.state, null, 2)}</pre>
            {super.render()}
          </div>
        );
      } else {
        return <div style={{ border: '3px solid green' }}>你还没有登录!{this.props.name}</div>;
      }
    }
  };
};
export default InheritanceInversion;

// 基于反向继承：拦截生命周期、state、渲染过程
// 渲染劫持，操作state
import React, { Component } from "react";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
const InheritanceInversion = Wrapcomponent => {
  console.log("原组件", Wrapcomponent);
  return class iiHOC extends Wrapcomponent {
    static displayName = `HOC(${getDisplayName(Wrapcomponent)})`;
    // 拦截生命周期
    componentDidMount() {
      console.log("iiHOC this.state", this.state);
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
        return (
          <div style={{ border: "3px solid green" }}>
            你还没有登录!{this.props.name}
          </div>
        );
      }
    }
  };
};
export default InheritanceInversion;

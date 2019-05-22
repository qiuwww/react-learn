import React, { Component } from "react";

// 目标组件
class UseContent extends Component {
  componentWillMount() {
    console.log("UseContent willMount");
  }
  render() {
    console.log("UseContent props:", this.props);
    return (
      <div>
        {this.props.title} - {this.props.name}
      </div>
    );
  }
}
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
const ExampleHoc = WrappedComponent => {
  // 这里可以使用class类型的组件，当然也可以是无状态的
  return class ExampleHoc extends Component {
    constructor(props) {
      super(props);
      this.state = {
        title: "hoc-component",
        name: "ExampleHoc"
      };
      ExampleHoc.displayName = `ExampleHoc(${getDisplayName(
        WrappedComponent
      )})`;
    }
    componentWillMount() {
      console.log("ExampleHoc willMount");
    }
    render() {
      console.log("ExampleHoc props:", this.props);
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  };
};

const TargetComponent = ExampleHoc(UseContent);

export default class Hoc extends Component {
  render() {
    return (
      <div className="higher-order-component">
        <ul className="description">
          <li>
            高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC
            自身不是 React API 的一部分，它是一种基于 React
            的组合特性而形成的设计模式。
          </li>
          <li>具体而言，高阶组件是参数为组件，返回值为新组件的函数。</li>
          <li>
            const EnhancedComponent = higherOrderComponent(WrappedComponent);
          </li>
          <li>
            HOC 在 React 的第三方库中很常见，例如 Redux 的 connect 和 Relay 的
            createFragmentContainer。
          </li>
          <li>属性代理。 高阶组件通过被包裹的React组件来操作props</li>
          <li>反向继承。 高阶组件继承于被包裹的React组件</li>
        </ul>
        <div className="hoc">
          <TargetComponent title={"TargetComponent1"} />
          <TargetComponent title={"TargetComponent2"} />
          <TargetComponent title={"TargetComponent3"} />
        </div>
      </div>
    );
  }
}

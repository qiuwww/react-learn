import React, { Component } from 'react';
import PropsProxy from './PropsProxy.js';
import InheritanceInversion from './InheritanceInversion.js';
// 1.基于属性代理
@PropsProxy
class Input extends React.Component {
  static displayName = 'Input';
  render() {
    return <input name="name" {...this.props.name} />;
  }
}
// 使用函数来操作
class TextAreaBase extends React.Component {
  static displayName = 'TextAreaBase';
  render() {
    return <textarea name="name" {...this.props.name}></textarea>;
  }
}
const TextArea = PropsProxy(TextAreaBase);

// 2.反向继承的形式
// 定义的基础组件
// @ts-ignore
@InheritanceInversion
class UserPanel extends Component {
  static displayName = 'UseContent';
  state = {
    skip: 1,
  };
  addSkip = () => {
    this.setState({
      skip: this.state.skip + 1,
    });
  };
  componentDidMount() {
    // 本来应该打印，结果是展示了一条信息
    console.log('UseContent componentDidMount');
  }
  render() {
    console.log('UseContent props:', this.props);
    return (
      <React.Fragment>
        <div>{this.props.name}</div>
        <button onClick={this.addSkip}>调整skip</button>
      </React.Fragment>
    );
  }
}

export default class Hoc extends Component {
  render() {
    return (
      <div className="higher-order-component">
        <ul className="description">
          <li>
            高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API
            的一部分，它是一种基于 React 的组合特性而形成的设计模式。
          </li>
          <li>具体而言，高阶组件是参数为组件，返回值为新组件的函数。</li>
          <li>const EnhancedComponent = higherOrderComponent(WrappedComponent);</li>
          <li>
            HOC 在 React 的第三方库中很常见，例如 Redux 的 connect 和 Relay 的
            createFragmentContainer。
          </li>
          <li>属性代理。 高阶组件通过被包裹的React组件来操作props</li>
          <li>反向继承。 高阶组件继承于被包裹的React组件</li>
        </ul>
        <div className="hoc">
          <h2>属性代理</h2>
          <Input></Input>
          <TextArea></TextArea>
          <UserPanel loggedIn={true} name="qiu"></UserPanel>
          <UserPanel loggedIn={false} name="wei"></UserPanel>
          {/* <TargetComponent title={"TargetComponent1"} /> */}
          {/* <TargetComponent2 title={"TargetComponent2"} /> */}
          {/* <TargetComponent3 title={"TargetComponent3"} /> */}
          {/* <TargetComponent4 title={"TargetComponent4"} /> */}
        </div>
      </div>
    );
  }
}

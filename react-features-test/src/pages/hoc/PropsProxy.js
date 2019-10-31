// 基于属性代理：操作组件的props
// 添加新的属性和方法，也就是对原组件进行了扩展
// 复用方法，这里的state定义的当前loading的属性，也就是两个事件

import React, { Component } from "react";

const PropsProxy = Wrapcomponent => {
  return class ppHOC extends Component {
    constructor(props) {
      super(props);
      // 给每一个使用这个高阶组件的组件添加一个内置的属性，共用了属性和方法
      this.state = {
        value: ""
      };
      this.onNameChange = this.onNameChange.bind(this);
    }
    onNameChange(event) {
      this.setState({
        value: event.target.value
      });
    }
    render() {
      const newProps = {
        name: {
          value: this.state.name,
          onChange: this.onNameChange
        }
      };
      return (
        // 给所有使用这个高阶组件的组件，都添加一个外边框，共用样式
        <div style={{ border: "2px solid blue" }}>
          <Wrapcomponent {...this.props} {...newProps} />
          <p>数据展示: {this.state.value}</p>
        </div>
      );
    }
  };
};
export default PropsProxy;

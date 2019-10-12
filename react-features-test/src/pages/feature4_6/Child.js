import React, { Component } from "react";

export default class Child extends Component {
  constructor(props) {
    super(props);
    this.state = { numb: 0 };
    console.log("Child constructor", this.state, this.props);
  }
  componentWillMount() {
    console.log("Child componentWillMount", this.state, this.props);
  }
  componentDidMount() {
    console.log("Child componentDidMount", this.state, this.props);
  }
  componentWillReceiveProps(nextProps, nextState) {
    console.log("Child componentWillReceiveProps", nextProps, nextState);
    // do something
    // return obj, 生成一个新的 extends state
    return null;
  }
  componentWillUpdate() {
    console.log("Child componentWillUpdate", this.state, this.props);
  }
  componentDidUpdate() {
    console.log("Child componentDidUpdate", this.state, this.props);
  }
  componentWillUnmount() {
    console.log("Child componentWillUnmount", this.state, this.props);
  }

  handleClick = e => {
    this.setState({
      numb: this.state.numb + 1
    });
  };
  render() {
    return (
      <div>
        <button onClick={this.handleClick}>子组件触发事件</button>
        <p>父组件：{this.props.numb}</p>
        <p>子组件：{this.state.numb}</p>
      </div>
    );
  }
}

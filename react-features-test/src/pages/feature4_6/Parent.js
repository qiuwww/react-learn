import React, { Component } from "react";
import Child from "./Child";
export default class Parent extends Component {
  constructor(props) {
    super(props);
    this.state = { numb: 0 };
    console.log("Parent constructor", this.state, this.props);
  }
  componentWillMount() {
    console.log("Parent componentWillMount", this.state, this.props);
  }
  componentDidMount() {
    console.log("Parent componentDidMount", this.state, this.props);
  }
  componentWillReceiveProps(nextProps, nextState) {
    console.log("Parent componentWillReceiveProps", nextProps, nextState);
    // do something
    // return obj, 生成一个新的 extends state
    return null;
  }
  componentWillUpdate() {
    console.log("Parent componentWillUpdate", this.state, this.props);
  }
  componentDidUpdate() {
    console.log("Parent componentDidUpdate", this.state, this.props);
  }
  componentWillUnmount() {
    console.log("Parent componentWillUnmount", this.state, this.props);
  }
  handleClick = e => {
    this.setState({
      numb: this.state.numb + 1
    });
  };
  render() {
    return (
      <div style={{ border: "1px solid red" }}>
        <button onClick={this.handleClick}>父组件触发事件</button>
        <Child handleClick={this.handleClick} numb={this.state.numb}></Child>
      </div>
    );
  }
}

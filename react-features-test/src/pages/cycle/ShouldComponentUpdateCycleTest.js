import React, { Component, PureComponent } from "react";

// 一般的组件是没有
class GeneralComponent extends Component {
  state = {};
  constructor(props) {
    super(props);
    console.log("GeneralComponent, constructor: ", this);
  }
  componentWillMount() {
    console.log("GeneralComponent, componentWillMount");
  }
  componentDidMount() {
    console.log("GeneralComponent, componentDidMount");
  }
  componentWillUpdate() {
    console.log("GeneralComponent, componentWillUpdate");
  }
  componentWillReceiveProps(nextProps, props) {
    console.log(
      "GeneralComponent, componentWillReceiveProps",
      nextProps,
      props
    );
  }
  shouldComponentUpdate() {
    console.log("GeneralComponent, shouldComponentUpdate");
    // 如果一直是false，就会一直不渲染
    // return false;
    // 如果一直返回true，就会一直更新，而不管是否有状态引用
    // return true;
    if (this.props.number % 2) {
      return true;
    } else {
      return false;
    }
  }
  componentDidUpdate() {
    console.log("GeneralComponent, componentDidUpdate");
  }

  // 测试新的生命周期
  // 会在调用 render 方法之前调用，并且在初始挂载及后续更新时都会被调用。它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。
  // GeneralComponent uses getDerivedStateFromProps() but also contains the following legacy lifecycles: 这里不应该与will...一起用

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(
      "GeneralComponent, componentWillReceiveProps",
      nextProps,
      prevState
    );
  }
  // 这里数据不改变的时候，也是不回去重新渲染的
  render() {
    console.log("GeneralComponent, render");
    return [
      "GeneralComponent",
      <p key="GeneralComponent">{JSON.stringify(this.props)}</p>,
      <p key="number">number: {this.props.number}</p>
    ];
  }
}

export default class ShouldComponentUpdateCycleTest extends PureComponent {
  state = {
    number: 1
  };
  constructor(props) {
    super(props);
    console.log("ShouldComponentUpdateCycleTest, constructor: ", this);
  }
  componentWillMount() {
    console.log("ShouldComponentUpdateCycleTest, componentWillMount");
  }
  componentDidMount() {
    console.log("ShouldComponentUpdateCycleTest, componentDidMount");
    setInterval(() => {
      this.setState({
        // number: this.state.number + 1
        number: this.state.number
      });
    }, 2000);
  }
  componentWillUpdate() {
    console.log("ShouldComponentUpdateCycleTest, componentWillUpdate");
  }
  componentWillReceiveProps(nextProps, props) {
    console.log(
      "ShouldComponentUpdateCycleTest, componentWillReceiveProps",
      nextProps,
      props
    );
  }
  // pureComponent是没有这个生命周期的
  // shouldComponentUpdate() {
  //   console.log("ShouldComponentUpdateCycleTest, shouldComponentUpdate");
  // }
  componentDidUpdate() {
    console.log("ShouldComponentUpdateCycleTest, componentDidUpdate");
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(
      "GeneralComponent, componentWillReceiveProps",
      nextProps,
      prevState
    );
  }
  render() {
    console.log("ShouldComponentUpdateCycleTest, render");
    return [
      "ShouldComponentUpdateCycleTest",
      <p key="props">{JSON.stringify(this.props)}</p>,
      <GeneralComponent key="GeneralComponent" number={this.state.number} />,
      <p key="number">number: {this.state.number}</p>
    ];
  }
}

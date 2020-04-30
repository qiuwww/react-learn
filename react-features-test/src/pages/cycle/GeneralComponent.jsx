import React, { Component, PureComponent } from 'react';

// 一般的组件是没有
//
export default class GeneralComponent extends Component {
  state = {};
  constructor(props) {
    super(props);
    console.log('GeneralComponent, constructor: ', this);
  }

  // 测试新的生命周期
  // 会在调用 render 方法之前调用，并且在初始挂载及后续更新时都会被调用。它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。
  // GeneralComponent uses getDerivedStateFromProps() but also contains the following legacy lifecycles: 这里不应该与will...一起用

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('GeneralComponent, getDerivedStateFromProps', nextProps, prevState);
  }

  componentWillMount() {
    console.log('GeneralComponent, componentWillMount');
  }
  componentDidMount() {
    console.log('GeneralComponent, componentDidMount');
  }
  componentWillUpdate() {
    console.log('GeneralComponent, componentWillUpdate');
  }
  componentWillReceiveProps(nextProps, props) {
    console.log('GeneralComponent, componentWillReceiveProps', nextProps, props);
  }
  // 自己控制shouldComponentUpdate生命周期
  shouldComponentUpdate() {
    console.log('GeneralComponent, shouldComponentUpdate');
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
    console.log('GeneralComponent, componentDidUpdate');
  }

  // 这里数据不改变的时候，也是不回去重新渲染的
  render() {
    // 这里只要父组件更新就会更新
    console.log('GeneralComponent, render');
    return [
      'GeneralComponent',
      <p key="GeneralComponent">{JSON.stringify(this.props)}</p>,
      <p key="number">number: {this.props.number}</p>,
    ];
  }
}

import React, { Component, PureComponent } from 'react';

export default class ShouldComponentUpdate extends PureComponent {
  state = {};
  constructor(props) {
    super(props);
    console.log('ShouldComponentUpdate, constructor: ', this);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('ShouldComponentUpdate, getDerivedStateFromProps', nextProps, prevState);
  }
  componentWillMount() {
    console.log('ShouldComponentUpdate, componentWillMount');
  }
  componentDidMount() {
    console.log('ShouldComponentUpdate, componentDidMount');
  }
  componentWillUpdate() {
    console.log('ShouldComponentUpdate, componentWillUpdate');
  }
  componentWillReceiveProps(nextProps, props) {
    console.log('ShouldComponentUpdate, componentWillReceiveProps', nextProps, props);
  }
  // pureComponent是没有这个生命周期的
  // shouldComponentUpdate() {
  //   console.log("ShouldComponentUpdate, shouldComponentUpdate");
  // }
  componentDidUpdate() {
    console.log('ShouldComponentUpdate, componentDidUpdate');
  }
  componentWillUnmount() {
    console.log('ShouldComponentUpdate, componentWillUnmount');
  }
  render() {
    console.log('ShouldComponentUpdate, render');
    // arr数组的改变，ShouldComponentUpdate组件不能感知到
    return [
      'ShouldComponentUpdate',
      <p key="props">{JSON.stringify(this.props)}</p>,
      <p key="number">number: {this.props.number}</p>,
    ];
  }
}

import React, { Component } from 'react';

export default class Welcome extends Component {
  componentWillMount() {
    console.log('### Welcome 组件将要挂载', this);
  }
  componentWillUnmount() {
    console.log('### Welcome 组件将要卸载', this);
  }
  render() {
    return <div>Welcome! {this.props.count}</div>;
  }
}

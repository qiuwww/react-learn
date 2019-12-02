import React, { Component } from 'react';
import { CountContext } from '../index.jsx';

export default class ChildContext extends Component {
  render() {
    return (
      <>
        <h3>这里是ChildContext</h3>
        <CountContext.Consumer>{value => <p>接受到的参数如下：{value}</p>}</CountContext.Consumer>
      </>
    );
  }
}

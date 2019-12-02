import React, { Component } from 'react';
import ChildContext from './ChildContext';

// 跨组件
export default class FatherContext extends Component {
  render() {
    return (
      <React.Fragment>
        <h3>这里是FatherContext</h3>
        <ChildContext />
      </React.Fragment>
    );
  }
}

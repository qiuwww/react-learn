import React, { Component } from 'react';

import Sfc from './Sfc.jsx';
import ClassComponent from './ClassComponent.jsx';

export default class index extends Component {
  componentDidMount() {
    console.dir('Sfc', Sfc);
    console.dir('ClassComponent', ClassComponent);
  }
  render() {
    return (
      <div>
        <h3>
          对比Sfc和ClassComponent，可以看到类组件转译成ES5后代码更多更长，但这不是区分它们的主要因素。
        </h3>

        <Sfc />
        <ClassComponent />
      </div>
    );
  }
}

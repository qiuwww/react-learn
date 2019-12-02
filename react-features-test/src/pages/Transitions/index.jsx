import React, { Component } from 'react';
import TransitionsComponent from './TransitionsComponent';

export default class Transitions extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="desc">
          <h3>
            转场，如果我们可以“跳过”它并等待某些内容加载，然后再过渡到新屏幕，那就太好了。React提供了一个新的内置useTransition()Hook来帮助解决这个问题。
          </h3>
        </div>
        <div className="demo">
          <TransitionsComponent></TransitionsComponent>
        </div>
      </React.Fragment>
    );
  }
}

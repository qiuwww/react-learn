import React, { Component } from 'react';
import Welcome from './Welcome';
// 对应测试 协调 https://zh-hans.reactjs.org/docs/reconciliation.html#the-diffing-algorithm
export default class DiffingTest extends Component {
  state = {
    isDiv: false,
    isBefore: true,
    count: 1,
  };
  // 1. 测试不同类型的元素
  // 先挂载 -> 替换 -> 原来的卸载
  diffElement = () => {
    this.setState({
      isDiv: !this.state.isDiv,
    });
  };

  // 2. 比对同一类型的元素
  // 当比对两个相同类型的 React 元素时，React 会保留 DOM 节点，仅比对及更新有改变的属性。

  diffAttribute = () => {
    this.setState({
      isBefore: !this.state.isBefore,
    });
  };

  render() {
    console.log('%c### DiffingTest 调用了render', 'color: red');
    const { isDiv, isBefore, count } = this.state;

    return (
      <div style={{ padding: '10px' }}>
        <div className="btns">
          <button onClick={this.diffElement}>测试不同类型的元素</button>
          <button onClick={this.diffAttribute}>比对同一类型的元素</button>
        </div>
        <div className="test1">
          {isDiv ? (
            <div>
              div包裹：
              <Welcome />
            </div>
          ) : (
            <span>
              span包裹：
              <Welcome />
            </span>
          )}
        </div>
        <div className="test2">
          <div className={isBefore ? 'before' : 'after'} title="stuff" />
        </div>
      </div>
    );
  }
}

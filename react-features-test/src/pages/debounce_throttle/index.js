// 示例debounce_throttle的使用
import React, { Component } from 'react';
// _.debounce(func, [wait=0], [options={}])
import debounce from 'lodash/debounce';
// https://www.lodashjs.com/
// _.throttle(func, [wait=0], [options={}])
import throttle from 'lodash/throttle';

import cloneDeep from 'lodash/cloneDeep';

import './index.css';

console.log('debounce_throttle/index.js文件被运行!');

setTimeout(() => {
  console.log('debounce_throttle/index.js文件被运行!，加载2s之后打印的');
}, 2000);

// 这里延时代码的执行
let i = 1,
  product = 1;
while (i < 100) {
  product = product * i;
  i++;
}
console.log('阶乘计算的结果', i, product);

export default class Debounce_throttle extends Component {
  constructor(props) {
    console.log('Debounce_throttle!组件被加载');
    super(props);
    this.state = {
      count: 1,
      regularArr: [],
      debounceArr: [],
      throttleArr: [],
    };
    this.showWidth = 600;
    this.timeID = null;
    this.showRef = React.createRef();
  }
  componentDidMount() {
    const showRect = this.showRef.current.getBoundingClientRect();
    this.showWidth = showRect.width;
  }
  onMouseMove = throttle(e => {
    console.log('onMouseMove', this.state.count);
    this.regularOnMouseMove();
    this.debounceOnMouseMove();
    this.throttleOnMouseMove();
  }, 101);
  onMouseOver = e => {
    this.timeID = setInterval(() => {
      this.setState({
        count: this.state.count + 1,
      });
    }, 100);
  };
  onMouseOut = e => {
    clearInterval(this.timeID);
  };
  markItem = field => {
    const showWidth = this.showWidth;
    let count = this.state.count;
    let arr = cloneDeep(this.state[field]);
    if (showWidth < count * 10 + 100) {
      this.setState({
        count: 1,
        regularArr: [],
        debounceArr: [],
        throttleArr: [],
      });
      arr = [];
      return;
    }
    arr.push(count);
    arr = [...new Set(arr)];
    this.setState({
      [field]: arr,
    });
  };
  regularOnMouseMove = () => {
    this.markItem('regularArr');
  };
  // 防抖是指在调用停止一段时间之前忽略事件处理程序调用。
  debounceOnMouseMove = debounce(
    () => {
      console.log('debounceOnMouseMove');
      // 画一个竖线
      this.markItem('debounceArr');
    },
    300,
    {
      leading: false, // 指定在延迟开始前调用。
      trailing: true, // 指定在延迟结束后调用。
    },
  );
  // 节流意味着延迟函数执行。
  // 这些函数不会立即执行，在触发事件之前会加上几毫秒延迟。
  throttleOnMouseMove = throttle(
    () => {
      console.log('throttleOnMouseMove');
      this.markItem('throttleArr');
    },
    300,
    {
      leading: false, // 指定调用在节流开始前。
      trailing: true, // 指定调用在节流结束后。
    },
  );

  renderItem = (arr, color) => {
    return arr.map((item, index) => {
      return (
        <div key={`${item}-${index}`} style={{ left: item * 10, backgroundColor: color }}></div>
      );
    });
  };
  render() {
    const { regularArr, debounceArr, throttleArr } = this.state;
    return (
      <div className="debounce_throttle">
        <div
          className="move"
          onMouseMove={this.onMouseMove}
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}
        >
          move your mouse here
        </div>
        <div className="show" ref={this.showRef}>
          <div className="region">
            regular
            {this.renderItem(regularArr, 'greenyellow')}
          </div>
          <div className="region">
            debounce
            {this.renderItem(debounceArr, 'skyblue')}
          </div>
          <div className="region">
            throttle
            {this.renderItem(throttleArr, 'darkgreen')}
          </div>
        </div>
      </div>
    );
  }
}

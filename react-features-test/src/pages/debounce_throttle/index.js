// 示例debounce_throttle的使用
import React, { Component } from 'react';
// _.debounce(func, [wait=0], [options={}])
import debounce from 'lodash/debounce';
// https://www.lodashjs.com/
// _.throttle(func, [wait=0], [options={}])
import throttle from 'lodash/throttle';

import cloneDeep from 'lodash/cloneDeep';

import './index.css';
export default class Debounce_throttle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
      regularArr: [],
      debounceArr: [],
      throttleArr: []
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
        count: this.state.count + 1
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
        throttleArr: []
      });
      arr = [];
      return;
    }
    arr.push(count);
    arr = [...new Set(arr)];
    this.setState({
      [field]: arr
    });
  };
  regularOnMouseMove = () => {
    this.markItem('regularArr');
  };

  debounceOnMouseMove = debounce(
    () => {
      console.log('debounceOnMouseMove');
      // 画一个竖线
      this.markItem('debounceArr');
    },
    300,
    {
      leading: false, // 指定在延迟开始前调用。
      trailing: true // 指定在延迟结束后调用。
    }
  );

  throttleOnMouseMove = throttle(
    () => {
      console.log('throttleOnMouseMove');
      this.markItem('throttleArr');
    },
    300,
    {
      leading: false, // 指定调用在节流开始前。
      trailing: true // 指定调用在节流结束后。
    }
  );

  renderItem = (arr, color) => {
    return arr.map((item, index) => {
      return (
        <div
          key={`${item}-${index}`}
          style={{ left: item * 10, backgroundColor: color }}
        ></div>
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

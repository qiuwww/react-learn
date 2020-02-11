import React, { Component } from 'react';

interface Props {
  name: string;
  count?: number;
}

// 在React.Component<Props, object>我们把状态指定为了object，因此使用SFC更简洁。
// 使用组件声明时的 Component<P, S> 泛型参数声明，来代替 PropTypes进行类型校验
class Counter extends React.Component<Props, object> {
  componentDidMount() {
    console.log('ClassComponent打印当前的组件的属性值Counter：', this);
  }
  render() {
    const { name, count = 1 } = this.props;
    return (
      <div>
        Counter {name}: {count}
      </div>
    );
  }
}

class ClassComponent extends React.Component<Props, object> {
  render() {
    return (
      <React.Fragment>
        <Counter name="ClassComponent test" count={1}></Counter>
      </React.Fragment>
    );
  }
}

export default ClassComponent;

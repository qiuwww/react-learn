import React, { Component } from 'react';

export default class SetStateTest extends Component {
  // 多次连续调用setState
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
    };
    console.log('constructor:', this.state.count);
    this.btnRef = React.createRef();
  }
  componentDidMount() {
    this.addEventListenerTest();
    const test = 5;
    // eslint-disable-next-line default-case
    switch (test) {
      case 1:
        this.setState({
          count: this.state.count + 1,
        });
        // 不会立即改变，在render之后执行
        console.log('componentDidMount:', this.state.count);
        break;
      case 2:
        // 如果需要立即使用count的值，可以声明为一个变量，可以使用，也可以用来赋值
        // 还可以使用setState的第二个参数
        this.setState(
          {
            count: this.state.count + 1,
          },
          () => {
            // 在render之后调用
            console.log('componentDidMount:callback:', this.state.count);
          },
        );
        // 但是异步代码和原生事件是可以立马修改的
        break;
      case 3:
        setTimeout(() => {
          console.log('componentDidMount:setTimeout:', this.state.count);
          this.setState({
            count: this.state.count + 1,
          });
          // 在render之后，可以拿到准确值
          console.log('componentDidMount:setTimeout:', this.state.count);
        }, 20);
        break;
      case 4:
        this.setState({
          count: this.state.count + 1,
        });
        this.setState({
          count: this.state.count + 1,
        });
        // 这个时候合并处理，只会执行一次，一般也不会出现
        console.log('componentDidMount:同一段代码多次修改:', this.state.count);
        break;
      case 5:
        // 借助回调函数来实现同一段代码多次修改
        this.setState(
          (state, props) => ({
            count: state.count + 1,
          }),
          () => {
            // 在render之后调用，结果都是最后一次的结果，合并了修改
            console.log('componentDidMount5:callback:', this.state.count);
          },
        );
        this.setState(
          (state, props) => ({
            count: state.count + 1,
          }),
          () => {
            // 在render之后调用
            console.log('componentDidMount5:callback:', this.state.count);
          },
        );
        // 这个时候合并处理，只会执行一次，一般也不会出现
        console.log('componentDidMount5:同一段代码多次修改:', this.state.count);
        break;
    }
  }
  // 测试合成事件
  testSyntheticEvent = () => {
    console.log('componentDidMount:testSyntheticEvent1:', this.state.count);
    // 这里只执行了一次
    this.setState({
      count: this.state.count + 1,
    });
    this.setState({
      count: this.state.count + 1,
    });
    console.log('componentDidMount:testSyntheticEvent2:', this.state.count);
  };

  addEventListenerTest = () => {
    this.btnRef.current.addEventListener(
      'click',
      e => {
        console.log('componentDidMount:addEventListenerTest1:', this.state.count);
        // 这里会执行两次render，与异步操作类似
        this.setState({
          count: this.state.count + 1,
        });
        this.setState({
          count: this.state.count + 1,
        });
        console.log('componentDidMount:addEventListenerTest2:', this.state.count);
      },
      false,
    );
  };
  render() {
    console.log('%crender', 'color:red', this.state.count);
    console.log('\n');
    return (
      <div>
        <p>SetStateTest</p>
        <button onClick={this.testSyntheticEvent}>测试合成事件下的setState</button>
        <button ref={this.btnRef}>测试原生事件下的setState</button>
      </div>
    );
  }
}

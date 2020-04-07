import React, { Component } from 'react';

export default class SetStateTest extends Component {
  // 多次连续调用setState
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
      count2: 1,
      count3: 1,
      count4: 1,
      count5: 1,
    };
    console.log('constructor this:', this);
    this.btnRef = React.createRef();
  }

  changeState2 = () => {
    console.log('###changeState2执行了');
    // 两种方式设置state
    // 在这里连续两次，只会执行一次render，且count2值增加了一次
    // 请使用 componentDidUpdate 或者 setState 的回调函数（setState(updater, callback)），这两种方式都可以保证在应用更新后触发。
    this.setState({ count2: this.state.count2 + 1 }, () => {
      // 在render之后执行
      console.log('count2修改了');
    });
    this.setState({ count2: this.state.count2 + 1 });
  };
  changeState3 = () => {
    console.log('###changeState3执行了');
    // 两种方式设置state
    // 在这里连续两次，与别的state一起执行，count3增加了2次
    this.setState(
      (state, props) => ({ count3: state.count3 + 1 }),
      () => {
        // 在render之后执行
        console.log('count3修改了');
      },
    );
    this.setState((state, props) => ({ count3: state.count3 + 1 }));
  };
  // 在setState外添加setTimeout会执行几次呢？
  // 设置几次执行几次
  changeStateWithSetTimeout = () => {
    setTimeout(() => {
      console.log('###changeStateWithSetTimeout');
      // 两种方式设置state
      // 在这里连续两次，只会执行一次render，且count2值增加了一次
      this.setState({ count: this.state.count + 1 }, () => {
        // 在render之后执行
        console.log('count修改了');
      });
      console.log('count', this.state.count);
      this.setState({ count: this.state.count + 1 });
      console.log('count', this.state.count);
    }, 1000);
  };
  // 这里可以阻止渲染，但不能阻止修改state，在render前调用
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextState.count === 3) {
  //     return false;
  //   }
  //   return true;
  // }
  // 测试原生事件绑定，获取元素并且添加原生事件
  addEventListenerTest = () => {
    this.btnRef.current.addEventListener(
      'click',
      (e) => {
        console.log('###componentDidMount:addEventListener，事件被触发了');
        // 这里会执行两次render，与异步操作类似
        this.setState({
          count4: this.state.count4 + 1,
        });
        console.log('count4', this.state.count4);
        this.setState({
          count4: this.state.count4 + 1,
        });
        console.log('count4', this.state.count4);
      },
      false,
    );
  };

  // 测试合成事件
  testSyntheticEvent = () => {
    // 这里只执行一次
    this.setState({
      count5: this.state.count5 + 1,
    });
    console.log('###componentDidMount:testSyntheticEvent:', this.state.count5);
    this.setState({
      count5: this.state.count5 + 1,
    });
    console.log('componentDidMount:testSyntheticEvent:', this.state.count5);
  };

  componentDidMount() {
    // 生命周期函数与setTimeout
    this.changeState2();
    this.changeState3();
    // 原生事件与合成事件
    this.changeStateWithSetTimeout();
    this.addEventListenerTest();
  }

  render() {
    const { count, count2, count3, count4, count5 } = this.state;
    console.log('%c######render被调用了：', 'color:red', this.state);
    return (
      <div>
        <p>SetStateTest</p>
        <p>state: {count}</p>
        <p>state2: {count2}</p>
        <p>state3: {count3}</p>
        <p>state4: {count4}</p>
        <p>state5: {count5}</p>
        <button onClick={this.testSyntheticEvent}>测试合成事件下的setState</button>
        <button ref={this.btnRef}>测试原生事件下的setState</button>
      </div>
    );
  }
}

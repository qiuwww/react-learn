import React, { Component, PureComponent } from 'react';
import GeneralComponent from './GeneralComponent';
import ShouldComponentUpdate from './ShouldComponentUpdate';
// 一般的组件是没有

export default class CyclePage extends Component {
  state = {
    // 测试组件初始化及状态改变之后的生命周期调用
    number: 1,
    // 测试子组件shouldComponentUpdate
    arr: [],
  };
  constructor(props) {
    super(props);
    console.log('CyclePage, constructor: ', this);
  }
  componentWillMount() {
    console.log('CyclePage, componentWillMount');
  }
  componentDidMount() {
    console.log('CyclePage, componentDidMount');
  }

  componentWillUpdate() {
    console.log('CyclePage, componentWillUpdate');
  }
  componentDidUpdate() {
    console.log('CyclePage, componentDidUpdate');
  }
  changeNumber = () => {
    this.setState({
      number: this.state.number + 1,
    });
  };
  changeArr = () => {
    const { arr } = this.state;
    arr.push(1);
    this.setState({
      arr: arr,
    });
  };
  changeObj = () => {
    this.setState({
      obj: {
        a: this.state.number + 1,
      },
    });
  };
  // 这里数据不改变的时候，也是不回去重新渲染的
  render() {
    console.log('CyclePage, render');
    const { number, arr } = this.state;
    return (
      <div>
        <h3>CyclePage</h3>
        <button onClick={this.changeNumber}>修改CyclePage的state.number</button>
        <button onClick={this.changeObj}>修改CyclePage的state.arr</button>
        <button onClick={this.changeObj}>修改CyclePage的state.obj</button>
        <br />
        <GeneralComponent number={number} arr={arr}></GeneralComponent>
        <ShouldComponentUpdate number={number} arr={arr}></ShouldComponentUpdate>
      </div>
    );
  }
}

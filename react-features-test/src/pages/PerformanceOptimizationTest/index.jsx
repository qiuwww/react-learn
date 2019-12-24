import React, { Component, PureComponent } from 'react';

// 这个组件会一直更新，即便props的值不变
class RegularChildComponent extends React.Component {
  // 这里使用shouldComponentUpdate来控制当count等于某个值的时候，停止重新渲染
  // 效果与PureComponent一致
  shouldComponentUpdate(nextProps, nextState) {
    const count = nextProps.count;
    if (count !== 3) {
      return true;
    }
    return false;
  }
  render() {
    console.log('%cRegular Component Rendered.. ', 'color: blue; font-size: 14px;');
    return <div>{this.props.count}</div>;
  }
}
// 如果 PureComponent 里有 shouldComponentUpdate 函数的话，直接使用 shouldComponentUpdate 的结果作为是否更新的依据，没有 shouldComponentUpdate 函数的话，才会去判断是不是 PureComponent ，是的话再去做 shallowEqual 浅比较。
// if(this._compositeType === CompositeTypes.PureClass){
//   shouldUpdate = !shallowEqual(prevProps,nextProps)||!shallowEqual(inst.state,nextState)
// }
// 这个组件会在state不相等的时候更新，即便props的值不变
class PureChildComponent extends React.PureComponent {
  state = {
    items: [1, 2, 3],
  };
  handleClick = () => {
    const { items } = this.state;
    items.push(1);
    console.log('items:', items);
    // 这里items更新了，但是页面没更新，这个时候就需要加shouldComponentUpdate判断
    this.setState({ items });
    // 这里调用强制刷新
    // 自身的state，如果这里不调用forceUpdate，页面是不会更新的
    // this.forceUpdate();
  };
  // Pure Components are the components that do not re-render if the State data or props data is still the same
  render() {
    console.log('%cPure Component Rendered..', 'color: red; font-size: 14px;');
    return (
      <>
        <div>{this.props.count}</div>
        <button onClick={this.handleClick}>handleClic，修改items</button>
        <ul>
          {/* 这里渲染会出问题 */}
          {this.state.items.map((i, index) => (
            <li key={'' + i + index}>{i}</li>
          ))}
        </ul>
        {/* <div>PureComponent接受父组件传递的参数：{JSON.stringify(this.props.list)}</div> */}
        <ul>
          {/* 这里也是可以渲染的，引用父组件的引用类型是没问题 */}
          <li>PureComponent接受父组件传递的参数:list</li>
          {this.props.list.map((i, index) => (
            <li key={'' + i + index}>{i}</li>
          ))}
        </ul>
      </>
    );
  }
}

export default class PerformanceOptimizationTest extends React.Component {
  constructor() {
    super();
    this.state = {
      count: 1,
      list: [],
    };
    this.timeID = null;
  }

  updateState = () => {
    this.timeID = setInterval(() => {
      let count = this.state.count;
      if (count === 3) {
        count = 2;
      }
      this.setState({
        count: count + 1,
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(this.timeID);
    }, 5000);
  };

  componentDidMount() {
    this.updateState();
  }
  changeList = () => {
    let list = this.state.list;
    list = list.concat([1]);
    // 这里的list更新在pure组件中也是可渲染的
    console.log('list', list);
    this.setState({
      list,
    });
  };
  render() {
    console.log('%cRender Called Again: ', 'color: green; font-size: 20px;');
    const { count, list } = this.state;
    return (
      <>
        <div className="PerformanceOptimizationTest">
          <button onClick={this.changeList}>修改list</button>
          <RegularChildComponent count={count} list={list} />
          <PureChildComponent count={count} list={list} />
        </div>
      </>
    );
  }
}

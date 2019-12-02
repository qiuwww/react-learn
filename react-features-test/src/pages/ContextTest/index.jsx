import React, { Component } from 'react';
import FatherContext from './component/FatherContext';

// 假设我们有很多个组件，我们只需要在父组件使用Provider提供数据，然后我们就可以在子组件任何位置使用Consumer拿到数据，不存在跨组件的问题

// Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。

// Context 主要应用场景在于很多不同层级的组件需要访问同样一些的数据。请谨慎使用，因为这会使得组件的复用性变差。

// 创建上下文
export const CountContext = React.createContext();
console.log('Provider, Consumer:', CountContext.Provider, CountContext.Consumer);
// 提供数据

export default class ContextTest extends Component {
  state = {
    count: 0,
  };
  componentDidMount() {
    setInterval(
      () =>
        this.setState({
          count: this.state.count + 1,
        }),
      2000,
    );
  }
  render() {
    return (
      <div>
        <h3>跨组件数据传递的方法，不推荐使用</h3>
        <CountContext.Provider value={this.state.count}>
          <FatherContext />
        </CountContext.Provider>
      </div>
    );
  }
}

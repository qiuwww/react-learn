import React, { Component } from 'react';
import Feature0_4 from './pages/feature0_4/Feature0_4';
import Feature4_6 from './pages/feature4_6/Feature4_6';
import Hoc from './pages/hoc/index.js';
import Hooks from './pages/hooks/index.js';
import Debounce_throttle from './pages/debounce_throttle/index.js';

import ShouldComponentUpdateCycleTest from './pages/cycle/ShouldComponentUpdateCycleTest.js';
// using ES6 modules
import { HashRouter, Route, Link, Switch } from 'react-router-dom';
// 这里抽出来就是Layout
class Layout extends Component {
  render() {
    return (
      <div className="Layout">
        <h2>测试react的功能，截止16.8.6</h2>
        <ul style={{borderBottom: '10px solid #258'}}>
          <li>
            <Link to="/feature0_4">v16.0 ~ 16.4的新特性</Link>
          </li>
          <li>
            <Link to="/feature4_6">v16.4 ~ 16.6的新特性</Link>
          </li>
          <li>
            <Link to="/hoc">Hoc，higherOrderComponent，高阶组件</Link>
          </li>
          <li>
            <Link to="/debounce_throttle">
              debounce_throttle,测试debounce_throttle
            </Link>
          </li>
          <li>
            <Link to="/cycle/ShouldComponentUpdateCycleTest">
              测试shouldComponentUpdate接口
            </Link>
          </li>
          <li>
            <Link to="/hooks">
              Hook 是 React 16.8 的新增特性。它可以让你在不编写 class
              的情况下使用 state 以及其他的 React 特性。
            </Link>
          </li>
        </ul>
        <div className="wrap" style={{ padding: '20px' }}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

// 这里就是react-router的基础模型，path对应到不同的component
function Routers() {
  return (
    <HashRouter>
      <Switch>
        <Layout path="/" component={Layout}>
          <Route path="/feature0_4" component={Feature0_4} />
          <Route path="/feature4_6" component={Feature4_6} />
          <Route path="/hoc" component={Hoc} />
          <Route path="/hooks" component={Hooks} />
          <Route
            path="/cycle/ShouldComponentUpdateCycleTest"
            component={ShouldComponentUpdateCycleTest}
          />
          <Route path="/debounce_throttle" component={Debounce_throttle} />
        </Layout>
      </Switch>
    </HashRouter>
  );
}

export default Routers;

import React, { Component, Suspense, lazy } from 'react';

import Feature0_4 from './pages/feature0_4/Feature0_4';
import Feature4_6 from './pages/feature4_6/Feature4_6';

import Hoc from './pages/hoc/index.js';
import Hooks from './pages/hooks/index.js';
import FetchRender from './pages/FetchRender/index.jsx';
import Transitions from './pages/Transitions/index.jsx';
import AirbnbReact from './pages/AirbnbReact/index.jsx';

// import ErrorBoundaryTest from './pages/ErrorBoundaryTest/index.jsx';

import ShouldComponentUpdateCycleTest from './pages/cycle/ShouldComponentUpdateCycleTest.js';
// using ES6 modules
import { HashRouter, Route, Link, Switch } from 'react-router-dom';
// 这里抽出来就是Layout

// 这里代码，debounce_throttle/index.js文件会被运行，也就是最开始的时候，代码就被加载进来了
// import Debounce_throttle from './pages/debounce_throttle/index.js';

// 这里的代码是不会默认不会被加载的，只有用到当前组件的时候，才会去加载'./pages/debounce_throttle/index.js';这个文件，同时生成组件实例。避免了暂时不需要加载的，夹在router中使用非常合适
// 使用懒加载代码会被切分为多个chunk
const Debounce_throttle = lazy(() => import('./pages/debounce_throttle/index.js'));

const ContextTest = lazy(() => import('./pages/ContextTest/index.jsx'));

const PerformanceOptimizationTest = lazy(() =>
  import('./pages/PerformanceOptimizationTest/index.jsx'),
);

const ErrorBoundaryTest = lazy(() => import('./pages/ErrorBoundaryTest/index.jsx'));
const SetStateTest = lazy(() => import('./pages/SetStateTest/index.jsx'));
class Layout extends Component {
  render() {
    return (
      <div className="Layout">
        <h2>测试react的功能，截止16.8.6</h2>
        <ul style={{ borderBottom: '10px solid #258' }}>
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
              debounce(防抖)，throttle(节流),测试debounce_throttle
            </Link>
          </li>
          <li>
            <Link to="/context-test">context-test，16.3，跨组件传递状态api</Link>
          </li>
          <li>
            <Link to="/cycle/ShouldComponentUpdateCycleTest">生命周期测试</Link>
          </li>
          <li>
            <Link to="/performance-optimization-test">
              react代码层面性能优化，shouldComponentUpdate&PureComponent&forceUpdate
            </Link>
          </li>
          <li>
            <Link to="/error-boundary-test">
              错误边界处理，getDerivedStateFromError&componentDidCatch
            </Link>
          </li>

          <li>
            <Link to="/hooks">
              Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的
              React 特性。
            </Link>
          </li>
          <li>
            <Link to="/setState-test">setState，渲染顺序测试</Link>
          </li>
          <li>
            <Link to="/fetch-render">fetch-render，测试react的数据获取时机</Link>
          </li>
          <li>
            <Link to="/transitions">并发UI模式，内置useTransition()Hook</Link>
          </li>
          <li>
            <Link to="/Airbnb-React">Airbnb React/JSX 编码规范</Link>
          </li>
          <li>
            <Link to="/TypeScriptDemo/ClassComponent">
              TypeScriptDemo/ClassComponent，class类型的ts组件
            </Link>
          </li>
          <li>
            <Link to="/TypeScriptDemo/StatelessComponent">
              TypeScriptDemo/StatelessComponent，函数式类型的ts组件
            </Link>
          </li>
          <li>
            <Link to="/TsReduxComponent">TsReduxComponent，测试redux的ts，demo</Link>
          </li>
          <li>
            <Link to="/ComponentTest">/components/Drawer，自定义组件Drawer</Link>
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
      {/* 这里的fallback还是必须的 */}
      <Suspense fallback={<div style={{ color: 'red' }}>Loading...</div>}>
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
            <Route path="/context-test" component={ContextTest} />
            <Route path="/performance-optimization-test" component={PerformanceOptimizationTest} />
            <Route path="/error-boundary-test" component={ErrorBoundaryTest} />
            <Route path="/setState-test" component={SetStateTest} />
            <Route path="/fetch-render" component={FetchRender} />
            <Route path="/transitions" component={Transitions} />
            <Route path="/Airbnb-React" component={AirbnbReact} />
            {/* ts react实例 */}
            {/* <Route
              path="/TypeScriptDemo/ClassComponent"
              component={lazy(() => import('./pages/TypeScriptDemo/ClassComponent'))}
            /> */}
            {/* <Route
              path="/TsReduxComponent"
              component={lazy(() => import('./pages/TsReduxComponent/index.tsx'))}
            /> */}
            <Route
              path="/ComponentTest"
              component={lazy(() => import('./pages/ComponentTest/index'))}
            />
          </Layout>
        </Switch>
      </Suspense>
    </HashRouter>
  );
}

export default Routers;

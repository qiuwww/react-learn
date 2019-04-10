import React, { Component } from "react";
import {
  RenderRelate,
  ErrorBoundary,
  BuggyCounter,
  Portals,
  FatherContext
} from "../../components/index";
import styles from "./index.less";

// 假设我们有很多个组件，我们只需要在父组件使用Provider提供数据，然后我们就可以在子组件任何位置使用Consumer拿到数据，不存在跨组件的问题

// 创建上下文
export const CountContext = React.createContext();
console.log(
  "Provider, Consumer:",
  CountContext.Provider,
  CountContext.Consumer
);
// 提供数据

export default class Feature0_4 extends Component {
  state = {
    count: 0
  };
  componentDidMount() {
    setInterval(
      () =>
        this.setState({
          count: this.state.count + 1
        }),
      5000
    );
  }
  render() {
    return [
      <h2 key="h2">v16.0 ~ 16.4的新特性</h2>,
      <React.StrictMode key="list">
        <ul className={styles.feature0_4}>
          <li>
            <RenderRelate />
          </li>
          <li>
            <h2>
              这里确实可以捕获到错误，进行局部的错误处理，不影响整体的显示。
              在未来的版本中被废弃。 使用static
              getDerivedStateFromError()处理退路渲染来代替。
              <a
                href="https://react.docschina.org/docs/react-component.html#componentdidcatch"
                target="_blank"
                rel="noopener noreferrer"
              >
                详细参考这里
              </a>
            </h2>
            <ErrorBoundary>
              <p>
                These two counters are inside the same error boundary. If one
                crashes, the error boundary will replace both of them.
              </p>
              <BuggyCounter />
            </ErrorBoundary>
          </li>
          <li>
            <Portals>
              <p>
                这里可以看到portals-root与root的内容不在同一个父标签中。最终不被渲染到root标签中。
              </p>
              {/* <dialog open>这里可以定义一个modal</dialog> */}
            </Portals>
          </li>
          <li>
            <qwer asd="asd">V16+，支持自定义标签和属性</qwer>
          </li>
          <li>优化SSR</li>
          <li>
            Fiber:
            <a href="https://react.docschina.org/docs/faq-internals.html#%E4%BB%80%E4%B9%88%E6%98%AFreact-fiber%EF%BC%9F">
              Virtual DOM
            </a>
            <br />
            <a href="https://github.com/xxn520/react-fiber-architecture-cn">
              React Fiber Architecture
            </a>
          </li>
          <li>
            <h3>
              Fragment可以组合多个内容，而不添加多余的包裹标签，类似于返回一个数组。
            </h3>
            <React.Fragment>
              Some text.
              <h2>A heading</h2>
            </React.Fragment>
          </li>
          <li>
            getDerivedStateFromProps:这个方法用于替代componentWillReceiveProps
          </li>
          <li>
            <h3>跨组件数据传递的方法，不推荐使用</h3>
            <CountContext.Provider value={this.state.count}>
              <FatherContext />
            </CountContext.Provider>
          </li>
          <li>React.createRef()</li>
          <li>forwardRef：父组件需要将自己的引用传给子组件</li>
          <li>
            React.lazy: React.lazy() lets you define a component that is loaded
            dynamically.
          </li>
          <li>strictMode component</li>
        </ul>
      </React.StrictMode>
    ];
  }
}

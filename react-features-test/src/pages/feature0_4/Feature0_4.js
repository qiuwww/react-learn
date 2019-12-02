import React, { Component } from 'react';
import { RenderRelate, Portals } from '../../components/index';
import styles from './index.css';

export default class Feature0_4 extends Component {
  render() {
    return [
      <h2 key="h2">v16.0 ~ 16.4的新特性</h2>,
      <React.StrictMode key="list">
        <ul className={styles.feature0_4}>
          <li>
            RenderRelate：
            <RenderRelate />
          </li>
          <li>
            Portals：这里可以看到portals-root与root的内容不在同一个父标签中。最终不被渲染到root标签中。
            <Portals>
              <p>
                这里可以看到portals-root与root的内容不在同一个父标签中。最终不被渲染到root标签中。
              </p>
              {/* <dialog open>这里可以定义一个modal</dialog> */}
            </Portals>
          </li>
          <li>
            qwer：<qwer asd="asd">V16+，支持自定义标签和属性</qwer>
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
            <h3>Fragment可以组合多个内容，而不添加多余的包裹标签，类似于返回一个数组。</h3>
            <React.Fragment>
              Some text.
              <h2>A heading</h2>
            </React.Fragment>
          </li>
          <li>getDerivedStateFromProps: 这个方法用于替代componentWillReceiveProps</li>
          <li>React.createRef()</li>
          <li>forwardRef：父组件需要将自己的引用传给子组件</li>
          <li>React.lazy: React.lazy() lets you define a component that is loaded dynamically.</li>
          <li>strictMode component</li>
        </ul>
      </React.StrictMode>,
    ];
  }
}

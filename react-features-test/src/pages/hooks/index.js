import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import GetAsyncData from './GetAsyncData.js';
import HookCustomize from './HookCustomize.jsx';
import Count from './Count.jsx';

import UseState from './UseState.jsx';
import UseEffect from './UseEffect.jsx';
import UseContext from './UseContext.jsx';
import UseReducer from './UseReducer.jsx';
import UseCallback from './UseCallback.jsx';
import UseMemo from './UseMemo.jsx';

// 无状态组件使用hooks
function CounterHooksExample() {
  // 声明一个变量count,来保存中间值
  // useState 就是一个 Hook，通过在函数组件里调用它来给组件添加一些内部 state。
  // useState返回两个参数，一个是当前state的值，还有一个其实是一个函数，用来改变state的值，就是setCount。
  // 它不会将旧的state跟新的state合并在一起，而是覆盖式的重写state的值。
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  // 在hooks里，这些生命周期函数都被统一成一个方法 useEffect。
  // 数据改变之后，副作用的函数
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });
  // 这里使用副作用，在根节点插入元素，然后在组件被移除的时候删除，这个组件加载完成的时候，就会被执行
  useEffect(() => {
    const node = document.createElement('P');
    const textnode = document.createTextNode('使用hooks组件插入');
    node.setAttribute('id', 'hooksAdd');
    node.appendChild(textnode);
    document.querySelector('body').appendChild(node);
    return () => {
      // 这里修改标题
      document.title = 'react-features-test';
      const hooksAddNode = document.querySelector('#hooksAdd');
      document.querySelector('body').removeChild(hooksAddNode);
    };
  });

  return (
    <div
      className="counter-wrap"
      style={{
        border: '1px solid green',
      }}
    >
      <p>You clicked {count} times</p>
      {/* 可以不需要用this，直接使用count */}
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

export default class Hooks extends Component {
  render() {
    return [
      <h2 key="h2">v16.8的新特性 Hooks</h2>,
      <div key="div">
        <div>
          <h3>question:</h3>
          <ul>
            <li>组件之间很难复用逻辑：React 需要为共享状态逻辑提供更好的原生途径。</li>
            <li>复杂组件很难理解</li>
            <li>class比较难学</li>
          </ul>
          <h3>Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。</h3>
          <ul>
            <li>
              useEffect 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的
              componentDidMount、componentDidUpdate 和 componentWillUnmount
              具有相同的用途，只不过被合并成了一个 API。
            </li>
          </ul>
          <CounterHooksExample />
          <GetAsyncData wrap={'这里是Hooks组件'}>这里是children</GetAsyncData>

          <HookCustomize />
          <Count />

          <h2>具体测试hooks</h2>
          {/* https://zhuanlan.zhihu.com/p/60925430?utm_source=wechat_session&utm_medium=social&utm_oi=72254268375040&utm_campaign=shareopn */}
          <fieldset>
            <legend>useState 保存组件状态</legend>
            <UseState />
          </fieldset>
          <fieldset>
            <legend>useEffect 处理副作用</legend>
            <UseEffect />
          </fieldset>
          <fieldset>
            <legend>useContext 减少组件层级</legend>
            <UseContext />
          </fieldset>

          <fieldset>
            <legend>
              useReducer useReducer 这个 Hooks 在使用上几乎跟 Redux/React-Redux
              一模一样，唯一缺少的就是无法使用 redux 提供的中间件。
            </legend>
            <UseReducer />
          </fieldset>

          <fieldset>
            <legend>useCallback 记忆函数</legend>
            <UseCallback />
          </fieldset>

          <fieldset>
            <legend>useMemo 记忆组件</legend>
            <UseMemo />
          </fieldset>

          <fieldset>
            <legend>useRef 保存引用值</legend>
            <p>用来保存dom的引用，或者一个闭包变量</p>
            <p>useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值。</p>
          </fieldset>
        </div>
      </div>,
    ];
  }
}

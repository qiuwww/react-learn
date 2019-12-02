import React, { Component, useEffect, useState } from 'react';
import RenderAsYouFetchDemo from './RenderAsYouFetchDemo'
// 无状态组件，通过hooks来获取
function FetchOnRender({ wrap, children }) {
  console.log('GetAsyncData', wrap);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(true);
  useEffect(() => {
    let isUnmounted = false;
    fetch('https://api.gushi.ci/all.json')
      .then(res => {
        return res.text();
      })
      .then(res => {
        if (!isUnmounted) {
          setLoading(false);
          setValue(res);
        }
      });
    return () => {
      isUnmounted = true;
    };
  }, {});
  return (
    <React.Fragment>
      <h4>
        1.通过useEffect获取数据，Render 后才去呼叫
        API，与class组件的componentDidMount类似，理论上效率最差
      </h4>
      {loading ? <h2>Loading...</h2> : <h2>value is {value}</h2>}
      {children}
    </React.Fragment>
  );
}

class RenderAsYouFetch extends Component {
  render() {
    return (
      <div>
        <h4>
          3.按需渲染，未来推荐的做法，在 Render 之前尽早的开始获取数据，并立刻的开始 Render
          下一个页面，这时资料若处于未 Ready 的状态，那就会 throw Promise 并进入 Suspense
          的状态，等到 Promise Resolve 后，React 会进行 Retry（这时候资料已经 Ready 了）。
        </h4>
        <RenderAsYouFetchDemo></RenderAsYouFetchDemo>
      </div>
    );
  }
}

export default class FetchRender extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="desc">
          <h3>异步取得数据，然后渲染</h3>
          <p>先来了解一下官方所提出的三种获取资料的方式：</p>
          <p>Approach 1: Fetch-on-Render </p>
          <p>Approach 2: Fetch-Then-Render </p>
          <p>Approach 3: Render-as-You-Fetch (using Suspense)</p>
        </div>
        <div className="test-demo">
          <FetchOnRender></FetchOnRender>
          <h4>
            2. 拿到数据再渲染。这是 Facebook 的 Relay 框架或者是说GraphQL
            体系比较容易做到的事，首先必须让资料被静态的定义好。 例如使用 GraphQL 的
            Fragment，这样你才能在 Render 前就知道 Component 需要什么数据。并且让 Fragment 被
            Compose 起來，就能避免获取资料時的 Waterfall。
          </h4>
          <RenderAsYouFetch></RenderAsYouFetch>
        </div>
      </React.Fragment>
    );
  }
}

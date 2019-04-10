import React, { Component } from "react";
import { Counter } from "../../components/index";
export default class Feature8 extends Component {
  render() {
    return [
      <h2 key="h2">v16.8的新特性 Hooks</h2>,
      <div key="div">
        <div>
          <h3>question:</h3>
          <ul>
            <ol>组件之间很难复用逻辑</ol>
            <ol>复杂组件很难理解</ol>
            <ol>class比较难学</ol>
          </ul>
          <Counter />
        </div>
      </div>
    ];
  }
}

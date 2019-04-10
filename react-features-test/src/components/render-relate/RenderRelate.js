import React, { Component } from "react";
export default class RenderRelate extends Component {
  render() {
    let str = "这里可以返回一个数组，里边包裹多个片段，省略了一些无意义的包裹标签：";
    return [str, <br/>, <div></div>];
  }
}

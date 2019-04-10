import React, { Component } from "react";
export default class RenderRelate extends Component {
  render() {
    let str =
      "render函数可以返回一个数组，里边包裹多个片段，省略了一些无意义的包裹标签。";
    return [
      str,
      <br key="br" />,
      <p key="desc">
        desc: React 16: 支持返回这五类：React elements,
        数组和Fragments，Portal，String/numbers，boolean/null。
      </p>,
      <p key="remarks">
        remarks: 这里的结构最终会被遍历加入到页面中，所以需要唯一的key。
      </p>,
      // { GlobalContext }
    ];
  }
}

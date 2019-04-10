import React, { Component } from "react";
import { CountContext } from "../../pages/feature0_4/Feature0_4";
export default class ChildContext extends Component {
  render() {
    return (
      <CountContext.Consumer>
        {value => value}
        {/*<h3>这里是ChildContext</h3>
        <p>接受到的参数如下：{value => value}</p> */}
      </CountContext.Consumer>
    );
  }
}

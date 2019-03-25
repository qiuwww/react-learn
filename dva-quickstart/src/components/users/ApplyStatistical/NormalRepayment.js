import React, { Component } from "react";
import List from "./List";

export default class NoApply extends Component {
  state = {};

  render() {
    return (
      <div>
        <List exportType="norepeat" />
      </div>
    );
  }
}

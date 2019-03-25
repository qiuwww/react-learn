import React, { Component } from "react";
import List from "./List";

export default class PayOffOrder extends Component {
  state = {};

  render() {
    return (
      <div>
        <List status={1} />
      </div>
    );
  }
}

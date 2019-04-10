import React, { Component } from "react";
export default class BuggyCounter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(({ counter }) => ({
      counter: counter + 1
    }));
  }

  render() {
    if (this.state.counter === 5) {
      // Simulate a JS error
      throw new Error("I crashed!");
    }
    return (
      <button
        style={{ width: "100px", height: "30px" }}
        onClick={this.handleClick}
      >
        {this.state.counter}
      </button>
    );
  }
}

// A class component becomes an error boundary if it defines a new lifecycle method called componentDidCatch(error, info):
import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  componentDidCatch(error, info) {
    // 这里是可以捕获到的
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.log(error, info);
    debugger;
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <h2>
          Something went wrong:{" "}
          {this.state.error && this.state.error.toString()}
        </h2>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;

// Let's create a Modal component that is an abstraction around
// Portals 提供了一种很好的将子节点渲染到父组件以外的 DOM 节点的方式。
import { Component } from "react";
import ReactDOM from "react-dom";
// the portal API.
// 这里需要配合在页面中定义一个位置
const modalRoot = document.getElementById("portals-root");
export default class Portals extends Component {
  constructor(props) {
    super(props);
    // Create a div that we'll render the modal into. Because each
    // Modal component has its own element, we can render multiple
    // modal components into the modal container.
    this.el = document.createElement("div");
  }
  componentDidMount() {
    // Append the element into the DOM on mount. We'll render
    // into the modal container element (see the HTML tab).
    // 这边会将我们生成的portal element插入到modal-root里。
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    // Remove the element from the DOM when we unmount
    modalRoot.removeChild(this.el);
  }

  render() {
    // Use a portal to render the children into the element
    return ReactDOM.createPortal(
      // Any valid React child: JSX, strings, arrays, etc.
      this.props.children,
      // A DOM element
      this.el
    );
  }
}

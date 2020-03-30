import React, { Component } from 'react';
import Drawer from '../../components/Drawer';
export default class index extends Component {
  state = {
    visible: true,
  };
  changeVisible = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };
  render() {
    return (
      <div>
        <button style={{ border: '1px solid red' }} onClick={this.changeVisible}>
          显示与隐藏drawer，{this.state.visible.toString()}
        </button>

        <Drawer visible={this.state.visible}>
          <p style={{ border: '1px solid red' }}>123</p>
        </Drawer>
      </div>
    );
  }
}

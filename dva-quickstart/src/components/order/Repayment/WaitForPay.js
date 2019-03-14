import React, { Component } from 'react';
import List from './List';

export default class WaitForPay extends Component {
  state = {
  }

  render() {
    return (
      <div>
        <List status={0} />
      </div>
    );
  }
}

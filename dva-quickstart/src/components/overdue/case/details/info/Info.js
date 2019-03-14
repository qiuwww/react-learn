/**
 * Created by yujianfu on 2016/11/9.
 */
import React, {Component, PropTypes} from 'react'
import {Tabs, Card, Table, Icon} from 'antd'

import Identity from '../../../../common/components/users/Identity'
import Education from './Education'
import DeliverAddress from './DeliverAddress'
import Borrow from './Borrow'
import Profession from '../../../../common/components/users/Profession'
import Photo from '../../../../common/components/users/Photos'
import ApplyRecord from '../../../../common/components/users/applyRecord'

class Info extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: props.userId,
      tradeNo: props.tradeNo
    }
  }

  componentWillReceiveProps(props) {
    if (this.state.userId != props.userId) {
      this.setState({
        userId: props.userId,
        tradeNo: props.tradeNo
      })
    }
  }

  render() {
    if (this.state.userId == null || this.state.tradeNo == null) {
      return <span className="no-data"><Icon type='frown-o'/>暂无数据</span>
    }

    return (
      <div style={{width: '100%', overflow: 'hidden'}}>
        <div style={{height: 750, overflow: 'auto', width: '101%'}}>
          {/*<Education userId={this.state.userId}/>*/}
          <Identity userId={this.state.userId} tradeNo={this.state.tradeNo}/>
          <Photo userId={this.state.userId} tradeNo={this.state.tradeNo}/>
          <Profession userId={this.state.userId} tradeNo={this.state.tradeNo}/>
          <ApplyRecord userId={this.state.userId} tradeNo={this.state.tradeNo}/>
        </div>
      </div>
    )
  }
}

export default Info

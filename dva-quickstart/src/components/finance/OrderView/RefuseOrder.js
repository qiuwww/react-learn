/**
 * Created by ziyu on 2017/7/27.
 */
import React, { Component, PropTypes } from 'react'
import Common from '../common/OrderViewIndex'
class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <Common stepType="refuseOrder" getListApi="/audit/refuse/list" />
    )
  }
}

export default Index

/**
 * Created by ziyu on 2017/7/26.
 */
import React, { Component, PropTypes } from 'react'
import Common from '../Index'
class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    this.getData()
  }

  getData () {

  }

  render () {
    return (
      <Common collectionType='0' isNewAdd='1' api='/collection/distributeOrderGet/list' />
    )
  }
}

export default Index

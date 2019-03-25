/**
 * Created by ziyu on 2017/7/26.
 */
import React, { Component,  } from 'react'
import Common from '../Index'
class Index extends Component {
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
      <Common collectionType='0' isNewAdd='0' api='/collection/distributeOrderGet/list' />
    )
  }
}

export default Index

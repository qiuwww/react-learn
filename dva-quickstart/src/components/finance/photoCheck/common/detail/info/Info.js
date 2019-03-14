import React, { Component, PropTypes } from 'react'
import { Col } from 'antd'
import Zmxy from './Zmxy'
import Identity from '../../../../../common/components/users/Identity'
import Profession from '../../../../../common/components/users/Profession'
import Account from './ApplyAccount'
import Ivs from './Ivs'
import Watch from './Watch'
import { fetchPost } from './../../../../../../utils/request'

class Info extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      zmData: {},
      id: props.id,
      message: ''
    }
  }

  componentWillReceiveProps (props) {
    if (this.state.userId != props.userId || this.state.id != props.id) {
      this.setState({
        userId: props.userId,
        id: props.id
      }, () => {
        this.getData()
      })
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData () {
    if (this.state.id) {
      fetchPost(`/user/${this.state.userId}/zm/info`).then(json => {
        if (json.data != null && json.code === 0) {
          this.setState({
            zmData: json.data
          })
        } else {
          this.setState({
            zmData: {},
            message: json.msg
          })
        }
      })
    } else {
      this.setState({
        zmData: {}
      })
    }
  }

  render () {
    return (
      <div style={{overflow: 'hidden', height: 800}}>
        <div style={{height: '100%', overflow: 'auto'}}>
          <Col span={24}>
            <Account userId={this.state.userId} />
          </Col>

          <Col span={24}>
            <Identity userId={this.state.userId} />
          </Col>

          <Col span={16}>
            <Profession id={this.state.id} userId={this.state.userId} />
          </Col>

          <Col span={8}>
            <Zmxy data={this.state.zmData} message={this.state.message} />
          </Col>

          <Col span={24}>
            <Ivs data={this.state.zmData} />
          </Col>

          <Col span={24} className='mt10'>
            <Watch data={this.state.zmData} />
          </Col>

        </div>
      </div>
    )
  }
}

export default Info

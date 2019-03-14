/**
 * Created by ziyu on 17/5/9.
 */

import React, { Component, PropTypes } from 'react'
import { Icon, Card, Col } from 'antd'
import Styles from '../Index.less'
import { fetchPost } from '../../../../../utils/request'
class PhotoInfo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      loading: false,
      list: [],
      message: '',
      timer: null
    }
  }

  componentWillReceiveProps (props) {
    if (this.state.userId != props.userId) {
      this.setState({
        userId: props.userId
      }, () => {
        this.getData()
      })
    }
  }

  componentDidMount () {
    this.getData()
  }

  componentWillUnmount () {
    clearTimeout(this.state.timer)
  }

  getData () {
    this.setState({
      loading: true
    })
    if (this.state.userId) {
      fetchPost(`/order/borrowrecord/${this.state.userId}/query`).then(json => {
        if (json.code === 0) {
          if (json.data != null) {
            this.setState({
              list: json.data.itemList,
              loading: false
            })
          }
        } else {
          this.setState({
            list: [],
            loading: false,
            message: json.msg
          })
        }
      })
    } else {
      this.setState({
        list: [],
        loading: false
      })
    }
  }

  message () {
    if (this.state.message) {
      this.state.timer = setTimeout(() => {
        this.setState({
          message: ''
        })
      }, 3000)

      return (
        <span className='color-warning warning-animate'><Icon type='info-circle-o' />                                {this.state.message}</span>
      )
    } else {
      return ''
    }
  }

  render () {
    return (
      <div className={Styles.photoInfo}>
        <Card title='照片信息' extra={this.message()} noHovering={true}>
          <Col className={Styles.imgWrapper} span={8}>
            <img src='' />
          </Col>
          <Col className={Styles.imgWrapper} span={8}>
            <img src='' />
          </Col>
          <Col className={Styles.imgWrapper} span={8}>
            <img src='' />
          </Col>
        </Card>
      </div>
    )
  }
}

export default PhotoInfo

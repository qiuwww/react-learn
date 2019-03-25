/**
 * Created by yujianfu on 2016/11/10.
 */
import React, { Component,  } from 'react'
import { Card, Icon } from 'antd'
import Styles from '../../../finance/common/detail/Index.less'
import {fetchPost} from '../../../../utils/request'

class Identity extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      tradeNo:props.tradeNo,
      data: [],
      message: '',
      timer: null
    }
  }

  componentWillReceiveProps (props) {
    if (this.state.userId != props.userId) {
      this.setState({
        userId: props.userId,
        tradeNo:props.tradeNo,
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
    if (this.state.tradeNo != null) {
      fetchPost(`/user/${this.state.tradeNo}/base/info`, {}).then(json => {
        if (json.data != null && json.code === 0) {
          this.setState({
            data: json.data.list
          })
        } else {
          this.setState({
            message: json.msg,
            data: []
          })
        }
      })
    } else {
      this.setState({
        data: []
      })
    }
  }

  createContent () {
    let data = this.state.data
    let content = []
    if (data != null && data.length > 0) {
      data.map(function (item) {
        let value = item.value
        if (value == null) { value = '--' }
        content.push(
          <div key={item.name} className={Styles.content}>

            <span style={{width: '20%'}}>{item.name}</span>
                        :
                        <span style={{width: '80%', paddingLeft: 5}}>{value}</span>
          </div>)
      })
    }
    return content
  }

  getTitle () {
    let data = this.state.data
    if (!data || !data.length) { return '个人信息 (无)' }

    return '个人信息'
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
      <div className={Styles.detailModule}>
        <Card title={this.getTitle()} extra={this.message()} bodyStyle={{padding: 0, maxHeight: 210, overflow: 'auto'}} noHovering={true}>
          {this.createContent()}
        </Card>
      </div>

    )
  }
}

export default Identity

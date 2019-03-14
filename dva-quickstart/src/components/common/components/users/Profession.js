/**
 * Created by yujianfu on 2016/11/10.
 */
import React, {Component, PropTypes} from 'react'
import {Card, Icon} from 'antd'
import Styles from '../../../finance/common/detail/Index.less'
import {fetchPost} from '../../../../utils/request'

class Profession extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      data: [],
      message: '',
      orderId: props.orderId,
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

  getData () {
    if (this.state.userId != null) {
      fetchPost(`/user/${this.state.userId}/work/info`, {}).then(json => {
        if (json.code === 0) {
          if (json.data.list) {
            this.setState({
              data: json.data.list
            })
          } else {
            this.setState({
              data: []
            })
          }
        } else {
          this.setState({
            data: [],
            message: json.msg
          })
        }
      })
    } else {
      this.setState({
        data: []
      })
    }
  }

  componentWillUnmount () {
    clearTimeout(this.state.timer)
  }

  message () {
    if (this.state.message) {
      this.state.timer = setTimeout(() => {
        this.setState({
          message: ''
        })
      }, 3000)
      return (
        <span className='color-warning warning-animate'><Icon type='info-circle-o' /> {this.state.message}</span>
      )
    } else {
      return ''
    }
  }

  createContent () {
    let data = this.state.data
    let content = []
    if (data != null && data.length > 0) {
      let conpamyFullAddress = ''
      let companyFullAddressPrefix = ''
      let companyFullAddressSufix = ''
      data.map(function (item) {
        if (item.name == '单位地址') {
          companyFullAddressPrefix = item.value
        }

        if (item.name == '详细地址') {
          companyFullAddressSufix = item.value
        }
      })
      conpamyFullAddress = companyFullAddressPrefix + companyFullAddressSufix

      data.map(function (item) {
        let value = item.value
        if (value == null) { value = '--' }

        if (item.name == '单位地址') {
          content.push(
            <div key={item.name} className={Styles.content}>
              <span style={{width: '20%'}}>{item.name}</span>
              :
              <span style={{width: '80%', paddingLeft: 5}}><a target='blank'
                href={`http://map.baidu.com/?newmap=1&ie=utf-8&s=s%26wd%3D${conpamyFullAddress}`}>{value}</a></span>
            </div>)
        } else {
          content.push(
            <div key={item.name} className={Styles.content}>
              <span style={{width: '20%'}}>{item.name}</span>
              :
              <span style={{width: '80%', paddingLeft: 5}}>{value}</span>
            </div>)
        }
      })
    }
    return content
  }

  getTitle () {
    let data = this.state.data
    if (data == null || data.length == 0) { return '职业信息 (无)' }

    return '职业信息'
  }

  render () {
    return (
      <div className={Styles.detailModule}>
        <Card extra={this.message()} title={this.getTitle()} bodyStyle={{padding: 1}} noHovering={true}>
          {this.createContent()}
        </Card>
      </div>
    )
  }
}
export default Profession

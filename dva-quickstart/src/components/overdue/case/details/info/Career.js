/**
 * Created by yujianfu on 2016/11/10.
 */
import React, {Component, PropTypes} from 'react'
import {Tabs, Card, Table} from 'antd'
import Styles from './../Index.less'
import {fetchPost} from './../../../../../utils/request'

class Career extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      data: []
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
      fetchPost(`/user/${this.state.userId}/career`, {}).then(json => {
        if (json.data != null) {
          this.setState({
            data: json.data.list
          })
        }
      })
    }
  }

  createContent () {
    let data = this.state.data
    let content = []

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

    return content
  }

  getTitle () {
    let data = this.state.data
    if (data == null || data.length == 0) { return '职业 / 公司信息 (无)' }

    return '职业 / 公司信息'
  }

  render () {
    return (
      <div className={Styles.detailModule}>
        <Card title={this.getTitle()} bodyStyle={{padding: 1}} noHovering={true}>
          {this.createContent()}
        </Card>
      </div>

    )
  }
}

export default Career

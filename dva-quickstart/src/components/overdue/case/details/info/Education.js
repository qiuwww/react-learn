/**
 * Created by yujianfu on 2016/11/10.
 */
import React, {Component, } from 'react'
import {Tabs, Card, Table} from 'antd'
import Styles from './../Index.less'
import {fetchPost} from './../../../../../utils/request'

class Education extends Component {
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
      fetchPost(`/user/${this.state.userId}/education`, {}).then(json => {
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

      let contentClassName = Styles.content
      if (item.important) {
        contentClassName += ` ${Styles.importantItem}`
      }

      content.push(
        <div key={item.name} className={contentClassName}>

          <span className={Styles.normalItemLabel}>{item.name}</span>
          :
          <span className={Styles.normalItemContent}>{value}</span>
        </div>)
    })

    return content
  }

  getTitle () {
    let data = this.state.data
    if (data == null || data.length == 0) { return '学历信息 (无)' }

    return '学历信息'
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

export default Education

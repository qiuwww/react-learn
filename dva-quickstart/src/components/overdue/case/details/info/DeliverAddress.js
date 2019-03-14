/**
 * Created by yujianfu on 2016/11/10.
 */
import React, {Component, PropTypes} from 'react'
import {Tabs, Card, Table} from 'antd'
import Styles from './../Index.less'
import {fetchPost} from './../../../../../utils/request'

class DeliverAddress extends React.Component {
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
      fetchPost(`/user/${this.state.userId}/deliverAddress/list`, {}).then(json => {
        if (json.data != null) {
          this.setState({
            data: json.data.list
          })
        }
      })
    }
  }

  render () {
    const columns = [
      {
        title: '收货人',
        dataIndex: 'consignee',
        key: 'consignee'
      }, {
        title: '地址',
        key: 'address',
        width: '40%',
        render: (text, record) => (
          <span style={{width: '40%'}}>{record.address}</span>
        )
      }, {
        title: '手机',
        dataIndex: 'mobile',
        key: 'mobile'
      }, {
        title: '时间',
        dataIndex: 'createdDate',
        key: 'createdDate'
      }
    ]

    return (
      <div className={Styles.detailModule}>
        <Card title='购物平台--收货信息' bodyStyle={{padding: 1}} noHovering={true}>
          <Table
            pagination={false}
            bordered
            dataSource={this.state.data}
            columns={columns}
          />
        </Card>
      </div>
    )
  }
}

export default DeliverAddress

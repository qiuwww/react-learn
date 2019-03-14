/**
 * Created by yujianfu on 2016/11/10.
 */
import React, {Component, PropTypes} from 'react'
import {Tabs, Card, Table, message} from 'antd'
import Styles from './../Index.less'
import {fetchPost} from './../../../../../utils/request'

class Borrow extends React.Component {
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
      fetchPost(`/user/${this.state.userId}/borrow/list`, {}).then(json => {
        if (json.code === 0) {
          if (json.data != null) {
            this.setState({
              data: json.data.list
            })
          }
        } else {
          message.error(json.msg)
        }
      })
    }
  }

  render () {
    const columns = [
      {
        title: '订单号',
        dataIndex: 'borrowNo',
        key: 'borrowNo'
      }, {
        title: '来源',
        dataIndex: 'borrowCashFrom',
        key: 'borrowCashFrom'
      }, {
        title: '打款人',
        dataIndex: 'paidBy',
        key: 'paidBy'
      }, {
        title: '放款时间',
        dataIndex: 'paidDate',
        key: 'paidDate'
      }, {
        title: '申请时间',
        dataIndex: 'createdDate',
        key: 'createdDate'
      }, {
        title: '姓名',
        dataIndex: 'realName',
        key: 'realName'
      }, {
        title: '银行卡号',
        dataIndex: 'creditCardNo',
        key: 'creditCardNo'
      }, {
        title: '申请金额',
        dataIndex: 'capital',
        key: 'capital'
      }, {
        title: '所属银行',
        dataIndex: 'bankName',
        key: 'bankName'
      }
    ]

    return (
      <div className={Styles.detailModule}>
        <Card title='申请订单列表' bodyStyle={{padding: 1}} noHovering={true}>
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

export default Borrow

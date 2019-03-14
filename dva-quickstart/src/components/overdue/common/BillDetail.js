/**
 * Created by ziyu on 2017/7/26.
 */

import React, { Component, PropTypes } from 'react'
import { Card, Table, Icon, message, Popover, Input, Button } from 'antd'
import Styles from '../case/details/Index.less'
import { fetchPost } from '../../../utils/request'

class BillDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: null,
      item: props.item
    }
  }

  componentWillReceiveProps (props) {
    if (this.state.userId !== props.userId) {
      this.setState({
        userId: props.userId,
        item: props.item || {}
      })
    }
  }

  render () {
    let collectionOrderDetailVoList = this.state.item.collectionOrderDetailVoList || []
    const columns = [
      {
        title: '账单日',
        dataIndex: 'repaymentDate',
        key: 'repaymentDate',
        render: (text, record) => (
          <div>
             {record.period}期/{record.repaymentDate.split(' ')[0]}
          </div>
        )
      },

      {
        title: '本金+利息+罚息/未还',
        dataIndex: '',
        key: '',
        render: (text, record) => (
          <div>
            {`${record.realCapital}+${record.interest}+${record.lateFee}`}
            <br />
            <span style={{color:'red'}}>{record.noRepayAmount}</span>
          </div>
        )
      },
      {
        title: '应还总额',
        dataIndex: 'expireAmount',
        key: 'expireAmount'
      },
      {
        title: '逾期天数',
        dataIndex: '',
        key: '',
        render: (text, record) => `${record.overdueDays<0?0:record.overdueDays}天`
      },
      {
        title: '实际还款时间',
        dataIndex: 'actualRepaymentDate',
        key: 'actualRepaymentDate'
      }
    ]

    return (
      <div className={Styles.detailModule}>
        <Card title='账单详情'
          noHovering={true}
          bodyStyle={{padding: 0,height:186,overflowY:'scroll'}} >
          <Table
            size='small'
            pagination={false}
            bordered
            dataSource={collectionOrderDetailVoList}
            columns={columns}
            key='name'
          />
        </Card>
      </div>
    )
  }
}

export default BillDetail

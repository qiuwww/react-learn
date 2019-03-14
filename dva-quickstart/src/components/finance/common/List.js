/**
 * Created by ziyu on 17/3/7.
 */
import React, { Component, PropTypes } from 'react'
import { Table, Card } from 'antd'
import styles from './Index.less'

class List extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      stepType: props.stepType,
      list: props.list,
      // loading: false,
      id: null,
      userId: null,
      item: {},
      page: {
        currentPage: 1,
        pageSize: 13,
        totalCount: 0,
      },
    }
  }

  componentWillReceiveProps (props) {
    if (props.list.length > 0) {
      if (props.id != this.state.id ||
        props.userId != this.state.userId || props.isFetch ||
        props.page.totalCount != this.state.page.totalCount) {
        this.setState({
          list: props.list,
          id: props.id,
          userId: props.userId,
          page: props.page,
        })
      }
    } else {
      this.setState({
        list: [],
        id: null,
        userId: null,
        page: props.page,

      })
    }
  }

  // 单击行
  handleClickRow (record) {
    this.setState({
      id: record.auditNo,
      userId: record.userId,
    }, () => {
      this.props.chooseOrder({
        'id': record.auditNo,
        'userId': record.tradeNo,
        'activeKey': 'detail',
        'item': record,
      })
    })
  }

  // 单击行 样式改变
  handleChosedRow (itemId) {
    if (itemId == this.state.id) {
      return styles.active
    } else {
      return styles.listRow
    }
  }

  setPagination () {
    let self = this
    return {
      total: this.state.page.totalCount,
      pageSize: this.state.page.pageSize,
      showSizeChanger: false,
      showQuickJumper: true,
      showTotal (total) {
        return `总共 ${total} 条`
      },
      onChange (current) {
        self.setState({
          page: {
            ...self.state.page,
            current,
          },
        }, () => {
          self.props.currentPage(current)
        })
      },
    }
  }

  render () {
    let self = this
    const columns = [
      {
        title: '订单号',
        dataIndex: '',
        key: '',
        render: (text, record) => {
          return (
            <div>
              <span style={{color:'red'}}>{record.tradeNo}</span>{`/${record.channelCode}`}
            </div>
          )
        },
      },
      {
        title: '借款金额/借款周期',
        key: 'realCapital',
        dataIndex: 'realCapital',
        render: (text, record) => (
          <div>
            {`${record.realCapital}元`}
            <br/>
            {record.productDuration}
          </div>
        ),
      },
    ]

    return (

      <div className='ant-layout-container'>
        <Card bodyStyle={{padding: 0, height: 820}} bordered={false}
              noHovering={true}>
          <Table pagination={this.setPagination(this)} key='auditNo'
                 rowKey='orderNo' columns={columns} dataSource={self.state.list}
                 loading={self.state.loading}
                 bordered
                 onRowClick={(record) => this.handleClickRow(record)}
                 rowClassName={(record) => this.handleChosedRow(record.auditNo)}
                 size='small'
          />
        </Card>
      </div>

    )
  }
}

export default List

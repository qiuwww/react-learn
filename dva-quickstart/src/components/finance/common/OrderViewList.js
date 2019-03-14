/**
 * Created by ziyu on 2017/7/28.
 */
import React, { Component, PropTypes } from 'react'
import { Table, Card, Modal } from 'antd'
import styles from './Index.less'
import { fetchPost } from '../../../utils/request'

class List extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      stepType: props.stepType,
      list: props.list,
      orderList: [],
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
      userId: record.tradeNo,
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

  checkDetail (record) {
    fetchPost('/order/bill/query', {
      tradeNo: record.tradeNo,
      userCode: record.userCode,
      productType: record.productType,
    }).then(res => {
      if (res.code === 0) {
        let list = res.data.itemList
        if (list.length) {
          this.setState({
            orderList: list,
            visible: !this.state.visible,
          })
        }
      } else {
        this.setState({
          orderList: [],
        })
      }
    })
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
        title: '账单详情',
        key: '',
        dataIndex: 'orderDetail',
        render: (text, record) => (
          <div>
            <span></span>
            <a href='javascript:;' onClick={() => {
              this.checkDetail(record)
            }}
               className='operateBtn'>详情</a>
          </div>
        ),
      },
    ]

    const orderColumns = [
      {
        title: '账单号',
        dataIndex: 'billNo',
        key: 'billNo',
      },
      {
        title: '期数',
        dataIndex: 'period',
        key: 'period',
      },
      {
        title: '逾期天数',
        dataIndex: 'overdueStatus',
        key: 'overdueStatus',
        /*render: (text) => (
          `${text}天`
        )*/
      },
    ]

    console.log(this.state.page, 'listPage')
    return (

      <div className='ant-layout-container'>
        <Modal visible={this.state.visible} onCancel={() => {
          this.setState({
            visible: false,
          })
        }} title='订单详情' footer={null}>
          <Table pagination={false} key='orderNo'
                 rowKey='orderNo' columns={orderColumns}
                 dataSource={self.state.orderList}
                 loading={self.state.loading}
                 bordered
                 size='small'
          />
        </Modal>
        <Card bodyStyle={{padding: 0, height: 820}} bordered={false}
              noHovering={true}>
          <Table pagination={this.setPagination(this)} key='orderNo'
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

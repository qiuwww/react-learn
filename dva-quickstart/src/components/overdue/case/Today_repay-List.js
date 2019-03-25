/**
 * Created by ziyu on 17/3/7.
 */
import React, { Component,  } from 'react'
import { Table, Card, Button, Row, Col, Icon } from 'antd'
import styles from './Index.less'

class List extends Component {
  constructor (props) {
    super(props)
    this.state = {
      stepType: props.stepType,
      newCaseCount: props.newCaseCount,
      outCaseCount: props.outCaseCount,
      list: props.list,
      id: null,
      userId: null,
      item: {},
      page: {
        currentPage: 1,
        pageSize: 13,
        totalCount: 0
      }
    }
  }

  componentWillReceiveProps (props) {
    if (props.list.length > 0) {
      if (props.id != this.state.id || props.userId != this.state.userId || props.isFetch || props.page.totalCount != this.state.page.totalCount) {
        this.setState({
          list: props.list,
          id: props.id,
          userId: props.userId,
          page: props.page,
          newCaseCount: props.newCaseCount,
          outCaseCount: props.outCaseCount
        })
      }
    } else {
      this.setState({
        list: [],
        id: null,
        userId: null,
        page: props.page,
        newCaseCount: props.newCaseCount,
        outCaseCount: props.outCaseCount
      })
    }
  }

  // 单击行
  handleClickRow (record) {
    this.setState({
      id: record.tradeNo,
      userId: record.tradeNo
    }, () => {
      this.props.chooseOrder({
        'id': record.tradeNo,
        'userId': record.tradeNo,
        'activeKey': 'baseInfo',
        'item': record
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
            current
          }
        }, () => {
          self.props.currentPage(current)
        })
      }
    }
  }


  render () {
    let self = this
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile'
      },
      {
        title: '新增/复借',
        dataIndex: 'isNewAdd',
        key: 'isNewAdd',
      }
    ]

    columns.forEach((item, index) => {
      columns[index].width = `${columns.length / 100}%`;
    });
    return (
      <div className='ant-layout-container'>
        <Card bodyStyle={{padding: 0, height: 820}} bordered={false} noHovering={true}>
          <Table pagination={this.setPagination(this)} key='collectionNo' columns={columns} dataSource={self.state.list} loading={self.state.loading}
            bordered
            onRowClick={(record) => this.handleClickRow(record)}
            rowClassName={(record) => this.handleChosedRow(record.tradeNo)}
            size='small'
            scroll={{ y: 450 }}
          />
        </Card>
      </div>

    )
  }
}

export default List

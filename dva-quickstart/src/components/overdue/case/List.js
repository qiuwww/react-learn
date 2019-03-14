/**
 * Created by ziyu on 17/3/7.
 */
import React, { Component, PropTypes } from 'react'
import { Table, Card, Button, Row, Col, Icon } from 'antd'
import styles from './Index.less'

class List extends React.Component {
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
      id: record.collectionNo,
      userId: record.tradeNo
    }, () => {
      this.props.chooseOrder({
        'id': record.collectionNo,
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
        title: '序号/渠道号',
        dataIndex: '',
        key: '',
        render: (text, record, index) => (
          <div>{index + 1}/<span style={{color: '#ff8000'}}>{record.channel}</span></div>
        )
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '逾期账单/期数',
        key: '',
        dataIndex: '',
        render: (text, record) => (
          <div>
            {`${parseInt(record.period) > parseInt(record.totalPeriod) ? '全部' : record.period}`}/{`${record.totalPeriod}`}
          </div>
        )
      },
      {
        title: '逾期时间',
        dataIndex: '',
        key: '',
        render: (text, record) => (
          <div>
            {record.maxOverdueDays}天
          </div>
        )
      },
      {
        title: '跟进',
        dataIndex: '',
        key: '',
        render: (text, record) => (
          <div>
            {record.followDays}天前
          </div>
        )
      },
      {
        title: '状态',
        dataIndex: 'collectionStatus',
        key: 'collectionStatus',
        render:(text,record)=>(
          <span style={{color: '#ff8000'}}>
            {text}
          </span>
        )
      }
    ]

    return (

      <div className='ant-layout-container'>
        <Card bodyStyle={{padding: 0, height: 820}} bordered={false} noHovering={true}>
          <Row>
            <Col span={20}>今日新增案件 {this.state.newCaseCount} 条／今日出库案件 {this.state.outCaseCount} 条</Col>
            <Col span={4} className={styles.switchDiv}>
              <Button type="primary" className={styles.switchBtn} onClick={() => this.props.switchChange()}><Icon type="swap" style={{ fontSize: 24, color: '#fff' }} /></Button>
            </Col>
          </Row>
          <Table pagination={this.setPagination(this)} key='collectionNo' columns={columns} dataSource={self.state.list} loading={self.state.loading}
                 bordered
                 onRowClick={(record) => this.handleClickRow(record)}
                 rowClassName={(record) => this.handleChosedRow(record.collectionNo)}
                 size='small'
          />

        </Card>
      </div>

    )
  }
}

export default List

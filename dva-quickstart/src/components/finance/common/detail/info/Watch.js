/**
 * Created by ziyu on 17/3/15.
 */

import React, { Component, PropTypes } from 'react'
import { Table, Collapse } from 'antd'
import Styles from './../Index.less'

const Panel = Collapse.Panel
class Watch extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: props.data,
      loading: false,
      list: []
    }
  }

  componentWillReceiveProps (props) {
    this.setState({
      data: props.data
    })
  }

  render () {
    let watchTitle = '暂无数据！'

    if (this.state.data.watchDetails) {
      if (this.state.data.watchDetails.length > 0) {
        watchTitle = `条数为:${this.state.data.watchDetails.length}`
      }
    } else {
      return <div />
    }

    const columns = [{
      title: '风险行业',
      dataIndex: 'biz_code',
      key: 'biz_code'
    },
    {
      title: '风险类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '风险说明',
      dataIndex: 'code',
      key: 'code'
    }, {
      title: '数据刷新时间',
      dataIndex: 'refresh_time',
      key: 'refresh_time'
    }, {
      title: '结清状态',
      key: 'settlement',
      dataIndex: 'settlement',
      render: (text) => {
        if (text == 'true') {
          return <div>
              已结算
            </div>
        } else {
          return <div>
            <font color='red'>未结算</font>
          </div>
        }
      }
    },
    {
      title: '当前逾期状态',
      key: 'currentOverdueStatus',
      dataIndex: 'currentOverdueStatus',
      render: (text) => {
        if (text == '逾期待处理') {
          return <div>
            <font color='red'>{text}</font>
          </div>
        } else {
          return <div>
            {text}
          </div>
        }
      }
    }
    ]

    return (
      <div className={Styles.checkRecord}>
        <Collapse defaultActiveKey={this.state.data.watchDetails.length?['1']:[]}>
          <Panel header={<div>行业关注名单信息 &nbsp;&nbsp;<font color='#FF8000'>{watchTitle}</font></div>} key='1'>
            <Table
              pagination={false}
              size='small'
              bordered
              dataSource={this.state.data.watchDetails}
              columns={columns}
              key='id'
            />
          </Panel>
        </Collapse>
      </div>

    )
  }
}

export default Watch

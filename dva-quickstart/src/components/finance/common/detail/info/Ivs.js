
/**
 * Created by ziyu on 17/3/13.
 */

import React, { Component, PropTypes } from 'react'
import { Table, Collapse } from 'antd'
import Styles from './../Index.less'
const Panel = Collapse.Panel

class Ivs extends React.Component {
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
    let ivsTitle = '暂无数据！'

    if (this.state.data.ivsDetails) {
      if (this.state.data.ivsDetails.length) {
        ivsTitle = `条数为:${this.state.data.ivsDetails.length}`
      }
    } else {
      return <div />
    }

    const columns = [
      {
        title: '风险因素',
        dataIndex: 'code',
        key: 'code'
      },
      {
        title: '风险描述说明',
        dataIndex: 'description',
        key: 'description'
      }
    ]

    return (
      <div className={Styles.checkRecord}>
        <Collapse defaultActiveKey={this.state.data.ivsDetails.length?['1']:[]}>
          <Panel header={<div>ivs风险因素 &nbsp;&nbsp;<font color='#FF8000'>{ivsTitle}</font></div>} key='1'>
            <Table
              size='small'
              pagination={false}
              bordered
              dataSource={this.state.data.ivsDetails}
              columns={columns}
              key='id'
            />
          </Panel>
        </Collapse>
      </div>

    )
  }
}

export default Ivs

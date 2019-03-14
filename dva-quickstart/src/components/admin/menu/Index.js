/**
 * Created by yujianfu on 2016/11/17.
 */
import React, { Component, PropTypes } from 'react'
import { fetchPost } from './../../../utils/request'
import { Table, Card } from 'antd'
import SecondClass from './SecondClass'
import Edit from './Edit'
import Styles from './Index.less'

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      firstMenus: null,
      activeItem: null,
      activeId: null,
      handleItem: null
    }
  }

  componentDidMount () {
    this.getFirstMenus()
  }

  getFirstMenus () {
    fetchPost('/menu/parent/0/list').then(json => {
      if (json.data != null) {
        let data = json.data.list
        this.setState({
          firstMenus: data,
          activeItem: data[0],
          handleItem: data[0],
          activeId: data[0].id
        })
      }
    })
  }

  // 单击行
  handleClickRow (record) {
    this.setState({
      activeId: record.id,
      activeItem: record,
      handleItem: record
    })
  }

  // 单击行 样式改变
  handleChosedRow (itemId) {
    if (itemId == this.state.activeId) {
      return Styles.active
    } else {
      return ''
    }
  }

  setHandleItem (item) {
    this.setState({
      handleItem: item
    })
  }

  render () {
    const firstColumns = [{
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: 50
    }, {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    }]

    return (
      <div>
        <div style={{width: '14%', display: 'inline-block', float: 'left'}}>
          <Card bodyStyle={{padding: 0}} bordered={false} noHovering={true}>
            <Table
              pagination={false}
              bordered
              style={{background: '#FFFFFF'}}
              dataSource={this.state.firstMenus}
              columns={firstColumns}
              onRowClick={(record) => this.handleClickRow(record)}
              rowClassName={(record) => this.handleChosedRow(record.id)}
              title={() => '一级导航'}
              size='small'
          />
          </Card>
        </div>

        <div style={{width: '52%', display: 'inline-block', float: 'left', paddingLeft: 10}}>
          <SecondClass activeItem={this.state.activeItem} setHandleItem={(item) => this.setHandleItem(item)} />
        </div>

        <div style={{width: '34%', display: 'inline-block', float: 'left', paddingLeft: 10}}>
          <Edit activeItem={this.state.handleItem} setHandleItem={(item) => this.setHandleItem(item)} />
        </div>
      </div>
    )
  }
}

export default Index

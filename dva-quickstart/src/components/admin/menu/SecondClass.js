/**
 * Created by yujianfu on 2016/11/17.
 */
import React, { Component, PropTypes } from 'react'
import { fetchPost } from './../../../utils/request'
import { Table } from 'antd'
import Styles from './Index.less'
import LeafMenus from './LeafMenus'

class SecondClass extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      menus: null,
      activeParentItem: null,
      activeId: null,
      activeItem: null
    }
  }

  componentWillReceiveProps (props) {
    let activeParentItem = props.activeItem
    if (activeParentItem != this.state.activeParentItem) {
      this.setState({
        activeParentItem,
      }, () => {
        this.getMenus(activeParentItem.id)
      })
    }
  }

  getMenus (parenId) {
    fetchPost(`/menu/parent/${parenId}/list`, {}).then(json => {
      if (json.data != null) {
        let data = json.data.list
        this.setState({
          menus: data,
          activeItem: data[0],
          activeId: data[0].id
        })
      }
    })
  }

  // 单击行
  handleClickRow (record) {
    this.setState({
      activeId: record.id,
      activeItem: record
    }, () => {
      this.props.setHandleItem(record)
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
    this.props.setHandleItem(item)
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
        <div style={{width: '30%', display: 'inline-block', float: 'left'}}>
          <Table
            pagination={false}
            bordered
            style={{background: '#FFFFFF'}}
            dataSource={this.state.menus}
            columns={firstColumns}
            onRowClick={(record) => this.handleClickRow(record)}
            rowClassName={(record) => this.handleChosedRow(record.id)}
            title={() => '二级导航'}
            size='small'
          />
        </div>
        <div style={{width: '70%', display: 'inline-block', float: 'left', paddingLeft: 10}}>
          <LeafMenus activeItem={this.state.activeItem} setHandleItem={(item) => this.setHandleItem(item)} />
        </div>
      </div>
    )
  }
}

export default SecondClass

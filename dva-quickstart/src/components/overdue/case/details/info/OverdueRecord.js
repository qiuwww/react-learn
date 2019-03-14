/**
 * Created by Administrator on 2016/11/10.
 */
import React, { Component, PropTypes } from 'react'
import { fetchPost } from '../../../../../utils/request'
import {
  Table,
  message,
  Collapse,
} from 'antd'

class OverdueRecord extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      msgList: [],
      phoneList: [],
      collectionList: [],
      msgNum: 0,
      loading: false,
      recordRefresh: false,
      item: props.item,
      refreshOverdueRecord: props.refreshOverdueRecord
    }
  }

  componentWillReceiveProps (props) {
    let state = null
    if (props.userId != this.state.userId) {
      state = {
        userId: props.userId,
        item: props.item,
      }
    }

    if (props.refreshOverdueRecord) {
      state = {
        recordRefresh: true,
      }
    }

    if (state !== null) {
      this.setState({
        ...this.state,
        loading: false,
        ...state
      }, () => {
        this.getData()
      })
    }

    if (props.userId != this.state.userId || props.recordRefresh) {
      this.setState({
        userId: props.userId,
        loading: false,
        item: props.item,
      }, () => {
        this.getData()
      })
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData () {
    if (this.state.item.tradeNo) {
      fetchPost('/collection/commentGet/list', {
        tradeNo: this.state.item.tradeNo,
      }).then(json => {
        if (json.code === 0) {
          this.setState({
            msgList: json.data.msgList,
            phoneList: json.data.phoneList,
            collectionList: json.data.collectionList,
            msgNum: json.data.msgNum,
          })
        } else {
          message.error('获取催收记录异常')
        }
      })
    }
  }

  getDefaultKey () {
    let defaultKeysArr = []
    if (this.state.collectionList.length) {
      defaultKeysArr.push('1')
    }
    if (this.state.phoneList.length) {
      defaultKeysArr.push('2')
    }
    if (this.state.msgList.length) {
      defaultKeysArr.push('3')
    }
    return defaultKeysArr
  }

  render () {
    let msgList = this.state.msgList
    let phoneList = this.state.phoneList
    let collectionList = this.state.collectionList
    let defaultActiveKey = []
    let self = this
    let msgTitle = '暂无数据!'
    let collectionTitle = '暂无数据!'

    if (collectionList.length > 0) {
      collectionTitle = `条数:${collectionList.length}`
      defaultActiveKey.push('1')
    }
    const collectionColumns = [
      {
        title: '跟进人',
        dataIndex: 'followUp',
        key: 'followUp',
      },
      {
        title: '跟进时间',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
      },
      {
        title: '操作',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => {
          let content = '改变用户状态'
          switch (text) {
            case 1:
              content = '发短信'
              break
            case 2:
              content = '打电话'
              break
            case 3:
              content = '还款'
              break
            case 4:
              content = '添加逾期备注'
              break
          }
          return (
            <div>
              {content}
            </div>
          )
        },
      }, {
        title: '操作内容',
        dataIndex: 'content',
        key: 'content',
        render: (text, record) => {
          let content = text
          if (record.type === 7) {
            content = `${content}，还款时间:${record.promisePayDate}`
          }
          return <div>
            {content}
          </div>
        },
      },
    ]

    let phoneTitle = '暂无数据!'
    if (phoneList.length > 0) {
      defaultActiveKey.push('2')
      phoneTitle = `条数:${phoneList.length}`
    }

    if (msgList.length > 0) {
      defaultActiveKey.push('3')
      msgTitle = `条数: ${msgList.length}; 近一个月已发：${this.state.msgNum || ''}条`
    }
    const Columns = [
      {
        title: '联系人称呼',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '与客户关系',
        dataIndex: 'relation',
        key: 'relation',
      },
      {
        title: '手机号码',
        dataIndex: 'mobile',
        key: 'mobile',
      }, {
        title: '跟进人',
        dataIndex: 'followUp',
        key: 'followUp',
      }, {
        title: '跟进时间',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
      }, {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
      },
    ]
    let keys = this.getDefaultKey()
    let keys2 = ['1']
    const Panel = Collapse.Panel
    return (
      <div>
        <Collapse defaultActiveKey={keys}>
          <Panel
            header={<div>跟进记录 &nbsp;&nbsp;<font
              color='#FF8000'>{collectionTitle}</font></div>}
            key="1">
            <div style={{maxHeight: 300, overflow: 'auto'}}>
              <Table pagination={false} columns={collectionColumns}
                dataSource={collectionList}
                loading={self.state.loading}
                bordered
              />
            </div>

          </Panel>

          <Panel
            header={<div>通话记录 &nbsp;&nbsp;<font
              color='#FF8000'>{phoneTitle}</font></div>}
            key="2">
            <div style={{overflow: 'auto', maxHeight: 300}}>
              <Table pagination={false} columns={Columns} dataSource={phoneList}
                loading={self.state.loading}
                bordered
              />
            </div>
          </Panel>

          <Panel
            header={<div>短信记录 &nbsp;&nbsp;<font
              color='#FF8000'>{msgTitle}</font></div>}
            key="3">
            <div style={{overflow: 'auto', maxHeight: 300}}>
              <Table pagination={false} columns={Columns} dataSource={msgList}
                loading={self.state.loading}
                bordered
              />
            </div>
          </Panel>
        </Collapse>
      </div>
    )
  }
}

export default OverdueRecord

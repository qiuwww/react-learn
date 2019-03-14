/**
 * Created by yujianfu on 2016/11/9.
 */
import React, { Component, PropTypes } from 'react'
import {
  Tabs,
  Card,
  Table,
  Icon,
  Radio,
  Popover,
  Input,
  Button,
  message,
} from 'antd'
import { fetchPost } from '../../../utils/request'
import OverdueRecord from '../case/details/info/OverdueRecord'
import OverdueBillNoOperate from '../case/details/info/OverdueBillNoOperate'
import OverdueBill from '../case/details/info/OverdueBill'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

class Record extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      outerOverdue: props.outerOverdue,
      module: 'overdueRecord',
      refresh: false,
      isShowXZCJ: props.isShowXZCJ, // 是否显示新增催记
      item: props.item,
      refreshOverdueRecord: props.refreshOverdueRecord,
      isCardShow: false,
    }
  }

  componentWillReceiveProps (props) {
    let state = null

    if (props.refreshOverdueRecord) {
      state = {
        refreshOverdueRecord: true,
      }
    }
    if (this.state.userId != props.userId) {
      state = {
        ...state,
        userId: props.userId,
        item: props.item,
      }
    }

    if (state) {
      this.setState({
        ...this.state,
        ...state,
        outerOverdue: props.outerOverdue,
      })
    }
  }

  show () {
    if (this.state.module === 'overdueBill') {
      if (this.state.outerOverdue) {
        return (
          <div>
            <OverdueBillNoOperate userId={this.state.userId}
              refresh={this.state.refresh}/>
          </div>
        )
      } else {
        return (
          <div>
            <OverdueBill userId={this.state.userId}
              refresh={this.state.refresh}/>
          </div>
        )
      }
    } else {
      return (
        <div className='mt10'>
          <OverdueRecord ref={(ref) => {this.overdueRecord = ref}}
            item={this.state.item} userId={this.state.userId}
            refreshOverdueRecord={this.state.refreshOverdueRecord}/>
        </div>
      )
    }
  }
  openCardsShow () {
    this.setState({
      isCardShow: true
    })
  }
  closeCardsShow () {
    this.setState({
      isCardShow: false
    })
  }
  changeField (field, value) {
    this.setState({
      [field]: value,
    })
  }

  showSend (type) {
    let name = '', relation = '', mobile = ''
    let content = ''
    return (
      <div style={{width: 300}}>
        <div className="mb5">
          <Input addonBefore='称呼：' defaultValue={name}
                 onBlur={(e) => { name = e.target.value }}/>
        </div>
        <div className="mb5">
          <Input addonBefore='关系：' defaultValue={relation}
                 onBlur={(e) => { relation = e.target.value }}/>
        </div>
        <div className="mb5">
          <Input addonBefore='手机：' defaultValue={mobile}
                 onBlur={(e) => { mobile = e.target.value }}/>
        </div>
        <div className="mb5">
          <Input addonBefore='内容：' type='textarea' placeholder='请输入内容'
            onBlur={(e) => { content = e.target.value }}
            autosize={{minRows: 4, maxRows: 6}}/>
        </div>
        <div style={{overflow: 'hidden', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
          <Button style={{marginRight: 6}} type='primary' size='small'
            onClick={(e) => this.showContent(type, name, mobile, relation,
            content)}>新增催记</Button>
          <Button type='primary' size='small'
            onClick={(e) => this.closeCardsShow()}>取消</Button>
        </div>
        <font style={{color: 'red', face: 'verdana'}}>*新增后无法做删除操作，请慎重添加</font>
      </div>
    )
  }

  // 表单提交
  showContent (type, name, mobile, relation, content) {
    if (!content) {
      message.error('请输入内容')
      return
    }
    if (!mobile) {
      message.error('请输入号码')
      return
    }
    if (!content.replace(/\s+/g, '').length) {
      message.error('内容不能为空')
      return
    }
    if (!mobile.replace(/\s+/g, '').length) {
      message.error('号码不能为空')
      return
    }
    this.send(type, name, mobile, relation, content)
  }

  send (type, name, mobile, relation, content) {
    if (this.state.userId) {
      fetchPost('/collection/comment/add', {
        userCode: this.state.userId,
        tradeNo: this.state.item.tradeNo,
        collectionNo: this.state.item.collectionNo,
        followId: this.state.item.followId,
        followUp: this.state.item.followUp,
        name,
        relation,
        mobile,
        content,
        type: 4,
        promisePayDate: null,
      }).then(json => {
        if (json.code === 0) {
          message.info('添加成功')
          this.overdueRecord.getData()
          this.setState({
            isCardShow: false
          })
        } else {
          message.error(json.msg)
        }
      })
    }
  }

  render () {
    if (!this.state.userId) {
      return (
        <Card title="跟进记录" noHovering={true}>
          <span className="no-data"><Icon type='frown-o'/>暂无数据</span>
        </Card>
      )
    }
    return (<div>
        <Card title='' noHovering={true}>
          <font size='2'>跟进记录</font>&nbsp;&nbsp;
          {
            this.state.isShowXZCJ ? <Popover key={Math.random().toString(16).substring(2)}
                  content={this.showSend(2)}
                  title=''
                  visible={this.state.isCardShow}
                  trigger='click'>
                <a onClick={this.openCardsShow.bind(this)}>新增催记</a>
              </Popover> : ''
          }
          {/* <div style={{height: 30}}> */}
          {/* <RadioGroup defaultValue={this.state.module} style={{float: 'right', marginRight: 15}} */}
          {/* onChange={(e) => this.changeField('module', e.target.value)}> */}
          {/* <RadioButton value='overdueRecord'>跟进记录</RadioButton> */}
          {/* /!*<RadioButton value='overdueBill'>逾期账单</RadioButton>*!/ */}
          {/* </RadioGroup> */}
          {/* </div> */}
          {this.show()}
        </Card>
      </div>
    )
  }
}

export default Record

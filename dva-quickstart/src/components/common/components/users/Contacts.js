/**
 * Created by yujianfu on 2016/11/10.
 */
import React, {Component, } from 'react'
import {Card, Table, message, Button, Icon, Popover, Input} from 'antd'
import Styles from '../../../finance/common/detail/Index.less'
import {fetchPost} from '../../../../utils/request'

class Contacts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      contactNum: 0,
      relationsNum: 0,
      exceptionNum: 0,
      list: [],
      calls: [],
      contactSelfItem: null,
      callSelfItem: null,
      loading: false,
      sendList: [],
      content: '',
      contactVisible: false,
      callVisible: false,
      message: '',
      timer: null,
      id: props.id
    }
  }

  componentWillUnmount () {
    clearTimeout(this.state.timer)
  }

  componentWillReceiveProps (props) {
    if (this.state.userId != props.userId) {
      this.setState({
        userId: props.userId,
        id: props.id
      }, () => {
        this.getData()
      })
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData () {
    this.setState({
      loading: true
    })
    if (this.state.userId != null) {
      fetchPost(`/user/${this.state.userId}/contactCall/info`, {}).then(json => {
        if (json.code === 0) {
          if (json.data != null) {
            this.setState({
              contactNum: json.data.contactNum,
              relationsNum: json.data.relationsNum,
              exceptionNum: json.data.exceptionNum,
              list: json.data.list || [],
              calls: json.data.calls || [],
              contactSelfItem: json.data.contactSelfItem,
              callSelfItem: json.data.callSelfItem
            })
          }
        } else {
          this.setState({
            contactNum: '',
            relationsNum: '',
            exceptionNum: '',
            list: [],
            calls: [],
            contactSelfItem: {},
            callSelfItem: {},
            message: json.msg
          })
        }
        this.setState({
          loading: false
        })
      })
    } else {
      this.setState({
        contactNum: '',
        relationsNum: '',
        exceptionNum: '',
        list: [],
        calls: [],
        contactSelfItem: {},
        callSelfItem: {}
      })
    }
  }

  message () {
    if (this.state.message) {
      this.state.timer = setTimeout(() => {
        this.setState({
          message: ''
        })
      }, 3000)
      return (
        <span className='color-warning warning-animate'><Icon type='info-circle-o' /> {this.state.message}</span>
      )
    } else {
      return ''
    }
  }

  showSend (type, name, mobile) {
    let content = ''
    let relation = ''
    return (
      <div style={{width: 300}}>
        <Input addonBefore='称呼：' defaultValue={name} onBlur={(e) => {
          name = e.target.value
        }} />
        <Input addonBefore='关系：'  onBlur={(e) => {
          relation = e.target.value
        }} />
        <Input addonBefore='手机：' defaultValue={mobile} onBlur={(e) => {
          mobile = e.target.value
        }} />
        <Input addonBefore='内容：' type='textarea' placeholder='请输入内容' onBlur={(e) => {
          content = e.target.value
        }}
               autosize={{minRows: 4, maxRows: 6}} />
        <div style={{overflow: 'hidden'}}>
          <Button style={{float: 'right'}} type='primary' size='small'
                  onClick={(e) => this.showContent(type, name, mobile, content, relation)}>确认</Button>
        </div>
      </div>
    )
  }

  // 表单提交
  showContent (type, name, mobile, content, relation) {
    if (content == null || content == '') {
      message.error('请输入内容')
      return
    }
    if (!relation) {
      message.error('请输入关系')
      return
    }
    this.send(type, name, mobile, content, relation)
  }

  send (type, name, mobile, content, relation) {
    fetchPost('/audit/operate/phone/remark', {
      auditNo: this.state.id,
      name,
      mobile,
      content,
      relation,
    }).then(json => {
      if (json.code === 0) {
        message.info('添加成功')
      } else {
        message.error(json.msg)
      }
    })
  }

  showContactTotal () {
    let selfItem = this.state.contactSelfItem
    let selfRisk = <font style={{color: '#ec5853', face: 'verdana'}}>通讯录未命中本人号码</font>
    if (selfItem != null && selfItem.hit) {
      selfRisk = <font style={{color: '#f60', face: 'verdana'}}>通讯录命中本人号码(通讯录姓名为):{selfItem.name}</font>
    }
    return (
      <div style={{display: 'inline-block'}}>
        <font style={{color: '#ec5853', face: 'verdana'}}>通讯录:</font>
        总条数:{this.state.contactNum}&nbsp;&nbsp;
        亲戚数:{this.state.relationsNum}&nbsp;&nbsp;
        异常数:{this.state.exceptionNum}&nbsp;&nbsp;
        {selfRisk}
      </div>
    )
  }

  showCallTotal () {
    let selfItem = this.state.callSelfItem
    let selfRisk = <font style={{color: '#ec5853', face: 'verdana'}}>通话记录未命中本人号码</font>
    if (selfItem != null && selfItem.hit) {
      selfRisk = <font style={{color: '#f60', face: 'verdana'}}>通话记录命中本人号码(通讯录姓名为):{selfItem.name}</font>
    }
    return (
      <div style={{display: 'inline-block'}}>
        {selfRisk}
      </div>
    )
  }

  showContactList () {
    this.setState({
      contactVisible: true
    })
  }

  showCallList () {
    this.setState({
      callVisible: true
    })
  }

  render () {
    if (this.state.userId == null) {
      return (
        <span className="no-data"><Icon type='frown-o' />暂无数据</span>
      )
    }
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => {
          if (record.deviceType == 1) {
            return <font color='green'>{text}</font>
          } else if (record.deviceType == 2) {
            return <font color='#f60'>{text}</font>
          } else {
            return <p>{text}</p>
          }
        }
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
        render: (text, record) => {
          if (record.red) {
            return <font color='#f60'>{text}</font>
          } else {
            return <p>{text}</p>
          }
        }
      },
      {
        title: '最后联系时间',
        dataIndex: 'lastTimeContacted',
        key: 'lastTimeContacted'
      },
      {
        title: '联系次数',
        dataIndex: 'timesContacted',
        key: 'timesContacted'
      },
      {
        title: '备注',
        render: (text, record) => {
          if (record.deviceType == 1) {
            return <font color='green'>亲戚</font>
          } else if (record.deviceType == 2) {
            return <font color='#f60'>异常</font>
          }
        }
      }, {
        title: '电话',
        render: (record) => {
          return <Popover key={Math.random().toString(16).substring(2)}
            content={this.showSend(2, record.name, record.phone)}
            title='电话内容'
            trigger='click'
          >
            <Button type='primary' size='small'>电话</Button>
          </Popover>
        }
      }
    ]

    const callsColumns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: '类型',
        dataIndex: 'callType',
        key: 'callType'
      },
      {
        title: '时间',
        dataIndex: 'callTime',
        key: 'callTime'
      },
      {
        title: '时长',
        dataIndex: 'callDuration',
        key: 'callDuration'
      }
    ]

    return (
      <div className={Styles.detailModule}>
        <Card title={this.showContactTotal()} extra={this.message()} bodyStyle={{padding: 0}} noHovering={true}>
          <div style={{maxHeight: 300, overflow: 'auto', textAlign: 'center'}}>
            {
              this.state.list.length < 100 || this.state.contactVisible
                ? <Table
                  size='small'
                  pagination={false}
                  bordered
                  dataSource={this.state.list}
                  columns={columns}
                  loading={this.state.loading}
                  key='name'
                />
                : <Button className='mt10 mb10' type='primary' onClick={() => {
                  this.showContactList()
                }}>点击查看</Button>
            }

          </div>
        </Card>
        <Card className='mt15' title={this.showCallTotal()} bodyStyle={{padding: 0}}>
          <div style={{maxHeight: 300, overflow: 'auto', textAlign: 'center'}}>
            {
              this.state.calls.length < 100 || this.state.callVisible
                ? <Table
                  size='small'
                  pagination={false}
                  bordered
                  dataSource={this.state.calls}
                  columns={callsColumns}
                  loading={this.state.loading}
                  key='name'
                />
                : <Button type='primary' className='mt10 mb10' onClick={() => {
                  this.showCallList()
                }}>点击查看</Button>
            }

          </div>

        </Card>
      </div>
    )
  }
}

export default Contacts

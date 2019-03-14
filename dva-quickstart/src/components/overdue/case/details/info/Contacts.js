/**
 * Created by yujianfu on 2016/11/10.
 */
import React, { Component, PropTypes } from 'react'
import {
  Tabs,
  Card,
  Table,
  message,
  Button,
  Popover,
  Input,
  Popconfirm,
  Icon,
} from 'antd'
import Styles from './../Index.less'
import { fetchPost } from './../../../../../utils/request'
class Contacts extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      contactNum: 0,
      relationsNum: 0,
      exceptionNum: 0,
      list: [
        // {name: 'name0', inputName: 'inputName0', relation: "relation0", phone: 'mobile通讯录', }
      ],
      calls: [],
      contactSelfItem: null,
      callSelfItem: null,
      loading: false,
      sendList: [],
      content: '',
      selectedRowKeys: [],
      selectRows: [],
      display: false,
      showCalls: props.showCalls,
      item: props.item,
      collectionType: props.collectionType,
    }
  }

  showBook () {
    this.setState({
      display: true,
    })
  };

  componentWillReceiveProps (props) {
    if (this.state.userId != props.userId) {
      let showCalls = true
      if (typeof (props.showCalls) !== 'undefined') { showCalls = false }

      this.setState({
        display: false,
        outerOverdue: props.outerOverdue,
        showCalls,
        userId: props.userId,
        item: props.item,
      }, () => {
        this.getData(props.userId)
      })
    }
  }

  componentDidMount () {
    this.getData(this.state.userId)
  }

  getData (userId) {
    if (userId != null) {
      fetchPost(`/user/${userId}/contactCall/info`, {}).then(json => {
        if (json.code === 0) {
          if (json.data != null) {
            this.setState({
              contactNum: json.data.contactNum,
              relationsNum: json.data.relationsNum,
              exceptionNum: json.data.exceptionNum,
              calls: json.data.calls,
              contactSelfItem: json.data.contactSelfItem,
              callSelfItem: json.data.callSelfItem,
              userId,
              selectedRowKeys: [],
              selectRows: [],
              list: json.data.list,
            })
          }
        } else {
          message.error(json.msg==null?"获取通讯录/通话记录错误":json.msg)
        }
      })
    }
  }

  showContactTotal () {
    let selfItem = this.state.contactSelfItem
    let selfRisk = <font
      style={{color: 'green', face: 'verdana'}}>通讯录未命中本人号码</font>
    if (selfItem != null && selfItem.hit) {
      selfRisk = <font style={{color: 'red', face: 'verdana'}}>通讯录命中本人号码(通讯录姓名为):{selfItem.name}</font>
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
    let selfRisk = <font style={{color: 'green', face: 'verdana'}}>通话记录:
      未命中本人号码</font>
    if (selfItem != null && selfItem.hit) {
      selfRisk = <font style={{color: 'red', face: 'verdana'}}>通话记录:
        命中本人号码(通讯录姓名为):{selfItem.name}</font>
    }
    return <div style={{display: 'inline-block'}}>
      {selfRisk}
    </div>
  }

  send (type, name, mobile, content) {
    if (this.state.userId != null) {
      fetchPost('/collection/comment/add', {
        userCode:this.state.userId,
        tradeNo: this.state.item.tradeNo,
        collectionNo: this.state.item.collectionNo,
        followId: this.state.item.followId,
        followUp: this.state.item.followUp,
        name,
        relation: '通讯录好友',
        mobile,
        content,
        type,
      }).then(json => {
        if (json.code === 0) {
          message.info('添加成功')
          this.props.recordRefresh()
        } else {
          message.error(json.msg)
        }
      })
    }
  }

  // 表单提交
  showContent (type, name, mobile, content) {
    if (content == null || content == '') {
      message.error('请输入内容')
      return
    }
    if (content.replace(/\s+/g, '').length == 0) {
      message.error('内容不能为空')
      return
    }
    this.send(type, name, mobile, content)
  }

  showSend (type, name, mobile) {
    let content = ''
    return (
      <div style={{width: 300}}>
        <Input className="mb10" addonBefore='称呼：' defaultValue={name}
               onBlur={(e) => { name = e.target.value }}/>
        <Input className="mb10" addonBefore='手机：' defaultValue={mobile}
               onBlur={(e) => { mobile = e.target.value }}/>
        <Input className="mb10" addonBefore='内容：' type='textarea'
               placeholder='请输入内容'
               onBlur={(e) => { content = e.target.value }}
               autosize={{minRows: 4, maxRows: 6}}/>
        <div className="mt10" style={{overflow: 'hidden'}}>
          <Button style={{float: 'right'}} type='primary' size='small'
            onClick={(e) => this.showContent(type, name, mobile,
            content)}>新增催记</Button>
        </div>
      </div>
    )
  }

  isShow (record) {
    let mobile = record.phone
    if (mobile.indexOf('-') != -1 || mobile.indexOf('(') != -1 ||
      mobile.length != 11) {
      return true
    }
    return false
  }

  batchSend () {
    this.setState({
      selectedRowKeys: [],
    })
    if (this.state.selectedRowKeys.length > 0) {
      fetchPost(`/collection/batch/message/send`, {
        userCode:this.state.userId,
        tradeNo: this.state.item.tradeNo,
        collectionNo: this.state.item.collectionNo,
        followId: this.state.item.followId,
        followUp: this.state.item.followUp,
        content,
        type,
        items: this.state.selectRows,
      }).then(json => {
        if (json.code === 0) {
          message.info('添加成功')
        } else {
          message.error(json.msg)
        }
      })
    }
  }

  handleOutCall (mobile) {
    // clickOutNum(mobile)
  }

  render () {
    if (this.state.list == null || this.state.userId != this.props.userId) {
      return (
        <div>
          <Card title={this.showContactTotal()} bodyStyle={{padding: 1}} noHovering={true}>
            <span className="no-data"><Icon type='frown-o' />暂无数据</span>
          </Card>
        </div>
      )
    }

    let columns = []

    if (this.state.collectionType === '0') {
      columns = [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          render: (text, record) => {
            if (record.deviceType == 1) {
              return <font color='green'>{text}</font>
            } else if (record.deviceType == 2) {
              return <font color='red'>{text}</font>
            } else {
              return <p>{text}</p>
            }
          },
        }, {
          title: '电话',
          dataIndex: 'phone',
          key: 'phone',
          render: (text, record) => {
            if (record.red) {
              return (
                <Popconfirm title="你确定要外呼号码?"
                            onConfirm={(phone) => this.props.outCallDo(record.phone)}>
                  <a href="javascript"><font color="red">{text}</font></a>
                </Popconfirm>
              )
            } else {
              return (
                <Popconfirm title="你确定要外呼号码?"
                            onConfirm={(phone) => this.props.outCallDo(record.phone)}>
                  <a href="javascript"><p style={{color: 'rgb(0, 128, 0)'}}>{text}</p></a>
                </Popconfirm>
              )
            }
          },
        }, {
          title: '最后联系时间',
          dataIndex: 'lastTimeContacted',
          key: 'lastTimeContacted',
        }, {
          title: '次数',
          dataIndex: 'timesContacted',
          key: 'timesContacted',
        }, {
          title: '备注',
          render: (text, record) => {
            if (record.deviceType == 1) {
              return <font color='green'>亲戚</font>
            } else if (record.deviceType == 2) {
              return <font color='red'>异常</font>
            }
          },
        },
        // {
        //   title: '短信',
        //   render: (record) => {
        //     if (this.state.outerOverdue) {
        //       return <p>暂无~</p>
        //     }
        //     return <div>
        //       <Popconfirm placement='left' title={'确认发送?'}
        //                   onConfirm={(e) => this.send(1, record.name,
        //                     record.phone, '')}
        //                   okText='发送' cancelText='取消'>
        //         <Button type='primary' size='small'>短信通知</Button>
        //       </Popconfirm>
        //     </div>
        //   },
        // },
        {
          title: '电话',
          render: (record) => {
            return <Popover key={Math.random().toString(16).substring(2)}
                            content={this.showSend(2, record.name,
                              record.phone)}
                            title='电话内容'
                            trigger='click'
            >
              <Button type='primary' size='small'>催记</Button>
            </Popover>
          },
        },
      ]
    } else {
      columns = [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          render: (text, record) => {
            if (record.deviceType == 1) {
              return <font color='green'>{text}</font>
            } else if (record.deviceType == 2) {
              return <font color='red'>{text}</font>
            } else {
              return <p>{text}</p>
            }
          },
        }, {
          title: '电话',
          dataIndex: 'phone',
          key: 'phone',
          render: (text, record) => {
            if (record.red) {
              return (
                <Popconfirm title="你确定要外呼号码?"
                            onConfirm={(phone) => this.props.outCallDo(record.phone)}>
                  <a href="javascript"><font color="red">{text}</font></a>
                </Popconfirm>
              )
            } else {
              return (
                <Popconfirm title="你确定要外呼号码?"
                            onConfirm={(phone) => this.props.outCallDo(record.phone)}>
                  <a href="javascript"><p style={{color: 'rgb(0, 128, 0)'}}>{text}</p></a>
                </Popconfirm>
              )
            }
          },
        }, {
          title: '主叫/被叫',
          dataIndex: 'calling',
          key: 'calling',
          render: (text, record) => {
            return <span>{text}/{record.called}</span>
          }
        }, {
          title: '时长(秒)',
          dataIndex: 'callTime',
          key: 'callTime',
        }, {
          title: '备注',
          render: (text, record) => {
            if (record.deviceType == 1) {
              return <font color='green'>亲戚</font>
            } else if (record.deviceType == 2) {
              return <font color='red'>异常</font>
            }
          },
        }, {
          title: '电话',
          render: (record) => {
            return (
              <Popover key={Math.random().toString(16).substring(2)}
                       content={this.showSend(2, record.name,
                         record.phone)}
                       title='电话内容'
                       trigger='click'
              >
                <Button type='primary' size='small'>催记</Button>
              </Popover>
            )
          },
        },
      ]
    }

    const callsColumns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
      }, {
        title: '类型',
        dataIndex: 'callType',
        key: 'callType',
      }, {
        title: '时间',
        dataIndex: 'callTime',
        key: 'callTime',
      }, {
        title: '时长',
        dataIndex: 'callDuration',
        key: 'callDuration',
      },
    ]

    const selectedRowKeys = this.state.selectedRowKeys
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        let selectRows = []
        selectedRows.map(function (item) {
          let batchMessageItem = {
            name: item.name,
            relation: '通讯录好友',
            mobile: item.phone,
          }
          selectRows.push(batchMessageItem)
        })
        this.setState({
          selectedRowKeys,
          selectRows,
        })
      },
      getCheckboxProps: (record) => ({
        disabled: this.isShow(record),
      }),
    }

    const hasSelected = selectedRowKeys.length > 0
    return (
      <div className={Styles.detailModule}>
        {!this.state.display && this.state.list.length >= 80
          ? <Card title={this.showContactTotal()} bodyStyle={{padding: 1}} noHovering={true}>
            <div style={{
              width: '100%',
              height: 400,
              paddingLeft: '42%',
              'lineHeight': 34,
            }}>
              <span style={{color: 'black'}}><Button type='primary'
                                                     onClick={() => {
                                                       this.showBook()
                                                     }}>点击查看通讯录</Button></span>
            </div>
          </Card>
          : <Card title={this.showContactTotal()} bodyStyle={{padding: 1}} noHovering={true}>

            <div style={{maxHeight: 400, overflow: 'scroll'}}>
              {/*<div className="ml10 mt10 mb10" style={{marginBottom: 16}}>*/}
                {/*<Popconfirm placement='top' title={'确认发送?'}*/}
                            {/*onConfirm={(e) => this.batchSend()}*/}
                            {/*okText='发送' cancelText='取消'>*/}
                  {/*<Button type='primary' disabled={!hasSelected}>一键短信</Button>*/}
                {/*</Popconfirm>*/}
                {/*<span style={{marginLeft: 8}}>{hasSelected*/}
                  {/*? `已选中 ${selectedRowKeys.length} 条`*/}
                  {/*: ''}</span>*/}
              {/*</div >*/}
              <Table
                rowKey={record => record.key}
                pagination={false}
                bordered
                dataSource={this.state.list}
                columns={columns}
                loading={this.state.loading}
                /*屏蔽一键短信多选框*/
                /*rowSelection={rowSelection}*/
                size='small'
              />
            </div>

          </Card>
        }

        {this.state.showCalls
          ? <Card title={this.showCallTotal()} bodyStyle={{padding: 1}} noHovering={true}>
            <div style={{maxHeight: 150, overflow: 'scroll'}}>
              <Table
                pagination={false}
                bordered
                dataSource={this.state.calls}
                columns={callsColumns}
                loading={this.state.loading}
                size='small'
              />
            </div>
          </Card>
          : <span />
        }
      </div>

    )
  }
}

export default Contacts

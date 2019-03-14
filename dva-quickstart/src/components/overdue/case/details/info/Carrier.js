/**
 * Created by yujianfu on 2016/11/10.
 */
import React, { Component, PropTypes } from 'react'
import { Card, Table, Collapse, Icon, Popover, Input, Button, message, Popconfirm } from 'antd'
import Styles from '../Index.less'
import { fetchPost } from '../../../../../utils/request'
const Panel = Collapse.Panel

class Carrier extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      id: props.id,
      item: props.item,
      data: [],
      callList: [],
      highFrequencyList: [
        // { createtime: '17-09-12', peernumber: 'phone 运营商/高频联系人'},
      ],
      riskCount: null,
      phoneCallList: [],
      merchantPhoneCallList: [],
      billList: [],
      loading: false,
      message: '',
      timer: null,
      collectionType: props.collectionType
    }
  }

  componentWillReceiveProps (props) {
    if (this.state.userId != props.userId) {
      this.setState({
        userId: props.userId,
        id: props.id,
        item: props.item,
        collectionType: props.collectionType
      }, () => {
        this.getData()
      })
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData () {
    if (this.state.userId != null) {
      this.setState({
        loading: true
      })
      fetchPost(`/user/${this.state.userId}/carriers/info`, {}).then(json => {
        if (json.code === 0) {
          if (json.data != null) {
            this.setState({
              data: json.data.list || [],
              callList: json.data.callList || [],
              riskCount: json.data.riskCount,
              phoneCallList: json.data.phoneCallList || [],
              merchantPhoneCallList: json.data.merchantPhoneCallList || [],
              billList: json.data.billList || [],
              highFrequencyList: json.data.highFrequencyDeviceContactList || []
            })
          }
        } else {
          this.setState({
            data: [],
            callList: [],
            riskCount: null,
            phoneCallList: [],
            merchantPhoneCallList: [],
            billList: [],
            highFrequencyList: [],
            message: json.msg
          })
        }
      })
      this.setState({
        loading: false
      })
    } else {
      this.setState({
        data: [],
        callList: [],
        riskCount: null,
        phoneCallList: [],
        merchantPhoneCallList: [],
        billList: [],
        highFrequencyList: [],
        loading: false
      })
    }
  }

  createContent () {
    let data = this.state.data
    let content = []

    data.map(function (item, index) {
      let value = item.value
      if (value == null) {
        value = '--'
      }
      let contentClassName = Styles.content
      if (item.important) {
        contentClassName += ` ${Styles.importantItem}`
      }
      content.push(
        <div key={index} className={contentClassName}>
          <h4><span className={Styles.normalItemLabel}>{item.name}</span>
            :
            <span className={Styles.normalItemContent}>{value}</span>
          </h4>
        </div>)
    })
    let billList = this.state.billList

    if (billList != null) {
      let billHtml = []
      billList.map(function (item, index) {
        billHtml.push(<p className='mt5' key={index}>
          <strong>
            出账日期:{item.billDate}&nbsp;&nbsp;<font
            style={{color: '#ec5853', face: 'verdana'}}>月基本费用:{item.baseFee}</font>&nbsp;&nbsp;
            月总消费{item.totalFee}
          </strong>
        </p>)
      })
      content.push(<div style={{width: '50%', display: 'inline-block', padding: '7px 10px', verticalAlign: 'top'}}>
        {billHtml}
      </div>)
    }

    let callList = this.state.callList
    if (callList != null) {
      let callListHtml = []
      callList.map(function (item, index) {
        callListHtml.push(<p key={index}>
          <strong>{item.name}:{item.value}</strong>
        </p>)
      })
      content.push(<div style={{width: '50%', display: 'inline-block', padding: '7px 10px', verticalAlign: 'top'}}>
        {callListHtml}
      </div>)
    }

    return content
  }

  getTitle () {
    let data = this.state.data
    if (data == null || data.length == 0) {
      return '手机运营商信息 (无)'
    }
    return '手机运营商信息'
  }

  getHighFrequencyTitle () {
    if (this.state.riskCount != null) {
      return <div style={{width: '100%', display: 'inline-block'}}>
        <strong>高频联系人记录:<font style={{color: '#ec5853', face: 'verdana'}}>
          总条数:{this.state.highFrequencyList.length}&nbsp;&nbsp;
          高频商户数:{this.state.riskCount.highFrequencyMerchantCount}&nbsp;&nbsp;
          高频商户异常数:{this.state.riskCount.highFrequencyMerchantRiskCount}&nbsp;&nbsp;
        </font>
        </strong>
      </div>
    } else {
      return (
        <strong>
          高频联系人记录:(空)
        </strong>
      )
    }
  }

  getMerchantTitle () {
    if (this.state.riskCount != null) {
      return (
        <div style={{width: '100%', display: 'inline-block'}}>
          <strong>运营商商户记录数:<font
            style={{
              color: '#ec5853',
              face: 'verdana'
            }}>总条数:{this.state.merchantPhoneCallList.length}&nbsp;&nbsp;
            命中催收数:{this.state.riskCount.merchantOverdueCount}&nbsp;&nbsp;
            命中借贷宝数:{this.state.riskCount.merchantJdbCount}&nbsp;&nbsp;
            异常数:{this.state.riskCount.merchantRiskCount}&nbsp;&nbsp;
            近两个月命中催收数:{this.state.riskCount.merchantLastTwoMouthOverdueCount}&nbsp;&nbsp;
            近两个月异常数:{this.state.riskCount.merchantLastTwoMouthRiskCount}&nbsp;&nbsp;</font>
          </strong>

        </div>
      )
    } else {
      return (
        <strong>
          运营商商户记录数: (空)
        </strong>
      )
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
        <span className='color-warning warning-animate'><Icon type='info-circle-o'/> {this.state.message}</span>
      )
    } else {
      return ''
    }
  }

  componentWillUnmount () {
    clearTimeout(this.state.timer)
  }

  showSend (type, value, relation) {
    let valueArr = value.split('(')
    let mobile = valueArr[0]
    let name = valueArr[1]&&valueArr[1].split(')')[0]
    let content = ''
    let buttonContact = '确认'
    relation = relation ? '本人' : '--'
    if (type == 1 && relation != '本人') {
      return <div style={{width: 300}}>
        <Input addonBefore='称呼：' defaultValue={name} onBlur={(e) => {
          name = e.target.value
        }}/>
        <Input addonBefore='关系：' defaultValue={relation} onBlur={(e) => {
          relation = e.target.value
        }}/>
        <Input addonBefore='手机：' defaultValue={mobile} onBlur={(e) => {
          mobile = e.target.value
        }}/>
        <div style={{overflow: 'hidden'}}>
          <Button style={{float: 'right'}} type='primary' size='small'
                  onClick={(e) => this.showContent(type, name, relation, mobile, content)}>{buttonContact}</Button>
        </div>
      </div>
    }

    return <div style={{width: 300}}>
      <Input addonBefore='称呼：' defaultValue={name} onBlur={(e) => {
        name = e.target.value
      }}/>
      <Input addonBefore='关系：' defaultValue={relation} onBlur={(e) => {
        relation = e.target.value
      }}/>
      <Input addonBefore='手机：' defaultValue={mobile} onBlur={(e) => {
        mobile = e.target.value
      }}/>
      <Input addonBefore='内容：' type='textarea' placeholder='请输入内容' onBlur={(e) => {
        content = e.target.value
      }}
             autosize={{minRows: 4, maxRows: 6}}/>
      <div style={{overflow: 'hidden'}}>
        <Button style={{float: 'right'}} type='primary' size='small'
                onClick={(e) => this.showContent(type, name, relation, mobile, content)}>{buttonContact}</Button>
      </div>
    </div>
  }

  // 表单提交   运营商催记和短信
  showContent (type, name, relation, mobile, content) {
    if ((type == 1 && relation == '本人' && content == '') || (type == 2 && content == '')) {
      message.error('请输入内容')
      return false
    }
    if (this.state.userId != null) {
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
        type
      }).then(json => {
        if (json.code === 0) {
          message.info('添加成功')
          this.props.refreshOverdueRecord()
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
    if (this.state.userId == null) {
      return <span className="no-data"><Icon type='frown-o'/>暂无数据</span>
    }

    let Columns = []

    if (this.state.collectionType === '0') {
      Columns = [
        {
          title: '时间',
          dataIndex: 'createtime',
          key: 'createtime'
        },
        {
          title: '电话',
          dataIndex: 'peernumber',
          key: 'peernumber',
          render: (text, record) => {
            if (record.red) {
              return (
                <Popconfirm title="你确定要外呼号码?"
                            onConfirm={(phone) => this.props.outCallDo(record.peernumber)}>
                  <a href="javascript"><font color="red">{text}</font></a>
                </Popconfirm>
              )
            } else {
              return (
                <Popconfirm title="你确定要外呼号码?"
                            onConfirm={(phone) => this.props.outCallDo(record.peernumber)}>
                  <a href="javascript"><p style={{color: 'rgb(0, 128, 0)'}}>{text}</p></a>
                </Popconfirm>
              )
            }
          }
        },
        {
          title: '备注/商户',
          dataIndex: 'merchantName',
          key: 'merchantName',
          render: (text, record) => {
            return <span>{record.peerremark}/{text?text:'--'}</span>
          }
        },
        {
          title: '主叫/被叫',
          dataIndex: 'calling',
          key: 'calling',
          render: (text, record) => {
            return <span>{text}/{record.called}</span>
          }
        },
        {
          title: '通话地址',
          dataIndex: 'location',
          key: 'location'
        },
        {
          title: '时长',
          dataIndex: 'callTime',
          key: 'callTime'
        },
        {
          title: '电话',
          render: (record) => {
            return (
              <Popover key={Math.random().toString(16).substring(2)}
                       content={this.showSend(2, record.peernumber, record.red)}
                       title='催记内容'
                       trigger='click'
              >
                <Button type='primary' size='small'>催记</Button>
              </Popover>
            )
          }
        },
        // {
        //   title: '短信通知',
        //   render: (record) => {
        //     return (
        //       <Popover key={Math.random().toString(16).substring(2)}
        //                content={this.showSend(1, record.peernumber, record.red)}
        //                title='短信内容'
        //                trigger='click'
        //       >
        //         <Button type='primary' size='small'>短信通知</Button>
        //       </Popover>
        //     )
        //   }
        // }
      ]
    } else {
      Columns = [
        {
          title: '时间',
          dataIndex: 'createtime',
          key: 'createtime'
        },
        {
          title: '电话',
          dataIndex: 'peernumber',
          key: 'peernumber',
          render: (text, record) => {
            if (record.red) {
              return (
                <Popconfirm title="你确定要外呼号码?"
                            onConfirm={(phone) => this.props.outCallDo(record.peernumber)}>
                  <a href="javascript"><font color="#f60">{text}</font></a>
                </Popconfirm>
              )
            } else {
              return (
                <Popconfirm title="你确定要外呼号码?"
                            onConfirm={(phone) => this.props.outCallDo(record.peernumber)}>
                  <a href="javascript"><p style={{color: 'rgb(0, 128, 0)'}}>{text}</p></a>
                </Popconfirm>
              )
            }
          }
        },
        {
          title: '备注/商户',
          dataIndex: 'merchantName',
          key: 'merchantName',
          render: (text, record) => {
            return <span>{record.peerremark}/{text?text:'--'}</span>
          }
        },
        {
          title: '主叫/被叫',
          dataIndex: 'calling',
          key: 'calling',
          render: (text, record) => {
            return <span>{text}/{record.called}</span>
          }
        },
        {
          title: '通话地址',
          dataIndex: 'location',
          key: 'location'
        },
        {
          title: '时长',
          dataIndex: 'callTime',
          key: 'callTime'
        },
        {
          title: '电话',
          render: (record) => {
            return (
              <Popover key={Math.random().toString(16).substring(2)}
                       content={this.showSend(2, record.peernumber, record.red)}
                       title='催记内容'
                       trigger='click'
              >
                <Button type='primary' size='small'>催记</Button>
              </Popover>
            )
          }
        }
      ]
    }

    const merchantPhoneCallColumns = [
      {
        title: '时间',
        dataIndex: 'createtime',
        key: 'createtime'
      },
      {
        title: '电话',
        dataIndex: 'peernumber',
        key: 'peernumber',
        render: (text, record) => {
          if (record.red) {
            return (
              <Popconfirm title="你确定要外呼号码?"
                          onConfirm={(phone) => this.props.outCallDo(record.peernumber)}>
                <a href="javascript"><font className='color-main'>{text}</font></a>
              </Popconfirm>
            )
          } else {
            return (
              <Popconfirm title="你确定要外呼号码?"
                          onConfirm={(phone) => this.props.outCallDo(record.peernumber)}>
                <a href="javascript"><p style={{color: 'rgb(0, 128, 0)'}}>{text}</p></a>
              </Popconfirm>
            )
          }
        }
      },
      {
        title: '备注/商户',
        dataIndex: 'merchantName',
        key: 'merchantName',
        render: (text, record) => {
          return <span>{record.peerremark}/{text?text:'--'}</span>
        }
      },
      {
        title: '主叫/被叫',
        dataIndex: 'calling',
        key: 'calling',
        render: (text, record) => {
          return <span>{text}/{record.called}</span>
        }
      },
      {
        title: '通话地址',
        dataIndex: 'location',
        key: 'location'
      },
      {
        title: '时长',
        dataIndex: 'callTime',
        key: 'callTime'
      }
    ]

    const phoneCallColumns = [
      {
        title: '时间',
        dataIndex: 'createtime',
        key: 'createtime'
      },
      {
        title: '电话',
        dataIndex: 'peernumber',
        key: 'peernumber',
        render: (text, record) => {
          if (record.red) {
            return (
              <Popconfirm title="你确定要外呼号码?"
                          onConfirm={(phone) => this.props.outCallDo(record.peernumber)}>
                <a href="javascript"><font className='color-main'>{text}</font></a>
              </Popconfirm>
            )
          } else {
            return (
              <Popconfirm title="你确定要外呼号码?"
                          onConfirm={(phone) => this.props.outCallDo(record.peernumber)}>
                <a href="javascript"><p style={{color: 'rgb(0, 128, 0)'}}>{text}</p></a>
              </Popconfirm>
            )
          }
        }
      },
      {
        title: '备注/商户',
        dataIndex: 'merchantName',
        key: 'merchantName',
        render: (text, record) => {
          return <span>{record.peerremark}/{text?text:'--'}</span>
        }
      },
      {
        title: '主叫/被叫',
        dataIndex: 'calling',
        key: 'calling',
        render: (text, record) => {
          return <span>{text}/{record.called}</span>
        }
      },
      {
        title: '通话地址',
        dataIndex: 'location',
        key: 'location'
      },
      {
        title: '时长(秒)',
        dataIndex: 'callTime',
        key: 'callTime'
      }
    ]

    return (
      <div className={Styles.detailModule}>
        <Card title={this.getTitle()} extra={this.message()} bodyStyle={{padding: 10}} noHovering={true}>
          {this.createContent()}
          <Collapse defaultActiveKey={[]}>
            <Panel
              header={this.getHighFrequencyTitle()}
              key='1' className='mt10'>
              <div style={{maxHeight: 300, overflow: 'scroll'}}>
                <Table pagination={false}
                       bordered
                       size='small'
                       dataSource={this.state.highFrequencyList}
                       columns={Columns}
                       loading={this.state.loading}
                       key='id'
                />
              </div>
            </Panel>

            <Panel
              header={this.getMerchantTitle()}
              key='2' className='mt10'>
              <div style={{maxHeight: 300, overflow: 'scroll'}}>
                <Table pagination={false}
                       bordered
                       size='small'
                       dataSource={this.state.merchantPhoneCallList}
                       columns={merchantPhoneCallColumns}
                       loading={this.state.loading}
                       key='id'
                />
              </div>
            </Panel>

            <Panel
              header={<strong>运营商呼入呼出记录：{this.state.phoneCallList.length}</strong>}
              key='3' className='mt10'>
              <div style={{maxHeight: 300, overflow: 'scroll'}}>
                <Table pagination={false}
                       bordered
                       size='small'
                       dataSource={this.state.phoneCallList}
                       columns={phoneCallColumns}
                       loading={this.state.loading}
                       key='value'
                />
              </div>
            </Panel>
          </Collapse>
        </Card>
      </div>
    )
  }
}

export default Carrier

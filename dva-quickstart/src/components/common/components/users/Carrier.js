/**
 * Created by yujianfu on 2016/11/10.
 */
import React, { Component, PropTypes } from 'react'
import { Card, Table, Collapse, Icon, Form, Modal, Input } from 'antd'
import Styles from '../../../finance/common/detail/Index.less'
import { fetchPost } from '../../../../utils/request'

const FormItem = Form.Item
const Panel = Collapse.Panel

class Carrier extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      data: [],
      callList: [],
      highFrequencyList: [],
      riskCount: null,
      phoneCallList: [],
      merchantPhoneCallList: [],
      billList: [],
      loading: false,
      message: '',
      timer: null,
      fixedLineModalVisible: false,
    }
  }

  componentWillReceiveProps (props) {
    if (this.state.userId != props.userId) {
      this.setState({
        userId: props.userId,
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
        loading: true,
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
              highFrequencyList: json.data.highFrequencyDeviceContactList || [],
              fixedPhoneCallVoList: json.data.fixedPhoneCallVoList || []
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
            message: json.msg,
            fixedPhoneCallVoList: []
          })
        }
      })
      this.setState({
        loading: false,
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
        loading: false,
        fixedPhoneCallVoList: []
      })
    }
  }

  createContent () {
    let data = this.state.data
    let content = []

    data.map(function (item, index) {
      let value = item.value
      if (value == null) { value = '--' }
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
            style={{
              color: '#ec5853',
              face: 'verdana',
            }}>月基本费用:{item.baseFee}</font>&nbsp;&nbsp;
            月总消费{item.totalFee}
          </strong>
        </p>)
      })
      content.push(<div style={{
        width: '50%',
        display: 'inline-block',
        padding: '7px 10px',
        verticalAlign: 'top',
      }}>
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
      content.push(<div style={{
        width: '50%',
        display: 'inline-block',
        padding: '7px 10px',
        verticalAlign: 'top',
      }}>
        {callListHtml}
      </div>)
    }

    return content
  }

  getTitle () {
    let data = this.state.data
    if (data == null || data.length == 0) { return '手机运营商信息 (无)' }
    return '手机运营商信息'
  }

  getHighFrequencyTitle () {
    if (this.state.riskCount) {
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

  getFixedLineTitle () {
    if (this.state.riskCount) {
      return <div style={{width: '100%', display: 'inline-block'}}>
        <strong>固定联系人记录:<font style={{color: '#ec5853', face: 'verdana'}}>
          总条数:{this.state.fixedPhoneCallVoList.length}&nbsp;&nbsp;
          {/*固定商户数:{this.state.riskCount.highFrequencyMerchantCount}&nbsp;&nbsp;*/}
          {/*固定商户异常数:{this.state.riskCount.highFrequencyMerchantRiskCount}&nbsp;&nbsp;*/}
        </font>
        </strong>
      </div>
    } else {
      return (
        <strong>
          固定联系人记录:(空)
        </strong>
      )
    }
  }

  getMerchantTitle () {
    if (this.state.riskCount) {
      return (
        <div style={{width: '100%', display: 'inline-block'}}>
          <strong>运营商商户记录数:<font
            style={{
              color: '#ec5853',
              face: 'verdana',
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
          message: '',
        })
      }, 3000)
      return (
        <span className='color-warning warning-animate'><Icon
          type='info-circle-o'/> {this.state.message}</span>
      )
    } else {
      return ''
    }
  }

  componentWillUnmount () {
    clearTimeout(this.state.timer)
  }

  changeMerchantInfo (record) {
    this.setState({
      currentFixedLineRecord: record,
      fixedLineModalVisible: true,
    })
  }

  handleMerchantInfo () {
    let self = this;
      this.props.form.validateFields((error, value) => {
        if(!error) {
          let phone = this.state.currentFixedLineRecord.peernumber.split('(')[0]
          fetchPost('/user/carrier/update', {
            phone,
            ...value
          }).then(res => {
              if(res.code === 0) {
                self.setState({
                    fixedLineModalVisible: false
                }, () => {
                  self.getData()
                  self.props.form.resetFields()
                })
              }
          });
        }
      })
  }

  render () {
    if (!this.state.userId) {
      return (
        <Card title="运营商" noHovering={true}>
          <span className="no-data"><Icon type='frown'/>暂无数据</span>
        </Card>
      )
    }

    const Columns = [
      {
        title: '时间',
        dataIndex: 'createtime',
        key: 'createtime',
      },
      {
        title: '电话',
        dataIndex: 'peernumber',
        key: 'peernumber',
        render: (text, record) => {
          if (record.red) {
            return <span color='#f60'>{text}</span>
          } else {
            return <p>{text}</p>
          }
        },
      },
      {
        title: '商户',
        dataIndex: 'merchantName',
        key: 'merchantName',
      },
      {
        title: '主叫/被叫',
        dataIndex: 'calling',
        key: 'calling',
        render: (text, record) => {
          return <span>{text}/{record.called}</span>
        },
      },
      {
        title: '通话地址',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: '时长',
        dataIndex: 'callTime',
        key: 'callTime',
      },
    ]

    const fixedLineColumns = [
      {
        title: '时间',
        dataIndex: 'createtime',
        key: 'createtime',
      },
      {
        title: '电话',
        dataIndex: 'peernumber',
        key: 'peernumber',
        render: (text, record) => {
          if (record.red) {
            return <span color='#f60'>{text}</span>
          } else {
            return <p>{text}</p>
          }
        },
      },
      {
        title: '商户',
        dataIndex: 'merchantName',
        key: 'merchantName',
      },
      {
        title: '主叫/被叫',
        dataIndex: 'calling',
        key: 'calling',
        render: (text, record) => {
          return <span>{text}/{record.called}</span>
        },
      },
      {
        title: '通话地址',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: '时长',
        dataIndex: 'callTime',
        key: 'callTime',
      },
      {
        title: '操作',
        dataIndex: '',
        key: '',
        render: (text, record) => (
          <span>
            <a href="javascript:;"
               onClick={() => {this.changeMerchantInfo(record)}}
               className="operateBtn">修改商户信息</a>
          </span>
        ),
      },
    ]

    const merchantPhoneCallColumns = [
      {
        title: '时间',
        dataIndex: 'createtime',
        key: 'createtime',
      },
      {
        title: '电话',
        dataIndex: 'peernumber',
        key: 'peernumber',
        render: (text, record) => {
          if (record.red) {
            return <font className='color-main'>{text}</font>
          } else {
            return <p>{text}</p>
          }
        },
      },
      {
        title: '商户',
        dataIndex: 'merchantName',
        key: 'merchantName',
      },
      {
        title: '主叫/被叫',
        dataIndex: 'calling',
        key: 'calling',
        render: (text, record) => {
          return <span>{text}/{record.called}</span>
        },
      },
      {
        title: '通话地址',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: '时长',
        dataIndex: 'callTime',
        key: 'callTime',
      },
    ]

    const phoneCallColumns = [
      {
        title: '时间',
        dataIndex: 'createtime',
        key: 'createtime',
      },
      {
        title: '电话',
        dataIndex: 'peernumber',
        key: 'peernumber',
        render: (text, record) => {
          if (record.red) {
            return <font className='color-main'>{text}</font>
          } else {
            return <p>{text}</p>
          }
        },
      },
      {
        title: '商户',
        dataIndex: 'merchantName',
        key: 'merchantName'
      },
      {
        title: '主叫/被叫',
        dataIndex: 'calling',
        key: 'calling',
        render: (text, record) => {
          return <span>{text}/{record.called}</span>
        },
      },
      {
        title: '通话地址',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: '时长(秒)',
        dataIndex: 'callTime',
        key: 'callTime',
      },
    ]

    const {getFieldDecorator} = this.props.form

    return (
      <div className={Styles.detailModule}>
        <Modal
          title="修改商户信息"
          visible={this.state.fixedLineModalVisible}
               onOk={this.handleMerchantInfo.bind(this)}
               onCancel={() => {
                 this.setState({
                     fixedLineModalVisible: false
                 })
               }}
        >
          <Form>
            <FormItem>
              {getFieldDecorator('carrierName',
                {rules: [{required: true, message: '请输入商户信息'}]})(
                <Input placeholder='请输入商户信息' className='mh150' />,
              )}
            </FormItem>
          </Form>

        </Modal>
        <Card title={this.getTitle()} extra={this.message()}
              bodyStyle={{padding: 10}}>
          {this.createContent()}
          <Collapse  defaultActiveKey={[]}>
            {/*高频联系人*/}
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
              header={this.getFixedLineTitle()}
              key='2' className='mt10'>
              <div style={{maxHeight: 300, overflow: 'scroll'}}>
                <Table pagination={false}
                       bordered
                       size='small'
                       dataSource={this.state.fixedPhoneCallVoList}
                       columns={fixedLineColumns}
                       loading={this.state.loading}
                       key='id'
                />
              </div>
            </Panel>
            {/*运营商商户记录*/}
            <Panel
              header={this.getMerchantTitle()}
              key='3' className='mt10'>
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
              header={
                <strong>运营商呼入呼出记录：{this.state.phoneCallList.length}</strong>}
              key='4' className='mt10'>
              <div style={{maxHeight: 300, overflow: 'scroll'}}>
                <Table pagination={false}
                       bordered
                       size='small'
                       dataSource={this.state.phoneCallList}
                       columns={phoneCallColumns}
                       loading={this.state.loading}
                       key='id'
                />
              </div>
            </Panel>
          </Collapse>
        </Card>
      </div>
    )
  }
}

Carrier = Form.create()(Carrier)
export default Carrier

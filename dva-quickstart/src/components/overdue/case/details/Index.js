import React, { Component, PropTypes } from 'react'
import {
  Tabs,
  Card,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Col,
  Collapse,
  DatePicker,
  Select,
} from 'antd'

import { fetchPost } from '../../../../utils/request'
import Contacts from './info/Contacts'
import Relation from './info/Relation'
import Carrier from './info/Carrier'
import Styles from './Index.less'
import Records from '../../common/Record'
import BillDetail from '../../common/BillDetail'
import Info from './info/Info'

const TabPane = Tabs.TabPane
const FormItem = Form.Item
const Panel = Collapse.Panel

class Detail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      id: props.id,
      userId: props.userId,
      activeKey: props.activeKey,
      item: props.item,
      visible: false,
      orderStatus: props.orderStatus,
      tagId: null,
      tagData: [],
      promiseTime: '',
      refreshOverdueRecord: false,
      refreshOrderFollow: false,
      activeRecord: '',
      recordRefresh: false,
      outerOverdue: false,
      collectionType: props.collectionType,
      phoneStatus: props.phoneStatus
    }
  }

  componentWillReceiveProps (props) {
    if (this.state.id != props.id || this.state.userId != props.userId ||
      this.state.orderStatus != props.orderStatus || this.state.phoneStatus != props.phoneStatus) {
      this.setState({
        id: props.id,
        activeKey: props.activeKey,
        userId: props.userId,
        orderStatus: props.orderStatus,
        item: props.item,
        phoneStatus:props.phoneStatus
      })
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData () {
    fetchPost('/collection/status/query').then(res => {
      if (res.code === 0) {
        this.setState({
          tagData: res.data.itemList,
        })
      }
    })

  }

  onChange (activeKey) {
    this.setState({activeKey})
  }

  handleModalOk () {
    let self = this
    if (this.state.tagId == null) {
      message.warning('请选择订单状态标签')
      return false
    }

    let data = {
      type: this.state.tagId,
      content: this.state.tagId == 12 ? this.state.content : this.props.form.getFieldValue('statusDescription'),
      collectionNo: this.state.item.collectionNo,
      tradeNo: this.state.item.tradeNo,
      userCode: this.state.item.userCode,
      name: this.state.item.name,
      mobile: this.state.item.mobile,
      followId: this.state.item.followId,
      followUp: this.state.item.followUp,
    }

    if (this.state.tagId == 7) {
      if (this.state.promiseTime == '') {
        message.warning('请选择承诺时间')
        return false
      } else {
        data.promisePayDate = this.state.promiseTime
      }
    }

    fetchPost('/collection/comment/add', data).then(data => {
      if (data.code === 0) {
        this.changeModal()
        this.props.form.resetFields()
        this.props.refreshList()
        this.setState({
          refreshOrderFollow: true,
        }, () => {
          self.setState({
            refreshOrderFollow: false,
          })
        })
        message.success('操作成功')
      } else {
        message.error(data.msg)
      }
    })
  }

  changeModal () {
    this.props.form.resetFields()
    this.setState({
      visible: !this.state.visible,
      tagId: null,
      promiseTime: '',
    })
  }

  getColor (tagId) {
    if (this.state.tagId == tagId) {
      return '#87d068'
    }
  }

  chooseTag (id) {
    this.setState({
      tagId: id,
    })
  }

  extraContent () {
    return (
      <Button type='primary' onClick={this.changeModal.bind(this)}>操作</Button>
    )
  }

  refreshOverdueRecord () {
    let self = this
    this.setState({
      refreshOverdueRecord: true,
    }, () => {
      self.setState({
        refreshOverdueRecord: false,
      })
    })
  }

  recordRefresh () {
    this.setState({
      recordRefresh: true,
    })
  }

  showCheatDetail () {
    if (this.state.tagId == 12)
      return <Select defaultValue="欺诈类型" style={{width: 120}} onChange={(e) => this.handleChange(e)}>
        <Select.Option value="伪冒申请">伪冒申请</Select.Option>
        <Select.Option value="资料信息虚假">资料信息虚假</Select.Option>
        <Select.Option value="职业信息虚假">职业信息虚假</Select.Option>
        <Select.Option value="用途风险">用途风险</Select.Option>
        <Select.Option value="不良嗜好">不良嗜好</Select.Option>
        <Select.Option value="无还款能力">无还款能力</Select.Option>
        <Select.Option value="长期拖欠">长期拖欠</Select.Option>
        <Select.Option value="不良信息">不良信息</Select.Option>
        <Select.Option value="高风险异常">高风险异常</Select.Option>
        <Select.Option value="代办包装">代办包装</Select.Option>
        <Select.Option value="组团骗贷">组团骗贷</Select.Option>
      </Select>
  }

  handleChange (value) {
    this.setState({
      content: value
    }, () => {
      console.log(this.state.content)
    })
  }

  render () {
    const {getFieldDecorator} = this.props.form
    console.log(this.state.tagId)
    return (
      <div>
        <Modal visible={this.state.visible}
               onOk={this.handleModalOk.bind(this)}
               onCancel={this.changeModal.bind(this)}
        >
          <Form>

            <FormItem>
              <div><strong>状态列表: </strong></div>
              <div>
                {
                  this.state.tagData.map((value, index) => (
                    <Tag key={index} onClick={(e) => this.chooseTag(value.type)}
                         color={this.getColor(value.type)}>{value.desc}</Tag>
                  ))
                }
              </div>

              {
                this.state.tagId !== null && this.state.tagId == 7
                  ? <div> 承诺日期：<DatePicker
                  showTime
                  format='YYYY-MM-DD HH:MM:SS'
                  placeholder='结束时间'
                  onChange={(value, dateString) =>
                    this.setState({
                      promiseTime: dateString,
                    })
                  }
                /></div> : ''
              }

              {this.showCheatDetail()}
            </FormItem>

            {this.state.tagId !== 12 ? <FormItem>
              {getFieldDecorator('statusDescription')(
                <Input placeholder='请输入状态描述' className='mh150' type='textarea'/>,
              )}
            </FormItem> : null
            }
          </Form>
        </Modal>

        <div className={Styles.hideScroll}>
          <Card bodyStyle={{padding: 0}} bordered={false} noHovering={true}>
            <div className=''>
              <Tabs className={Styles.tabs} activeKey={this.state.activeKey}
                    onChange={(e) => this.onChange(e)}
                    tabBarExtraContent={this.extraContent()}>

                <TabPane tab='基本信息' key='baseInfo'>
                  {
                    this.state.activeKey === 'baseInfo'
                      ? <div className={Styles.tabsWrapper}>
                      <div className='clearfix'>
                        <Col span={10}>
                          <Relation
                            refreshOverdueRecord={() => {
                              this.refreshOverdueRecord()
                            }}
                            collectionType={this.state.collectionType}
                            item={this.state.item} id={this.state.id}
                            outCallDo={(phone) => this.props.outCallDo(phone)}
                            userId={this.state.userId}/>
                        </Col>
                        <Col span={14}>
                          <BillDetail item={this.state.item}
                                      userId={this.state.userId}
                                      id={this.state.id}
                          />
                        </Col>
                        {/*<Col span={14}>*/}
                        {/*<Contacts*/}
                        {/*collectionType={this.state.collectionType}*/}
                        {/*recordRefresh={() => this.recordRefresh()}*/}
                        {/*activeRecord={this.state.activeRecord}*/}
                        {/*showCalls={false}*/}
                        {/*refreshOverdueRecord={() => {*/}
                        {/*this.refreshOverdueRecord()*/}
                        {/*}}*/}
                        {/*outCallDo={(phone) => this.props.outCallDo(phone)}*/}
                        {/*id={this.state.id}*/}
                        {/*item={this.state.item}*/}
                        {/*userId={this.state.userId}/>*/}
                        {/*</Col>*/}
                      </div>

                      <div>
                        <Records userId={this.state.userId}
                                 refreshOverdueRecord={this.state.refreshOverdueRecord}
                                 recordRefresh={() => this.recordRefresh()}
                                 refresh={this.state.recordRefresh}
                                 outerOverdue={this.state.outerOverdue}
                                 isShowXZCJ
                                 item={this.state.item}
                        />
                      </div>
                    </div> : null
                  }
                </TabPane>

                {
                  this.state.phoneStatus
                    ? <TabPane tab='通讯录' key='contacts'>
                    {
                      this.state.activeKey === 'contacts'
                        ? <div className={Styles.tabsWrapper}>
                        <Contacts
                          collectionType={this.state.collectionType}
                          recordRefresh={() => this.recordRefresh()}
                          activeRecord={this.state.activeRecord}
                          showCalls={false}
                          refreshOverdueRecord={() => {
                            this.refreshOverdueRecord()
                          }}
                          outCallDo={(phone) => this.props.outCallDo(phone)}
                          id={this.state.id}
                          item={this.state.item}
                          userId={this.state.userId}/>
                        {/*<div className='clearfix'>*/}


                        {/*</div>*/}


                      </div> : null
                    }
                  </TabPane>
                    : ''
                }
                {
                  this.state.phoneStatus
                    ? <TabPane tab='运营商' key='carrier'>
                    {
                      this.state.activeKey === 'carrier'
                        ? <div className={Styles.tabsWrapper}>
                        <Carrier
                          collectionType={this.state.collectionType}
                          refreshOverdueRecord={() => {
                            this.refreshOverdueRecord()
                          }}
                          outCallDo={(phone) => this.props.outCallDo(phone)}
                          id={this.state.id} item={this.state.item}
                          userId={this.state.userId}/>
                      </div>

                        : null
                    }
                  </TabPane>
                    : ''
                }


                <TabPane tab='详细信息' key='userInfo'>
                  {
                    this.state.activeKey === 'userInfo'
                      ? <Info userId={this.state.userId} tradeNo={this.state.item.tradeNo}/>
                      : null
                  }
                </TabPane>
              </Tabs>
            </div>
          </Card>
        </div>
      </div>
    )
  }
}

Detail = Form.create()(Detail)

export default Detail

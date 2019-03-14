/**
 * Created by yujianfu on 2016/11/10.
 */
import React, {Component, PropTypes} from 'react'
import {
  DatePicker,
  Table,
  Form,
  Input,
  Button,
  Card,
  Checkbox,
  Radio,
  Slider,
  Tooltip,
  Icon,
  InputNumber,
  Popconfirm,
  message,
  Alert,
  Collapse,
  Popover,
  Select,
  Tag
} from 'antd'
import Styles from './../Index.less'
import {fetchPost} from './../../../../../utils/request'
const Panel = Collapse.Panel
const FormItem = Form.Item
const Option = Select.Option

class OverdueBill extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      loading: false,
      list: [],
      borrowBillId: null,
      borrowNo: null,
      buttonLoading: false,
      payButtonLoading: false,
      borrowBillDetail: null,
      borrowId: null,
      refreshList: false,
      userCouponList: []
    }
  }

  componentWillReceiveProps (props) {
    let state = null
    if (this.state.userId != props.userId) {
      state = {
        userId: props.userId,
        borrowBillDetail: null
      }
    }

    if (props.refresh == true) {
      state = {
        ...state,
        refreshList: props.refresh
      }
    }

    if (state != null) {
      this.setState({
        ...this.state,
        ...state
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
    // fetchPost('/coupon/'+ this.state.userId +'/coupon/list').then(json=> {
    //  if (json.code === 0) {
    //    var userCouponList = json.data.list;
    //    if (userCouponList != null && userCouponList.length > 0) {
    //      this.setState({
    //        userCouponList: userCouponList
    //      });
    //    }
    //  } else {
    //    message.error(json.msg);
    //  }
    // });

    fetchPost(`/overdue/${this.state.userId}/borrowBill/list`, {}).then(json => {
      if (json.code === 0) {
        if (json.data != null) {
          this.setState({
            list: json.data.list
          })
        }
      } else {
        message.error('获取逾期列表异常')
      }
    })
    this.setState({
      loading: false
    })
  }

  getPayDetail () {
    this.setState({
      buttonLoading: true
    })
    fetchPost(`/overdue/${this.state.borrowBillId}/pay/detail`, {}).then(json => {
      if (json.code === 0) {
        if (json.data != null) {
          this.setState({
            borrowBillDetail: {...json.data}
          })
        }
      } else {
        message.error('详情获取失败')
      }
    })
    this.setState({
      buttonLoading: false
    })
  }

  pay (values) {
    this.setState({
      payButtonLoading: true
    })
    let operateDates = values.operateDates.format('YYYY-MM-DD HH:mm:ss')

    fetchPost(`/overdue/${this.state.borrowBillDetail.borrowId}/${this.state.borrowBillDetail.id}/pay`,
      {...values, operateDates,}).then(json => {
        if (json.code === 0) {
          message.info('支付成功')
          this.getData()
          this.setState({
            borrowBillDetail: null,
            borrowId: null,
            payButtonLoading: false
          })
        } else {
          message.error(json.msg)
        }
      })
  }

  showPay (id, borrowNo) {
    this.setState({
      borrowBillId: id,
      borrowNo,
    }, () => {
      if (this.state.borrowBillId != null) {
        this.getPayDetail()
      }
    })
  }

  // 取消操作
  handleCancel () {
    this.setState({
      borrowBillId: null,
      borrowBillDetail: null
    })
  }

  // 重置
  handleReset (e) {
    e.preventDefault()
    this.props.form.resetFields()
  }

  // 表单提交
  handleSubmit () {
    // 验证
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      if (isNaN(values.paidAmount)) {
        message.error('还款金额 必须为数字')
        return
      }
      if (values.deductAmount == null || isNaN(values.deductAmount)) {
        message.error('人工抵扣 必须为数字')
        return
      }
      if (isNaN(values.operateDates)) {
        message.error('请输入时间')
        return
      }
      this.pay(values)
    })
  }

  getUserCoupon (getFieldDecorator) {
    if (this.state.userCouponList != null && this.state.userCouponList.length > 0) {
      let content = []
      this.state.userCouponList.map(function (item) {
        content.push(
          <Option key={Math.random().toString(16).substring(2)}>
            <Tag color='green'>{item.couponStatusDesc}</Tag>
            有效期:{item.startDate}~{item.endDate}&nbsp;&nbsp; {item.name}:{item.couponValue}元
          </Option>
        )
      })
      return <FormItem
      >
        {getFieldDecorator('couponId', {
          initialValue: ''
        })(
          <Select
            style={{width: 500}}>
            <Option value=''>用户拥有券</Option>
            {content}
          </Select>
        )}
      </FormItem>
    }
    return ''
  }

  showOperate () {
    let borrowBillDetail = this.state.borrowBillDetail
    if (borrowBillDetail == null) {
      return ''
    }
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14}
    }
    let lateServiceFee = 0
    if (this.state.borrowBillDetail.fineFee > 0) {
      lateServiceFee = this.state.borrowBillDetail.lateServiceFee
    }
    let needPaidCash = this.state.borrowBillDetail.payAllMoney - this.state.borrowBillDetail.paidAmount - this.state.borrowBillDetail.deductAmount
    let couponDesc = '未使用'
    let borrowBill = this.state.borrowBillDetail
    if (borrowBill.couponId != null) {
      couponDesc = `名称:${borrowBill.couponName}|优惠金额:${borrowBill.couponValue}元|有效期:${borrowBill.couponStartDate}~${borrowBill.couponEndDate}`
    }
    return <div>
      <Card title='还款' noHovering={true}>
        <div style={{width: '50%', display: 'inline-block'}}>
          <p>订单号：{this.state.borrowNo}</p>
          <p>应还总金额：{borrowBillDetail.payAllMoney }元</p>
          <p>已还现金：{borrowBillDetail.paidAmount}</p>
          <p>抵扣券：{borrowBillDetail.deductAmount}</p>
          <p>还款日期：{borrowBillDetail.repaymentDate }</p>
          <strong><font color='#FF8000'>剩余应还金额：{borrowBillDetail.needPaidCash}元</font></strong>
        </div>
        <div style={{width: '50%', display: 'inline-block'}}>
          <p >当前第{borrowBillDetail.period}期</p>
          <p>逾期服务费：{lateServiceFee}元</p>
          <p>逾期息费：{borrowBillDetail.fineFee}</p>
          <p>逾期天数：{borrowBillDetail.yuQiDays}</p>
          <p>利息：{borrowBillDetail.serviceFee}</p>
          <p>逾期每天罚息：{borrowBillDetail.dayLateFee}元</p>
        </div>
        <div style={{width: '100%', display: 'inline-block'}}>
          <p>优惠券(逾期3天不可使用)：{couponDesc}</p>
        </div>

        <Form horizontal onSubmit={this.handleSubmit} style={{marginTop: 15, width: '70%'}}>
          <FormItem
            {...formItemLayout}
            label='还款金额(现金)'
          >
            {getFieldDecorator('paidAmount', {
              rules: [
                {required: true, message: 'please input your paidAmount'}
              ]
            })(
              <Input />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='人工抵扣'
          >
            {getFieldDecorator('deductAmount', {
              initialValue: '0'
            })(
              <Input placeholder='现金和抵扣相加等于应还则还清' />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='还款时间'
          >
            {getFieldDecorator('operateDates')(
              <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='备注'
          >
            {getFieldDecorator('payReason')(
              <Input type='textarea' placeholder='请输入备注' autosize={{minRows: 3, maxRows: 8}} />
            )}
          </FormItem>

          <FormItem wrapperCol={{span: 16, offset: 6}} style={{marginTop: 24}}>
            <Popconfirm placement='top' title={'确认当前操作？'} onConfirm={(e) => this.handleSubmit(e)} okText='是'
              cancelText='否'>
              <Button type='primary' loading={this.state.payButtonLoading}>确认还款</Button>
            </Popconfirm>
            &nbsp;&nbsp;
            <span>
              <Button onClick={() => this.handleCancel()}>取消</Button>
            </span>
            &nbsp;&nbsp;&nbsp;
            <Button type='ghost' onClick={(e) => this.handleReset(e)}>Reset</Button>
          </FormItem>
        </Form>
      </Card>

    </div>
  }

  showOverdueBillDetail (borrowBillPaidHistories) {
    const historyColumns = [
      {
        title: '订单id',
        dataIndex: 'borrowBillId'
      }, {
        title: '还款金额',
        dataIndex: 'paidAmount'
      }, {
        title: '抵扣金额',
        dataIndex: 'deductAmount'
      }, {
        title: '描述',
        dataIndex: 'deductInfo'
      }, {
        title: '操作人',
        dataIndex: 'createdBy'
      }, {
        title: '操作时间',
        dataIndex: 'createdDate'
      }
    ]

    return (
      <div>
        {this.showOperate()}
        <Table
          pagination={false}
          bordered
          dataSource={borrowBillPaidHistories}
          columns={historyColumns}
        />
      </div>
    )
  }

  render () {
    const columns = [
      {
        title: '订单号',
        dataIndex: 'borrowNo',
        render: (text, render) => {
          if (render.borrowCashFrom == null || render.borrowCashFrom == '') {
            return <div>{text}<font color='#FF8000'>(app)</font></div>
          }
          return <div>{text}<font color='#FF8000'>({render.borrowCashFrom})</font></div>
        },
        width: '10%'
      }, {
        title: '产品',
        dataIndex: 'borrowType',
        width: '10%'
      }, {
        title: '借款日',
        dataIndex: 'createdDate',
        width: '10%'
      }, {
        title: '审核日',
        dataIndex: 'verifiedDate',
        width: '10%'
      }, {
        title: '应还日',
        dataIndex: 'repaymentDate',
        width: '10%'
      }, {
        title: '实际还款日期',
        dataIndex: 'actualRepayMentDate',
        width: '10%'
      }, {
        title: '逾期时长(天)',
        dataIndex: 'yuQiDays',
        width: '5%',
        render: (text) => {
          if (text > 0) {
            return <span style={{color: 'red'}}>{text}</span>
          } else {
            return <span>{text}</span>
          }
        }

      }, {
        title: '逾期备注',
        dataIndex: 'content',
        width: '10%'
      }, {
        title: '应还(本金/利息/罚息)',
        width: '10%',
        render: (text, record) => {
          return <div>
            {record.realCapital}<br />
            {record.serviceFee}<br />
            {record.lateFee}
          </div>
        }
      }, {
        title: '已还(现金/抵扣)',
        width: '10%',
        render: (text, record) => {
          return <div>
            {record.paidAmount}<br />
            {record.deductAmount}
          </div>
        }
      }, {
        title: '操作人',
        dataIndex: 'followUp',
        width: '5%'
      }
      // , {
      //   title: '还款操作',
      //   width: '5%',
      //   render: (record) => {
      //     if (record.paid) {
      //       return <font color="green">已还</font>
      //     }
      //     return <Button type="primary" size="small" loading={this.state.buttonLoading}
      //                    onClick={() => {
      //                      this.showPay(record.id, record.borrowNo)
      //                    }}>还款</Button>
      //   }
      // }
    ]

    return (
      <div>
        <Table
          pagination={false}
          bordered
          dataSource={this.state.list}
          columns={columns}
          expandedRowRender={record => this.showOverdueBillDetail(record.borrowBillPaidHistories)}
        />

      </div>

    )
  }
}
OverdueBill = Form.create()(OverdueBill)
export default OverdueBill

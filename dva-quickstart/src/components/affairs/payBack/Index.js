/**
 * Created by ziyu on 17/3/10.
 */

import Search from "../../common/components/Search";
import Styles from "./payBack.less";
import CommonStyle from "../../common/less/common.less";
import { fetchPost } from "../../../utils/request";
import moment from "moment";
import Modals from "./Modal.js";

import React, { Component } from "react";
import { connect } from "dva";
import {
  Table,
  Button,
  Modal,
  Form,
  message,
  Col,
  Input,
  DatePicker,
  Select
} from "antd";
const Option = Select.Option;

const FormItem = Form.Item;
@connect(({ payBack }) => ({
  data: payBack.data
}))
class PayBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTradeNo: "",
      visible: false,
      list: [],
      params: {
        paidType: "",
        findtype: "",
        inputValue: ""
      },
      page: {
        currentPage: 1,
        pageSize: 20,
        totalCount: 0
      },
      repaymentInfo: {},
      panelParams: [],
      startDt: "",
      searchParams: {
        list: [
          {
            type: "buttonRadio",
            key: "paidType",
            className: "pr20",
            values: [{ name: "全部", value: "" }]
          },
          {
            name: "查询类型",
            type: "group",
            key: ["findtype", "inputValue"],
            className: "pr20",
            values: [{ value: "", name: "请选择" }]
          },
          {
            name: "应还时间",
            type: "range",
            key: ["startDate", "endDate"],
            className: "pr20",
            placeHolder: "",
            values: [moment().subtract("days", 6), moment()]
          },
          {
            name: "",
            type: "search",
            key: "",
            className: "pr20",
            value: []
          }
        ],
        api: "/common/repayment/query"
      }
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData(time) {
    let self = this;
    let copyState = {};
    for (let i in this.state.params) {
      if (this.state.params[i] != "") {
        copyState[i] = this.state.params[i];
      }
    }
    function GetList() {
      return new Promise((resolve, reject) => {
        fetchPost(
          `/liquidation/repayment/list?currentPage=${
            self.state.page.currentPage
          }&pageSize=${self.state.page.pageSize}`,
          copyState
        ).then(res => {
          if (res.code === 0) {
            resolve(res);
          } else {
            reject(res);
            message.error(res.msg);
          }
        });
      });
    }

    Promise.all([GetList()]).then(
      res => {
        let list = res[0];
        let arr = [];

        if (list.data) {
          this.setState({
            list: list.data.list || [],
            page: list.data.page || this.state.page
          });
        }
      },
      () => {
        this.setState({
          list: [],
          panelParams: []
        });
      }
    );
  }

  nextpage(current) {
    this.setState(
      {
        page: {
          ...this.state.page,
          currentPage: current
        }
      },
      () => {
        // console.log(this.state.page,'this.state.page')
        this.getData();
      }
    );
  }

  getPaybackItem(record, time) {
    let url = null;
    if (record) {
      this.state.currentTradeNo = record.orderNo;
      this.setState({
        visible: true
      });
      url = `/liquidation/${
        this.state.currentTradeNo
      }/repayment/info?paymentDt=${moment().format("YYYY-MM-DD HH:MM:SS")}`;
    } else {
      url = `/liquidation/${
        this.state.currentTradeNo
      }/repayment/info?paymentDt=${time}`;
    }
    fetchPost(url).then(res => {
      // this.props.form.setFieldsValue({
      // discountCapital:'',
      // paidCapital:''
      // })
      this.setState({
        repaymentInfo: res.data.repaymentInfo,
        startDt: res.data.repaymentInfo.startDt
      });
    });
  }

  handleOk() {
    let self = this;
    this.props.form.validateFields((error, values) => {
      if (!error) {
        // let data = this.props.form.getFieldsValue();
        // data.happenedAt = data.happenedAt.format('YYYY-MM-DD HH:mm:ss');
        // fetchPost(`/liquidation/${this.state.repaymentInfo.billNo}/repay`, data).then((res) => {
        //   if (res.code === 0) {
        //     self.props.form.resetFields();
        //     this.setState({
        //       visible: !this.state.visible
        //     }, () => {
        //       self.getData()
        //     })
        //   }
        // })
        const data = {
          discountCapital: values.discountCapital,
          repaymentDate: values.happenedAt.format("YYYY-MM-DD HH:mm:ss")
        };
        console.log(data);
        // return false;
        fetchPost("/repayment/artificial/callback", {
          bizApplyDate: values.happenedAt.format("YYYY-MM-DD HH:mm:ss"),
          acceptAmount: values.paidCapital,
          paymentChannelCode: values.payChannel,
          acceptNo: this.state.repaymentInfo.billNo,
          bizNo: this.state.repaymentInfo.billNo,
          infoOrder: JSON.stringify(data)
        }).then(res => {
          if (res.code === 0) {
            self.props.form.resetFields();
            this.setState(
              {
                visible: !this.state.visible
              },
              () => {
                self.getData();
              }
            );
          } else {
            message.error(res.msg);
          }
        });
      }
    });
  }

  handleCancel() {
    this.setState({
      visible: !this.state.visible
    });
  }

  changeParams(params) {
    this.setState(
      {
        params
      },
      () => {
        this.getData();
      }
    );
  }

  handleChangeTime(moment) {
    let time = moment.format("YYYY-MM-DD HH:mm:ss");
    this.getPaybackItem("", time);
  }

  handleChange(e) {}

  getRemainCapital() {
    let res = "";
    let data = this.props.form.getFieldsValue();
    let reg = /^[0-9]*\.?[0-9]{0,2}$/;
    let reg2 = /^[0-9]*\.?[0-9]{0,2}$/;
    if (reg.test(data.paidCapital) && reg2.test(data.discountCapital)) {
      // this.state.repaymentInfo.remainCapital = this.state.repaymentInfo.remainCapital - data.paidCapital
      let temp = this.state.repaymentInfo.remainCapital;
      res = temp - data.paidCapital - data.discountCapital;
    } else if (reg.test(data.paidCapital) && !reg2.test(data.discountCapital)) {
      let temp = this.state.repaymentInfo.remainCapital;
      res = temp - data.paidCapital;
    } else if (!reg.test(data.paidCapital) && reg2.test(data.discountCapital)) {
      let temp = this.state.repaymentInfo.remainCapital;
      res = temp - data.discountCapital;
    } else {
      res = this.state.repaymentInfo.remainCapital;
    }
    return isNaN(res) ? res : Number(res).toFixed(2);
  }

  disabledStartDate = startValue => {
    const endValue = this.state.startDt;
    // console.log(moment('2017-12-13'),'this.state.startDt',startValue,'startValue')
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() <= moment(endValue).valueOf();
  };
  handleLiquidation = record => {
    console.log(1);
    this.props.dispatch({
      type: "payBack/fetch",
      payload: record.orderNo
    });
  };
  render() {
    const self = this;
    const columns = [
      {
        title: "交易号",
        dataIndex: "orderNo",
        key: "orderNo",
        render: (text, record) => (
          <div>{`${record.orderNo}/${record.channel}`}</div>
        )
      },
      {
        title: "姓名",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "手机号",
        dataIndex: "mobile",
        key: "mobile"
      },
      {
        title: "借款金额/周期",
        key: "duration",
        dataIndex: "duration",
        render: (text, record) => (
          <div>{`${record.realCapital}/${record.duration}`}</div>
        )
      },
      {
        title: "打款金额",
        key: "capital",
        dataIndex: "capital"
      },
      {
        title: "应还日/实际还款日",
        dataIndex: "",
        key: "",
        render: (text, record) => {
          if (record.repaymentPlan) {
            return record.repaymentPlan.map(item => {
              return (
                <div key={item.repaymentDate}>
                  <span>
                    {item.repaymentDate} / {item.actualRepaymentDate}
                  </span>
                </div>
              );
            });
          }
        }
      },
      {
        title: "开户行",
        dataIndex: "bankName",
        key: "bankName"
      },
      {
        title: "银行卡号",
        dataIndex: "bankCardNo",
        key: "bankCardNo"
      },
      {
        title: "还款状态",
        dataIndex: "repaymentStat",
        key: "repaymentStat"
      },
      {
        title: "操作",
        dataIndex: "tradeStatus",
        key: "",
        render: (value, record) => {
          if (value != "7") {
            return (
              <span>
                <span style={{ marginRight: 15 }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      this.getPaybackItem(record);
                    }}
                  >
                    还款计划
                  </Button>
                </span>
                <span>
                  <Button
                    type="primary"
                    onClick={() => {
                      this.handleLiquidation(record);
                    }}
                  >
                    线下续期
                  </Button>
                </span>
              </span>
            );
          }
        }
      }
    ];

    const pagination = {
      total: this.state.page.totalCount || 0,
      pageSize: this.state.page.pageSize,
      showSizeChanger: false,
      showQuickJumper: true,
      showTotal(total) {
        return `总共 ${total} 条`;
      },
      onChange(current) {
        self.nextpage(current);
      }
    };
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Modal
          visible={this.state.visible}
          okText="确认还款"
          onOk={() => {
            this.handleOk();
          }}
          onCancel={() => {
            this.handleCancel();
          }}
        >
          <Form className={Styles.formWrapper}>
            <div className={Styles.operationHeader}>
              <span className={Styles.title}>待还款账单</span>
              <span className="ml20">
                订单号: {this.state.repaymentInfo.orderNo}
              </span>
            </div>

            <div className={Styles.info}>
              <div className={Styles.wrapper}>
                <Col span={24} className="mt5">
                  账单编号:{this.state.repaymentInfo.billNo}
                </Col>

                <Col span={12} className="mt5">
                  应还金额:{this.state.repaymentInfo.repaymentCapital}
                </Col>

                <Col span={12} className="mt5">
                  借款金额:{this.state.repaymentInfo.borrowCapital}
                </Col>

                <Col span={12} className="mt5">
                  抵扣金额:{this.state.repaymentInfo.discountCapital}
                </Col>

                <Col span={12} className="mt5">
                  借款期限:{this.state.repaymentInfo.startDt} ~{" "}
                  {this.state.repaymentInfo.repaymentDt}
                </Col>

                <Col span={12} className="mt5">
                  逾期天数:{this.state.repaymentInfo.overdueDays}
                </Col>

                <Col span={12} className="mt5">
                  利息:{this.state.repaymentInfo.interest}
                </Col>

                <Col span={12} className="mt5">
                  服务费:{this.state.repaymentInfo.serviceFee}
                </Col>

                <Col span={12} className="mt5">
                  逾期服务费:{this.state.repaymentInfo.overdueServiceFee}
                </Col>

                <Col span={12} className="mt5">
                  总罚息:{this.state.repaymentInfo.overdueFee}
                </Col>

                <Col span={12} className="mt5">
                  每天罚息:{this.state.repaymentInfo.eachDayOverdueFee}
                </Col>

                <Col span={24} className="font14 color-main mt10">
                  剩余应还:{this.getRemainCapital()}
                </Col>
              </div>

              <FormItem
                className="mt20"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}
                label="还款方式:"
              >
                {getFieldDecorator("payChannel", {
                  rules: [
                    {
                      required: true,
                      message: "请选择支付方式"
                    }
                  ]
                })(
                  <Select
                    placeholder="请选择支付方式"
                    onChange={e => this.handleChange(e)}
                    style={{ width: 200 }}
                  >
                    <Option key="ALI_PAY">支付宝</Option>
                    <Option key="BOC">中国银行</Option>
                  </Select>
                )}
              </FormItem>

              <FormItem
                className="mt20"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}
                label="还款金额:"
              >
                {getFieldDecorator("paidCapital", {
                  rules: [
                    {
                      required: true,
                      message: "请输入还款金额"
                    },
                    {
                      pattern: /^[0-9]*\.?[0-9]{0,2}$/,
                      message: "请输入正确的格式"
                    }
                  ]
                })(<Input type="text" placeholder="请输入还款金额" />)}
              </FormItem>

              <FormItem
                className="mt20"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}
                label="减免金额:"
              >
                {getFieldDecorator("discountCapital", {
                  rules: [
                    {
                      required: true,
                      message: "请输入减免金额"
                    },
                    {
                      pattern: /^[0-9]*\.?[0-9]{0,2}$/,
                      message: "请输入正确的格式"
                    }
                  ]
                })(<Input type="text" placeholder="请输入减免金额" />)}
              </FormItem>

              <FormItem
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}
                label="还款时间:"
              >
                {getFieldDecorator("happenedAt", {
                  rules: [{ required: true }]
                })(
                  <DatePicker
                    onChange={e => {
                      this.handleChangeTime(e);
                    }}
                    disabledDate={this.disabledStartDate}
                  />
                )}
              </FormItem>

              <FormItem
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}
                label="备注:"
              >
                {getFieldDecorator("remark", {})(
                  <Input type="textarea" placeholder="请输入备注" />
                )}
              </FormItem>
            </div>
          </Form>
        </Modal>

        <div className={CommonStyle.searchClass}>
          <Search
            searchParams={this.state.searchParams}
            changeParams={params => this.changeParams(params)}
            showAllReview={this.state.showAllReview}
          />
        </div>
        <br />
        <br />
        <Table
          pagination={pagination}
          size="small"
          key="name"
          columns={columns}
          dataSource={this.state.list}
          sloading={this.state.loading}
          bordered
        />
        <Modals />
      </div>
    );
  }
}

PayBack = Form.create()(PayBack);

export default PayBack;

/**
 * @author lianPf
 * @date 2017-11-13
 * */

import React, { Component } from "react";
import {
  Modal,
  Form,
  Select,
  DatePicker,
  Row,
  Col,
  Input,
  message
} from "antd";
import moment from "moment";
import { fetchPost } from "../../../utils/request";

const { MonthPicker, RangePicker } = DatePicker;
const Option = Select.Option;
const FormItem = Form.Item;
const dateFormat = "YYYY-MM-DD";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalState: props.modalState,
      modalConfig: {
        title: "新增记录",
        maskClosable: false,
        okText: "计算"
        // width: '360px',
      },
      shortTermDisplay: "",
      longTermDisplay: "none",
      allOfflineFundSites: [],
      shortPeriods: [],
      longPeriods: [],
      repayWays: [],
      feeRepayDateTypes: [],
      periods: []
    };

    this.clearFormFields = this.clearFormFields.bind(this);
  }
  componentWillUnmount() {
    this.clearFormFields();
  }

  componentDidMount() {
    fetchPost(`/settle/fund/query`, {}).then(res => {
      if (res.code === 0) {
        // 数据获取 success
        if (res.data !== null) {
          const {
            allOfflineFundSites,
            shortPeriods,
            longPeriods,
            repayWays,
            feeRepayDateTypes
          } = res.data;
          this.setState({
            allOfflineFundSites,
            shortPeriods,
            longPeriods,
            repayWays,
            feeRepayDateTypes,
            periods: shortPeriods
          });
        }
      } else {
        // 数据获取 fail
        message.error(res.msg);
      }
    });
  }

  componentWillReceiveProps(props) {
    if (this.state.modalState != props.modalState) {
      this.setState(
        {
          modalState: props.modalState
        },
        () => {
          console.log("--componentWillReceiveProps--", this.state.modalState);
          if (!this.state.modalState.visible) {
            this.clearFormFields();
          }
        }
      );
    }
  }
  handleChange(event) {
    let {
      shortTermDisplay,
      longTermDisplay,
      periods,
      shortPeriods,
      longPeriods
    } = this.state;
    if (event === "1" || event === "短期") {
      shortTermDisplay = "";
      longTermDisplay = "none";
      periods = shortPeriods;
    } else if (event === "2") {
      shortTermDisplay = "none";
      longTermDisplay = "";
      periods = longPeriods;
    }
    this.setState(
      {
        shortTermDisplay,
        longTermDisplay,
        periods
      },
      () => {
        this.props.form.setFieldsValue({
          ...this.props.form.validateFields(),
          period: ""
        });
      }
    );
  }
  handleOk(event) {
    console.log("--modal-ok--");
    let copyState = {};
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);

        for (let i in values) {
          if (typeof values[i] === "undefined") {
            copyState[i] = "";
          } else {
            if (i === "isShortPeriod") {
              if (values[i] === "1" || values[i] === "短期") {
                copyState[i] = true;
              } else if (values[i] === "2") {
                copyState[i] = false;
              }
            } else if (i === "loanDate") {
              copyState[i] = moment(values[i]).format(dateFormat);
              console.log("--loanDate--", copyState[i]);
            } else {
              copyState[i] = values[i];
            }
          }
        }
      }
    });

    this.setState(
      {
        modalState: {
          ...this.state.modalState
        }
      },
      () => {
        // 调用parent传参数
        console.log("--modal-modalState--", this.state.modalState);
        this.props.sendParams({ ...copyState, btnType: 0 }, event);
      }
    );
  }
  handleCancel(event) {
    // this.clearFormFields();
    let copyState = {};
    for (let i in this.state.modalState) {
      if (i === "visible") {
        copyState[i] = false;
      } else {
        copyState[i] = "";
      }
    }
    this.setState(
      {
        modalState: {
          ...copyState
        }
      },
      () => {
        this.props.sendParams({ ...copyState, btnType: 1 }, event);
      }
    );
  }

  clearFormFields() {
    const params = {
      fundSite: "",
      fundName: "",
      loanDate: "",
      loanAmount: "",
      extraInfo: "",
      isShortPeriod: "短期",
      period: "",
      feeRepayDateType: "",
      repayWay: ""
    };
    this.props.form.setFieldsValue({
      ...params
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalState, shortTermDisplay, longTermDisplay } = this.state;
    const {
      allOfflineFundSites,
      periods,
      shortPeriods,
      longPeriods,
      repayWays,
      feeRepayDateTypes
    } = this.state;
    const { visible } = modalState;

    return (
      <div>
        <Modal
          {...this.state.modalConfig}
          visible={visible}
          onOk={() => {
            this.handleOk();
          }}
          onCancel={() => {
            this.handleCancel();
          }}
        >
          <Form>
            <FormItem
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 12 }}
              label="资方:"
            >
              {getFieldDecorator("fundSite", {
                rules: [
                  {
                    required: true,
                    message: "请选择资方"
                  }
                ]
              })(
                <Select placeholder="请选择资方" style={{ width: 160 }}>
                  {allOfflineFundSites.map((item, index) => {
                    return (
                      <Option key={index} value={item.value}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem
              className="mt20"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 12 }}
              label="打款日:"
            >
              {getFieldDecorator("loanDate", {
                rules: [
                  {
                    required: true,
                    message: "请选择打款日"
                  }
                ]
              })(<DatePicker format={dateFormat} />)}
            </FormItem>

            <FormItem
              className="mt20"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 12 }}
              label="金额:"
            >
              {getFieldDecorator("loanAmount", {
                rules: [
                  {
                    required: true,
                    message: "请填写纯数字金额"
                  }
                ]
              })(<Input type="number" placeholder="请填写金额" size="large" />)}
            </FormItem>

            <FormItem
              className="mt20"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 12 }}
              label="备注:"
            >
              {getFieldDecorator("extraInfo", {
                rules: [
                  {
                    required: true,
                    message: "请填写备注"
                  }
                ]
              })(<Input placeholder="请填写备注" size="large" />)}
            </FormItem>

            <FormItem
              className="mt20"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 12 }}
              label="类型:"
            >
              <Row>
                <Col span={8}>
                  {getFieldDecorator("isShortPeriod", {
                    rules: [
                      {
                        required: true,
                        message: "请选择类型"
                      }
                    ],
                    initialValue: "短期"
                  })(
                    <Select
                      placeholder="请选择类型"
                      onChange={e => this.handleChange(e)}
                      style={{ width: 60 }}
                    >
                      <Option key="1">短期</Option>
                      <Option key="2">长期</Option>
                    </Select>
                  )}
                </Col>
                <Col span={4}>期限:</Col>
                <Col span={12}>
                  {getFieldDecorator("period", {
                    rules: [
                      {
                        required: true,
                        message: "请选择期限"
                      }
                    ]
                  })(
                    <Select placeholder="请选择期限" style={{ width: 160 }}>
                      {periods.map((item, index) => {
                        return (
                          <Option key={index} value={item.value}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Col>
              </Row>
            </FormItem>

            <FormItem
              style={{ display: shortTermDisplay }}
              className="mt20"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 12 }}
              label="服务费还款方式:"
            >
              {getFieldDecorator("feeRepayDateType", {
                rules: [
                  {
                    required: false,
                    message: "请选择服务费还款方式"
                  }
                ]
              })(
                <Select
                  placeholder="请选择服务费还款方式"
                  style={{ width: 160 }}
                >
                  {feeRepayDateTypes.map((item, index) => {
                    return (
                      <Option key={index} value={item.value}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>

            <FormItem
              style={{ display: longTermDisplay }}
              className="mt20"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 12 }}
              label="还款方式:"
            >
              {getFieldDecorator("repayWay", {
                rules: [
                  {
                    required: false,
                    message: "请选择还款方式"
                  }
                ]
              })(
                <Select placeholder="请选择还款方式" style={{ width: 160 }}>
                  {repayWays.map((item, index) => {
                    return (
                      <Option key={index} value={item.value}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

Index = Form.create()(Index);

export default Index;

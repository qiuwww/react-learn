/**
 * Created by ziyu on 17/3/10.
 */
import React, { Component } from "react";
import {
  Table,
  Button,
  message,
  Form,
  Input,
  DatePicker,
  Select,
  Modal,
  Checkbox
} from "antd";
import { fetchPost } from "../../../utils/request";
import moment from "moment";
import Styles from "./index.less";
import echarts from "echarts";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const plainOptions = [
  { label: "Apple", value: "0" },
  { label: "Pear", value: "1" },
  { label: "Orange", value: "2" }
];
class PaymentCenter extends Component {
  constructor(props) {
    super(props);
    this.getListFun = this.getListFun.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCheckAllChange = this.onCheckAllChange.bind(this);
    this.handleClickRow = this.handleClickRow.bind(this);
    this.groupSearch = this.groupSearch.bind(this);
    this.jumpFun = this.jumpFun.bind(this);
    this.handleStylekRow = this.handleStylekRow.bind(this);
    this.state = {
      dataList: [],
      timeObj: "",
      visible: false,
      checkedList: [], //选中产品设置code
      selectList: [], //确定时的产品设置code
      defaultList: [], //默认选中的产品code
      indeterminate: true,
      checkAll: false,
      usedQuota: 0,
      usedStockQuota: 0,
      totalQuota: 0,
      totalStockQuota: 0,
      productData: [],
      rowId: "",
      weight: "",
      formTotalQuota: "",
      formTotalStockQuota: "",
      formWeight: "",
      kucunState: "",
      tableRowNum: 1
    };
  }

  componentDidMount() {
    let that = this;
    this.getListFun();
  }

  changeTime(time, keys) {
    console.log(time);
    console.log(keys);
  }

  initCharts(use, total) {
    if (use === null) {
      use = 0;
    }
    if (total === null) {
      total = 0;
    }
    let useRatio;
    let surplusRatio;
    if (total === 0) {
      useRatio = 0;
      surplusRatio = 100;
    } else {
      useRatio = parseInt((Number(use) / Number(total)) * 100);
      surplusRatio = Number(100 - useRatio);
    }
    if (useRatio >= 100) {
      useRatio = 100;
      surplusRatio = 0;
    }
    console.log("now~~~");
    console.log(useRatio);
    console.log(surplusRatio);
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById("pieBox"));
    myChart.setOption({
      tooltip: {
        trigger: "item",
        formatter: "{d}%"
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: ["使用率"]
      },
      series: [
        {
          name: "",
          type: "pie",
          radius: ["60%", "70%"],
          label: {
            normal: {
              position: "center"
            }
          },
          data: [
            {
              value: useRatio,
              name: "",
              label: {
                normal: {
                  formatter: "{d} %",
                  textStyle: {
                    fontSize: 25
                  }
                }
              }
            },
            {
              value: surplusRatio,
              name: "占位",
              label: {
                normal: {
                  formatter: "\n使用率",
                  textStyle: {
                    color: "#555",
                    fontSize: 16
                  }
                }
              },
              tooltip: {
                show: false
              },
              itemStyle: {
                normal: {
                  color: "#aaa"
                },
                emphasis: {
                  color: "#aaa"
                }
              },
              hoverAnimation: false
            }
          ]
        }
      ]
    });
  }

  initCharts02(use, total) {
    if (use === null) {
      use = 0;
    }
    if (total === null) {
      total = 0;
    }
    let useRatio;
    let surplusRatio;
    if (total === 0) {
      useRatio = 0;
      surplusRatio = 100;
    } else {
      useRatio = parseInt((Number(use) / Number(total)) * 100);
      surplusRatio = Number(100 - useRatio);
    }
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById("pieBox02"));
    // if (myChart != null && myChart != "" && myChart != undefined) {
    //   myChart.dispose();
    // }
    myChart.setOption({
      tooltip: {
        trigger: "item",
        formatter: "{d}%"
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: ["使用率"]
      },
      series: [
        {
          name: "",
          type: "pie",
          radius: ["60%", "70%"],
          label: {
            normal: {
              position: "center"
            }
          },
          data: [
            {
              value: useRatio,
              name: "",
              label: {
                normal: {
                  formatter: "{d} %",
                  textStyle: {
                    fontSize: 25
                  }
                }
              }
            },
            {
              value: surplusRatio,
              name: "占位",
              label: {
                normal: {
                  formatter: "\n使用率",
                  textStyle: {
                    color: "#555",
                    fontSize: 16
                  }
                }
              },
              tooltip: {
                show: false
              },
              itemStyle: {
                normal: {
                  color: "#aaa"
                },
                emphasis: {
                  color: "#aaa"
                }
              },
              hoverAnimation: false
            }
          ]
        }
      ]
    });
  }

  getListFun(data) {
    let that = this;
    fetchPost(`/finance/fundPool/list`, data).then(res => {
      if (res.code === 0) {
        // 控制库存显示
        if (res.data.fundPoolSideVoList[0].fundType === 0) {
          // kucunState
          that.setState({
            kucunState: "block"
          });
        } else {
          that.setState({
            kucunState: "none"
          });
        }
        that.setState(
          {
            dataList: res.data.fundPoolSideVoList,
            productData: res.data.productDetailVoList.map(item => {
              return {
                label: `${item.productCategory},${item.principalMoney}元，${
                  item.days
                }${item.paybackPeriodUnit}`,
                value: item.productCode
              };
            }),
            rowId: res.data.fundPoolSideVoList[0].fundCode,
            usedQuota: res.data.fundPoolSideVoList[0].usedQuota,
            usedStockQuota: res.data.fundPoolSideVoList[0].usedStockQuota,
            totalQuota: res.data.fundPoolSideVoList[0].totalQuota,
            totalStockQuota: res.data.fundPoolSideVoList[0].totalStockQuota,
            weight: res.data.fundPoolSideVoList[0].weight,
            formTotalQuota: res.data.fundPoolSideVoList[0].totalQuota,
            formTotalStockQuota: res.data.fundPoolSideVoList[0].totalStockQuota,
            formWeight: res.data.fundPoolSideVoList[0].weight,
            defaultList: res.data.fundPoolSideVoList[0].productCodeList,
            checkedList: res.data.fundPoolSideVoList[0].productCodeList,
            selectList: res.data.fundPoolSideVoList[0].productCodeList
          },
          () => {
            if (that.state.dataList.length === 0) {
              that.initCharts(0, 100);
              that.initCharts02(0, 100);
            } else {
              // init echart 正常流程
              that.initCharts(
                that.state.dataList[0].usedStockQuota,
                that.state.dataList[0].totalStockQuota
              );
              that.initCharts02(
                that.state.dataList[0].usedQuota,
                that.state.dataList[0].totalQuota
              );
            }
          }
        );
      } else {
        message.error(res.msg);
      }
    });
  }

  jumpFun() {
    window.location.reload();
  }

  groupSearch() {
    let that = this;
    const { validateFields } = this.props.form;
    validateFields((errors, values) => {
      if (errors !== null) {
        return;
      } else {
        if (!/^[0-9]*$/.test(values.totalQuota)) {
          return message.error("额度必须是数字");
        }
        if (!/^[0-9]*$/.test(values.totalStockQuota)) {
          return message.error("库存必须是数字");
        }
        if (!/^[0-9]*$/.test(values.weight)) {
          return message.error("权重必须是数字");
        }
        if (that.state.selectList.length === 0) {
          return message.error("请进行产品设置");
        }
        let data = {
          quota: values.totalQuota,
          stockQuota: values.totalStockQuota,
          weight: values.weight,
          productCode: that.state.selectList
        };
        fetchPost(
          `/finance/update/fundPoolSide?fundCode=${JSON.stringify(
            that.state.rowId
          )}`,
          data
        ).then(res => {
          if (res.code === 0) {
            message.success(res.msg);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            message.error(res.msg);
          }
        });
      }
    });
  }

  handleOk() {
    let that = this;
    this.setState({
      visible: false,
      selectList: that.state.checkedList
    });
  }

  handleCancel() {
    let that = this;
    this.setState({
      visible: false,
      selectList: that.state.defaultList
    });
  }

  showModal() {
    this.setState({
      visible: true
    });
  }

  onChange = checkedList => {
    let that = this;
    this.setState(
      {
        checkedList,
        indeterminate:
          !!checkedList.length &&
          checkedList.length < that.state.productData.length,
        checkAll: checkedList.length === that.state.productData.length
      },
      () => {
        console.log(this.state.checkedList);
      }
    );
  };

  handleStylekRow(e) {
    console.log(this.state.tableRowNum);
    console.log(e);
    if (parseInt(this.state.tableRowNum) === parseInt(e)) {
      return Styles.rowBg;
    } else {
      return "";
    }
  }

  handleClickRow(e) {
    let that = this;
    that.setState({
      tableRowNum: e.fundCode
    });
    // 控制库存显示
    if (e.fundType === 0) {
      // kucunState
      that.setState({
        kucunState: "block"
      });
    } else {
      that.setState({
        kucunState: "none"
      });
    }
    that.setState(
      {
        rowId: e.fundCode,
        usedQuota: e.usedQuota,
        usedStockQuota: e.usedStockQuota,
        totalQuota: e.totalQuota,
        totalStockQuota: e.totalStockQuota,
        weight: e.weight,
        formTotalQuota: e.totalQuota,
        formTotalStockQuota: e.totalStockQuota,
        formWeight: e.weight,
        defaultList: e.productCodeList,
        checkedList: e.productCodeList,
        selectList: e.productCodeList
      },
      () => {
        that.initCharts(e.usedStockQuota, e.totalStockQuota);
        that.initCharts02(e.usedQuota, e.totalQuota);
      }
    );
  }

  onCheckAllChange = e => {
    let that = this;
    this.setState(
      {
        checkedList: e.target.checked
          ? that.state.productData.map(data => {
              return data.value;
            })
          : [],
        indeterminate: false,
        checkAll: e.target.checked
      },
      () => {
        console.log(this.state.checkedList);
      }
    );
  };

  render() {
    const that = this;
    const { getFieldDecorator } = that.props.form;
    const columns = [
      {
        title: "资金方ID",
        dataIndex: "fundCode",
        key: "fundCode"
      },
      {
        title: "资金方名称",
        dataIndex: "fundName",
        key: "fundName"
      },
      {
        title: "资金方类型",
        dataIndex: "fundTypeDesc",
        key: "fundTypeDesc"
      },
      {
        title: "当日额度",
        dataIndex: "totalQuota",
        key: "totalQuota",
        render: (text, record) => {
          return record.totalQuota == null || record.totalQuota == ""
            ? 0
            : record.totalQuota;
        }
      },
      {
        title: "权重",
        dataIndex: "weight",
        key: "weight"
      }
    ];
    return (
      <div className={Styles.payCenter}>
        <div className={Styles.leftBox}>
          <div className={Styles.headBox}>
            <div className={Styles.title}>资金方</div>
            <Button
              type="primary"
              icon="search"
              className={Styles.fr}
              onClick={() => {
                this.jumpFun();
              }}
            >
              刷新
            </Button>
          </div>
          <div className={Styles.tableBox}>
            <Table
              size="small"
              pagination={false}
              bordered
              dataSource={this.state.dataList}
              rowKey={(record, index) => index}
              columns={columns}
              onRowClick={record => this.handleClickRow(record)}
              rowClassName={record => this.handleStylekRow(record.fundCode)}
            />
          </div>
        </div>
        <div className={Styles.rightBox}>
          <div className={Styles.echartsBox}>
            <div className={Styles.fl}>
              <div className={Styles.titleBox}>库存使用情况</div>
              <div>
                <div id="pieBox" className={Styles.pieBox} />
                <div className={Styles.fl}>
                  <div className={Styles.paddingTop}>当日总库存：</div>
                  <div>{this.state.totalStockQuota}</div>
                  <div className={Styles.paddingTop02}>已占用库存</div>
                  <div>{this.state.usedStockQuota}</div>
                </div>
              </div>
            </div>

            <div className={Styles.fl}>
              <div className={Styles.titleBox}>额度使用情况</div>
              <div>
                <div id="pieBox02" className={Styles.pieBox} />
                <div className={Styles.fl}>
                  <div className={Styles.paddingTop}>当日总额度：</div>
                  <div>{this.state.totalQuota}</div>
                  <div className={Styles.paddingTop02}>已使用额度</div>
                  <div>{this.state.usedQuota}</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Form layout="horizontal" style={{ padding: "10px 20px" }}>
              <FormItem label="额度">
                {getFieldDecorator("totalQuota", {
                  initialValue:
                    this.state.formTotalQuota == null
                      ? 0
                      : this.state.formTotalQuota.toString(),
                  rules: [
                    {
                      required: true,
                      message: "请输入额度"
                    }
                  ]
                })(<Input placeholder="请输入" style={{ width: 180 }} />)}
              </FormItem>
              <FormItem label="库存">
                {getFieldDecorator("totalStockQuota", {
                  initialValue:
                    this.state.formTotalStockQuota == null
                      ? 0
                      : this.state.formTotalStockQuota.toString(),
                  rules: [
                    {
                      required: true,
                      message: "请输入库存"
                    }
                  ]
                })(<Input placeholder="请输入" style={{ width: 180 }} />)}
              </FormItem>
              <FormItem label="权重">
                {getFieldDecorator("weight", {
                  initialValue:
                    this.state.formWeight == null
                      ? 0
                      : this.state.formWeight.toString(),
                  rules: [
                    {
                      required: true,
                      message: "请输入权重"
                    }
                  ]
                })(<Input placeholder="请输入" style={{ width: 180 }} />)}
              </FormItem>
              <FormItem>
                <div>
                  <span style={{ color: "red" }}>*</span>{" "}
                  <span style={{ fontWeight: "bold" }}>产品：</span>
                </div>
                <Button
                  type="dashed"
                  onClick={() => {
                    this.showModal();
                  }}
                >
                  设置
                </Button>
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  icon="exception"
                  onClick={() => {
                    this.groupSearch();
                  }}
                >
                  提交
                </Button>
              </FormItem>
            </Form>
            <Modal
              title="产品设置"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <Checkbox
                indeterminate={this.state.indeterminate}
                onChange={this.onCheckAllChange}
                checked={this.state.checkAll}
              >
                全选
              </Checkbox>
              <Form style={{ paddingRight: "280px" }}>
                <CheckboxGroup
                  options={this.state.productData}
                  value={this.state.checkedList}
                  onChange={this.onChange}
                />
              </Form>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}
PaymentCenter = Form.create()(PaymentCenter);
export default PaymentCenter;

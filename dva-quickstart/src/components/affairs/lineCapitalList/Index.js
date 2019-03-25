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
  Upload,
  Icon
} from "antd";
import { fetchPost } from "../../../utils/request";
import Moment from "moment";
import { origin } from "../../../utils/config";
import auth from "../../../services/auth";

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const dateFormat = "YYYY/MM/DD";
const monthFormat = "YYYY/MM";

class LineCapitalList extends Component {
  constructor(props) {
    super(props);
    this.getListFun = this.getListFun.bind(this);
    this.nextpage = this.nextpage.bind(this);
    this.groupSearch = this.groupSearch.bind(this);
    this.pickerFun = this.pickerFun.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.exportHandleOk = this.exportHandleOk.bind(this);
    this.exportHandleCancel = this.exportHandleCancel.bind(this);
    this.showExportModal = this.showExportModal.bind(this);
    this.exportHandleChange = this.exportHandleChange.bind(this);
    this.getFundSide = this.getFundSide.bind(this);
    this.getOrderStatus = this.getOrderStatus.bind(this);
    this.initSelectFunc = this.initSelectFunc.bind(this);
    this.getTimeChange = this.getTimeChange.bind(this);
    this.state = {
      dataList: [],
      initFund: [],
      visible: false,
      page: {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      selectfundCode: "",
      selectStartTime: Moment()
        .subtract(7, "days")
        .format("YYYY-MM-DD 00:00:00"),
      endStartTime: Moment().format("YYYY-MM-DD 23:59:59"),
      verifiedStartTime: Moment()
        .subtract(7, "days")
        .format("YYYY-MM-DD 00:00:00"), //审核开始时间
      verifiedEndTime: Moment().format("YYYY-MM-DD 23:59:59"), //审核的结束时间
      findType: null, //查询类型
      status: 0, //订单状态
      inputValue: null, //输入值
      fundCode: null, //资金方
      rowDetail: [],
      exportVisible: false,
      exportValue: "",
      startDate: "",
      endDate: "",
      exportInit: [],
      orderStatus: [
        {
          label: "待匹配",
          value: -3
        },
        {
          label: "待打款",
          value: 0
        },
        {
          label: "打款中",
          value: 1
        },
        {
          label: "锁住订单",
          value: -2
        },
        {
          label: "打款失败",
          value: -1
        },
        {
          label: "打款成功",
          value: 2
        }
      ],
      totalAmount: null
    };
  }

  getDateFun(obj) {
    var t = obj;
    var array = t.split("-");
    var dt = new Date(array[0], array[1], array[2]);
    return dt;
  }

  getListFun(data) {
    let that = this;
    fetchPost(
      `/finance/fund/list?currentPage=${that.state.page.currentPage}&pageSize=${
        that.state.page.pageSize
      }`,
      data
    ).then(res => {
      if (res.code === 0) {
        // message.success(res.msg)
        that.setState({
          dataList: res.data.prePaymentOrderVos,
          initFund: res.data.fundCodeItemList,
          page: {
            ...this.state.page,
            totalCount: res.page.totalCount || 0
          },
          totalAmount: res.data.totalAmount
        });
      } else {
        message.error(res.msg);
      }
    });
  }

  componentDidMount() {
    let initData = {
      verifiedStartTime: this.state.selectStartTime,
      verifiedEndTime: this.state.endStartTime,
      findType: null,
      inputValue: null,
      status: 0,
      fundCode: null
    };
    this.getListFun(initData);
    this.initSelectFunc();
  }

  changeTime(time, keys) {
    console.log(time);
    console.log(keys);
  }

  getOrderStatus(e) {
    let data = this.state.orderStatus;
    for (let i = 0; i < data.length; i++) {
      if (Number(data[i].value) === Number(e)) {
        return data[i].label;
      }
    }
  }

  getFundSide(e) {
    let data = this.state.initFund;
    for (let i = 0; i < data.length; i++) {
      if (e == null) {
        return "待匹配";
      }
      if (Number(data[i].type) === Number(e)) {
        return data[i].desc;
      }
    }
  }

  groupSearch() {
    let that = this;
    const { validateFields } = that.props.form;
    validateFields((errors, values) => {
      if (errors !== null) {
        return;
      } else {
        // console.log(values)
        that.setState(
          {
            verifiedStartTime: that.state.selectStartTime,
            verifiedEndTime: that.state.endStartTime,
            findType: values.findType === "" ? null : values.findType,
            status: values.status === "" ? null : values.status,
            inputValue: values.inputValue === "" ? null : values.inputValue,
            fundCode: values.fundCode === "" ? null : values.fundCode,
            page: {
              ...this.state.page,
              currentPage: 1
            }
          },
          () => {
            let obj = {
              verifiedStartTime: that.state.verifiedStartTime,
              verifiedEndTime: that.state.verifiedEndTime,
              findType: that.state.findType,
              inputValue: that.state.inputValue,
              status: that.state.status,
              fundCode: that.state.fundCode
            };
            that.getListFun(obj);
          }
        );
      }
    });
  }

  pickerFun(e) {
    console.log(e);
    let that = this;
    if (e.length === 0) {
      that.setState({
        // selectStartTime : that.getDateFun(Moment(e[0]).format('YYYY-MM-DD')),
        // endStartTime: that.getDateFun(Moment(e[1]).format('YYYY-MM-DD'))
        selectStartTime: null,
        endStartTime: null
      });
    } else {
      that.setState({
        // selectStartTime : that.getDateFun(Moment(e[0]).format('YYYY-MM-DD')),
        // endStartTime: that.getDateFun(Moment(e[1]).format('YYYY-MM-DD'))
        selectStartTime: Moment(e[0]).format("YYYY-MM-DD 00:00:00"),
        endStartTime: Moment(e[1]).format("YYYY-MM-DD 23:59:59")
      });
    }
  }

  showModal(e) {
    this.setState({
      visible: true,
      rowDetail: e.orderMoveDetailVoList
    });
  }

  handleCancel() {
    this.setState({
      visible: false
    });
  }

  handleOk() {
    this.setState({
      visible: false
    });
  }

  nextpage(current) {
    let that = this;
    that.setState(
      {
        page: {
          ...that.state.page,
          currentPage: current
        }
      },
      () => {
        console.log("zhelishi");
        console.log(that.state.page.currentPage);
        let obj = {
          verifiedStartTime: that.state.verifiedStartTime,
          verifiedEndTime: that.state.verifiedEndTime,
          findType: that.state.findType,
          inputValue: that.state.inputValue,
          status: that.state.status,
          fundCode: that.state.fundCode
        };
        that.getListFun(obj);
      }
    );
  }

  showExportModal() {
    let that = this;
    that.setState({
      exportVisible: true
    });
  }

  exportHandleOk() {
    //开始导出
    let that = this;
    if (that.state.exportValue === "") {
      return message.error("请选择资金方");
    }
    that.setState({
      exportVisible: false
    });

    let url = `${origin}/finance/exportOutCheckListToExcel?fundCode=${
      that.state.exportValue
    }&startDate=${that.state.startDate}&endDate=${that.state.endDate}`;
    window.open(url);
  }

  exportHandleCancel() {
    let that = this;
    that.setState({
      exportVisible: false
    });
  }

  exportHandleChange(e) {
    let that = this;
    let num = this.state.exportInit;
    for (let i = 0; i < num.length; i++) {
      if (num[i] !== undefined) {
        if (parseInt(num[i].fundCode) === parseInt(e)) {
          that.setState(
            {
              selectfundCode: num[i]
            },
            () => {
              console.log("aa");
              console.log(that.state.selectfundCode);
            }
          );
        }
      }
    }
    that.setState({
      exportValue: e
    });
  }

  showUserInfo(info) {
    if (info.file.status !== "uploading") {
    }
    if (info.file.status === "done") {
      var code = info.file.response.code;
      var msg = info.file.response.msg;
      if (code == 0) {
        message.success(`${info.file.name} file uploaded successfully`);
      } else {
        message.error(msg);
      }
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  initSelectFunc() {
    let that = this;
    fetchPost("/finance/fundPool/list").then(res => {
      if (res.code === 0) {
        // message.success(res.msg)
        that.setState({
          exportInit: res.data.fundPoolSideVoList.map(item => {
            //目前只能支持以下资金方导出：铜牛理财，联连，玛瑙湾理财，钜泷理财 对应 value 6，7，8，9
            if (
              item.fundCode === 6 ||
              item.fundCode === 7 ||
              item.fundCode === 8 ||
              item.fundCode === 9 ||
              item.fundCode === 15
            ) {
              return item;
            }
          })
        });
      } else {
        message.error(res.msg);
      }
    });
  }

  getTimeChange(e) {
    console.log("日期时间选择", e);
    let that = this;
    if (e.length === 0) {
      that.setState({
        startDate: "",
        endDate: ""
      });
    } else {
      that.setState({
        startDate: Moment(e[0]).format("YYYY-MM-DD HH:mm"),
        endDate: Moment(e[1]).format("YYYY-MM-DD HH:mm")
      });
    }
  }

  render() {
    const that = this;
    const { getFieldDecorator } = that.props.form;
    const fundOption = this.state.initFund.map(item => {
      return (
        <Option key={item.type.toString()} value={item.type.toString()}>
          {item.desc}
        </Option>
      );
    });
    const exportOption = this.state.exportInit.map(data => {
      console.log(data);
      if (data !== undefined) {
        return (
          <Option
            key={data.fundCode.toString()}
            value={data.fundCode.toString()}
          >
            {data.fundName}
          </Option>
        );
      }
    });
    const columns = [
      {
        title: "订单编号",
        dataIndex: "orderId",
        key: "orderId",
        width: 200
      },
      {
        title: "资金方",
        dataIndex: "",
        key: "fundCode",
        render: (text, record) => {
          return that.getFundSide(record.fundCode);
        }
      },
      {
        title: "审核通过时间",
        dataIndex: "verifiedTime",
        key: "verifiedTime"
      },
      {
        title: "姓名",
        dataIndex: "acctName",
        key: "acctName"
      },
      {
        title: "手机号",
        dataIndex: "mobile",
        key: "mobile"
      },
      {
        title: "借款金额",
        dataIndex: "contractAmount",
        key: "contractAmount"
      },
      {
        title: "当前状态",
        dataIndex: "",
        key: "status",
        render: (text, record) => {
          return that.getOrderStatus(record.status);
        }
      },
      {
        title: "详细",
        dataIndex: "",
        key: "",
        render: (text, record) => {
          return (
            <a
              className="operateBtn"
              onClick={() => {
                this.showModal(record);
              }}
              href="javascript:;"
            >
              详细
            </a>
          );
        }
      }
    ];
    const columns02 = [
      {
        title: "时间",
        dataIndex: "createDateTime",
        key: "createDateTime"
      },
      {
        title: "状态",
        dataIndex: "",
        key: "status",
        render: (text, record) => {
          return that.getOrderStatus(record.status);
        }
      },
      {
        title: "描述",
        dataIndex: "acceptMessage",
        key: "acceptMessage"
      }
    ];
    //分页
    const pagination = {
      current: this.state.page.currentPage,
      total: this.state.page.totalCount || 0,
      pageSize: this.state.page.pageSize,
      showSizeChanger: false,
      showQuickJumper: true,
      showTotal(total) {
        return `总共 ${total} 条`;
      },
      onChange(current) {
        that.nextpage(current);
      }
    };
    const excelPrams = {
      name: "mFile",
      headers: {
        accessToken: auth.getToken()
      },
      // showUploadList: false,
      action: `${origin}/finance/fund/import`,
      //后期考虑如何反馈信息
      onChange(info) {
        that.showUserInfo(info);
      }
    };
    return (
      <div>
        <Form layout="inline" style={{ padding: "10px 20px" }}>
          <FormItem label="审核通过时间">
            <RangePicker
              onChange={e => {
                this.pickerFun(e);
              }}
              onOpenChange={e => {
                console.log("chufa");
              }}
              defaultValue={[Moment().subtract(7, "days"), Moment()]}
            />
          </FormItem>
          <FormItem label="查询类型">
            {getFieldDecorator("findType", {
              initialValue: ""
            })(
              <Select style={{ width: 100 }}>
                <Option value="">请选择</Option>
                <Option value="name">姓名</Option>
                <Option value="mobile">手机号</Option>
                <Option value="orderId">订单号</Option>
                <Option value="identityNo">身份证号</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="">
            {getFieldDecorator("inputValue", {
              initialValue: ""
            })(<Input placeholder="请输入" style={{ width: 180 }} />)}
          </FormItem>
          <FormItem label="订单状态">
            {getFieldDecorator("status", {
              initialValue: "0"
            })(
              <Select style={{ width: 100 }}>
                <Option value="">请选择</Option>
                <Option value="-3">待匹配</Option>
                <Option value="0">待打款</Option>
                <Option value="1">打款中</Option>
                <Option value="-2">锁住订单</Option>
                <Option value="-1">打款失败</Option>
                <Option value="-11">打款异常</Option>
                <Option value="2">打款成功</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="资金方">
            {getFieldDecorator("fundCode", {
              initialValue: ""
            })(
              <Select style={{ width: 100 }}>
                <Option value="">请选择</Option>
                {fundOption}
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              icon="search"
              onClick={() => {
                this.groupSearch();
              }}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
        <Form layout="inline" style={{ padding: "10px 20px" }}>
          <FormItem>
            <Upload {...excelPrams}>
              <Button>
                <Icon type="upload" />
                导入订单文件(excel)
              </Button>
            </Upload>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              onClick={() => {
                this.showExportModal();
              }}
            >
              线下资金方导出
            </Button>
          </FormItem>
        </Form>
        <h1
          style={{ textAlign: "right", color: "#ec5853", marginRight: "50px" }}
        >
          总金额:
          {this.state.totalAmount == null ? "--.--" : this.state.totalAmount}
        </h1>
        <Table
          size="small"
          pagination={pagination}
          bordered
          dataSource={this.state.dataList}
          rowKey={(record, index) => index}
          columns={columns}
        />
        <Modal
          title="详细"
          visible={this.state.visible}
          onOk={this.handleOk}
          maskClosable={true}
          onCancel={this.handleCancel}
        >
          <Table
            size="small"
            pagination={false}
            bordered
            dataSource={this.state.rowDetail}
            rowKey={(record, index) => index}
            columns={columns02}
          />
        </Modal>
        <Modal
          title="线下资金方导出"
          visible={this.state.exportVisible}
          onOk={this.exportHandleOk}
          maskClosable={true}
          onCancel={this.exportHandleCancel}
        >
          <Form
            layout="inline"
            style={{ padding: "10px 20px", textAlign: "center" }}
          >
            <FormItem label="资金方选择">
              {getFieldDecorator("exportType", {
                initialValue: ""
              })(
                <Select
                  style={{ width: 100 }}
                  onChange={this.exportHandleChange}
                >
                  <Option value="">请选择</Option>
                  {exportOption}
                </Select>
              )}
            </FormItem>
            <FormItem label="时间选择" style={{ margin: "20px" }}>
              <RangePicker
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                onChange={this.getTimeChange}
                onOk={this.getTimeOk}
              />
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  } // render end
}

LineCapitalList = Form.create()(LineCapitalList);
export default LineCapitalList;

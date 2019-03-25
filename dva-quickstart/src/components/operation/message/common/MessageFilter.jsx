import React, { Component } from "react";
import {
  Form,
  Row,
  message,
  Col,
  Input,
  Button,
  Select,
  Modal,
  Message,
  DatePicker,
  Icon,
  Checkbox
} from "antd";
import { fetchPost } from "./request";

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

class MessageFilter extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleModelReset = this.handleModelReset.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.resetSearchParmas = this.resetSearchParmas.bind(this);
    this.disabledDate = this.disabledDate.bind(this);

    this.state = {
      data: [],
      batchNO: [],
      startTime: null,
      endTime: null,
      fileList: [],
      flag: 0,
      apps: [],
      bizs: [],
      servicers: [],
      params: {
        couponType: "1",
        validtimeType: "1",
        startTime: null,
        endTime: null
      },
      visible: false
    };
  }

  componentDidMount() {
    this.getAppList();
    this.getServicerList();
  }

  getServicerList() {
    fetchPost("/servicer/getAllServicer").then(json => {
      if (json.data != null) {
        this.setState({
          servicers: json.data
        });
      }
    });
  }

  getAppList() {
    fetchPost("/appInfo/getAppInfo").then(json => {
      if (json.data != null) {
        var data = json.data;
        console.log(data);
        this.setState({
          apps: data
        });
      }
    });
  }

  getBizFuncList(appId) {
    var param = null;
    if (appId) {
      param = {};
      param.appId = appId;
    }
    fetchPost("/bizFunc/getBizFuncList", param).then(json => {
      if (json.data != null) {
        this.setState({
          bizs: json.data
        });
      }
    });
  }

  handleSearch() {
    const { validateFields } = this.props.form;
    this.props.changeIsLoading();
    validateFields((err, values) => {
      if (!err) {
        let aa = {};
        if (values.appCode) {
          aa.appId = values.appCode;
        }
        if (values.bizCode) {
          aa.bizCode = values.bizCode;
        }
        if (values.servicerName) {
          aa.servicerCode = values.servicerName;
        }
        if (values.time) {
          aa.startTime = values.time[0].format("YYYY-MM-DD HH:mm:ss");
          aa.endTime = values.time[1].format("YYYY-MM-DD HH:mm:ss");
        }
        aa.currentPage = 1;
        this.props.showLoading();
        this.props.getSearchData(aa);
      }
    });
  }
  handleModelReset() {
    const { resetFields } = this.props.form;
    resetFields();
    this.setState({
      visible: false
    });
  }

  handleSubmit() {
    let self = this;
    // this.props.changeIsLoading()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let time = values.time;
        let params = {};
        if (values.validtimeType !== "1") {
          (values.startTime = time[0].format("YYYY-MM-DD HH:mm:ss")),
            (values.endTime = time[1].format("YYYY-MM-DD HH:mm:ss"));
          delete values.time;
        }
        // this.addCoupontemplate(values)
      }
    });
  }

  resetSearchParmas() {
    this.props.changeIsLoading();
    this.props.form.resetFields();
    this.handleReset();
  }
  handleReset() {
    this.props.form.resetFields();
    this.setState(
      {
        visible: false,
        fileList: [],
        startTime: null,
        endTime: null,
        params: {
          couponType: "1",
          validtimeType: "1",
          startTime: null,
          endTime: null
        }
      },
      () => {
        // this.props.getData()
      }
    );
  }

  disabledDate(current) {
    // Can not select days before today and today
    return current && current.valueOf() < Date.now();
  }

  appChange = value => {
    console.log(this.props.form);
    this.props.form.resetFields(["bizCode"]);
    this.getBizFuncList(value);
  };

  render() {
    const appOptions = this.state.apps.map(d => (
      <Select.Option value={d.appId}>{d.appName}</Select.Option>
    ));
    const bizOptions = this.state.bizs.map(d => (
      <Select.Option value={d.bizId}>{d.bizName}</Select.Option>
    ));
    const servierOptions = this.state.servicers.map(d => (
      <Select.Option value={d.servicerCode}>{d.servicerName}</Select.Option>
    ));

    const { getFieldDecorator } = this.props.form;
    /*if(this.state.flag === 0) {
      this.state.flag = 1;
      fetchPost(`/message/0/filterlist`).then(json => {
        if (json.data && json.code === 0) {
          //   appIds: [],
          //   bizCodes: [],
          //   servicerNames: [],
          let apps = json.data.appList
          let servicers = json.data.servicerList
          let bizs = json.data.bizList;
          this.setState({
            apps: apps,
            bizs: bizs,
            servicers: servicers
          })
        }
      })
    }*/
    return (
      <div>
        <Form className="ant-advanced-search-form" style={{ marginBottom: 20 }}>
          <Row gutter={40}>
            <Col span={4}>
              <FormItem {...formItemLayout} label={"App"}>
                {getFieldDecorator("appCode")(
                  <Select placeholder="请选择Appcode" onSelect={this.appChange}>
                    {appOptions}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label={"服务场景"}>
                {getFieldDecorator("bizCode")(
                  <Select placeholder="请选择服务场景">{bizOptions}</Select>
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem {...formItemLayout} label={"服务商"}>
                {getFieldDecorator("servicerName")(
                  <Select placeholder="请选择服务商">{servierOptions}</Select>
                )}
              </FormItem>
            </Col>
            <Col span={9}>
              <FormItem {...formItemLayout} label={"时间选择"}>
                {getFieldDecorator("time")(
                  <RangePicker
                    style={{ width: "100%" }}
                    allowEmpty
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                )}
              </FormItem>
            </Col>

            <Col span={24} style={{ textAlign: "right" }}>
              <Button type="primary" onClick={this.handleSearch}>
                搜索
              </Button>
              <Button
                style={{ marginLeft: 6 }}
                onClick={this.resetSearchParmas}
              >
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

// MessageFilter.propTypes = {
//   form: .object,
//   handleSearch: .func,
//   addList: .func,
// }

export default Form.create()(MessageFilter);

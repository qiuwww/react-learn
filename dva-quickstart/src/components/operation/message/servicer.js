import { successNotify, errorNotify } from "./common/common";
import { treeDeal } from "./common/common.js";

import React, { Component } from "react";
import { fetchPost } from "./common/request";
import {
  Tree,
  Table,
  Card,
  Button,
  Form,
  Message,
  Row,
  Col,
  DatePicker,
  Modal,
  Input,
  Lable,
  Select,
  Popconfirm
} from "antd";
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;

class MessageServicer extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    appList: [],
    selectedKey: null,
    servicerList: [],
    record: {},
    refRecord: {
      smsMsgLinkInfo: {}
    },
    sortedInfo: null,
    // 是否新增服务商服务商
    newServicerModal: false,
    newServicerRefModal: false,
    servicerRefData: []
  };

  // 新增服务商所填字段
  recordServicerNameChange = e => {
    this.state.record.servicerName = e.target.value;
  };
  recordServicerCodeChange = e => {
    this.state.record.servicerCode = e.target.value;
  };
  recordDescInfoChange = e => {
    this.state.record.descInfo = e.target.value;
  };

  // 新增服务商关联所填字段
  refRecordServicerCodeChange = (value, option) => {
    this.state.refRecord.servicerCode = value;
  };
  refRecordAppNameChange = (value, option) => {
    this.state.refRecord.servicerCode = null;
    this.props.form.resetFields();
    this.state.refRecord.appId = value;
  };
  refRecordUrlChange = e => {
    this.state.refRecord.smsMsgLinkInfo.url = e.target.value;
  };
  refChannelNameChange = e => {
    this.state.refRecord.channelName = e.target.value;
  };

  refRecordUserNameChange = e => {
    this.state.refRecord.smsMsgLinkInfo.userName = e.target.value;
  };
  refRecordPasswordChange = e => {
    this.state.refRecord.smsMsgLinkInfo.password = e.target.value;
  };
  refRecordSignChange = e => {
    this.state.refRecord.smsMsgLinkInfo.sign = e.target.value;
  };
  refRecordInterfaceChange = e => {
    this.state.refRecord.smsMsgLinkInfo.interfaceUrl = e.target.value;
  };
  refRecordBatchSendInterfaceUrlChange = e => {
    this.state.refRecord.smsMsgLinkInfo.batchSendInterfaceUrl = e.target.value;
  };
  refRecordVerifyCodeInterfaceUrlChange = e => {
    this.state.refRecord.smsMsgLinkInfo.verifyCodeInterfaceUrl = e.target.value;
  };
  refRecordNoticeSendInterfaceUrlChange = e => {
    this.state.refRecord.smsMsgLinkInfo.noticeSendInterfaceUrl = e.target.value;
  };
  refRecordSaleSendInterfaceUrlChange = e => {
    this.state.refRecord.smsMsgLinkInfo.saleSendInterfaceUrl = e.target.value;
  };
  refRecordQueryStatusInterfaceUrlChange = e => {
    this.state.refRecord.smsMsgLinkInfo.queryStatusInterfaceUrl =
      e.target.value;
  };
  refRecordQueryBalanceInterfaceUrlChange = e => {
    this.state.refRecord.smsMsgLinkInfo.queryBalanceInterfaceUrl =
      e.target.value;
  };
  refRecordQueryMsgReportUrlInterfaceUrlChange = e => {
    this.state.refRecord.smsMsgLinkInfo.queryMsgReportUrlInterfaceUrl =
      e.target.value;
  };

  // 加载树形控件
  onLoadTreeData = treeNode => {
    return new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
    });
  };
  renderTreeNodes = data => {
    return data.map(item => {
      return (
        <TreeNode
          title={item.servicerName}
          isLeaf={true}
          key={item.servicerCode}
          dataRef={item}
        />
      );
    });
  };
  // 显示对应app信息
  loadTemplateInfo = selectedKeys => {
    if (selectedKeys) {
      this.state.selectedKey = selectedKeys;
      this.getServicerRefList(selectedKeys[0]);
    } else {
      this.getServicerRefList();
    }
  };

  newServicer() {
    fetchPost("/servicer/addServicer", this.state.record).then(json => {
      if (json.code != 200) {
        errorNotify("添加失败", json.msg);
      } else {
        successNotify("添加成功");
        this.state.record = {};
        this.getServicerList();
      }
    });
  }

  newRefServicer() {
    fetchPost("/servicer/addAppServicerRef", this.state.refRecord).then(
      json => {
        if (json.code != 200) {
          errorNotify("添加失败", json.msg);
        } else {
          successNotify("添加成功");
          this.state.refRecord = {};
          this.getServicerRefList(this.state.selectedKey[0]);
        }
      }
    );
  }

  // 新增和修改对话框的维护
  showNewServicerRefModal = () => {
    this.getAppList();
    this.getMsgEnum();
    this.props.form.resetFields();
    this.state.refRecord.servicerCode = this.state.selectedKey
      ? this.state.selectedKey[0]
      : this.state.refRecord.servicerCode;
    this.setState({
      servicerRefModalVis: true,
      newServicerRefModal: true
    });
  };
  // 新增和修改对话框的维护
  showUpdateServicerRefModal = record => {
    this.props.form.resetFields();
    this.state.record = record;
    this.setState({
      record: record,
      servicerRefModalVis: true,
      recordIsNew: false
    });
  };

  handleServicerRefMOk = e => {
    this.props.form.validateFields((err, values) => {
      console.log(err);
      if (!err || (!err.appId && !err.servicerCode && !err.channelName)) {
        console.log(err);
        // 判断是新增还是修改
        if (this.state.newServicerRefModal) {
          this.newRefServicer();
        }

        this.setState({
          servicerRefModalVis: false
        });
      }
    });
  };
  handleServicerRefMCancel = e => {
    this.setState({
      servicerRefModalVis: false
    });
  };

  // 新增和修改对话框的维护
  showNewServicerModal = () => {
    console.log(this.state.record);
    this.props.form.resetFields();
    this.setState({
      servicerModalVis: true,
      newServicerModal: true
    });
  };
  // 新增和修改对话框的维护
  showUpdateServicerModal = record => {
    this.props.form.resetFields();
    this.state.record = record;
    this.setState({
      record: record,
      servicerModalVis: true,
      newServicerModal: false
    });
  };

  handleServicerOk = e => {
    this.props.form.validateFields((err, values) => {
      if (!err || !err.servicerName) {
        if (this.state.newServicerModal) {
          this.newServicer();
          this.state.record = {};
        }
        // 判断是新增还是修改
        // console.log(this.state.record? this.state.record : "")
        this.setState({
          servicerModalVis: false
        });
      }
    });
  };

  handleServicerCancel = e => {
    this.setState({
      servicerModalVis: false
    });
  };

  componentDidMount() {
    // console.log(this.refs.refModal.props.children.ref)
    this.getMsgEnum();
    this.getServicerRefList();
    this.getServicerList();
  }

  getServicerRefList = servicerCode => {
    var param = null;
    if (servicerCode) {
      param = {};
      param.servicerCode = servicerCode;
    }
    fetchPost("/servicer/getListByServicer", param).then(json => {
      // var temp = this.dealTemplateList(json.data)

      if (json.data != null) {
        this.setState({
          servicerRefData: json.data || []
        });
      }
    });
  };

  getServicerList = () => {
    fetchPost("/servicer/getAllServicer").then(json => {
      if (json.data != null) {
        this.setState({
          servicerList: json.data || []
        });
      }
    });
  };

  getAppList() {
    fetchPost("/appInfo/getAppInfo").then(json => {
      if (json.data != null) {
        treeDeal(json.data);
        this.setState({
          appList: json.data || []
        });
      }
    });
  }

  getMsgEnum() {
    fetchPost("/template/getMsgType").then(json => {
      if (json.data != null) {
        this.setState({
          msgEnums: json.data
        });
      }
    });
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    });
  };

  // 删除选中
  onDeleteLists = () => {};

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    const columns = [
      {
        title: "app名字",
        dataIndex: "appName",
        key: "appName",
        width: 100,
        sorter: (a, b) => (a.appName > b.appName ? 1 : -1),
        sortOrder: sortedInfo.columnKey === "appName" && sortedInfo.order
      },
      {
        title: "服务商代码",
        dataIndex: "servicerCode",
        key: "servicerCode",
        width: 100,
        sorter: (a, b) => (a.servicerCode > b.servicerCode ? 1 : -1),
        sortOrder: sortedInfo.columnKey === "servicerCode" && sortedInfo.order
      },
      {
        title: "通道名",
        dataIndex: "channelName",
        key: "channelName",
        width: 100,
        sorter: (a, b) => (a.channelName > b.channelName ? 1 : -1),
        sortOrder: sortedInfo.columnKey === "channelName" && sortedInfo.order
      },
      {
        title: "连接信息",
        dataIndex: "linkInfo",
        key: "linkInfo",
        sorter: (a, b) => (a.linkInfo > b.linkInfo ? 1 : -1),
        width: 700,
        sortOrder: sortedInfo.columnKey === "linkInfo" && sortedInfo.order
      }
      /*, {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
          width:200,
        render: (text, record) => {
          const {editable} = record;
          return (
            <div>
              <Button onClick={this.showUpdateModal.bind(this,record)}>
                修改
              </Button>
              <Popconfirm title="确定删除该条数据?" onConfirm={() => this.onDelete(record.key)}>
                <Button>
                  删除
                </Button>
              </Popconfirm>
            </div>
          );
        }
      }*/
    ];

    const appOptions = this.state.appList.map(d => (
      <Select.Option key={d.appId}>{d.appName}</Select.Option>
    ));
    const servicerOptions = this.state.servicerList
      ? this.state.servicerList.map(d => (
          <Select.Option key={d.servicerCode}>{d.servicerName}</Select.Option>
        ))
      : null;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Card>
        <Row>
          <Col span={4}>
            <Tree
              ref="tree"
              loadData={this.onLoadTreeData}
              onSelect={this.loadTemplateInfo}
            >
              {this.renderTreeNodes(this.state.servicerList)}
            </Tree>
          </Col>
          <Col span={20}>
            <Table
              dataSource={this.state.servicerRefData}
              onChange={this.handleChange}
              columns={columns}
              bordered
              pagination={{ pageSize: 10 }}
              rowKey="asRefId"
              footer={() => (
                <div>
                  <Button onClick={this.showNewServicerModal}>
                    新增服务商
                  </Button>
                  <Button onClick={this.showNewServicerRefModal}>
                    新增服务商发送通道
                  </Button>
                  <Popconfirm
                    title="确定删除这些数据?"
                    onConfirm={() => this.onDeleteLists()}
                  >
                    <Button style={{ display: "none" }}>删除选中</Button>
                  </Popconfirm>
                </div>
              )}
            />
          </Col>
        </Row>

        <Modal
          ref="modal"
          title={this.state.newServicerModal ? "新增" : "修改"}
          visible={this.state.servicerModalVis}
          onOk={this.handleServicerOk}
          onCancel={this.handleServicerCancel}
        >
          <Form ref="form213" props="form">
            <FormItem {...formItemLayout} label="服务商">
              {getFieldDecorator("servicerName", {
                initialValue: this.state.record
                  ? this.state.record.servicerName || ""
                  : "",
                rules: [{ required: true, message: "请输入服务商名!" }]
              })(
                <Input
                  placeholder="服务商"
                  onChange={this.recordServicerNameChange}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="描述">
              {getFieldDecorator("descInfo", {
                initialValue: this.state.descInfo
                  ? this.state.record.descInfo || ""
                  : "",
                rules: []
              })(
                <Input
                  placeholder="描述"
                  onChange={this.recordDescInfoChange}
                />
              )}
            </FormItem>
          </Form>
        </Modal>

        <Modal
          ref="refModal"
          title={this.state.newServicerRefModal ? "新增" : "修改"}
          visible={this.state.servicerRefModalVis}
          onOk={this.handleServicerRefMOk}
          onCancel={this.handleServicerRefMCancel}
        >
          <Form ref="refForm">
            <FormItem {...formItemLayout} label="app名称">
              {getFieldDecorator("appId", {
                initialValue: this.state.refRecord
                  ? this.state.refRecord.appId || ""
                  : "",

                rules: [{ required: true, message: "请选择app名称!" }]
              })(
                <Select
                  placeholder="Please"
                  onSelect={this.refRecordAppNameChange}
                >
                  {appOptions}
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="服务商">
              {getFieldDecorator("servicerCode", {
                initialValue: this.state.refRecord
                  ? this.state.refRecord.servicerCode || ""
                  : "",

                rules: [{ required: true, message: "请选择服务提供商!" }]
              })(
                <Select
                  placeholder="请选择服务提供商"
                  onSelect={this.refRecordServicerCodeChange}
                >
                  {servicerOptions}
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="通道名">
              {getFieldDecorator("channelName", {
                initialValue: this.state.refRecord.channelName
                  ? this.state.refRecord.channelName || ""
                  : "",
                rules: [{ required: true, message: "请填写通道名!" }]
              })(
                <Input
                  placeholder="通道名"
                  onChange={this.refChannelNameChange}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="接口链接">
              {getFieldDecorator("url", {
                initialValue: this.state.refRecord.smsMsgLinkInfo
                  ? this.state.refRecord.smsMsgLinkInfo.url || ""
                  : "",
                rules: []
              })(
                <Input
                  placeholder="接口链接"
                  onChange={this.refRecordUrlChange}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="用户名">
              {getFieldDecorator("userName", {
                initialValue: this.state.refRecord.smsMsgLinkInfo
                  ? this.state.refRecord.smsMsgLinkInfo.userName || ""
                  : "",
                rules: []
              })(
                <Input
                  placeholder="用户名"
                  onChange={this.refRecordUserNameChange}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="密码">
              {getFieldDecorator("password", {
                initialValue: this.state.refRecord.smsMsgLinkInfo
                  ? this.state.refRecord.smsMsgLinkInfo.password || ""
                  : "",
                rules: []
              })(
                <Input
                  placeholder="密码"
                  onChange={this.refRecordPasswordChange}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="签名">
              {getFieldDecorator("sign", {
                initialValue: this.state.refRecord.smsMsgLinkInfo
                  ? this.state.refRecord.smsMsgLinkInfo.sign || ""
                  : "",
                rules: []
              })(
                <Input placeholder="签名" onChange={this.refRecordSignChange} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="普通单条短信发送接口地址">
              {getFieldDecorator("interfaceUrl", {
                initialValue: this.state.refRecord.smsMsgLinkInfo
                  ? this.state.refRecord.smsMsgLinkInfo.interfaceUrl || ""
                  : "",
                rules: []
              })(
                <Input
                  placeholder="普通单条短信发送接口地址"
                  onChange={this.refRecordInterfaceChange}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="批量发送地址">
              {getFieldDecorator("batchSendInterfaceUrl", {
                initialValue: this.state.refRecord.smsMsgLinkInfo
                  ? this.state.refRecord.smsMsgLinkInfo.batchSendInterfaceUrl ||
                    ""
                  : "",
                rules: []
              })(
                <Input
                  placeholder="批量发送地址"
                  onChange={this.refRecordBatchSendInterfaceUrlChange}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="验证码发送接口地址">
              {getFieldDecorator("verifyCodeInterfaceUrl", {
                initialValue: this.state.refRecord.smsMsgLinkInfo
                  ? this.state.refRecord.smsMsgLinkInfo
                      .verifyCodeInterfaceUrl || ""
                  : "",
                rules: []
              })(
                <Input
                  placeholder="验证码发送接口地址"
                  onChange={this.refRecordVerifyCodeInterfaceUrlChange}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="通知短信发送接口地址">
              {getFieldDecorator("noticeSendInterfaceUrl", {
                initialValue: this.state.refRecord.smsMsgLinkInfo
                  ? this.state.refRecord.smsMsgLinkInfo
                      .noticeSendInterfaceUrl || ""
                  : "",
                rules: []
              })(
                <Input
                  placeholder="通知短信发送接口地址"
                  onChange={this.refRecordNoticeSendInterfaceUrlChange}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="营销短信">
              {getFieldDecorator("saleSendInterfaceUrl", {
                initialValue: this.state.refRecord.smsMsgLinkInfo
                  ? this.state.refRecord.smsMsgLinkInfo.saleSendInterfaceUrl ||
                    ""
                  : "",
                rules: []
              })(
                <Input
                  placeholder="营销短信"
                  onChange={this.refRecordSaleSendInterfaceUrlChange}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="短信状态查询">
              {getFieldDecorator("queryStatusInterfaceUrl", {
                initialValue: this.state.refRecord.smsMsgLinkInfo
                  ? this.state.refRecord.smsMsgLinkInfo
                      .queryStatusInterfaceUrl || ""
                  : "",
                rules: []
              })(
                <Input
                  placeholder="短信状态查询"
                  onChange={this.refRecordQueryStatusInterfaceUrlChange}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="获取余额">
              {getFieldDecorator("queryBalanceInterfaceUrl", {
                initialValue: this.state.refRecord.smsMsgLinkInfo
                  ? this.state.refRecord.smsMsgLinkInfo
                      .queryBalanceInterfaceUrl || ""
                  : "",
                rules: []
              })(
                <Input
                  placeholder="获取余额"
                  onChange={this.refRecordQueryBalanceInterfaceUrlChange}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="短信报告">
              {getFieldDecorator("queryMsgReportUrlInterfaceUrl", {
                initialValue: this.state.refRecord.smsMsgLinkInfo
                  ? this.state.refRecord.smsMsgLinkInfo
                      .queryMsgReportUrlInterfaceUrl || ""
                  : "",
                rules: []
              })(
                <Input
                  placeholder="短信报告"
                  onChange={this.refRecordQueryMsgReportUrlInterfaceUrlChange}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      </Card>
    );
  }
}

MessageServicer = Form.create()(MessageServicer);
export default MessageServicer;

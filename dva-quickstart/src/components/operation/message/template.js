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

class MessageTemplate extends Component {
  constructor(props) {
    super(props);
  }

  record = null;

  state = {
    appList: [],
    msgEnums: [],
    smsTypes: [],
    templateData: [],
    // 当前点击的appId
    selectedKey: null,
    servicerList: [],
    bizFuncList: [],
    record: {},
    sortedInfo: null,
    recordIsNew: false,
    newModalVis: false
  };

  newTemplate() {
    fetchPost("/template/newTemp", this.state.record).then(json => {
      if (json.code != 200) {
        errorNotify("添加失败", json.msg);
      } else {
        successNotify("添加成功");
        this.state.record = {};
        if (this.state.selectedKey) {
          this.getTemplateList(this.state.selectedKey[0]);
        }
      }
    });
  }

  // 新增业务所填字段
  recordAppNameChange = (value, option) => {
    this.props.form.resetFields();
    this.state.record.bizCode = null;
    this.state.record.appId = value;
    this.state.record.appName = option.props.children;
    this.state.record.sign = "【" + option.props.children + "】";

    this.getBizFuncList(value);
    // this.state.record.appId = value;
  };
  recordServicerChange = (value, option) => {
    this.state.record.servicerCode = value;
  };
  recordMsgTypeChange = (value, option) => {
    this.state.record.msgType = value;
  };
  recordTempTypeChange = (value, option) => {
    this.state.record.templateType = value;
  };
  recordContentChange = e => {
    // this.state.record.servicerCode = e.target.value;
    this.state.record.content = e.target.value;
  };
  recordDescInfoChange = e => {
    this.state.record.descInfo = e.target.value;
  };
  recordSignChange = e => {
    this.state.record.sign = e.target.value;
  };
  recordBizChange = value => {
    this.state.record.bizCode = value;
  };
  recordTypeChange = value => {
    this.state.record.type = value;
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
          title={item.appName}
          isLeaf={item.isLeaf}
          key={item.appId}
          dataRef={item}
        />
      );
    });
  };
  // 显示对应app信息
  loadTemplateInfo = selectedKeys => {
    if (selectedKeys) {
      this.state.selectedKey = selectedKeys;
      this.getTemplateList(selectedKeys[0]);
    } else {
      this.getTemplateList(this.state.selectedKey);
    }
  };

  // 新增和修改对话框的维护
  showNewModal = () => {
    this.getAppList();
    this.getMsgEnum();
    this.getSmsEnum();
    this.getServicerList();
    // this.state.
    this.props.form.resetFields();
    if (this.state.selectedKey) {
      this.state.record.appId = this.state.selectedKey[0];
      for (var i = 0, len = this.state.appList.length; i < len; i++) {
        if (this.state.appList[i].appId === parseInt(this.state.record.appId)) {
          this.state.record.appName = this.state.appList[i].appName;
          this.state.record.sign = "【" + this.state.appList[i].appName + "】";
        }
      }
      this.getBizFuncList(this.state.record.appId);
    }

    this.setState({
      newModalVis: true,
      recordIsNew: true
    });
  };
  // 新增和修改对话框的维护
  showUpdateModal = record => {
    this.props.form.resetFields();
    this.state.record = record;
    this.setState({
      record: record,
      newModalVis: true,
      recordIsNew: false
    });
  };

  handleVisOk = e => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 判断是新增还是修改
        if (this.state.recordIsNew) {
          this.newTemplate();
        }
        this.setState({
          newModalVis: false
        });
      }
    });
  };
  handleVisCancel = e => {
    this.setState({
      newModalVis: false
    });
  };

  componentDidMount() {
    this.getMsgEnum();
    this.getTemplateList();
    this.getAppList();
  }

  getTemplateList = appId => {
    var param = null;
    if (appId) {
      param = {};
      param.appId = appId;
    }
    fetchPost("/template/getTemplateList", param).then(json => {
      // var temp = this.dealTemplateList(json.data)

      if (json.data != null) {
        this.setState({
          templateData: json.data || []
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

  //获取业务列表
  getBizFuncList(appId) {
    var param = null;
    if (appId) {
      param = {};
      param.appId = appId;
    }
    fetchPost("/bizFunc/getBizFuncList", param).then(json => {
      if (json.data != null) {
        this.setState({
          bizFuncList: json.data || []
        });
      }
    });
  }

  getMsgEnum() {
    fetchPost("/template/getMsgType").then(json => {
      if (json.data != null) {
        this.setState({
          msgEnums: json.data || []
        });
      }
    });
  }

  getSmsEnum() {
    fetchPost("/template/getSmsType").then(json => {
      if (json.data != null) {
        this.setState({
          smsTypes: json.data || []
        });
      }
    });
  }

  dealTemplateList(templateData) {
    for (var i = 0; i < templateData.length; i++) {
      if (templateData[i].templateType === 0) {
        templateData[i].templateType = "否";
      } else {
        templateData[i].templateType = "是";
      }
    }
    return templateData;
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
        title: "签名",
        dataIndex: "sign",
        key: "sign",
        width: 100,
        sorter: (a, b) => (a.sign > b.sign ? 1 : -1),
        sortOrder: sortedInfo.columnKey === "sign" && sortedInfo.order
      },
      {
        title: "消息发送类型",
        dataIndex: "msgType",
        key: "msgType",
        width: 120,
        sorter: (a, b) => (a.msgType > b.msgType ? 1 : -1),
        sortOrder: sortedInfo.columnKey === "msgType" && sortedInfo.order
      },
      {
        title: "短信类型",
        dataIndex: "type",
        key: "type",
        width: 90,
        sorter: (a, b) => (a.type > b.type ? 1 : -1),
        sortOrder: sortedInfo.columnKey === "type" && sortedInfo.order
      },
      /*{
        title: '来源',
        dataIndex: 'templateType',
        key: 'templateType',
        width: 40
      }, */ {
        title: "模板内容",
        dataIndex: "content",
        key: "content",
        sorter: (a, b) => (a.context > b.context ? 1 : -1),
        // width : 200,
        sortOrder: sortedInfo.columnKey === "content" && sortedInfo.order
      },
      {
        title: "描述",
        dataIndex: "descInfo",
        key: "descInfo",
        sorter: (a, b) => (a.descInfo > b.descInfo ? 1 : -1),
        sortOrder: sortedInfo.columnKey === "descInfo" && sortedInfo.order
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
    const MsgTypeOptions = this.state.msgEnums
      ? this.state.msgEnums.map(d => (
          <Select.Option key={d.code}>{d.message}</Select.Option>
        ))
      : null;
    const SmsTypeOptions = this.state.smsTypes
      ? this.state.smsTypes.map(d => (
          <Select.Option key={d.code}>{d.desc}</Select.Option>
        ))
      : null;
    const servicerOptions = this.state.servicerList
      ? this.state.servicerList.map(d => (
          <Select.Option key={d.servicerCode}>{d.servicerName}</Select.Option>
        ))
      : null;
    const bizFuncOptions = this.state.bizFuncList.map(d => (
      <Select.Option value={d.bizCode}>{d.bizName}</Select.Option>
    ));
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
    const { TextArea } = Input;
    return (
      <Card>
        <Row>
          <Col span={4}>
            <Tree
              ref="tree"
              loadData={this.onLoadTreeData}
              onSelect={this.loadTemplateInfo}
            >
              {this.renderTreeNodes(this.state.appList)}
            </Tree>
          </Col>
          <Col span={20}>
            <Table
              dataSource={this.state.templateData}
              onChange={this.handleChange}
              columns={columns}
              bordered
              pagination={{ pageSize: 10 }}
              rowKey="msgTmpId"
              footer={() => (
                <div>
                  <Button onClick={this.showNewModal}>新增配置</Button>
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
          title={this.state.recordIsNew ? "新增" : "修改"}
          visible={this.state.newModalVis}
          onOk={this.handleVisOk}
          onCancel={this.handleVisCancel}
        >
          <Form>
            <FormItem {...formItemLayout} label="app名字">
              {getFieldDecorator("appId", {
                initialValue: this.state.record
                  ? this.state.record.appId || ""
                  : "",

                rules: [{ required: true, message: "请输入app名称!" }]
              })(
                <Select
                  placeholder="Please"
                  onSelect={this.recordAppNameChange}
                >
                  {appOptions}
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="业务类型">
              {getFieldDecorator("bizCode", {
                initialValue: this.state.record
                  ? this.state.record.bizCode || ""
                  : "",
                rules: [{ required: true, message: "请选择业务类型!" }]
              })(
                <Select
                  placeholder="请选择业务类型!"
                  onSelect={this.recordBizChange}
                >
                  {bizFuncOptions}
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="服务商">
              {getFieldDecorator("servicerCode", {
                initialValue: this.state.record
                  ? this.state.record.servicerCode || ""
                  : "",

                rules: [{ required: true, message: "请输入服务商!" }]
              })(
                <Select
                  placeholder="Please"
                  onSelect={this.recordServicerChange}
                >
                  {servicerOptions}
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="消息发送类型">
              {getFieldDecorator("msgType", {
                initialValue: this.state.record
                  ? this.state.record.msgType || ""
                  : "",

                rules: [{ required: true, message: "请选择消息发送类型!" }]
              })(
                <Select
                  placeholder="请选择消息发送类型"
                  onSelect={this.recordMsgTypeChange}
                >
                  {MsgTypeOptions}
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="短信类型">
              {getFieldDecorator("type", {
                initialValue: this.state.record
                  ? this.state.record.type || ""
                  : "",
                rules: [{ required: true, message: "请选择短信类型!" }]
              })(
                <Select
                  placeholder="请选择消息发送类型"
                  onSelect={this.recordTypeChange}
                >
                  {SmsTypeOptions}
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="模板类型">
              {getFieldDecorator("templateType", {
                initialValue: this.state.record
                  ? this.state.record.templateType || ""
                  : "",
                rules: [{ required: true, message: "请选择模板类型!" }]
              })(
                <Select
                  placeholder="请选择模板类型!"
                  onSelect={this.recordTempTypeChange}
                >
                  <Select.Option value="1">本地模板</Select.Option>
                  <Select.Option value="2">第三方模板</Select.Option>
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="内容">
              {getFieldDecorator("content", {
                initialValue: this.state.record
                  ? this.state.record.content || ""
                  : "",
                rules: [{ required: true, message: "请输入内容!" }]
              })(
                <TextArea
                  type="text"
                  placeholder="第三方模板输入id，普通模板就输入模板内容，替代词用##CODE##表示  "
                  onChange={this.recordContentChange}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="描述">
              {getFieldDecorator("descInfo", {
                initialValue: this.state.record
                  ? this.state.record.descInfo || ""
                  : "",
                rules: []
              })(
                <TextArea
                  placeholder="描述"
                  onChange={this.recordDescInfoChange}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="签名">
              {getFieldDecorator("sign", {
                initialValue: this.state.record
                  ? this.state.record.sign || ""
                  : "",
                rules: [{ required: true, message: "请输入签名!" }]
              })(<Input placeholder="签名" onChange={this.recordSignChange} />)}
            </FormItem>
          </Form>
        </Modal>
      </Card>
    );
  }
}

MessageTemplate = Form.create()(MessageTemplate);
export default MessageTemplate;

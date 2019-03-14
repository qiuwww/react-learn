import React from 'react'
import {fetchPost} from './common/request'
import {Tree, Table, Card, Button, Form, notification,Message, Row, Col, DatePicker,Modal,Input,Lable, Select,Popconfirm } from 'antd'
import {treeDeal} from './common/common.js'
import {successNotify,errorNotify} from './common/common'

const TreeNode = Tree.TreeNode
const FormItem = Form.Item

class MessageBiz extends React.Component {
  constructor (props) {
    super(props)
  }

  state = {
    bizFuncDate : [],
    sortedInfo: null,
    newModalVis : false,
    record :{},
    appList :[],
    servicerList :[],
    selectedKey:null
  }

  componentDidMount= () => {
    this.getBizFuncList();
    this.getAppList();
  }

  //获取app列表
  getAppList() {
    fetchPost('/appInfo/getAppInfo',).then( json => {
      if (json.data != null) {
        var data = json.data
        treeDeal(data)
        this.setState({
          appList: data || [],
        });
      }
    });
  }
  //获取业务列表
  getBizFuncList(appId) {
    var param = null;
    if(appId) {
      param = {}
      param.appId = appId
    }
    fetchPost('/bizFunc/getBizFuncList',param).then( json => {
      if (json.data != null) {
        this.setState({
          bizFuncDate: json.data || [],
        });
      }
    });
  }
  //新增业务
  newBizFunc() {
    fetchPost('/bizFunc/newBizFunc',this.state.record).then( json => {
      //
      if (json.code != 200) {
        errorNotify('添加失败',json.msg)
      } else {
        successNotify('新增业务成功')
        this.state.record = {}
        console.log(this.state.record )
        if (this.state.selectedKey)
          this.loadTemplateInfo(this.state.selectedKey)
        else{
          this.loadTemplateInfo()
        }
      }
    });
  }

  // 加载树形控件（app列表）
  onLoadTreeData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
    });
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      return <TreeNode title={item.appName} isLeaf={item.isLeaf} key={item.appId}   dataRef={item} />;
    });
  }
  // 当点击app时 显示对应app信息
  loadTemplateInfo = (selectedKeys) => {
    if (selectedKeys) {
      this.state.selectedKey = selectedKeys
      this.getBizFuncList(selectedKeys[0])
    } else {
      this.getBizFuncList(this.state.selectedKey )
    }
  }


  // 新增和修改对话框的维护
  showNewModal = () => {
    this.props.form.resetFields();
    console.log(this.state.record)
    this.getAppList()
    this.state.record.appId = this.state.selectedKey?this.state.selectedKey[0]: this.state.record.appId;

    this.setState({
      newModalVis: true,
      recordIsNew: true
    });

  }
  // 新增和修改对话框的维护
  showUpdateModal = (record) => {
    this.props.form.resetFields();
    this.state.record = record
    this.setState({
      record : {},
      newModalVis: true,
      recordIsNew: false,
    });
  }
  handleVisOk = (e) => {

    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 判断是新增还是修改
        if(this.state.recordIsNew){
          this.newBizFunc()
        }
        this.setState({
          newModalVis: false,
        });
      }
    });

  }
  handleVisCancel = (e) => {
    this.setState({
      newModalVis: false,
    });
  }

  // 新增业务所填字段
  recordAppNameChange= (value, option)=> {
    this.state.record.bizName = null;
    this.props.form.resetFields();

    this.state.record.appId = value;
    this.state.appList.map(app => {
      var a = this.state.record
      if (app.appId == value){
        a.businessTypeId = app.businessTypeId
      }
      this.setState({
        record: a
      })
    })
  }
  recordBizNameChange= (e)=> {
    this.state.record.bizName = e.target.value;
  }
  recordDescChange= (e)=> {
    this.state.record.descInfo = e.target.value;
  }

  // 排序
  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  // 删除选中
  onDeleteLists = () => {
  }

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    const columns = [{
      title: '业务码',
      dataIndex: 'bizCode',
      key: 'bizCode',
      sorter: (a, b) => a.bizCode > b.bizCode ? 1 : -1,
      sortOrder: sortedInfo.columnKey === 'bizCode' && sortedInfo.order,
      // render: text => <a href="#">{text}</a>,
    }, {
      title: 'app名称',
      dataIndex: 'appName',
      key: 'appName',
      sorter: (a, b) => a.appName > b.appName ? 1 : -1,
      sortOrder: sortedInfo.columnKey === 'appName' && sortedInfo.order,
    }, {
      title: '业务名',
      dataIndex: 'bizName',
      key: 'bizName',
      sorter: (a, b) => a.bizName > b.bizName ? 1 : -1,
      sortOrder: sortedInfo.columnKey === 'bizName' && sortedInfo.order,
    },
/*      {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status > b.status ? 1 : -1,
      sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
    },*/
      {
      title: '描述',
      dataIndex: 'descInfo',
      key: 'descInfo',
      sorter: (a, b) => a.descInfo > b.descInfo ? 1 : -1,
      sortOrder: sortedInfo.columnKey === 'descInfo' && sortedInfo.order,

     /* }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => {
        const {editable} = record;
        return (
          <div>
            <Button onClick={this.showVisModal}>
              修改
            </Button>
            <Popconfirm title="确定删除该条数据?" onConfirm={() => this.onDelete(record.key)}>
              <Button>
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      }*/
    }];

    // 表单排版
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    // app单选框
    const appOptions = this.state.appList.map(d => <Option key={d.appId}>{d.appName}</Option>);
    // 服务商单选框
    const servicerOptions = this.state.servicerList.map(d => <Option key={d.servicerId}>{d.servicerName}</Option>);
    const { getFieldDecorator } = this.props.form;

    return(
      <Card>
          <Row>
            <Col span={3}>
              <Tree ref="tree" loadData={this.onLoadTreeData} onSelect={this.loadTemplateInfo} >
                {this.renderTreeNodes(this.state.appList)}
              </Tree>
            </Col>
            <Col span={21}>
              <Table ref="table" dataSource={this.state.bizFuncDate} onChange={this.handleChange} columns={columns} bordered
                   rowKey="bizId"
                   footer={() =>
                     <div>
                       <Button onClick={this.showNewModal}>新增配置</Button>
                       <Popconfirm title="确定删除这些数据?" onConfirm={() => this.onDeleteLists()}>
                         <Button  style={{display:'none'}}>
                           删除选中
                         </Button>
                       </Popconfirm>
                     </div>
                   }>
              </Table>
            </Col>
          </Row>

        <Modal
          title={this.state.recordIsNew ? "新增":"修改"}
          visible={this.state.newModalVis}
          onOk={this.handleVisOk}
          onCancel={this.handleVisCancel}
        >
          <Form >

            <FormItem {...formItemLayout} label = "app名称">

              {getFieldDecorator('appId', {
                initialValue : this.state.record? this.state.record.appId || "" : "",

                rules: [
                  { required: true, message: '请输入app名称!' },
                ],
              })(

                <Select placeholder="Please" onSelect={this.recordAppNameChange}>
                  {appOptions}
                </Select>
              )}
            </FormItem>


            <FormItem {...formItemLayout} label = "业务名">

              {getFieldDecorator('bizName', {
                initialValue : this.state.record? this.state.record.bizName || "" : "",
                rules: [
                  { required: true, message: '请输入业务名' },
                ],
              })(
                <Input  placeholder="请输入业务名" onChange={this.recordBizNameChange}/>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label = "描述">

              {getFieldDecorator('descInfo', {
                initialValue : this.state.record? this.state.record.descInfo || "" : "",
                rules: [],
              })(
                <Input placeholder="请输入描述" onChange={this.recordDescChange}/>
              )}
            </FormItem>


          </Form>
        </Modal>

      </Card>
    );
  }
}


MessageBiz = Form.create()(MessageBiz)
export default MessageBiz



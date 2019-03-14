import React from 'react'
import { Tree,Table, Card, Button, Form, Message, Row, Col, DatePicker,Modal,Input,Lable, Select,Popconfirm } from 'antd'
import {fetchPost} from './common/request'
import {treeDeal,treeRefTitleDeal} from './common/common.js'
import {errorNotify,successNotify} from './common/common'

const TreeNode = Tree.TreeNode
const RangePicker = DatePicker.RangePicker
const Option = Select.Option

const FormItem = Form.Item

class MessageSearch extends React.Component {
  constructor (props) {
    super(props)
  }


  state = {
    TitleData: [],
    detailDate : [],

    newModalVis : false,
    recordIsNew : false,

    // 列表
    appList: [],
    bizFuncList: [],
    servicerList: [],
    templateList: [],
    ruleList: [],

    selectedRows : null,
    selectedAppId : null,
    //记录
    record : {},
    page: {
      currentPage: 1,
      pageSize: 10
    },
    loading:false,
  }

  componentWillMount() {
    this.getTitle()
    this.getAppList()
  }

  addBusiness(){
    fetchPost('/business/addBusinessTemplateInfo',this.state.record).then( json => {
      if (json.code != 200) {
        console.log(this.state.record)
        errorNotify('添加失败',json.msg)
      } else {
        successNotify('添加成功')
        this.onReloadCache()
        this.state.record = {}
        if (this.state.selectedKeys)
          this.loadTemplateInfo(this.state.selectedKeys)
      }
    });
  }

  getTitle() {
    fetchPost('/business/getTitleList').then( json => {
      if (json.data != null) {
        var data = json.data
        treeRefTitleDeal(data)
        this.setState({
          TitleData: data
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
          bizFuncList: json.data
        });
      }
    });
  }

  getRuleList = (appId) => {
    var param = null;
    if(appId) {
      param = {}
      param.appId = appId
    }
    fetchPost('/rule/getRuleByAppId', param).then( json => {
      if (json.data != null) {
        this.setState({
          ruleList : json.data
        });
      }
    });
  }

  getTemplateList = (appId) => {

    var param = null;
    if(appId) {
      param = {}
      param.appId = appId
    }
    fetchPost('/template/getTemplateList',param).then( json => {
      if (json.data != null) {
        this.setState({
          templateList:json.data
        });
      }
    });
  }

  getTemplateInfo(param) {

    fetchPost('/business/getAllBusinessTemplateInfo',param).then( json => {
      if (json.data != null) {
        let data = json.data
        let list = data.data

        for (var i=0; i < list.length; i++) {
          if(list[i].sendFlag === 0){
            list[i].sendFlag = "删除"
          } else {
            list[i].sendFlag = "正常"
          }
        }
        console.log(list)
        console.log(data)
        this.setState({
          detailDate:data.data,
          page : {
            currentPage : data.currentPage,
            totalCount: data.totalCount,
            pageSize: data.pageSize,
          },
        });
      }
    });
  }

  nextPage(current) {
    this.state.page.currentPage = current
    this.loadTemplateInfo(this.state.selectedKeys);
  }

  loadTemplateInfo = (selectedKeys,e,current) => {
    //用于新增后刷新页面
    this.state.selectedKeys = selectedKeys;

    var param = {}
    var keys = selectedKeys[0].split("-")
    if(keys[1]){
      param.businessTypeId = keys[0]
      param.appId = keys[1]
      // 用于新增时直接添加app
      this.state.selectedAppId= param.appId
    }
    param.pageSize = this.state.page.pageSize;
    param.currentPage = this.state.page.currentPage
    this.getTemplateInfo(param)
  }

  getServicerList = (appId) => {
    let param = null
    if (appId) {
      param = {}
      param.appId = appId
      fetchPost('/servicer/getListByServicer',param).then( json => {
        if (json.data != null) {
          this.setState({
            servicerList : json.data
          });
        }
      });
    }
    else {

    }
    fetchPost('/servicer/getListByServicer',param?param:null).then( json => {
      if (json.data != null) {
        this.setState({
          servicerList : json.data || [],
        });
      }
    });
  }

  getAppList() {
    fetchPost('/appInfo/getAppInfo').then( json => {
      if (json.data != null) {
        treeDeal(json.data)
        this.setState({
          appList: json.data || [],
        });
      }
    });
  }

  // 新增和修改对话框的维护
  showNewModal = () => {
    this.getAppList()
    this.props.form.resetFields()

    if (this.state.selectedAppId){
      let value = parseInt(this.state.selectedAppId)
      this.state.record.appId = value
      this.state.appList.map(app => {
        var a = this.state.record
        if (app.appId == value){
          a.businessTypeId = app.businessTypeId
        }
        this.setState({
          record: a
        })
      })
      this.getTemplateList(value)
      this.getBizFuncList(value)
      this.getRuleList(value)
      this.getServicerList(value)
    }

    this.setState({
      newModalVis: true,
      recordIsNew: true,
    });

  }
  // 新增和修改对话框的维护
  showUpdateModal = (record) => {
    this.props.form.resetFields();
    this.state.record = record
    this.setState({
      record : record,
      newModalVis: true,
      recordIsNew: false,
    });
  }

  handleVisOk = (e) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 判断是新增还是修改
        if (this.state.newModalVis)
          this.addBusiness()
        this.setState({
          newModalVis: false,
        })
      }
    });
  }
  handleVisCancel = (e) => {
    this.setState({
      newModalVis: false,
    });
  }



  onReloadCache = () => {
    fetchPost('/business/reloadCache').then( json => {
      if (json.data != null) {
        treeDeal(json.data)
        this.setState({
          appList: json.data || [],
        });
      }
      this.setState({
        loading: false
      })
    });
  }

  // 删除记录
  onDelete = (key) => {
  }

  appChange = (value, option) => {
    this.state.record.appServicerId = null
    this.state.record.bizFunctionId = null
    this.state.record.messageTemplateId = null
    // this.state.record.rule = null
    this.props.form.resetFields()

    this.state.record.appId = value
    this.state.appList.map(app => {
      var a = this.state.record
      if (app.appId == value){
        a.businessTypeId = app.businessTypeId
      }
      this.setState({
        record: a
      })

    })
    this.getTemplateList(value)
    this.getBizFuncList(value)
    this.getRuleList(value)
    this.getServicerList(value)
  }
  servicerChange = (value) => {
    this.state.record.appServicerId = value
  }
  templateChange = (value,option) => {
    for(var i=0,len=this.state.templateList.length; i< len; i++){
      if(this.state.templateList[i].msgTmpId === value){
        this.state.record.bizFunctionId = parseInt(this.state.templateList[i].bizId)
      }
    }
    // templateList
    // console.log(option)
    this.state.record.messageTemplateId = value
  }
  ruleChange = (value) => {
    this.state.record.sendRuleId = value
  }

  // 加载树形控件
  onLoadTreeData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children || treeNode.props.appInfoVoList) {
        resolve();
        return;
      }
    });
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children || item.appInfoVoList) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children?item.children : item.appInfoVoList)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });
  }

  enterIconLoading = () => {
    this.setState({ loading: true });
  }

  enterIconCanceling =() => {
    this.setState({ loading: false });
  }

  render() {
    let self = this
    const pagination = {
      total: this.state.page.totalCount,
      pageSize: this.state.page.pageSize,
      showSizeChanger: false,
      showQuickJumper: true,
      showTotal (total) {
        return `总共 ${total} 条`
      },
      onChange (current){
        self.nextPage(current)
      }
    }
    const appOptions = this.state.appList.map(d => <Option value={d.appId}>{d.appName}</Option>);
    const templateOptions = this.state.templateList.map(d => <Option value={d.msgTmpId}>{d.bizName}:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{d.content}</Option>);
    const ruleOptions = this.state.ruleList.map(d => <Option value={d.ruleId}>{d.sendRuleName}</Option>);
    const servicerOptions = this.state.servicerList? this.state.servicerList.map(d => <Option value={d.asRefId}>{d.channelName}</Option>) : null;
    const { getFieldDecorator } = this.props.form;
    // 表单布局
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
    // table 标题
    const columns = [{
      title: 'App名称',
      dataIndex: 'appName',
      key: 'appName',
      // render: text => <a href="#">{text}</a>,
    }, {
      title: '场景',
      dataIndex: 'bizFunctionDesc',
      key: 'bizFunctionDesc',
    }, {
      title: '通道名',
      dataIndex: 'channelName',
      key: 'channelName',
    },{
      title: '消息模板',
      dataIndex: 'messageTemplateDesc',
      key: 'messageTemplateDesc',
    },{
      title: '发送规则',
      dataIndex: 'sendRuleId',
      key: 'sendRuleId',
    }, {
      title: '状态',
      dataIndex: 'sendFlag',
      key: 'sendFlag',
    }
/*    , {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
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

    return(
      <Card>
        <Row>
          <Col span={4}>
            <Tree loadData={this.onLoadTreeData} onSelect={this.loadTemplateInfo}>
              {this.renderTreeNodes(this.state.TitleData)}
            </Tree>
          </Col>
          <Col span={20}>
            <Table ref="table" dataSource={this.state.detailDate} style={{position:'relative'}} columns={columns} bordered
                   rowKey="businessRefId" pagination={pagination}
                   footer={() =>
                     <div>
                       <Button onClick={this.showNewModal.bind(this)}>新增配置</Button>
                       <Popconfirm title="确定重新加载配置数据?" onConfirm={() => this.onReloadCache()} onCancel={this.enterIconCanceling}>
                         <Button type="danger" loading={this.state.loading} onClick={this.enterIconLoading}>
                           重新加载配置
                         </Button>
                       </Popconfirm>
                     </div>
                     }>
            </Table>

          </Col>
        </Row>

        <Modal ref="modal"
               title={this.state.recordIsNew ? "新增":"修改"}
               visible={this.state.newModalVis}
               onOk={this.handleVisOk}
               onCancel={this.handleVisCancel}
        >
          <Form>
            <FormItem {...formItemLayout} label = "app名称">

              {getFieldDecorator('appId', {
                initialValue : this.state.record? this.state.record.appId || null : null,
                rules: [
                  { required: true, message: '请选择app名称!' },
                ],
              })(
                <Select placeholder="Please" onSelect={this.appChange}>
                  {appOptions}
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label = "服务商通道">

              {getFieldDecorator('appServicerId', {
                initialValue : this.state.record? this.state.record.appServicerId || "" : "",
                rules: [
                  { required: true, message: '请选择服务商通道!' },
                ],
              })(
                <Select placeholder="服务商通道" onSelect={this.servicerChange}>
                  {servicerOptions}
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label = "消息模板">

              {getFieldDecorator('template', {
                initialValue : this.state.record? this.state.record.template || "" : "",
                rules: [
                  { required: true, message: '请选择消息模板！' },
                ],
              })(
                <Select placeholder="消息模板" onSelect={this.templateChange}>
                  {templateOptions}
                </Select>
              )}
            </FormItem>


            <FormItem {...formItemLayout} label = "发送规则">
              {getFieldDecorator('rule', {
                initialValue : this.state.record? this.state.record.rule || "" : "",
                rules: [],
              })(
                <Select placeholder="发送规则" onSelect={this.ruleChange}>
                  {ruleOptions}
                </Select>
              )}
            </FormItem>

          </Form>
        </Modal>

      </Card>
    );
  }
}

MessageSearch = Form.create()(MessageSearch)
export default MessageSearch



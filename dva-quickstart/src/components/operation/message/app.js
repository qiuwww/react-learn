import React from 'react'
import {fetchPost} from './common/request'
import { Tree,Table, Card, Button, Form, Message, Row, Col, DatePicker,Modal,Input,Lable, Select,Popconfirm } from 'antd'
import {successNotify,errorNotify} from './common/common'

const FormItem = Form.Item

class MessageApp extends React.Component {
  constructor (props) {
    super(props)
  }

  record = null;

  state = {
    appData : [],
    sortedInfo: null,
    recordIsNew: false,
    record :{},
    appOwnerList : []
  }


  onNewApp = ()=>{
    fetchPost('/appInfo/addAppInfo',this.state.record).then( json => {
      if (json.code != 200) {
        errorNotify('添加失败',json.msg)
      } else {
        successNotify('添加成功');
        this.state.record = {}
        this.getAppList()
      }
      // if (json.data != null) {
      //   var data = json.data
      //   console.log(data)
      //   this.getAppList();
      // }
    });
  }

  appOwner = () => {
    fetchPost("/appInfo/getAllBusinessType").then(json => {
      this.setState({
        appOwnerList : json.data || [],
      })
    })
  }

  componentDidMount() {
    this.getAppList()
  }

  // 删除选中
  onDeleteLists = ()=> {

  }

  getAppList() {
    fetchPost('/appInfo/getAppInfo').then( json => {
      if (json.data != null) {
        var data = json.data
        this.setState({
          appData: data || [],
        });
      }
    });
  }

  // 新增对话框
  showNewModal = () => {
    this.appOwner();
    this.props.form.resetFields();
    this.setState({
      newModalVis: true,
      recordIsNew: true
    });


  }
/*
  // 修改对话框
  showUpdateModal = (record) => {
    this.props.form.resetFields();
    this.state.record = record
    console.log(record)
    this.props.form.resetFields();
    console.log(this.state.record )
    this.setState({
      record : record,
      newModalVis: true,
      recordIsNew: false,
    });
  }
*/
  handleVisOk = (e) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 判断是新增还是修改
        if (this.state.recordIsNew){
          this.onNewApp()
        } else {
          console.log(this.state.record? this.state.record : "")
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

  //排序
  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }


  //模态框的code，name改变
  recordNameChange= (e)=> {
    this.state.record.appName = e.target.value;
  }
  recordBusinessIdChange= (value)=> {
    this.state.record.businessTypeId = value
  }


  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    const columns = [
      {
        title: 'app所属',
        dataIndex: 'businessTypeName',
        key: 'businessTypeName',
        sorter: (a, b) => a.businessTypeName > b.businessTypeName ? 1 : -1,
        sortOrder: sortedInfo.columnKey === 'businessTypeName' && sortedInfo.order,
        // render: text => <a href="#">{text}</a>,
      }, {
      title: 'app码',
      dataIndex: 'appCode',
      key: 'appCode',
      sorter: (a, b) => a.appCode > b.appCode ? 1 : -1,
      sortOrder: sortedInfo.columnKey === 'appCode' && sortedInfo.order,
      // render: text => <a href="#">{text}</a>,
    }, {
      title: 'app名称',
      dataIndex: 'appName',
      key: 'appName',
      sorter: (a, b) => a.appName > b.appName ? 1 : -1,
      sortOrder: sortedInfo.columnKey === 'appName' && sortedInfo.order,
    }
    /*
     , {
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

    const appOwnerOpt = this.state.appOwnerList.map(d => <Option key={d.businessTypeId }>{d.businessTypeName}</Option>);
    const { getFieldDecorator } = this.props.form;
    return(
      <Card>
        <Row>
          <Table dataSource={this.state.appData} onChange={this.handleChange} columns={columns} rowKey="appId" bordered
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

        </Row>

        <Modal
          title={this.state.recordIsNew ? "新增":"修改"}
          visible={this.state.newModalVis}
          onOk={this.handleVisOk}
          onCancel={this.handleVisCancel}
        >
          <Form>
            <FormItem {...formItemLayout} label = "app名称">

              {getFieldDecorator('appName', {
                initialValue : this.state.record?this.state.record.appName || null : null,
                rules: [
                  { required: true, message: '请选择app!' },
                ],
              })(
                <Input onChange={this.recordNameChange} placeholder="请输入app名称"/>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label = "所属">

              {getFieldDecorator('businessTypeId', {
                rules: [
                  { required: true, message: '请选择app所属!' },
                ],
              })(
                <Select placeholder="请选择app所属" onChange={this.recordBusinessIdChange }>
                  {appOwnerOpt}
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      </Card>
    );
  }
}

MessageApp = Form.create()(MessageApp)
export default MessageApp



import React from 'react'
import {fetchPost} from './common/request'

import { Spin, Table, Card, Button, Form, Upload, Message, Modal, Select, Input, Icon, Checkbox, Popconfirm, Row, Col, DatePicker, message } from 'antd'

// import {origin} from '../../../utils/config'
import MessageFilter from './common/MessageFilter';

const FormItem = Form.Item
const Option = Select.Option
const CheckBoxGroup = Checkbox.Group

class MessageList extends React.Component {
  constructor (props){
    super(props)
    this.changeIsLoading = this.changeIsLoading.bind(this)
    this.getSearchData = this.getSearchData.bind(this)
    this.changeIsLoading = this.changeIsLoading.bind(this)
    this.showLoading = this.showLoading.bind(this)

    this.state = {
      page: {
        currentPage: 1,
        pageSize: 10
      },
      params: {},
      params1: {},
      appIds: [],
      flag: 1,
      bizCodes: [],
      servicerNames: [],
      data: [],
      visible: false,
      loading:true
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData () {
    this.state.params1 = this.state.params
    this.state.params1.currentPage = this.state.page.currentPage
    this.state.params1.pageSize = this.state.page.pageSize
    fetchPost(`/message/getMessageList`,this.state.params1).then(json => {
      if (json.data && json.code === 200) {
        let data = json.data.itemList
        this.setState({
          data: data,
          page: json.data.page,
        })
      }
      this.setState({
        loading: false
      })
    })
  }

  getSearchData (params) {
    params.currentPage = 1;
    params.pageSize = this.state.page.pageSize;
    this.state.params = params;
    fetchPost(`/message/getMessageList`,params).then(json => {
      if (json.data && json.code === 200) {
        let data = json.data.itemList
        // this.state.data = data;
        this.setState({
          data: data,
          page: json.data.page,
          loading: false,
        })
      }
    })
  }

  handleReset () {
    this.props.form.resetFields()
    this.setState({
      data: [],
      appIds: [],
      bizCodes: [],
      servicerNames: [],
      visible: false
    }, () => {
      this.getData()
    })
  }

  changeIsLoading () {
    // let a = !this.state.isLoading
    // this.setState({
    //   isLoading: a
    // })
  }

  nextPage (currentPage) {
    this.setState({
      page: {
        ...this.state.page,
        currentPage,
      }
    }, () => {
      this.getData()
    })
  }

  showLoading(){
    this.setState({
      loading: true
    })
  }

  render(){
    let self = this
    const columns = [
      {
        title: '第三方MsgId',
        dataIndex: 'thirdMsgId',
        key: 'thirdMsgId'
      },
      {
        title: '消息类型',
        dataIndex: 'msgType',
        key: 'msgType'
      },
      {
        title: '消息内容',
        dataIndex: 'content',
        key: 'content'
      },
      {
        title: '消息发送状态',
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: 'App名称',
        dataIndex: 'appName',
        key: 'appName'
      }, {
        title: '场景码',
        dataIndex: 'bizCode',
        key: 'bizCode',
      },{
        title: '服务商',
        dataIndex: 'servicerName',
        key: 'servicerName'
      }, {
        title: '用户手机号',
        dataIndex: 'receiver',
        key: 'receiver'
      }
    ]

    const pagination = {
      total: self.state.page.totalCount,
      pageSize: self.state.page.pageSize,
      showSizeChanger: false,
      showQuickJumper: true,
      showTotal (total) {
        return `总共 ${total} 条`
      },
      onChange (current) {
        self.nextPage(current)
      }
    }

    return (
      <div>
        <Modal
          visible={this.state.visible}
          onCancel={() => {
            this.handleReset()
          }}
          footer={null}
        >
        </Modal>
        <Card>
          <Spin spinning={this.state.loading}>
            <MessageFilter changeIsLoading={this.changeIsLoading} showLoading={this.showLoading}  getSearchData={this.getSearchData} getData={this.getData} />
            <Table pagination={pagination} columns={columns} dataSource={self.state.data}
                   bordered
            >
            </Table>
          </Spin>
        </Card>
      </div>
    )
    return (<div></div>);
  }
}

MessageList = Form.create()(MessageList)
export default MessageList



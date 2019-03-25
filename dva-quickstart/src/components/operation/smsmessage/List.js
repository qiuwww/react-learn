import React, { Component,  } from 'react'
import { fetchPost } from '../../../utils/request'
import { Table, Card, Button, Form, Upload, Message, Modal, Select, Input, Icon, Checkbox, Popconfirm, Row, Col, DatePicker, message } from 'antd'

import {origin} from '../../../utils/config'
import Filter from './Filter';

const FormItem = Form.Item
const Option = Select.Option
const CheckBoxGroup = Checkbox.Group

class List extends Component {
  constructor (props) {
    super(props)
    this.changeIsLoading = this.changeIsLoading.bind(this)
    this.getSearchData = this.getSearchData.bind(this)
    this.changeIsLoading = this.changeIsLoading.bind(this)

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
      visible: false
    }

  }

  componentDidMount () {
    this.getData()
  }

  getData () {
    this.state.params1 = this.state.params
    let appType = window.sessionStorage.getItem('appCode')
    this.state.params1.currentPage = this.state.page.currentPage
    this.state.params1.pageSize = this.state.page.pageSize
    fetchPost(`/smsmessage/list`,this.state.params1).then(json => {
      if (json.data && json.code === 0) {
        let data = json.data.itemList
        this.setState({
          data: data,
          page: json.data.page
        })
      }
    })
  }
  getSearchData (params) {
    params.currentPage = 1;
    params.pageSize = this.state.page.pageSize;
    this.state.params = params;
    fetchPost(`/smsmessage/list`,params).then(json => {
      if (json.data && json.code === 0) {
        let data = json.data.itemList
        this.state.data = data;
        this.setState({
          data: data,
          page: json.data.page
        })
      }
    })
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
  changeIsLoading () {
    // let a = !this.state.isLoading
    // this.setState({
    //   isLoading: a
    // })
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

  render () {
    let self = this

    const columns = [
      {
        title: 'App名称',
        dataIndex: 'appName',
        key: 'appName'
      }, {
        title: '场景码',
        dataIndex: 'bizCode',
        key: 'bizCode',
      }, {
        title: '场景名称',
        dataIndex: 'bizName',
        key: 'bizName'
      },{
        title: '服务商',
        dataIndex: 'servicerName',
        key: 'servicerName'
      }, {
        title: '总数',
        dataIndex: 'totalNum',
        key: 'totalNum'
      }, {
        title: '成功数',
        dataIndex: 'successNum',
        key: 'successNum'
      }, {
        title: '成功率',
        dataIndex: 'successPercent',
        key: 'successPercent'
      }
    ]

    let {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 10},
    }
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
          <Filter changeIsLoading={this.changeIsLoading} getSearchData={this.getSearchData} getData={this.getData} />

          <Table pagination={pagination} columns={columns} dataSource={self.state.data}
                 bordered
          >
          </Table>
        </Card>
      </div>
    )
  }
}

List = Form.create()(List)
export default List



/**
 * Created by yujianfu on 2016/11/16.
 */
import React, { Component,  } from 'react'
import { fetchPost } from './../../../utils/request'
import { Table, Card, Button, Form, Upload, message, Modal, Select, Input, Icon } from 'antd'
import {origin} from '../../../utils/config'

const FormItem = Form.Item
const Option = Select.Option

class List extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      fileList: [],
      params: {
        pushLocalType: '0',
        userType: '1'
      },
      visible: false
    }

  }

  componentDidMount () {
    this.getData()
  }

  getData () {
    let appType = window.sessionStorage.getItem('appCode')
    fetchPost(`/cms/push/${appType}/list`).then(json => {
      if (json.data && json.code === 0) {
        let data = json.data.itemList
        this.setState({
          data,
        })
      }
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    let self = this
    let appType = window.sessionStorage.getItem('appCode')
    this.props.form.validateFields((error, values) => {
      if (!error) {
        if(values.batchUrl) {
          if (!values.batchUrl.file && values.userType === '2') {
            message.error('请先上传excel')
            return false
          }
          if(values.userType === '2') {
            values.batchUrl = values.batchUrl.file.response.data.url
          }
        }

        fetchPost('/cms/push/add', {
          ...values,
          appType,
        }).then(res => {
          if(res.code === 0) {
            self.handleReset()
          } else {
            message.error(res.msg)
          }
        })
      }
    })
  }

  handleReset () {
    this.props.form.resetFields()
    this.setState({
      visible: false,
      fileList: [],
      params: {
        pushLocalType: '0',
        userType: '1'
      },
    }, () => {
      this.getData()
    })
  }

  handleUpload (info) {
    if(info) {
      let fileList = info.fileList;
      fileList = fileList.slice(-1);
      this.setState({ fileList, });
    }
  }

  render () {
    let self = this

    const columns = [
      {
        title: '推送时间',
        dataIndex: 'pushStartTime',
        key: 'pushStartTime'
      }, {
        title: '用户类型',
        dataIndex: 'pushTypeDesc',
        key: 'pushTypeDesc',
      }, {
        title: '推送内容',
        dataIndex: 'pushContent',
        key: 'pushContent'
      }, {
        title: '推送量',
        dataIndex: 'pushCount',
        key: 'pushCount'
      }, {
        title: '到达数／到达率',
        dataIndex: '',
        key: '',
        render: (text, record) => (
          <span>
            {record.clickCount}/{record.clickRate}
          </span>
        )
      }
    ]

    let {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 10},
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
          <div>
            <Form style={{width: '100%', margin: 'auto'}} horizontal onSubmit={(e) => this.handleSubmit(e)}>
              <FormItem
                {...formItemLayout}
                label="用户类型"
              >
                {getFieldDecorator('userType', {
                  initialValue: '1'
                })(
                  <Select onChange={(e) => {
                    console.log(e, 'e')
                    this.setState({
                        params: {
                          ...this.state.params,
                          userType: e
                        }
                    })
                  }} placeholder="用户类型">
                    <Select.Option key="1">单个用户</Select.Option>
                    <Select.Option key="2">批量用户</Select.Option>
                    <Select.Option key="3">所有用户</Select.Option>
                  </Select>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="跳转位置"
              >
                {getFieldDecorator('pushLocalType', {
                  initialValue: '0'
                })(
                  <Select onChange={(e) => {
                    this.setState({
                      params: {
                        ...this.state.params,
                        pushLocalType: e
                      }
                    })
                  }} placeholder="类型">
                    <Select.Option key="0">app首页</Select.Option>
                    <Select.Option key="2">H5页面</Select.Option>
                    <Select.Option key="3">邀请页</Select.Option>
                    <Select.Option key="4">卡券包</Select.Option>
                  </Select>
                )}
              </FormItem>

              {
                this.state.params.userType === '2' ? <FormItem
                    {...formItemLayout}
                    label="Upload"
                  >
                    {getFieldDecorator('batchUrl', {
                      rules: [
                        {required: true},
                      ]
                    })(
                      <Upload onChange={this.handleUpload.bind(this)} defaultFileList={this.state.fileList}  fileList={this.state.fileList} name="file" action={origin + '/upload/excel'}>
                        <Button type="ghost">
                          <Icon type="upload"/>点击上传excel
                        </Button>
                      </Upload>
                    )}
                  </FormItem>
                  : null
              }

              {
                this.state.params.userType === '1' ? <FormItem
                    {...formItemLayout}
                    label="手机号"
                  >
                    {getFieldDecorator('mobile', {
                      rules: [
                        {required: true},
                        {pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/}
                      ]
                    })(
                      <Input/>
                    )}
                  </FormItem>
                  : null

              }

              {
                this.state.params.pushLocalType === '2' ? <FormItem
                    {...formItemLayout}
                    label="跳转链接"
                  >
                    {getFieldDecorator('jumpUrl', {
                      rules: [
                        {required: true}
                      ]
                    })(
                      <Input/>
                    )}
                  </FormItem>
                  : null

              }

              <FormItem
                {...formItemLayout}
                label="标题"
              >
                {getFieldDecorator('title', {
                  rules: [
                    {required: true}
                  ]
                })(
                  <Input />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="内容"
              >
                {getFieldDecorator('content', {
                  rules: [
                    {required: true}
                  ]
                })(
                  <Input type="textarea"/>
                )}
              </FormItem>


              <FormItem wrapperCol={{span: 12, offset: 6}}>
                <Button type="primary" htmlType="submit">添加</Button>
                &nbsp;
                <Button type="ghost" onClick={(e) => this.handleReset(e)}><Icon type="reload"/></Button>
              </FormItem>
            </Form>
          </div>
        </Modal>
        <Card>
          <div className="mb10">
            <Button type="primary" onClick={() => {
              this.setState({
                visible: true
              })
            }}>
              新增推送
            </Button>
          </div>
          <Table pagination={false} columns={columns} dataSource={self.state.data}
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



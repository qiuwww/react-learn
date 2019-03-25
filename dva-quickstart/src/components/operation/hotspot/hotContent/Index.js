/**
 * Created by ziyu on 17/3/15.
 */
import React, { Component,  } from 'react'
import {
  Input,
  Card,
  Form,
  Icon,
  Table,
  Button,
  Upload,
  Modal,
  Select,
  message,
} from 'antd'
import { history } from '../../../../utils/config'
import { origin, env } from '../../../../utils/config'

import { fetchPost } from '../../../../utils/request'

import Styles from '../Index.less'

const FormItem = Form.Item
const Option = Select.Option

class HotContent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      list: [],
      picUrl: '',
      loading: false,
      visible: false,
      isEdit: false,
      data: null,
      title: '新增广告',
      hotTitle: '新增热点内容',
      isHotEdit: false,
      hotData: null,
      hotIndex: null,
      fileList: [],
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData () {
    if (this.props.location.state) {
      fetchPost(
        `/cms/hotspot/content/${this.props.location.state.data.cmsHotspotId}/query`).
        then((res) => {
          this.setState({
            list: res.data.cmsHotspotContentList,
            isEdit: true,
            data: this.props.location.state.data,
            title: '编辑广告',
            fileList: [
              {
                uid: -1,
                status: 'done',
                thumbUrl: this.props.location.state.data.picUrl,
              }],
          })
        })

    }
  }

  editContent (record, index) {
    this.props.form.setFieldsValue({
      hotspotId: record.hotspotId,
      cmsHotspotContentId: record.cmsHotspotContentId,
      title: record.title,
      xStart: record.xStart,
      xEnd: record.xEnd,
      yStart: record.yStart,
      yEnd: record.yEnd,
      url: record.url,
      urlType: record.urlType.toString(),
    })
    this.setState({
      visible: true,
      hotData: record,
      hotIndex: index,
      isHotEdit: true,
    })
  }

  openModal () {
    this.setState({
      visible: true,
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.form.validateFields(
      ['bannerTitle', 'picWidth', 'picHeight', 'displayType'],
      (error, values) => {
        if (!error) {
          if (this.state.fileList.length) {
            let pic = this.state.fileList[0].response
              ? this.state.fileList[0].response.data.url
              : this.state.fileList[0].thumbUrl
            let appType = sessionStorage.getItem('appCode')

            if (this.state.isEdit) {
              fetchPost('/cms/hotspot/update', {
                title: values.bannerTitle,
                picWidth: values.picWidth,
                picHeight: values.picHeight,
                displayType: values.displayType,
                id: this.state.data.cmsHotspotId,
                picUrl: pic,
                appType: appType,
              }).then((res) => {
                if (res.code === 0) {
                  message.success(res.msg)
                  history.push({
                    pathname: '/operation/hotspot/list',
                  })
                }
              })
            } else {
              fetchPost('/cms/hotspot/add',
                {
                  title: values.bannerTitle,
                  picWidth: values.picWidth,
                  picHeight: values.picHeight,
                  displayType: values.displayType,
                  picUrl: pic,
                  appType: appType,
                }).then((res) => {
                if (res.code === 0) {
                  message.success(res.msg)
                  history.push({
                    pathname: '/operation/hotspot/list',
                  })
                }
              })
            }
          } else {
            message.warning('请先上传图片')
          }

        }
      })
  }

  handleOk () {
    const self = this
    this.props.form.validateFields(
      ['title', 'xStart', 'xEnd', 'yStart', 'yEnd', 'url', 'urlType'],
      (error, values) => {
        if (!error) {
          if (this.state.isHotEdit) {
            fetchPost('/cms/hotspot/content/update', {
              ...values,
              cmsHotspotContentId: this.state.hotData.cmsHotspotContentId,
              hotspotId: this.state.hotData.hotspotId,
            }).then((res) => {
              if (res.code === 0) {
                self.setState({
                  visible: false,
                }, () => {
                  self.getData()
                })
              }
            })
          } else {
            fetchPost('/cms/hotspot/content/add',
              {...values, hotspotId: this.state.data.cmsHotspotId}).
              then((res) => {
                if (res.code === 0) {
                  self.setState({
                    visible: false,
                  }, () => {
                    self.getData()
                  })
                }
              })
          }

        }
      })
  }

  handleCancel () {
    this.props.form.setFieldsValue({
      title: '',
      xStart: '',
      xEnd: '',
      yStart: '',
      yEnd: '',
      url: '',
      urlType: '',
    })
    this.setState({
      visible: false,
    })
  }

  cancelPoster () {
    history.push({
      pathname: '/operation/hotspot/list',
    })
  }

  handleUpload (info) {
    if (info) {
      let fileList = info.fileList
      fileList = fileList.slice(-1)
      this.setState({fileList,})
    }
  }

  render () {
    const getFieldDecorator = this.props.form.getFieldDecorator

    const uploadProps = {
      action: origin + '/upload/img',
      listType: 'picture',
      onChange: this.handleUpload.bind(this),
      defaultFileList: [...this.state.fileList],
      fileList: this.state.fileList,
      name: 'file',
    }

    const columns = [
      {
        title: '序号',
        dataIndex: '',
        key: '',
        render: (text, record, index) => (
          <div>{index + 1}</div>
        ),
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'url地址',
        dataIndex: 'url',
        key: 'url',
      },
      {
        title: 'X轴范围',
        dataIndex: '',
        key: '',
        render: (text, record) => (
          <div>
            {`${record.xStart} - ${record.xEnd}`}
          </div>
        ),
      },
      {
        title: 'Y轴范围',
        dataIndex: '',
        key: '',
        render: (text, record) => (
          <div>
            {`${record.yStart} - ${record.yEnd}`}
          </div>
        ),
      },
      {
        title: '操作',
        dataIndex: '',
        key: '',
        render: (text, record, index) => {
          return (
            <Button type='primary' onClick={() => {
              this.editContent(record, index)
            }}>修改</Button>

          )
        },
      },
    ]

    let [isEdit, isHotEdit, data] = [
      this.state.isEdit,
      this.state.isHotEdit,
      this.state.data]
    return (
      <div className="mt20">
        <div className={Styles.addHeader}>
          <Card title={this.state.title} noHovering={true}>
            <Form onSubmit={(e) => this.handleSubmit(e)}>

              <FormItem className='mt20' labelCol={{span: 6}}
                        wrapperCol={{span: 12}} label='展示位置'>

                {
                  getFieldDecorator('displayType', {
                    initialValue: `${isEdit ? data.displayType : '1'}`,
                    rules: [{required: true, message: '请选择展示位置'}],
                  })(
                    <Select>
                      <Select.Option value='2'>H5</Select.Option>
                      <Select.Option value='1'>APP</Select.Option>
                    </Select>,
                  )
                }
              </FormItem>

              <FormItem className='mt20' labelCol={{span: 6}}
                        wrapperCol={{span: 12}} label='标题'>
                {
                  getFieldDecorator('bannerTitle', {
                    initialValue: `${isEdit ? data.title : ''}`,
                    rules: [{required: true, message: '请输入标题'}],
                  })(
                    <Input type='text' placeholder="请输入标题"/>,
                  )
                }
              </FormItem>

              <FormItem className='mt20' labelCol={{span: 6}}
                wrapperCol={{span: 12}} label='图片像素(高)'>
                {
                  getFieldDecorator('picHeight', {
                    initialValue: `${isEdit ? data.picHeight : ''}`,
                    rules: [
                      {
                        required: true,
                        message: '请输入高',
                      },
                      {
                        message: '请输入数字',
                        pattern: /^[0-9]*$/,
                      }],
                  })(
                    <Input type='text' placeholder="请输入高"/>,
                  )
                }
              </FormItem>

              <FormItem className='mt20' labelCol={{span: 6}}
                        wrapperCol={{span: 12}} label='图片像素(宽)'>

                {
                  getFieldDecorator('picWidth', {
                    initialValue: `${isEdit ? data.picWidth : ''}`,
                    rules: [
                      {
                        required: true,
                        message: '请输入宽',
                      },
                      {
                        message: '请输入数字',
                        pattern: /^[0-9]*$/,
                      }],
                  })(
                    <Input type='text' placeholder="请输入宽"/>,
                  )
                }
              </FormItem>

              <FormItem className='mt20' labelCol={{span: 6}}
                        wrapperCol={{span: 12}} label='选择文件'>
                <Upload {...uploadProps}>
                  <Button>
                    <Icon type="upload"/> upload
                  </Button>
                </Upload>
              </FormItem>

              <FormItem wrapperCol={{span: 12, offset: 6}}>
                <Button type="primary" htmlType="submit">提交</Button>
                <Button type="default" className='ml10' onClick={() => {
                  this.cancelPoster()
                }}>取消</Button>
              </FormItem>
            </Form>
          </Card>
        </div>


        {
          this.state.isEdit ? <div>
              <div className={Styles.contentHeader}>
                <span className={Styles.title}>热点内容详情</span>
                <Button className="ml20" type='primary' onClick={() => {
                  this.openModal()
                }}>新增热点内容</Button>
              </div>
              <Table pagination={false} key='title' columns={columns}
                     dataSource={this.state.list}
                     loading={this.state.loading}
                     bordered size="small"
              >
              </Table>
            </div>
            : ''
        }

        <Modal title={this.state.hotTitle} visible={this.state.visible}
               onOk={() => {
                 this.handleOk()
               }} onCancel={this.handleCancel.bind(this)}
        >

          <Form>
            <FormItem className='mt20' labelCol={{span: 6}}
                      wrapperCol={{span: 12}} label='标题'>
              {
                getFieldDecorator('title', {
                  initialValue: `${isHotEdit ? data.title : ''}`,
                  rules: [{required: true, message: '请输入标题'}],
                })(
                  <Input type='text' placeholder="请输入标题"/>,
                )
              }
            </FormItem>

            <FormItem className='mt20' labelCol={{span: 6}}
                      wrapperCol={{span: 12}} label='x起始坐标'>
              {
                getFieldDecorator('xStart', {
                  initialValue: `${isHotEdit ? data.xStart : ''}`,
                  rules: [
                    {
                      required: true,
                      message: 'x起始坐标',
                    },
                    {
                      message: '请输入数字',
                      pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
                    }],
                })(
                  <Input type='text' placeholder="x起始坐标"/>,
                )
              }
            </FormItem>

            <FormItem className='mt20' labelCol={{span: 6}}
                      wrapperCol={{span: 12}} label='x终止坐标'>

              {
                getFieldDecorator('xEnd', {
                  initialValue: `${isHotEdit ? data.xEnd : ''}`,
                  rules: [
                    {
                      required: true,
                      message: 'x终止坐标',
                    },
                    {
                      message: '请输入数字',
                      pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
                    }],
                })(
                  <Input type='text' placeholder="x终止坐标"/>,
                )
              }
            </FormItem>

            <FormItem className='mt20' labelCol={{span: 6}}
                      wrapperCol={{span: 12}} label='y起始坐标'>
              {
                getFieldDecorator('yStart', {
                  initialValue: `${isHotEdit ? data.yStart : ''}`,
                  rules: [
                    {
                      required: true,
                      message: 'y起始坐标',
                    },
                    {
                      message: '请输入数字',
                      pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
                    }],
                })(
                  <Input type='text' placeholder="y起始坐标"/>,
                )
              }
            </FormItem>

            <FormItem className='mt20' labelCol={{span: 6}}
                      wrapperCol={{span: 12}} label='y终止坐标'>

              {
                getFieldDecorator('yEnd', {
                  initialValue: `${isHotEdit ? data.yEnd : ''}`,
                  rules: [
                    {
                      required: true,
                      message: 'y终止坐标',
                    },
                    {
                      message: '请输入数字',
                      pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
                    }],
                })(
                  <Input type='text' placeholder="y终止坐标"/>,
                )
              }
            </FormItem>

            <FormItem className='mt20' labelCol={{span: 6}}
                      wrapperCol={{span: 12}} label='跳转种类'>

              {
                getFieldDecorator('urlType', {
                  initialValue: `${isHotEdit ? data.urlType : '0'}`,
                  rules: [{required: true, message: '跳转种类'}],
                })(
                  <Select>
                    <Select.Option value='0'>H5跳转</Select.Option>
                    <Select.Option value='1'>app跳转</Select.Option>
                  </Select>,
                )
              }
            </FormItem>

            <FormItem className='mt20' labelCol={{span: 6}}
                      wrapperCol={{span: 12}} label='跳转地址url'>

              {
                getFieldDecorator('url', {
                  initialValue: `${isHotEdit ? data.url : ''}`,
                  rules: [
                    {
                      required: true,
                      message: '跳转地址url',
                    }, {
                      pattern: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
                    }],
                })(
                  <Input type='text' placeholder="跳转地址url"/>,
                )
              }
            </FormItem>

            t
          </Form>
        </Modal>
      </div>
    )
  }

}

HotContent = Form.create()(HotContent)

export default HotContent

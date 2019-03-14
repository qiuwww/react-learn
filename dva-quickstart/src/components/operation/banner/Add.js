/**
 * Created by ziyu on 2017/9/14.
 */
/**
 * Created by yujianfu on 2016/11/16.
 */
import React, {Component, PropTypes} from 'react'
import moment from 'moment';
import {Form, Radio, DatePicker, Modal, Upload, Select, Input, Button, Icon, message} from 'antd';
import {origin, env} from '../../../utils/config'
import {fetchPost} from '../../../utils/request'

const FormItem = Form.Item;
const {MonthPicker, RangePicker} = DatePicker;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'small',
      effectiveStart: null,
      effectiveEnd: null,
      name: "",
      fileList: [],
      params: {
        appType: 0,
        location: null,
        pictureUrl: null,
        comment: null,
        jumpLocation: 0,
        jumpUrl: null,
        effectiveStart: null,
        effectiveEnd: null,
        hotspotLocation: 0,
      }
    };
  }

  state = {visible: false}
  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    }, () => this.props.reload(Math.random()));
  };

  changeField(field, value) {

    this.setState({
      ...this.state,
      [field]: value,
    }, () => {
      this.props.changeParams(this.state);
    });
  }

  changeTime(time) {

    if (typeof(time) != 'undefined') {
      var effectiveStart = time[0].format("YYYY-MM-DD");
      var effectiveEnd = time[1].format("YYYY-MM-DD");

      this.setState({
        effectiveStart: effectiveStart,
        effectiveEnd: effectiveEnd
      }, () => {
        this.props.changeParams(this.state);
      })

    }
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.form.validateFields((error, values) => {
      if (!error) {
        let time = values.time;
        var params = {};
        if (!values.pictureUrl) {
          message.error('请先上传图片')
          return false
        }
        if (time == undefined) {
          params = {
            appType: sessionStorage.getItem('appCode'),
            location: values.location,
            hotspotLocation: values.hotspotLocation,
            jumpLocation: values.jumpLocation,
            pictureUrl: values.pictureUrl.file.response.data.url,
            jumpUrl: values.jumpUrl,
            comment: values.comment,
          };
        } else {
          params = {
            appType: sessionStorage.getItem('appCode'),
            location: values.location,
            hotspotLocation: values.hotspotLocation,
            jumpLocation: values.jumpLocation,
            pictureUrl: values.pictureUrl.file.response.data.url,
            jumpUrl: values.jumpUrl,
            effectiveStart: time[0].format("YYYY-MM-DD"),
            effectiveEnd: time[1].format("YYYY-MM-DD"),
            comment: values.comment,
          };
        }

        this.create(params);
      }
    })
  }

  create(params) {
    fetchPost('/cms/banner/add', params).then(json => {
      if (json.code == 0) {
        message.info("添加成功");
        this.handleReset()
      } else {
        message.error(json.msg);
      }
    });
  }

  handleReset(e) {
    this.props.form.resetFields();
    this.setState({
      effectiveStart: null,
      effectiveEnd: null,
      name: "",
      visible: false,
      pictureUrl: null,
      fileList: []
    }, () => {
      this.props.changeParams()
    });
  }

  range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  disabledDate(current) {
    console.log(current.valueOf(), Date.now())
    let now = moment()
    // Can not select days before today and today
    return current.valueOf() < now.subtract('days', 1);
  }


  disabledRangeTime(_, type) {
    if (type === 'start') {
      return {
        disabledHours: () => this.range(0, 60).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56]
      };
    }
    return {
      disabledHours: () => this.range(0, 60).splice(20, 4),
      disabledMinutes: () => this.range(0, 31),
      disabledSeconds: () => [55, 56]
    };
  }

  handleUpload (info) {
    if(info) {
      let fileList = info.fileList;
      fileList = fileList.slice(-1);
      this.setState({ fileList, });
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const size = this.state.size;

    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 10},
    };
    return (
      <Form inline>
        <FormItem>
          &nbsp;&nbsp;&nbsp;
          <Button type="primary" size={size} onClick={this.showModal}>新增banner</Button>
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
                  label="位置"
                >
                  {getFieldDecorator('location', {
                    initialValue: "0"
                  })(
                    <Select placeholder="类型">
                      <Select.Option key="0">APP</Select.Option>
                      <Select.Option key="3">H5</Select.Option>
                    </Select>
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="热点位置"
                >
                  {getFieldDecorator('hotspotLocation', {
                    initialValue: "0"
                  })(
                    <Select placeholder="类型">
                      <Select.Option key="0">置顶热点</Select.Option>
                    </Select>
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="上传图片"
                >
                  {getFieldDecorator('pictureUrl')(
                    <Upload onChange={this.handleUpload.bind(this)} defaultFileList={this.state.fileList} name="file"  fileList={this.state.fileList}  action={origin + "/upload/img"} listType="picture">
                      <Button type="ghost">
                        <Icon type="upload"/> 点击上传
                      </Button>
                    </Upload>
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="备注"
                >
                  {getFieldDecorator('comment', {
                    rules: [
                      {required: true, message: '备注必填!'},
                    ],
                  })(
                    <Input />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="跳转位置"
                >
                  {getFieldDecorator('jumpLocation', {
                    initialValue: "0",
                  })(
                    <Select onChange={(e) => {
                      this.setState({
                        params: {
                          ...this.state.params,
                          jumpLocation: e
                        }
                      }, () => {
                        console.log(this.state.params)
                      })
                    }} placeholder="类型">
                      <Option key="0">H5页面</Option>
                      <Option key="1">卡券包</Option>
                      <Option key="2">邀请页</Option>
                      <Option key="3">不跳转</Option>
                    </Select>
                  )}
                </FormItem>


                {
                  this.state.params.jumpLocation != "0" ?
                    <span></span>
                    :
                    <FormItem
                      {...formItemLayout}
                      label="跳转链接"
                    >
                      {getFieldDecorator('jumpUrl', {
                        rules: [
                          {required: true}
                        ]
                      })(
                        <Input />
                      )}
                    </FormItem>
                }
                <FormItem
                  {...formItemLayout}
                  label="持续时间"
                >
                  {getFieldDecorator('time', {
                    rules: [
                      {required: true}
                    ]
                  })(
                    <RangePicker
                      disabledDate={this.disabledDate}
                      format="YYYY-MM-DD"
                    />
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
        </FormItem>


      </Form>
    )
  }
}

Index = Form.create()(Index);
export default Index;



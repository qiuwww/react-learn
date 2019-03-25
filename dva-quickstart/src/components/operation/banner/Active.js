/**
 * Created by yujianfu on 2016/11/17.
 */
import React, {Component, } from 'react'
import {Form, message, Select, Input, Button, Upload, Icon, Modal, DatePicker} from 'antd';

import {fetchPost} from './../../../utils/request'
import {origin} from '../../../utils/config'

const FormItem = Form.Item;
const Option = Select.Option;

class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reload: false,
      data: null,
      activeItem: {
        id: " ",
        imageUrl: "",
        name: "",
        typeMsg: "",
        url: ""
      },
      page: {
        pageNum: 1,
        pageSize: 300
      }
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    fetchPost('/banner/draft/list?pageNum=' + this.state.page.pageNum + "&pageSize=" + this.state.page.pageSize).then(json => {
      if (json.data != null) {
        var data = json.data.list;
        this.setState({
          data: data
        });
      }
    });
  }


  handleSubmit(e) {
    e.preventDefault();
    const {id} = this.props.form.getFieldsValue();
    this.active(id);
  }

  active(id) {
    var self = this;
    fetchPost('/banner/' + id + '/active').then(json => {
      if (json.code == 0) {
        message.info("操作成功");
        self.setState({
          activeItem: {
            id: " ",
            imageUrl: "",
            name: "",
            typeMsg: "",
            url: ""
          }
        }, () => {
          self.getData();
          self.props.reload();
        })
      } else {
        message.error(json.msg);
      }
    });
  }

  selectBanner(id) {
    var self = this;
    this.state.data.map(function (banner) {
      if (banner.id == id) {
        self.setState({
          activeItem: banner
        })
      }
    })
  }


  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 14},
    };

    if (this.state.data == null) {
      return (
        <div style={{'marginTop': 30}}>
          <span>暂无可用banner</span>
        </div>
      )
    }

    const res = this.state.data;
    const banners = [];

    banners.push(<Select.Option key=" ">全部</Select.Option>);
    res.map(function (banner) {
      banners.push(<Select.Option key={banner.id}>{banner.name}</Select.Option>);
    });

    return (
      <div style={{'marginTop': 30}}>
        <Form style={{width: '100%', margin: 'auto'}} horizontal onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="可选通告"
          >
            {getFieldDecorator('id', {
              initialValue: this.state.activeItem.id
            })(
              <Select placeholder="类型" onChange={(e) => this.selectBanner(e)}>
                {banners}
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="图片"
          >
            {getFieldDecorator('imageUrl')(
              <img width='180' src={this.state.activeItem.imageUrl}/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="名称"
          >
            {getFieldDecorator('name', {
              initialValue: this.state.activeItem.name,
            })(
              <Input />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="类型"
          >
            {getFieldDecorator('type', {
              initialValue: this.state.activeItem == 2 ? this.state.activeItem.typeMsg + " ( " + this.state.activeItem.startDate + " ~ " + this.state.activeItem.endDate + " )" : this.state.activeItem.typeMsg,
            })(
              <Input />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="跳转地址"
          >
            {getFieldDecorator('url', {
              initialValue: this.state.activeItem.url,
            })(
              <Input />
            )}
          </FormItem>

          <FormItem wrapperCol={{span: 12, offset: 6}}>
            <Button type="primary" onClick={(e) => this.handleSubmit(e)}>启用</Button>
          </FormItem>
        </Form>


      </div>
    );
  }

}


Active = Form.create()(Active);
export  default Active;

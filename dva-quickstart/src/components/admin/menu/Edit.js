/**
 * Created by yujianfu on 2016/11/17.
 */
import React, { Component } from "react";
import { Form, message, Input, Button, Icon } from "antd";
import { fetchPost } from "./../../../utils/request";
import Style from "./Index.less";
const FormItem = Form.Item;

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: {
        id: 0,
        name: "",
        url: ""
      },
      params: {
        name: null,
        url: null
      }
    };
  }

  componentWillReceiveProps(props) {
    let activeItem = props.activeItem;
    if (this.state.activeItem.id != activeItem.id) {
      this.setState({
        activeItem
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const { name, url } = this.props.form.getFieldsValue();
    if (typeof name === "undefined") {
      message.error("必填项不能为空");
    } else {
      this.setState(
        {
          activeItem: {
            ...this.state.activeItem,
            name,
            url
          },
          params: {
            name,
            url
          }
        },
        () => {
          this.updateMenu();
        }
      );
    }
  }

  updateMenu() {
    fetchPost(
      `/menu/${this.state.activeItem.id}/update`,
      this.state.params
    ).then(json => {
      if (json.code === 0) {
        message.info("添加成功");
        this.props.form.resetFields();
      } else {
        message.error(json.msg);
      }
    });
  }

  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };

    return (
      <div className={Style.menuWrapper}>
        <Form horizontal onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="名称" hasFeedback>
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "名称不能为空!" }],
              initialValue: this.state.activeItem.name
            })(<Input />)}
          </FormItem>

          <FormItem {...formItemLayout} label="url" hasFeedback>
            {getFieldDecorator("url", {
              initialValue: this.state.activeItem.url
            })(<Input />)}
          </FormItem>

          <FormItem wrapperCol={{ span: 12, offset: 6 }}>
            <Button type="primary" onClick={e => this.handleSubmit(e)}>
              更新
            </Button>
            &nbsp;
            <Button type="ghost" onClick={e => this.handleReset(e)}>
              <Icon type="reload" />
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

Edit = Form.create()(Edit);
export default Edit;

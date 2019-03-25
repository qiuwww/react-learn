/**
 * Created by yujianfu on 2016/11/17.
 */
import React, { Component } from "react";
import { Form, message, Select, Input, Button, Icon } from "antd";
import { fetchPost } from "./../../../utils/request";
import Style from "./Index.less";
import Title from "../../common/components/Title";
import { history } from "../../../utils/config";
const FormItem = Form.Item;
const Option = Select.Option;

class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        name: null,
        type: 0,
        description: ""
      }
    };
  }

  componentDidMount() {
    if (this.props.params.id) {
      this.setState({
        data: this.props.location.state.data,
        isEdit: true
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const { name, type, description } = this.props.form.getFieldsValue();
    this.props.form.validateFields(error => {
      if (!error) {
        if (this.state.isEdit) {
          fetchPost(`/admin/role/${this.state.data.id}/update`, {
            name,
            description
          }).then(json => {
            if (json.code === 0) {
              message.info("修改成功");
              history.push("/admin/role/list");
            } else {
              message.error(json.msg);
            }
          });
        } else {
          fetchPost("/admin/role/add", {
            name,
            description
          }).then(json => {
            if (json.code === 0) {
              message.info("添加成功");
              history.push("/admin/role/list");
            } else {
              message.error(json.msg);
            }
          });
        }
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
      <div>
        <Title title={this.state.isEdit ? "编辑角色" : "新增角色"} />
        <div className={Style.addClass}>
          <Form horizontal onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="角色名">
              {getFieldDecorator("name", {
                initialValue: this.state.isEdit ? this.state.data.name : "",
                rules: [{ required: true, message: "角色名必填!" }]
              })(<Input />)}
            </FormItem>

            <FormItem {...formItemLayout} label="描述" hasFeedback>
              {getFieldDecorator("description", {
                initialValue: this.state.isEdit
                  ? this.state.data.description
                  : ""
              })(<Input type="textarea" />)}
            </FormItem>

            <FormItem wrapperCol={{ span: 12, offset: 6 }}>
              <Button type="primary" onClick={e => this.handleSubmit(e)}>
                {this.state.isEdit ? "修改角色" : "新建角色"}
              </Button>
              &nbsp;
              <Button type="ghost" onClick={e => this.handleReset(e)}>
                <Icon type="reload" />
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

Add = Form.create()(Add);
export default Add;

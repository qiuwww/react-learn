/**
 * Created by Administrator on 2016/12/29.
 */
/**
 * Created by Administrator on 2016/12/29.
 */
import React, { Component } from "react";
import { Button, Input, Icon, Form } from "antd";
const FormItem = Form.Item;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }
  handleSubmit(e) {
    e.preventDefault();
    const { name } = this.props.form.getFieldsValue();
    this.setState(
      {
        name
      },
      () => {
        this.props.changeItem(this.state);
      }
    );
  }
  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
    this.setState(
      {
        name: ""
      },
      () => {
        this.props.changeItem(this.state);
      }
    );
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form inline>
        <FormItem label="名称">
          {getFieldDecorator("name")(<Input placeholder="名称" />)}
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={e => this.handleSubmit(e)}>
            <Icon type="search" />
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="ghost" onClick={e => this.handleReset(e)}>
            <Icon type="reload" />
          </Button>
        </FormItem>
      </Form>
    );
  }
}

Search = Form.create()(Search);
export default Search;

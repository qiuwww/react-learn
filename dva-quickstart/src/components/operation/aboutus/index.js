import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Card, Input, Button, Popconfirm, Form } from 'antd';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

@connect(({ aboutus }) => ({
  loading: aboutus.loading,
  btnLoading: aboutus.btnLoading,
  formData: aboutus.data,
}))

@Form.create()

export default class AboutUs extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount = () => {
    this.props.dispatch({
      type: 'aboutus/fetch',
      callback: (data) => {
        const { form: { setFieldsValue } } = this.props
        setFieldsValue({
          describe: data.describe || '',
          servicePhone: data.servicePhone || '',
          serviceQq: data.serviceQq || '',
          serviceWechat: data.serviceWechat || '',
          message: data.message || '',
        });
      }
    });
  }
  handleSubmit = () => {
    const { form: { validateFields } } = this.props;
    validateFields((err, value) => {
      if (!err) {
        this.props.dispatch({
          type: 'aboutus/fetchPush',
          payload: { ...value },
        });
      }
    });
  }

  render () {
    const { form: { getFieldDecorator } } = this.props;
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 16},
    };
    return (
      <Card loading={this.props.loading}>
        <h3 style={{ marginBottom: 30, fontSize: 18, textIndent: '4em'}}>APP设置</h3>
        <Form horizontal style={{ width: '60%'}}>
          <FormItem
            {...formItemLayout}
            label='关于我们'
          >
            {getFieldDecorator('describe', {
              rules: [
                // {required: true, message: '关于我们不能为空!'},
                { max: 50, message: '最多50个字' },
              ],
            })(
              <TextArea autosize={{ minRows: 3, maxRows: 6 }}/>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='客服电话'
          >
            {getFieldDecorator('servicePhone', {
              rules: [
                {required: true, message: '客服电话不能为空!'},
              ],
            })(
              <Input />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='客服QQ'
          >
            {getFieldDecorator('serviceQq', {
              rules: [
                // {required: true, message: '客服QQ不能为空!'},
              ],
            })(
              <Input />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='客服微信'
          >
            {getFieldDecorator('serviceWechat', {
              rules: [
                // {required: true, message: '客服微信不能为空!'},
              ],
            })(
              <Input />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='通知'
          >
            {getFieldDecorator('message', {
              rules: [
                // {required: true, message: '通知不能为空!'},
                { max: 50, message: '最多50个字' },
              ],
            })(
              <TextArea autosize={{ minRows: 3, maxRows: 6 }}/>,
            )}
          </FormItem>
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={this.handleSubmit}>提交</Button>
          </div>
        </Form>
      </Card>
    )
  }
}

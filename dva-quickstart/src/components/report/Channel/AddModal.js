import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Form, Modal, Input, InputNumber } from 'antd';
// import styles from './index.less';
const FormItem = Form.Item;

@connect(({ channel }) => ({
  addModals: channel.addModals,
}))
@Form.create()
export default class AddModal extends Component {
  state = {
    loading: false,
  }

  componentDidMount() {    
  }
  componentWillReceiveProps = (nextProps) => {
    const { form: { setFieldsValue } } = nextProps;
    if (!this.props.addModals.visible && nextProps.addModals.visible) {
      const { form: { setFieldsValue } } = this.props;
    } else if (this.props.addModals.visible && !nextProps.addModals.visible) {
      this.setState({
        loading: false,
      });
      setFieldsValue({
        note: '',
        channelName: '',
      });
    }
  }

  handleCancel = () => {
    this.props.dispatch({
      type: 'channel/hideAddModals',
    });
  }
  handleOk = () => {
    const { form: { validateFields } } = this.props;
    // const fetchType = this.state.type === 'edit' ? 'links/fetchChangeChannel' : 'links/fetchAddChannel';
    validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true,
        });
        this.props.dispatch({
          type: 'channel/fetchSave',
          payload: {
            ...values,
          },
          callback: (res) => {
            this.setState({
              loading: false,
            });
            if (res.code === 0) {
              if (this.props.fetch) this.props.fetch();
            }
          }
        });
      }
    });
  }

  render() {
    const { addModals: { visible }, form: { getFieldDecorator } } = this.props;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 16},
    };
    return (
      <Modal
        title={this.state.type === 'edit' ? '修改渠道' : '新增渠道'}
        visible={visible}
        onCancel={this.handleCancel}
        footer={<div style={{ padding: 10 }}>
          <Button loading={this.state.loading} type="primary" onClick={this.handleOk}>确定</Button>
        </div>}
      >
        <Form>
          <FormItem {...formItemLayout} label={'渠道号'}>
            {getFieldDecorator('channelName', {
              rules: [
                { required: true, message: '请填写渠道号！' },
                { pattern: /^\w+$/, message: '只能输入字母和数字！' }
              ],
            })(
              <Input placeholder="请填写渠道号"  style={{width: '100%'}} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={'备注'}>
            {getFieldDecorator('note', {
              rules: [{ required: true, message: '请填写备注！' }],
            })(
              <Input placeholder="请填写备注"  style={{width: '100%'}} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

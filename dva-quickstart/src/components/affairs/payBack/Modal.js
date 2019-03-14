import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Form, Modal, Input, DatePicker, Row, Col } from 'antd';
import styles from './payBack.less';
const FormItem = Form.Item;

@connect(({ payBack }) => ({
  data: payBack.data,
  modals: payBack.modals,
}))
@Form.create()
export default class PayModals extends Component {
  state = {
    loading: false,
  }

  componentDidMount() {    
  }
  componentWillReceiveProps = (nextProps) => {
    const { form: { setFieldsValue } } = nextProps;
    if (!this.props.modals.visible && nextProps.modals.visible) {

    } else if (this.props.modals.visible && !nextProps.modals.visible) {
      this.setState({
        loading: false,
      });
      setFieldsValue({
        acceptAmount: '',
      });
    }
  }

  handleCancel = () => {
    this.props.dispatch({
      type: 'payBack/hideModals',
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
          type: 'payBack/fetchSave',
          payload: {
            ...values,
            tradeNo: this.props.data.tradeNo || '',
          },
          callback: () => {
            this.setState({
              loading: false,
            });
          }
        });
      }
    });
  }

  render() {
    const { modals: { visible }, form: { getFieldDecorator }, data } = this.props;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 16},
    };
    console.log(data)
    return (
      <Modal
        title="线下续期"
        visible={visible}
        onCancel={this.handleCancel}
        // onOk={this.handleOk}
        footer={<div style={{ padding: 10 }}>
          <Button onClick={this.handleCancel}>取消</Button>
          <Button loading={this.state.loading} type="primary" onClick={this.handleOk}>确定</Button>
        </div>}
      >
        <div className={styles.listItem}>
          <span>待还款账单订单号：</span>{data.tradeNo || ''}
        </div>
        <Row className={styles.listItem} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={12}><span>客户姓名：</span>{data.name || ''}</Col>
          <Col xs={24} sm={12}><span>客户手机号：</span>{data.mobile || ''}</Col>
          <Col xs={24} sm={12}><span>借款期限：</span>{data.borrowTerm || ''}</Col>
          <Col xs={24} sm={12}><span>借款金额：</span>{data.borrowCapital || ''}</Col>
        </Row>
        <Form>
          <FormItem {...formItemLayout} label={'实收展期费用'}>
            {getFieldDecorator('acceptAmount', {
              rules: [
                { required: true, message: '请填写实收展期费用！' },
                { pattern: /^[0-9|\.]*$/, message: '请输入数字！' }
              ],
            })(
              <Input placeholder="请填写实收展期费用"  style={{width: '100%'}} />
            )}
          </FormItem>
          <Row>
            <Col span={6} style={{ textAlign: 'right' }}>展期至：</Col>
            <Col span={16}>{data.extension || ''}</Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

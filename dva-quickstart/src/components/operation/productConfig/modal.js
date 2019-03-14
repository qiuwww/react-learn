import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Modal, Row, Col, Input, Button, Popconfirm, Form, Switch, Select, InputNumber } from 'antd';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

@connect(({ product }) => ({
  btnLoading: product.btnLoading,
  visible: product.modals.visible,
  formData: product.modals.data,
  periodsOptions: product.periodsOptions,
}))

@Form.create()

export default class ProductModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      accountMoney: '',
      payable: '',
      disabled: false,
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { form: { getFieldsValue, setFieldsValue }} = this.props;
    if (!this.props.visible && nextProps.visible) {
      if (nextProps.formData && nextProps.formData.productId) {
        const data = nextProps.formData;
        const FieldsValue = {};
        const formKeys = Object.keys(getFieldsValue());
        formKeys.forEach(item => {
          FieldsValue[item] = item === 'isRenewable' || item === 'paybackPeriodType' ? data[item] : parseFloat(data[item]);
        });
        setFieldsValue(FieldsValue);

        if (data.isRenewable) {
          this.handleSetCharge(data.renewalCharge);
        }
        this.handleCalculation();
        this.setState({
          disabled: true,
        });
      } else {
        setFieldsValue({
          isRenewable: false,
        });
      }
    } else if (this.props.visible && !nextProps.visible) {
      const formKeys = Object.keys(getFieldsValue());
      const FieldsValue = {};
      formKeys.forEach(item => {
        FieldsValue[item] = '';
      });
      setFieldsValue(FieldsValue);
      this.setState({
        accountMoney: '',
        payable: '',
        disabled: false,
      });
    }
  }
  handleSetCharge = (value) => {
    const { form: { setFieldsValue }} = this.props;
    setTimeout(() => {
      setFieldsValue({
        renewalCharge: value,
      });
    });
  }
  handleSubmit = () => {
    const { form: { validateFields } } = this.props;
    validateFields({
      force: true,
    }, (err, value) => {
      if (!err) {
        this.props.dispatch({
          type: 'product/fetchSave',
          payload: {
            ...this.props.formData,
            ...value,
          },
        });
      }
    });
  }
  handleCancel = () => {
    this.props.dispatch({
      type: 'product/hideModals',
    });
  }
  handleCalculation = () => {
    const { form: { validateFields }, periodsOptions } = this.props;
    const data = {};
    setTimeout(() => {
      validateFields(['principalMoney', 'serviceCharge'], (err, value) => {
        if (!err) {
          data.accountMoney = value.principalMoney - value.serviceCharge;
        } else {
          data.accountMoney = '';
        }
      });
      validateFields(['principalMoney', 'annualized', 'paybackPeriodType'], (err, value) => {
        if (!err) {
          let days = parseInt(periodsOptions.find(item => item.type === value.paybackPeriodType).value);
          data.payable = (parseFloat(value.principalMoney) + (value.principalMoney * (value.annualized / 365).toFixed(2) / 100 * days));
        } else {
          data.payable = '';
        }
      });
      this.setState({
        ...data,
      });
    });
  }

  validatorServiceCharge = (rule, value, callback) => {
    console.log(1)
    const { form: { getFieldValue }, periodsOptions } = this.props;
    let principalMoney = getFieldValue('principalMoney');
    principalMoney = principalMoney ? parseFloat(principalMoney) : '';
    if (principalMoney) {
      if (value > (principalMoney * 0.35)) {
        callback('不能超过借款金额的35%');
      }
    }
    callback();
  }
  render () {
    const { visible, form: { getFieldDecorator, getFieldValue }, periodsOptions } = this.props;
    const { disabled } = this.state;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 16},
    };
    return (
      <Modal
        title="借款产品"
        visible={visible}
        onCancel={this.handleCancel}
        footer={<div style={{ padding: 10 }}>
          <Button loading={this.state.loading} type="primary" onClick={this.handleSubmit}>保存</Button>
        </div>}
      >
        <Form>
          <FormItem {...formItemLayout} label={'借款金额'}>
            {getFieldDecorator('principalMoney', {
              rules: [
                { required: true, message: '请填写借款金额！' },
                { pattern: /^[(\d+)(\d+\.\d)]+$/, message: '只能输入数字！' },
              ],
            })(
              <Input disabled={disabled} placeholder="请填写借款金额" onChange={this.handleCalculation} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={'服务费'}>
            {getFieldDecorator('serviceCharge', {
              validateTrigger: 'onChange',
              rules: [
                { required: true, message: '请填写服务费！' },
                { pattern: /^[(\d+)(\d+\.\d)]+$/, message: '只能输入数字！' },
                { validator: this.validatorServiceCharge }
              ],
            })(
              <Input placeholder="请填写服务费" onChange={this.handleCalculation} />
            )}
          </FormItem>
          <Row style={{ paddingBottom: 20 }}>
            <Col span="6" style={{ color: '#000', textAlign: 'right' }}>到账金额：</Col>
            <Col span="16">{this.state.accountMoney}</Col>
          </Row>
          <FormItem {...formItemLayout} label={'借款周期'}>
            {getFieldDecorator('paybackPeriodType', {
              rules: [{ required: true, message: '请选择借款周期！' }],
            })(
              <Select disabled={disabled} placeholder="请选择" onChange={this.handleCalculation}>
                {periodsOptions.map(item => <Option value={item.type} key={item.type}>{item.desc}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={'年化利率（%）'}>
            {getFieldDecorator('annualized', {
              rules: [{ required: true, message: '请填写年化利率！' }],
            })(
              <InputNumber min={0} max={36} placeholder="最高不得超过36" style={{ width: '100%' }} onChange={this.handleCalculation} />
            )}
          </FormItem>
          <Row style={{ paddingBottom: 20 }}>
            <Col span="6" style={{ color: '#000', textAlign: 'right' }}>到期应还：</Col>
            <Col span="16">{this.state.payable}</Col>
          </Row>
          <div style={{ paddingTop: 20, margin: '20px 0', borderTop: '1px dashed #ccc', borderBottom: '1px dashed #ccc' }}>
            <FormItem {...formItemLayout} label={'开启展期'}>
            {getFieldDecorator('isRenewable', {
              valuePropName: 'checked',
            })(
              <Switch />
            )}
          </FormItem>
          {getFieldValue('isRenewable') && <FormItem {...formItemLayout} label={'展期费'}>
              {getFieldDecorator('renewalCharge', {
                rules: [{ required: true, message: '请填写展期费！' },
                { pattern: /^[(\d+)(\d+\.\d)]+$/, message: '只能输入数字！' }],
              })(
                <Input placeholder="请填写展期费" />
              )}
            </FormItem>}
          </div>

          <p style={{paddingLeft: 40, color: '#f1807c', marginBottom: 20 }}>罚息 = 逾期管理费+逾期利率*借款金额*逾期天数</p>
          <FormItem {...formItemLayout} label={'逾期管理费'}>
            {getFieldDecorator('overdueServiceCharge', {
              rules: [{ required: true, message: '请填写逾期管理费！' },
              { pattern: /^[(\d+)(\d+\.\d)]+$/, message: '只能输入数字！' }],
            })(
              <Input placeholder="请填写逾期管理费" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={'逾期利率（%）'}>
            {getFieldDecorator('penaltyRate', {
              rules: [{ required: true, message: '请填写逾期利率！' }],
            })(
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

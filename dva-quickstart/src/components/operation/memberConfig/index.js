import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Card, InputNumber, Button, Form, Switch } from 'antd';
const FormItem = Form.Item;
@connect(({ member }) => ({
  loading: member.loading,
  btnLoading: member.btnLoading,
}))
@Form.create()

export default class MemberConfig extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      memberShipSwitch: false,
      memberCreditSwitch: false,
    }
  }

  componentWillMount = () => {
    const { form: { setFieldsValue }} = this.props;
    this.props.dispatch({
      type: 'member/fetch',
      callback: (data) => {
        this.setState({
          memberShipSwitch: data.memberShipSwitch,
          memberCreditSwitch: data.memberCreditSwitch,
        }, () => {
          if (data.memberShipSwitch && data.memberShipConfigVos) {
            const fieldsValue = {};
            data.memberShipConfigVos.forEach(item => {
              fieldsValue[`loanCredit_${item.loanCountRange}`] = item.loanCredit;
            });
            setFieldsValue(fieldsValue);
          }
        });
      }
    });
  }
  handleChange = (value) => {
    this.setState({
      memberShipSwitch: value,
    })
  }
  handleSave = () => {
    const { memberShipSwitch } = this.state;
    const { form: { validateFields } } = this.props;
    validateFields({
      force: true,
    }, (err, value) => {
      if (!err) {
        const arr = Object.values(value);
        const memberShipConfigVos = arr.map((item, index) => {
          return {
            loanCountRange: index,
            loanCredit: item,
          };
        });
        this.props.dispatch({
          type: 'member/fetchSave',
          payload: {
            memberShipSwitch,
            memberShipConfigVos,
          },
        });
      }
    });
  }
  handleValidator = (data) => {
    const { rule, value, callback, index } = data;
    const { form: { getFieldValue } } = this.props;
    if (value) {
      if (index > 0) {
        const lastValue = getFieldValue(`loanCredit_${index - 1}`);
        if (lastValue > value) {
          callback('额度不能小于上一个设置');
        }
      }
      if (index < 20) {
        const afterValue = getFieldValue(`loanCredit_${index + 1}`);
        if (afterValue < value) {
          callback('额度不能大于下一个设置');
        }
      }
    }
    data.callback();
  }
  render () {
    const { loading, form: { getFieldDecorator } } = this.props;
    const { memberShipSwitch, memberCreditSwitch } = this.state;
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 12},
    };
    return (
      <Card loading={loading}>
        <h3 style={{ marginBottom: 20, fontSize: 18 }}>会员设置</h3>
        <div>
          开启会员功能：<Switch checked={memberShipSwitch} onChange={this.handleChange} disabled={!memberCreditSwitch} />
          {memberCreditSwitch && <Button type="primary" onClick={this.handleSave} style={{ marginLeft: 50 }}>提交设置</Button>}
          {!memberCreditSwitch && <p style={{ color: '#f00', paddingTop: 20 }}>会员授信功能未开启,请联系客服</p>}
        </div>
        {memberShipSwitch && <Form style={{ paddingTop: 40}}>
          {Array(21).fill('').map((item, index) => (<FormItem key={index} {...formItemLayout} label={`${index}次正常还款额度`}>
            {getFieldDecorator(`loanCredit_${index}`, {
              validateTrigger: 'onChange',
              rules: [
                { required: true, message: '请填写还款额度' },
                { pattern: /^\d*0{2}$/, message: '只能输入是100的倍数的整数' },
                { type: 'number', validator: (rule, value, callback) => this.handleValidator({rule, value, callback, index}) },
              ],
            })(
              <InputNumber min={0} step={100} style={{ width: 200 }} />
            )}
          </FormItem>))}
        </Form>}
      </Card>
    )
  }
}

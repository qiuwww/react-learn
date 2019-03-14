/**
 * @author lianPf
 * @date 2017-11-13
 * */

import React from 'react';
import { Modal, Form, Select, DatePicker, Row, Col, Input, InputNumber } from 'antd';
import moment from 'moment';
import Styles from './updateModal.less';

const { MonthPicker, RangePicker } = DatePicker;
const Option = Select.Option;
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';

class Index extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      modalState: {
        ...props.modalState,
        repaymentDateObj: moment(props.modalState.repaymentDate, dateFormat)
      },
      modalConfig: {
        title: '修改记录',
        maskClosable: false,
        okText: '确认',
      },
    };

    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.repaymentDateChange = this.repaymentDateChange.bind(this);
    this.capitalChange = this.capitalChange.bind(this);
    this.interestChange = this.interestChange.bind(this);
    this.totalManagerFeeChange = this.totalManagerFeeChange.bind(this);
    this.extraInfoChange = this.extraInfoChange.bind(this);
  }

  componentWillReceiveProps (props) {
    if(this.state.modalState != props.modalState) {
      this.setState({
        modalState: {
          ...props.modalState,
          repaymentDateObj: moment(props.modalState.repaymentDate, dateFormat)
        }
      })
    }
  }

  // update modal
  handleOk(event) {
    console.log('--update-params--', this.state.modalState);
    const { modalState } = this.state;
    // 调用parent传参数
    this.props.sendParams({...modalState, btnType: 0}, event);
    // clear state
    let copyState = {};
    for(let i in this.state.modalState) {
      if ( i === 'visible') {
        copyState[i] = false;
      } else {
        copyState[i] = '';
      }
    }
    this.setState({
      modalState: {
        ...copyState,
      }
    })
  }
  handleCancel() {
    let copyState = {};
    for(let i in this.state.modalState) {
      if ( i === 'visible') {
        copyState[i] = false;
      } else {
        copyState[i] = '';
      }
    }
    this.setState({
      modalState: {
        ...copyState,
      }
    }, () => {
      // 调用parent传参数
      console.log('--modal-state--', this.state.modalState);
      this.props.sendParams({...this.state.modalState, btnType: 1}, event);
    })
  }

  // onChange function
  repaymentDateChange(date, dateString) {
    this.setState({
      modalState: {
        ...this.state.modalState,
        repaymentDateObj: date,
        repaymentDate: dateString,
      }
    })
  }
  capitalChange(event) {
    this.setState({
      modalState: {
        ...this.state.modalState,
        capital: event.target.value,
      }
    })
  }
  interestChange(event) {
    this.setState({
      modalState: {
        ...this.state.modalState,
        interest: event.target.value,
      }
    })
  }
  totalManagerFeeChange(event) {
    this.setState({
      modalState: {
        ...this.state.modalState,
        managerFee: event.target.value,
      }
    })
  }
  extraInfoChange(event) {
    this.setState({
      modalState: {
        ...this.state.modalState,
        extraInfo: event.target.value,
      }
    })
  }

  render () {
    const self = this;

    const { modalState } = this.state;
    const { visible, repaymentDateObj, repaymentDate, capital, interest, managerFee, extraInfo } = modalState;

    const rowStyle = {
      marginBottom: '8px',
    };
    const labelStyle = {
      lineHeight: '32px',
    };
    let dateRepay = '';

    console.log('--time--', );
    return (
      <div>
        <Modal {...this.state.modalConfig} visible={ visible } onOk={() => {this.handleOk()}}
               onCancel={() => {this.handleCancel()}}
        >
          <div className={Styles.formStyle}>
            <Row style={{...rowStyle}}>
              <Col style={{...labelStyle}} span={4}>还款日:</Col>
              <Col span={12}><DatePicker value={repaymentDateObj} format={dateFormat} onChange={this.repaymentDateChange} /></Col>
            </Row>


            <Row style={{...rowStyle}}>
              <Col style={{...labelStyle}} span={4}>应还本金:</Col>
              <Col span={12}><Input value={capital} onChange={this.capitalChange} size="large" /></Col>
            </Row>

            <Row style={{...rowStyle}}>
              <Col style={{...labelStyle}} span={4}>应还利息:</Col>
              <Col span={12}><Input value={interest} onChange={this.interestChange} size="large" /></Col>
            </Row>

            <Row style={{...rowStyle}}>
              <Col style={{...labelStyle}} span={4}>应还服务费:</Col>
              <Col span={12}><Input value={managerFee} onChange={this.totalManagerFeeChange} size="large" /></Col>
            </Row>

            <Row style={{...rowStyle}}>
              <Col style={{...labelStyle}} span={4}>备注:</Col>
              <Col span={12}><Input value={extraInfo} onChange={this.extraInfoChange} size="large" /></Col>
            </Row>
          </div>

        </Modal>
      </div>
    )
  }
}

export default Index

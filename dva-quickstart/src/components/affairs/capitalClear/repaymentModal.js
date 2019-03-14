/**
 * @author lianPf
 * @date 2017-11-10
 * */

import React from 'react';
import { Modal, Form, Select, Row, Col, message } from 'antd';
import { fetchPost } from '../../../utils/request';

const Option = Select.Option;
const FormItem = Form.Item;

class Index extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      modalState: props.modalState,
      modalConfig: {
        title: '修改状态',
        maskClosable: false,
        okText: '确认',
        width: '360px',
      },
      settleRepayStatuses: [],
    }
  }

  componentDidMount() {
    fetchPost(`/settle/fund/query`,{}).then((res) => {
      if(res.code === 0) {
        // 数据获取 success
        if (res.data !== null) {
          const { settleRepayStatuses } = res.data;
          this.setState({
            settleRepayStatuses,
          });
        }

      } else {
        // 数据获取 fail
        message.error(res.msg);
      }
    })
  }

  componentWillReceiveProps (props) {
    if(this.state.modalState != props.modalState) {
      this.setState({
        modalState: props.modalState
      })
    }
  }
  handleChange(value) {
    console.log('--handleChange--', value);
    let repaymentStatusDesc = '';
    this.state.settleRepayStatuses.map((item) => {
      if (item.value === value) {
        repaymentStatusDesc = item.name;
      }
    })
    console.log('--handleChange--', repaymentStatusDesc);

    this.setState({
      modalState: {
        ...this.state.modalState,
        repayStatus: value,
        repaymentStatusDesc,
      }
    })
  }
  handleOk(event) {
    const {modalState} = this.state;
    this.props.getParams({...modalState, btnType: 0}, event)
  }
  handleCancel(event) {
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
      console.log('--modal-state--', this.state.modalState);
      this.props.getParams({...this.state.modalState, btnType: 1}, event)
    })
  }

  render () {
    const { modalState, settleRepayStatuses } = this.state;
    const { visible, repayStatus, repaymentStatusDesc } = modalState;

    const Style = {
      width: '85%',
      marginLeft: '15%',
      textAlign: 'left',
    }
    const labelStyle = {
      lineHeight: '32px',
    }

    return (
      <div>
        <Modal {...this.state.modalConfig} visible={ visible } onOk={(e) => {this.handleOk(e)}}
               onCancel={() => {this.handleCancel()}}
        >
          <div style={{...Style}}>
            <Row>
              <Col style={{...labelStyle}} span={5}>还款方式:</Col>
              <Col span={12}>
                <Select
                  placeholder="还款状态"
                  onChange={(e) => this.handleChange(e)}
                  style={{width: 160}}
                  value={repaymentStatusDesc}
                >
                  {
                    settleRepayStatuses.map((item, index) => {
                      return (
                        <Option key={index} value={item.value}>{item.name}</Option>
                      );
                    })
                  }
                </Select>
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    )
  }
}

export default Index

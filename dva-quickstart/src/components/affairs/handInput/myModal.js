/**
 * @author lianPf
 * @date 2017-11-10
 * */

import React from 'react';
import { Modal, Form, Select } from 'antd';

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
    }
  }

  componentWillReceiveProps (props) {
    if(this.state.modalState != props.modalState) {
      this.setState({
        modalState: props.modalState
      })
    }
  }
  handleChange(event) {
    console.log('--select--', event);
  }
  handleOk() {
    console.log('--modal-ok--');
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
      console.log('--modal-state--', this.state.modalState);
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { modalState } = this.state;
    const { visible } = modalState;

    return (
      <div>
        <Modal {...this.state.modalConfig} visible={ visible } onOk={() => {this.handleOk()}}
               onCancel={() => {this.handleCancel()}}
        >
          <Form>
            <div>
              <FormItem className='mt20' labelCol={{span: 6}}
                        wrapperCol={{span: 12}} label='还款方式:'>
                {
                  getFieldDecorator('payChannel', {
                    rules: [{
                      required: true,
                      message: '请选择还款状态'
                    }]
                  })(
                    <Select
                      placeholder="还款状态"
                      onChange={(e) => this.handleChange(e)}
                      style={{width: 160}}
                    >
                      <Option key="1">未结清</Option>
                      <Option key="2">本息已结清</Option>
                      <Option key="3">服务费已结清</Option>
                      <Option key="4">已结清</Option>
                    </Select>
                  )
                }
              </FormItem>
            </div>

          </Form>

        </Modal>
      </div>
    )
  }
}

Index = Form.create()(Index);

export default Index

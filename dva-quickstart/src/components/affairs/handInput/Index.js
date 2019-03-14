/**
 * @author lianPf
 * @date 2017-11-10
 * */

import React from 'react';
import moment from 'moment';
import { Table, Button, Modal, message } from 'antd';
import Styles from './index.less';
import AddModal from './addModal';
import UpdateModal from  './updateModal';
import { fetchPost } from '../../../utils/request';

// rowSelection object indicates the need for row selection
const confirm = Modal.confirm;


class Index extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      page: {
        totalCount: 0,
        pageSize: 10,
      },
      addModalState: {
        visible: false,
      },
      updateModalState: {
        visible: false,
      },
      handleInputDate: [],
      selectedRows: [],
    }

    this.rowSelectionChange = this.rowSelectionChange.bind(this);
    this.sendParamsAdd = this.sendParamsAdd.bind(this);
    this.sendParamsUpdate = this.sendParamsUpdate.bind(this);
  }

  // modal对应事件
  addNewHandInputModal() {
    const visible = true;
    this.setState({
      addModalState: {
        ...this.state.addModalState,
        visible,
      }
    })
  }
  updateHandInputItem(item) {
    // console.log('--修改--', item);
    const visible = true;
    this.setState({
      updateModalState: {
        ...this.state.updateModalState,
        ...item,
        visible,
      }
    }, ()=> {
      // console.log('--修改-after--', this.state.updateModalState);
    })
  }
  sendParamsAdd(params) {
    const self = this;
    const { btnType, fundSite, loanDate, loanAmount, extraInfo, isShortPeriod, period, feeRepayDateType, repayWay } = params;
    if (btnType === 0){
      // add modal OK
      const _params = {
        fundSite, loanDate, loanAmount, extraInfo, isShortPeriod, period, feeRepayDateType, repayWay
      };
      // calManualRecord
      console.log('--sendParamsAdd-_params--', _params);
      fetchPost(`/settle/fund/calManualRecord`, _params).then((res) => {
        if(res.code === 0) {
          // 数据获取 success
          message.info(res.msg);
          let { handleInputDate} = this.state;

          handleInputDate.push.apply(handleInputDate,res.data.data);
          let copyData = [];
          for(let i in handleInputDate){
            copyData[i] = {
              ...handleInputDate[i],
              key: i,
            }
          }
          this.setState({
            addModalState: {
              ...this.state.addModalState,
              ..._params,
              visible: false,
            },
            handleInputDate: copyData,
          }, () => {
            console.log('--success-data--', this.state.handleInputDate);
            // this.clearModalState();
          })
        } else {
          // 数据获取 fail
          message.error(res.msg);
        }
      })

    } else {
      // add modal cancel
      this.setState({
        addModalState: {
          ...this.state.addModalState,
          visible: false,
        }
      }, () => {
        console.log('---123---', this.state.modalState)
      })
    }
  }
  sendParamsUpdate(params) {
    const { btnType, key, repaymentDate, capital, interest, managerFee, extraInfo } = params;

    console.log('--sendParamsUpdate-params--', params)

    this.setState({
      updateModalState: {
        ...this.state.updateModalState,
        visible: false,
      }
    }, () => {
      if (btnType === 0){
        // update modal OK
        const capitalAndInterest = parseFloat(capital) + parseFloat(interest);
        const amount = capitalAndInterest + parseFloat(managerFee);
        let { handleInputDate } = this.state;
        for(let i in handleInputDate) {
          if (handleInputDate[i].key === key) {
            console.log('--update-key--', key);
            handleInputDate[i] = {
              ...handleInputDate[i],
              repaymentDate,
              capital,
              interest,
              managerFee,
              extraInfo,
              capitalAndInterest,
              amount,
            }
          }
        }

        this.setState({
          handleInputDate,
        })
      } else {
        // update modal cancel
      }
    })
  }

  inputBtnClick() {
    let { handleInputDate, selectedRows } = this.state;
    const self = this;
    confirm({
      title: '确认录入?',
      width: '220px',
      onOk() {
        // 确认操作
        // console.log('OK', selectedRows);

        let copyParams = [{}];
        let deleteItem = [];
        for(let i in selectedRows) {
          deleteItem.push(selectedRows[i].key);
          let item = {};
          for(let j in selectedRows[i]) {
            if (j !== 'key') {
              item[j] = selectedRows[i][j];
            }
          }
          copyParams[i] = item;
        }

        fetchPost(`/settle/fund/insertManualRecord`, {records: copyParams}).then((res) => {
          if(res.code === 0) {
            // 数据获取 success
            console.log('---插入success--', res);
            let copyParams = [];

            function isInArray(arr, obj){
              let i = arr.length;
              while (i--) {
                if (arr[i] === obj) {
                  return true;
                }
              }
              return false;
            };

            handleInputDate.map((item) => {
              if (!isInArray(deleteItem, item.key)) {
                copyParams.push(item);
              }
            });

            self.setState({
              handleInputDate: copyParams,
              selectedRows: [],
            });
            message.info(res.msg);
          } else {
            // 数据获取 fail
            message.error(res.msg);
          }
        })
      },
      onCancel() {
        // 取消操作
        console.log('Cancel');
      },
    });
  }
  initHandInput() {
    this.setState({
      handleInputDate: [],
    })
  }

  rowSelectionChange(selectedRowKeys, selectedRows) {
    this.setState({
      selectedRows,
    })
  }

  render () {
    const self = this;
    const columns1 = [{
      title: '资方',
      dataIndex: 'fundName',
    }, {
      title: '打款日',
      dataIndex: 'loanDate',
    }, {
      title: '还款日',
      dataIndex: 'repaymentDate',
    }, {
      title: '借款金额',
      dataIndex: 'loanAmount',
    }, {
      title: '期限',
      dataIndex: 'loanPeriod',
    }, {
      title: '应还总额',
      dataIndex: 'amount',
    }, {
      title: '应还本息',
      dataIndex: 'capitalAndInterest',
    }, {
      title: '应还本金',
      dataIndex: 'capital',
    }, {
      title: '应还利息',
      dataIndex: 'interest',
    }, {
      title: '应还服务费',
      dataIndex: 'managerFee',
    }, {
      title: '备注',
      dataIndex: 'extraInfo',
    }, {
      title: '',
      render: (record) => <a onClick={() => this.updateHandInputItem(record)}>修改</a>,
    },
    ];

    const { addModalState, updateModalState, handleInputDate } = this.state;

    const pagination = {
      total: this.state.page.totalCount || 0,
      pageSize: this.state.page.pageSize,
      showSizeChanger: false,
      showQuickJumper: true,
      showTotal(total){
        return `总共 ${total} 条`;
      },
      onChange(current) {
        self.nextpage(current)
      }
    };
    const rowSelection = {
      onChange(selectedRowKeys, selectedRows) {
        self.rowSelectionChange(selectedRowKeys, selectedRows);
      }
    };

    console.log();

    return (
      <div className={Styles.content}>
        <div className={Styles.top}>
          <Button type='primary' onClick={() => { this.addNewHandInputModal() }}>新增记录</Button><br/>
        </div>
        <Table bordered pagination={false} rowSelection={rowSelection} columns={columns1} dataSource={handleInputDate} />

        <div className={Styles.bottom}>
          <Button onClick={() => { this.initHandInput() }}>重置</Button>&nbsp;&nbsp;
          <Button type='primary' onClick={() => { this.inputBtnClick() }}>确定录入</Button>
        </div>

        <AddModal modalState={addModalState} sendParams={this.sendParamsAdd} />
        <UpdateModal modalState={updateModalState} sendParams={this.sendParamsUpdate} />
      </div>
    )
  }
}

export default Index

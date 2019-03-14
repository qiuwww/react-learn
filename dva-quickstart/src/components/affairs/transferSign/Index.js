/**
 * Created by ziyu on 17/3/10.
 */

import React, { Component, PropTypes } from 'react'
import { message, Table, Button } from 'antd';
import moment from 'moment'
import Search from '../../common/components/Search'
import Pannel from '../../common/components/Pannel'
import CommonStyle from '../../common/less/common.less'
import { fetchPost } from '../../../utils/request'
class TransferSign extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      list: [],
      panelParams: [],
      params: {
        paidStatus: '',
        startDate: moment().subtract('days', 7).format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        find: '',
        input: ''
      },
      page: {
        currentPage: 1,
        pageSize: 20,
        totalCount: 0
      },
      searchParams: {
        list: [
          {
            type: 'buttonRadio',
            key: 'paidStatus',
            className: 'pr20',
            values: []
          },
          {
            name: '申请时间',
            type: 'range',
            key: ['startDate','endDate'],
            className: 'pr20',
            placeHolder: '',
            values: []
          },
          {
            name: '查询类型',
            type: 'group',
            key: ['findtype','inputValue'],
            className: 'pr20',
            values: [{value: '',name: '请选择'}]
          },
          {
            name: '',
            type: 'search',
            key: '',
            className: 'pr20',
            value: []
          }
        ],
        api: '/common/liquidation/query'
      }
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData () {
    let self = this;
    let copyState = {};
    for(let i in this.state.params) {
      if(this.state.params[i] != '') {
        copyState[i] = this.state.params[i]
      }
    }
    function GetList() {
      return new Promise((resolve, reject) => {
        fetchPost(`/liquidation/repayment/list?currentPage=${self.state.page.currentPage}&pageSize=${self.state.page.pageSize}`,copyState).then((res) => {
          if(res.code === 0) {
            resolve(res)
          } else {
            message.error(res.msg)
            reject(res)
          }
        })
      })
    }

    function GetPanel() {
      return new Promise((resolve, reject) => {
        fetchPost('/audit/manage/info').then((res) => {
          if(res.code === 0) {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    }

    Promise.all([GetList(), GetPanel()]).then((res) => {
      let list = res[0];
      let panel = res[1]
      this.setState({
        list: list.data.list || [],
        page: list.data.page || this.state.page,
        panelParams: [

        ]
      })
    },() => {
      this.setState({
        list: [],
        panelParams: []
      });
    });
  }

  nextpage (current) {
    this.setState({
      page: {
        ...this.state.page,
        currentPage: current
      }
    }, () => {
      this.getData();
    });
  }

  changeParams (params) {
    this.setState({
      params,
    },() => {
      this.getData();
    })
  }

  operation () {

  }

  render () {
    const self = this;
    const columns = [{
      title: '订单号',
      dataIndex: 'borrowNo',
      key: 'borrowNo'
    },
      {
        title: '申请人/手机号',
        key: 'borrowApplyOverdue',
        dataIndex: 'borrowApplyOverdue'
      },
      {
        title: '借款金额/周期',
        key: 'borrowApplyOverdu',
        dataIndex: 'borrowApplyOverdu'
      },
      {
        title: '管家打款时间',
        key: 'name',
        dataIndex: 'name'
      },
      {
        title: '管家打款金额',
        key: 'borrowApplyOve',
        dataIndex: 'borrowApplyOve'
      },
      {
        title: '管家应还日/还款金额',
        key: 'borrowApply',
        dataIndex: 'borrowApply'
      },
      {
        title: '51放款时间',
        key: 'borrow',
        dataIndex: 'borrow'
      },
      {
        title: '51放款金额',
        key: 'a',
        dataIndex: 'a'
      },
      {
        title: '51还款日/金额',
        key: 'd',
        dataIndex: 'd'
      },
      {
        title: '参考信息',
        key: 'v',
        dataIndex: 'v'
      },
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render: (text,record) => (
          <div>
            <Button type="primary" onClick={()=>{this.operation(record.id)}}>连连打款</Button>
          </div>
        )
      }
    ];

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

    return (
      <div>
        <div className={CommonStyle.searchClass}>
          <Search searchParams={this.state.searchParams} changeParams={(params)=>this.changeParams(params)} showAllReview={this.state.showAllReview}/>
        </div>

        <div className="mt20">
          <Pannel panelParams={this.state.panelParams}></Pannel>
        </div>


        <Table pagination={pagination} size='small' key='name' columns={columns} dataSource={this.state.list} loading={this.state.loading}
               bordered
        >
        </Table>
      </div>
    )
  }
}

export default TransferSign

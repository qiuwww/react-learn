/**
 * Created by ziyu on 17/3/10.
 */
import React, { Component, PropTypes } from 'react'

import { message, Table } from 'antd';
import Search from '../../common/components/Search'
import Pannel from '../../common/components/Pannel'
import CommonStyle from '../../common/less/common.less'
import { fetchPost } from '../../../utils/request'
import moment from 'moment'
class Checking extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      list: [],
      panelParams: [],
      params: {
        startDate: moment().subtract('days', 7).format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD')
      },
      searchParams: {
        list: [
          {
            name: '还款时间',
            type: 'range',
            key: ['startDate','endDate'],
            className: 'pr20',
            placeHolder: '',
            values: []
          }
        ],
        api: ''
      }
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData () {
    let copyState = {};
    for(let i in this.state.params) {
      if(this.state.params[i] != '') {
        copyState[i] = this.state.params[i]
      }
    }
    fetchPost('/liquidation/checking/system',copyState).then((res) => {
      if(res.code === 0) {
        let [list, panel] = [res.data.itemList, res.data.itemTotal];
        if(list.length > 0) {
          this.setState({
            list,
            panelParams: [
              {
                name: '应收款',
                value: `${panel.fqgjAmount}元`
              },
              {
                name: '实收款',
                value: `${panel.fqgjPaidedAmount}元`
              },
              {
                name: '51放款金额',
                value: `${panel.fcAmount}元`
              },
              {
                name: '51还款金额',
                value: `${panel.fcPaidAmount}元`
              },
              {
                name: '应还利息',
                value: `${panel.fcInterest}元`
              }
            ]
          })
        } else {
          this.setState({
            list: [],
            panelParams: [
              {
                name: '应收款',
                value: `${panel.fqgjAmount}元`
              },
              {
                name: '实收款',
                value: `${panel.fqgjPaidedAmount}元`
              },
              {
                name: '51放款金额',
                value: `${panel.fcAmount}元`
              },
              {
                name: '51还款金额',
                value: `${panel.fcPaidAmount}元`
              },
              {
                name: '应还利息',
                value: `${panel.fcInterest}元`
              }
            ]
          })
        }
      } else {
        this.setState({
          list: [],
          panelParams: []
        });
        message.error(res.msg)
      }
    });

  }

  changeParams (params) {
    this.setState({
      params,
    },() => {
      this.getData();
    })
  }

  render () {
    const self = this;
    const columns = [
      {
        title: '还款日',
        dataIndex: 'statDate',
        key: 'statDate'
      },
      {
        title: '管家应收款',
        dataIndex: 'fqgjAmount',
        key: 'fqgjAmount'
      },
      {
        title: '管家实收款',
        dataIndex: 'fqgjPaidedAmount',
        key: 'fqgjPaidedAmount'
      },
      {
        title: '51放款',
        dataIndex: 'fcAmount',
        key: 'fcAmount'
      },
      {
        title: '51应收款',
        dataIndex: 'fcPaidAmount',
        key: 'fcPaidAmount'
      },
      {
        title: '应还利息',
        dataIndex: 'fcInterest',
        key: 'fcInterest'
      },
      {
        title: '差额(管家应收款-51应收款)',
        dataIndex: '',
        key: '',
        render: (text, record) => (
          <div>{parseFloat(record.fqgjPaidedAmount)-parseFloat(record.fcPaidAmount)}</div>
        )
      },
    ];

    return (
      <div>
        <div className={CommonStyle.searchClass}>
          <Search searchParams={this.state.searchParams} changeParams={(params)=>this.changeParams(params)}/>
        </div>

        <div className="mt20">
          <Pannel panelParams={this.state.panelParams}></Pannel>
        </div>

        <Table pagination={false} size='small' rowKey='name' columns={columns} dataSource={this.state.list} loading={this.state.loading}
               bordered
        >
        </Table>
      </div>
    )
  }
}

export default Checking

/**
 * Created by ziyu on 2017/8/7.
 */

import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import { connect } from 'dva';
import { message, Table, Button } from 'antd';
import Search from '../../common/components/Search'
import SearchStyle from '../../common/less/search.less'
import {fetchPost} from '../../../utils/request'
import {origin} from '../../../utils/config'
@connect(() => ({

}))
class PersonalCheckList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      panelParams: [],
      params: {
        distributeStartDate: null,
        distributeEndDate: null,
        actualRepaymentStartDate: null,
        actualRepaymentEndDate: null,
        name: null,
        mobile: null,
        followId: null
      },
      page: {
        currentPage: 1,
        pageSize: 20,
        totalCount: 0
      },
      searchParams: {
        list: [
          {
            name: '分单时间',
            type: 'range',
            key: ['distributeStartDate', 'distributeEndDate'],
            className: 'pr20',
            placeHolder: '',
            // values: [moment().subtract('days', 14),
            //   moment()]
          },
          {
            name: '还款时间',
            type: 'range',
            key: ['actualRepaymentStartDate', 'actualRepaymentEndDate'],
            className: 'pr20',
            placeHolder: '',
            // values: [moment().subtract('days', 14),
            //   moment()]
          },
          {
            name: '姓名',
            type: 'text',
            key: 'name',
            className: 'pr20',
            values: [],
            placeHolder: '请输入姓名'
          },
          {
            name: '电话',
            type: 'text',
            key: 'mobile',
            className: 'pr20',
            values: [],
            placeHolder: '请输入电话'
          },
          {
            name: '催收人',
            type: 'select',
            key: 'followId',
            className: 'pr20',
            values: [{value: '', name: '请选择'}]
          },
          {
            name: '',
            type: 'search',
            key: '',
            className: 'pr20',
            value: []
          }
        ],
        api: ''
      }
    }
  }

  componentDidMount() {
    this.getData()
  }

  nextPage(current) {
    this.setState({
      page: {
        ...this.state.page,
        currentPage: current
      }
    }, () => {
      this.getData();
    });
  }

  getData() {
    let copyState = {};
    // for(let i in this.state.params) {
    //   if(this.state.params[i] !== '') {
    //     copyState[i] = this.state.params[i]
    //   }
    // }
    fetchPost(`/collection/checkStat/list?currentPage=${this.state.page.currentPage}&pageSize=${this.state.page.pageSize}`, this.state.params).then((res) => {
      if (res.code === 0) {
        // console.log(res)
        let list = res.data.collectionOrderCheckStatVos
        if (list.length > 0) {
          this.setState({
            list,
            page: res.page,
          })
        } else {
          this.setState({
            list: [],
            page: res.page,
          })
        }
      } else {
        message.error(res.msg)
      }
    })

    fetchPost('/collection/admin/query', {}).then(res => {
      if (res.code === 0) {
        let list = res.data.itemList
        if (list.length > 0) {
          for (let i in list) {
            let item = list[i]
            this.state.searchParams.list[4].values.push({
              value: item.followId,
              name: item.name
            })
          }
        }
        this.setState({
          searchParams: this.state.searchParams
        })
      }
    });
  }


  changeParams(params) {
    if (params.startDate) {
      params.applyStartDate = params.startDate;
      delete params.startDate
    }

    if (params.endDate) {
      params.applyEndDate = params.endDate;
      delete params.endDate
    }
    this.setState({
      params,
    }, () => {
      this.getData();
    })
  }

  exportExcel = () => {
    const { params } = this.state;
    const paramsJson = {};
    const paramArr = Object.keys(params);
    let paramUrl = '?';
    paramArr.forEach((item, index) => {
      if (params[item]) {
        paramUrl += `${item}=${params[item]}&`;
        paramsJson[item] = params[item];
      }
    });
    paramUrl = paramUrl.substring(0, paramUrl.length - 1);
    const url = `${origin}/collection/export/excel${paramUrl}`;
    this.props.dispatch({
      type: 'personalCheck/fetchExportRecord',
      payload: {
        jsonData: JSON.stringify({
          ...paramsJson,
        }),
        exportType: 'checkStat', 
      },
      callback: () => {
        location.href = url;
      }
    });
  }
  render() {
    const self = this;
    const columns = [
      {
        title: '订单号',
        dataIndex: 'tradeNo',
        key: 'tradeNo'
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile'
      },
      {
        title: '身份证号',
        dataIndex: 'identityNo',
        key: 'identityNo'
      },
      {
        title: '借款金额',
        dataIndex: 'realCapital',
        key: 'realCapital'
      },
      {
        title: '催回账单/订单期数',
        dataIndex: '',
        key: '',
        render: (text, record) => {
          return (
            <span>
              第{record.period}期/{record.totalPeriod}
            </span>
          )
        }
      },
      {
        title: '账单实际还款总金额',
        dataIndex: 'paidAllMoney',
        key: 'paidAllMoney'
      },
      {
        title: '每个催收催回金额',
        dataIndex: 'personCollectMoney',
        key: 'personCollectMoney'
      },
      {
        title: '分单时间',
        dataIndex: '',
        key: '',
        render: (text, record) => (
          record.distributeDate.split(' ')[0]
        )
      },
      {
        title: '实际还款时间',
        dataIndex: 'actualRepaymentDate',
        key: 'actualRepaymentDate'
      },
      {
        title: '催回催收人',
        dataIndex: 'followUp',
        key: 'followUp'
      }
    ]

    const pagination = {
      total: this.state.page.totalCount || 0,
      pageSize: this.state.page.pageSize,
      showSizeChanger: false,
      showQuickJumper: true,
      showTotal(total){
        return `总共 ${total} 条`;
      },
      onChange(current) {
        self.nextPage(current)
      }
    };
    return (
      <div>
        <div className={SearchStyle.searchClass}>
          <Search searchParams={this.state.searchParams} changeParams={(params) => this.changeParams(params)}/>
        </div>
        <div>
          <Button type="primary" onClick={this.exportExcel}>导出</Button>
        </div>
        <div className="mt20">
          <Table pagination={pagination} size='small' rowKey="orderNo" columns={columns} dataSource={this.state.list}
            loading={this.state.loading}
            bordered
          >
          </Table>
        </div>
      </div>
    )
  }
}

export default PersonalCheckList

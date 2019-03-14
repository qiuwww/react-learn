/**
 * @author lianPf
 * @date 2017-11-10
 * */

import React from 'react';
import moment from 'moment';
import { Table, message } from 'antd';
import Search from '../../common/components/Search';
import searchStyle from '../../common/less/search.less';
import { fetchPost } from '../../../utils/request';
import RepaymentModal from './repaymentModal';
import { origin } from '../../../utils/config';

class Index extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      list: [],
      modalState: {
        visible: false,
        fundSite: '',
        date: '',
        repayStatus: ''
      },
      panelParams: [],
      params: {
        fundCodeStrs: [],
        startDate: moment().subtract('days', 6).format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      },
      page: {
        currentPage: 1,
        pageSize: 7,
        totalCount: 0
      },
      expandedRowKeysData: [],
      repaymentRecordData: [],
      searchParams2: {
        list: [
          {
            name: '资方',
            type: 'multipleSelect',
            key: 'allFundSites',
            className: 'pr20',
            values: []
          }, {
            name: '还款日',
            type: 'range',
            key: ['startDate','endDate'],
            className: 'pr20',
            placeHolder: '',
            values: [
              moment().subtract('days', 6),
              moment().add('days', 0)
            ]
          }, {
            name: '',
            type: 'searchBtn',
            key: '',
            className: 'pr20',
            value: []
          }, {
            name: '导出',
            type: 'button',
            key: '',
            className: 'pr20',
            value: []
          }
        ],
        api: '/settle/fund/query'
      }
    }

    this.showModal = this.showModal.bind(this);
    this.getParams = this.getParams.bind(this);
  }

  showModal(params) {
    console.log('--showModal-params--', params);
    const visible = true;
    const { fundSite, repaymentStatus, repaymentStatusDesc, repayDate } = params;
    this.setState({
      modalState: {
        ...this.state.modalState,
        visible,
        fundSite,
        repayDate,
        repayStatus: repaymentStatus,
        repaymentStatusDesc,
      }
    }, () => {
      console.log('--modalState--', this.state.modalState);
    })
  }
  getParams(params) {
    console.log('--getParams--', params);
    const { btnType, fundSite, repayDate, repayStatus } = params;
    if ( btnType === 0) {
      const _params = {
        fundSite,
        date: repayDate,
        repayStatus
      };
      // 确定 btn
      fetchPost(`/settle/fund/updateRepayStatus`, _params).then((res) => {
        if(res.code === 0) {
          // 数据获取 success
          this.setState({
            modalState: {
              ...this.state.modalState,
              ..._params,
            }
          }, () => {
            this.clearModalState();
          })
        } else {
          // 数据获取 fail
          message.error(res.msg);
        }
      })
    } else {
      this.clearModalState();
    }
  }
  clearModalState() {
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
      this.getData();
    })
  }

  componentDidMount () {
    this.getData()
  }

  getData () {
    const self = this;
    let { repaymentRecordData } = this.state;
    const { params, page} = this.state;
    let { currentPage, pageSize, totalCount } = page;

    console.log('--getData--', JSON.stringify(this.state.params));
    fetchPost(`/settle/fund/repaySummary?currentPage=${currentPage}&pageSize=${pageSize}`,params).then((res) => {
      if(res.code === 0) {
        // 数据获取 success
        if (res.data !== null) {
          let copyState = [];
          repaymentRecordData = res.data.data;
          currentPage = res.data.page.currentPage;
          pageSize = res.data.page.pageSize;
          totalCount = res.data.page.totalCount;

          for(let i = 0; i< repaymentRecordData.length; i++) {
            copyState[i] = {
              ...repaymentRecordData[i],
              key: i
            }
          }

          this.setState({
            repaymentRecordData: copyState,
            page: {
              currentPage,
              pageSize,
              totalCount,
            }
          });
        }

      } else {
        // 数据获取 fail
        message.error(res.msg);
      }
    })
  }

  nextpage (current) {
    console.log('--nextpage-下一页--', current);
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
    const { startDate, endDate } = params;
    if ( "allFundSites" in params){
      const {allFundSites} = params;
      this.setState({
        params: {
          ...this.state.params,
          fundCodeStrs: allFundSites,
          startDate,
          endDate
        },
      })
    } else {
      this.setState({
        params: {
          ...this.state.params,
          startDate,
          endDate
        },
      })
    }
  }

  searchFunc(params) {
    const { allFundSites, startDate, endDate } = params;
    let fundCodeStrs = allFundSites;
    this.setState({
      params: {
        fundCodeStrs,
        startDate,
        endDate
      },
      expandedRowKeysData: [],
    },() => {
      this.getData();
    })
  }
  primaryBtnClick() {
    const { params } = this.state;
    const self = this;

    fetchPost(`/settle/fund/repaySummaryExportUrl`, params).then((res) => {
      if(res.code === 0) {
        // 数据获取 success
        const downloadUrl = `${origin}/settle/fund/repaySummaryExport?${res.data.data}`;
        self.downloadExcel(downloadUrl);
      } else {
        // 数据获取 fail
        message.error(res.msg);
      }
    });
  }
  downloadExcel(downloadUrl) {
    window.open(downloadUrl);
  }
  tableExpandRowChange(expanded, record) {
    if (expanded) {
      const { key } = record;
      this.setState({
        expandedRowKeysData: [parseInt(key)],
      })
    } else {
      this.setState({
        expandedRowKeysData: [],
      })
    }

  }

  render () {
    const self = this;
    const { repaymentRecordData, expandedRowKeysData } = this.state;

    const pagination = {
      current: this.state.page.currentPage,
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

    // 还款记录
    const columns1 = [
      { title: '还款日', dataIndex: 'repayDate', key: 'repayDate'},
      { title: '应还总额', dataIndex: 'totalAmount', key: 'totalAmount' },
      { title: '应还本息', dataIndex: 'totalCapitalAndInterest', key: 'totalCapitalAndInterest'},
      { title: '应还本金', dataIndex: 'totalCapital', key: 'totalCapital' },
      { title: '应还利息', dataIndex: 'totalInterest', key: 'totalInterest'},
      { title: '应还服务费', dataIndex: 'totalManagerFee', key: 'totalManagerFee' },
      { title: '状态',
        dataIndex: 'repaymentStatus',
        key: 'repaymentStatus',
        render: (text, record) => {
          const { repaymentStatus } = record;
          return (
            <a onClick={() => this.showModal(record)}>{repaymentStatus}</a>
          )
        }
      }
    ];

    const columns2 = [
      { title: '资方', dataIndex: 'fundSiteName', key: 'fundSiteName', width: '14.5%'},
      { title: '应还总额', dataIndex: 'totalAmount', key: 'totalAmount', width: '15%'},
      { title: '应还本息', dataIndex: 'totalCapitalAndInterest', key: 'totalCapitalAndInterest', width: '14.8%',
      },
      { title: '应还本金', dataIndex: 'totalCapital', key: 'totalCapital', width: '14.8%', },
      { title: '应还利息', dataIndex: 'totalInterest', key: 'totalInterest', width: '14.8%',},
      { title: '应还服务费', dataIndex: 'totalManagerFee', key: 'totalManagerFee', width: '18%',},
      { title: '状态',
        dataIndex: 'repaymentStatusDesc',
        key: 'repaymentStatusDesc',
        render: (text, record) => {
          const { repaymentStatusDesc } = record;
          return (
            <a onClick={() => this.showModal(record)}>{repaymentStatusDesc}</a>
          )
        }
      }
    ];



    return (
      <div>
        <div className={searchStyle.searchClass}>
          <Search searchParams={this.state.searchParams2} primaryBtnClick={() => this.primaryBtnClick()} changeParams={(params)=>this.changeParams(params)} showAllReview={this.state.showAllReview} searchFunc={(params) => this.searchFunc(params)}/>
        </div>

        <Table
          pagination={pagination}
          columns={columns1}
          expandedRowKeys = {expandedRowKeysData}
          onExpand={(expanded,record) => this.tableExpandRowChange(expanded, record)}
          expandedRowRender={record => (<Table pagination={false} showHeader={false} columns={columns2} dataSource={record.details}/>)}
          dataSource={repaymentRecordData}
        />

        <RepaymentModal modalState={this.state.modalState} getParams={this.getParams} />
      </div>
    )
  }
}

export default Index

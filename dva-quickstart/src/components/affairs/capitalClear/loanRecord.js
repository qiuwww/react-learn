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
import { origin } from '../../../utils/config';

class Index extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      list: [],
      panelParams: [],
      params: {
        startDate: moment().subtract('days', 6).format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      },
      page: {
        currentPage: 1,
        pageSize: 7,
        totalCount: 0
      },
      expandedRowKeysData: [],
      loanRecordData: [],
      searchParams: {
        list: [
          {
            name: '借款日',
            type: 'range',
            key: ['startDate','endDate'],
            className: 'pr20',
            placeHolder: '',
            values: [
              moment().subtract('days', 6),
              moment(),
            ]
          },
          {
            name: '',
            type: 'searchBtn',
            key: '',
            className: 'pr20',
            value: []
          },
          {
            name: '导出',
            type: 'button',
            key: '',
            className: 'pr20',
            value: []
          }
        ],
        api: '/finance/query'
      },
    }

  }

  componentDidMount () {
    this.getData()
  }

  getData () {
    let self = this;
    let { loanRecordData } = this.state;
    const { params, page} = this.state;
    let { currentPage, pageSize, totalCount } = page;


    fetchPost(`/settle/fund/loanSummary?currentPage=${currentPage}&pageSize=${pageSize}`, params).then((res) => {
      if(res.code === 0) {
        // 数据请求成功
        if (res.data !== null) {
          let copyState = [];
          loanRecordData = res.data.data;
          currentPage = res.data.page.currentPage;
          pageSize = res.data.page.pageSize;
          totalCount = res.data.page.totalCount;

          for(let i = 0; i< loanRecordData.length; i++) {
            copyState[i] = {
              ...loanRecordData[i],
              key: i
            }
          }

          this.setState({
            loanRecordData: copyState,
            page: {
              currentPage,
              pageSize,
              totalCount,
            }
          });
        }
      } else {
        // 数据获取失败
        message.error(res.msg)
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
    this.setState({
      params,
    })
  }
  searchFunc(params) {
    this.setState({
      params,
      expandedRowKeysData: [],
    },() => {
      this.getData();
    })
  }
  primaryBtnClick() {
    const { params } = this.state;
    const { startDate, endDate } = params;
    const downloadUrl = `${origin}/settle/fund/loanSummaryExport?startDate=${startDate}&endDate=${endDate}`;
    console.log('--loanRecord-primaryBtnClick-导出-1--', downloadUrl);

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
    const { loanRecordData, expandedRowKeysData } = this.state;
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

    const columns = [
      { title: '借款日', dataIndex: 'loanDate', key: 'loanDate'},
      { title: '借款金额', dataIndex: 'totalAmount', key: 'totalAmount' },
    ];
    const columns2 = [
      { title: '', dataIndex: 'fundSiteName', key: 'fundSiteName', width: '56.5%' },
      { title: '', dataIndex: 'amount', key: 'amount', width: '43.5%' },
    ];

    return (
      <div>
        <div className={searchStyle.searchClass}>
          <Search searchParams={this.state.searchParams} primaryBtnClick={() => this.primaryBtnClick()} changeParams={(params)=>this.changeParams(params)} searchFunc={(params) => this.searchFunc(params)} />
        </div>

        <Table
          pagination={pagination}
          columns={columns}
          expandedRowKeys = {expandedRowKeysData}
          onExpand={(expanded,record) => this.tableExpandRowChange(expanded, record)}
          expandedRowRender={(record, index) => {
            return (<Table pagination={false} showHeader={false} columns={columns2} dataSource={record.details}/>);
          }}
          dataSource={loanRecordData}
        />
      </div>
    )
  }
}

export default Index

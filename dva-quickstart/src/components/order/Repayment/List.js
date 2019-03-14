import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Button, Card, Table, Select, Row, Col, Input, Radio, DatePicker } from 'antd';
import HistoryModal from './History';
const Search = Input.Search;
const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(({ repayment }) => ({
  list: repayment.list,
  pagination: repayment.pagination,
  loading: repayment.loading,
  selectType: repayment.selectType,
  overdueType: repayment.overdueType,
}))
export default class RepaymentOrder extends Component {
  state = {
    type: '',
    context: '',
    overdueStatus: '',
    startDate: '',
    endDate: '',
  }

  componentDidMount() {
    this.handleFetchSelect();
    this.handleFetch();
  }
  handleFetchSelect = () => {
    this.props.dispatch({
      type: 'repayment/fetchSelect',
    });
  }
  handleFetch = (currentPage = 1, pageSize = 20) => {
    this.props.dispatch({
      type: 'repayment/fetch',
      payload: {
        ...this.state,
        status: this.props.status,
        currentPage,
        pageSize,
      },
    });
  }
  handleSearch = (value, key) => {
    const parmas = {};
    if (key === 'time') {
      if (value.length > 0) {
        parmas.startDate = moment(value[0]).format('YYYY-MM-DD');
        parmas.endDate = moment(value[1]).format('YYYY-MM-DD');
      } else {
        parmas.startDate = '';
        parmas.endDate = '';
      }
    } else {
      parmas[key] = value;
    }
    this.setState({
      ...parmas,
    }, () => {
      this.handleFetch();
    });
  }
  handleChange = (data) => {
    this.setState({
      ...data,
    });
  }
  handleTurnRecordList = (list) => {
    this.props.dispatch({
      type: 'repayment/saveHistoryList',
      payload: {
        historyList: list,
        currentKey: 'repayment',
      },
    });
    // this.props.dispatch(routerRedux.push('/order/repayment/list-history'));
  }
  render() {
    const { startDate, endDate } = this.state;
    const { selectType, list, pagination, loading, status, overdueType } = this.props;
    let columns = [
      {
        title: '交易订单号',
        dataIndex: 'tradeNo',
      }, {
        title: '姓名',
        dataIndex: 'name',
      }, {
        title: '手机号',
        dataIndex: 'mobile',
      }, {
        title: '新客/老客',
        dataIndex: 'customerType',
      }, {
        title: '借款金额',
        dataIndex: 'borrowCapital',
      }, {
        title: '借款期限',
        dataIndex: 'borrowTerm',
      }, {
        title: '到账金额',
        dataIndex: 'receivedCapital',
      }, {
        title: '借款时间',
        dataIndex: 'borrowDate',
      }, {
        title: '服务费金额',
        dataIndex: 'serviceCapital',
      }, {
        title: '服务费缴纳方式',
        dataIndex: 'serviceType',
      }
    ];
    const statusData = {
      title: '状态',
      dataIndex: 'status',
    };
    const repaymentDate = {
      title: '应还时间',
      dataIndex: 'repaymentDate',
    };
    const repaymentAmount = {
      title: '应还金额',
      dataIndex: 'repaymentAmount',
    };
    const payOffDate = {
      title: '实际还款时间',
      dataIndex: 'payOffDate',
    };
    const option = {
      title: '还款记录',
      dataIndex: 'repaymentRecordList',
      render: (value) => {
        return <a onClick={() => this.handleTurnRecordList(value)}>查看</a>
      }
    };
    if (status === 0) {
      columns.push(statusData, repaymentDate, repaymentAmount, option);
    } else {
      columns.push(repaymentDate, repaymentAmount, payOffDate, option);
    }

    columns.forEach((item, index) => {
      columns[index].width = `${columns.length / 100}%`;
    });
    return (
      <Card bordered={false}>
        <Row>
          <Col sm={24} xs={24} style={{ marginBottom: 20 }}>
            <span>时间范围：</span>
            <RangePicker
              value={startDate ? [moment(startDate), moment(endDate)] : []}
              onChange={value => this.handleSearch(value, 'time')}
            />
          </Col>
          <Col sm={6} xs={24} style={{ marginBottom: 20 }}>
            <span>查询类型：</span>
            <Select
              style={{ width: 150 }}
              allowClear={true}
              onChange={value => this.handleChange({type: value})}
            >
              {selectType.map(item => <Option key={item.type}>{item.desc}</Option>)}
            </Select>
          </Col>
          <Col sm={6} xs={24} style={{ marginBottom: 20 }}>
            <Search style={{width: 200}} placeholder="查询内容" onSearch={value => this.handleSearch(value, 'context')} />
          </Col>
          {status === 0 && <Col sm={6} xs={24} style={{ marginBottom: 20 }}>
            <span>查询类型：</span>
            <Select
              style={{ width: 150 }}
              allowClear={true}
              onChange={value => this.handleSearch(value, 'overdueStatus')}
            >
              {overdueType.map(item => <Option key={item.type}>{item.desc}</Option>)}
            </Select>
          </Col>}
        </Row>
        <Table
          loading={loading}
          bordered
          scroll={{ y: 400 }}
          rowKey={(record, index) => index}
          dataSource={list}
          columns={columns}
          pagination={{
            ...pagination,
            onChange: (page, pageSize) => {
              this.handleFetch(page, pageSize);
            }
          }}
        />
        <HistoryModal k="repayment" />
      </Card>
    );
  }
}

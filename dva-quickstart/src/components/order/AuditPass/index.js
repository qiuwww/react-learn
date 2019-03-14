import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Button, Card, Table, Select, Row, Col, Input, Radio, DatePicker } from 'antd';
import DetailsModal from './Details';
const Search = Input.Search;
const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(({ audit }) => ({
  list: audit.list,
  pagination: audit.pagination,
  loading: audit.loading,
  selectType: audit.selectType,
  auditType: audit.auditType,
}))
export default class AuditPass extends Component {
  state = {
    type: '',
    context: '',
    tradeStatus: '',
    startDate: '',
    endDate: '',
  }

  componentDidMount() {
    this.handleFetchSelect();
    this.handleFetch();
  }
  handleFetchSelect = () => {
    this.props.dispatch({
      type: 'audit/fetchSelect',
    });
  }
  handleFetch = (currentPage = 1, pageSize = 20) => {
    this.props.dispatch({
      type: 'audit/fetch',
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
  handleTurnRecordList = (list) => {
    this.props.dispatch({
      type: 'audit/saveDetails',
      payload: {
        historyList: list,
        currentKey: 'audit',
      },
    });
    // this.props.dispatch(routerRedux.push('/order/repayment/audit-details'));
  }
  handleChange = (data) => {
    this.setState({
      ...data,
    });
  }
  render() {
    const { startDate, endDate } = this.state;
    const { selectType, list, pagination, loading, status, auditType } = this.props;
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
        title: '订单生成时间',
        dataIndex: 'creatTime',
      }, {
        title: '订单状态',
        dataIndex: 'tradeStatus',
      }, {
        title: '服务费缴纳方式',
        dataIndex: 'serviceRecordList',
        render: (value) => {
          return <a onClick={() => this.handleTurnRecordList(value)}>查看</a>
        }
      }
    ];
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
          <Col sm={6} xs={24} style={{ marginBottom: 20 }}>
            <span>订单状态：</span>
            <Select
              style={{ width: 150 }}
              allowClear={true}
              onChange={value => this.handleSearch(value, 'tradeStatus')}
            >
              {auditType.map(item => <Option key={item.type}>{item.desc}</Option>)}
            </Select>
          </Col>
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
        <DetailsModal k="audit" />
      </Card>
    );
  }
}

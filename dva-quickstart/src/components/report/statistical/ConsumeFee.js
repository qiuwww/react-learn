import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Button, Card, Table, Select, Row, Col, Input, Radio, DatePicker } from 'antd';
import { origin } from '../../../utils/hostName';
const Search = Input.Search;
const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(({ consumeFee }) => ({
  list: consumeFee.list,
  pagination: consumeFee.pagination,
  loading: consumeFee.loading,
}))
export default class ConsumeFee extends Component {
  state = {
    channelCode: '',
    startDate: '',
    endDate: '',
  }

  componentDidMount() {
    this.setState({
      startDate: moment().subtract(1, 'month').format('YYYY-MM-DD'),
      endDate: moment().add(7, 'days').format('YYYY-MM-DD'),
    }, () => {
      this.handleFetch();
      // this.handleFetchSelect();
    });
  }

  handleFetchSelect = () => {
    this.props.dispatch({
      type: 'channel/fetchSelect',
    });
  }
  handleFetch = (currentPage = 1, pageSize = 20) => {
    this.props.dispatch({
      type: 'consumeFee/fetch',
      payload: { ...this.state, currentPage, pageSize },
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
    // if (value === undefined) {
    //   parmas[key] = null;
    // }
    this.setState({
      ...parmas,
    }, () => {
      this.handleFetch();
    });
  }
  handleExportData = () => {
    const { startDate, endDate } = this.state;
    window.location.href = origin + `/statistic/export/excel?startDate=${startDate}&endDate=${endDate}`;
    
  }
  render() {
    const { startDate, endDate } = this.state;
    const { selectList, list, pagination, loading } = this.props;
    const columns = [
      {
        title: '日期',
        dataIndex: 'dataTime',
      }, {
        title: '总费用',
        dataIndex: 'totalAmount',
      }, {
        title: '已发送短信条数',
        dataIndex: 'smsNum',
      }, {
        title: '短信单价',
        dataIndex: 'smsUnitPrice',
      }, {
        title: '短信费用',
        dataIndex: 'smsCapital',
      }, {
        title: '芝麻认证数',
        dataIndex: 'zmAuthNum',
      }, {
        title: '芝麻认证单价',
        dataIndex: 'zmAuthUnitPrice',
      }, {
        title: '芝麻认证费用',
        dataIndex: 'zmAuthCapital',
      }, {
        title: '人脸认证数',
        dataIndex: 'faceNum',
      }, {
        title: '人脸认证单价',
        dataIndex: 'faceUnitPrice',
      }, {
        title: '人脸认证费用',
        dataIndex: 'faceCapital',
      }, {
        title: '风控审核总数',
        dataIndex: 'riskNum',
      }, {
        title: '新客审核数',
        dataIndex: 'newGuestRiskNum',
      }, {
        title: '老客审核数',
        dataIndex: 'oldGuestRiskNum',
      }, {
        title: '风控单价',
        dataIndex: 'riskUnitPrice',
      }, {
        title: '风控费用',
        dataIndex: 'riskCapital',
      }
    ];
    columns.forEach((item, index) => {
      columns[index].width = `${columns.length / 100}%`;
    });
    return (
      <Card bordered={false}>
        <Row style={{ marginBottom: 20 }}>
          {/* <Col sm={6} xs={24} style={{ marginBottom: 20 }}>
            <span>渠道号：</span>
            <Select
              style={{ width: 150 }}
              allowClear={true}
              onChange={value => this.handleSearch(value, 'channelCode')}
            >
              {selectList.map(item => <Option key={item.channelCode}>{item.channelName}</Option>)}
            </Select>
          </Col> */}
          <Col sm={8} xs={24}>
            <span>时间范围：</span>
            <RangePicker
              value={startDate ? [moment(startDate), moment(endDate)] : []}
              onChange={value => this.handleSearch(value, 'time')}
            />
          </Col>
          <Col sm={4} xs={24}>
            <Button onClick={this.handleExportData}>导出数据</Button>
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
      </Card>
    );
  }
}

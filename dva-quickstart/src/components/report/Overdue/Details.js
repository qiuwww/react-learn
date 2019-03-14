import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { getLocationSearch } from '../../../utils/utils.js';
import { Card, Table, } from 'antd';
import styles from '../index.less';

@connect(({ overdue }) => ({
  list: overdue.detailList,
}))
export default class Details extends Component {
  state = {
  }

  componentDidMount() {
    this.handleFetch();
  }
  handleFetch = () => {
    this.props.dispatch({
      type: 'overdue/fetchDetails',
      payload: { dataTime: getLocationSearch().dataTime },
    });
  }
  render() {
    const { startDate, endDate } = this.state;
    const { selectList, list, pagination, loading } = this.props;
    const columns = [
      {
        title: '渠道',
        dataIndex: 'channelName',
      }, {
        title: '应还账单数',
        dataIndex: 'repaymentNum',
      }, {
        title: '在逾率/个数',
        dataIndex: 'beOverdueInfo',
        className: styles.redTd,
      }, {
        title: '首逾率/个数',
        dataIndex: 'firstOverdueInfo',
        className: styles.redTd1,
      }, {
        title: 'd3率/个数',
        dataIndex: 'd3OverdueInfo',
        className: styles.redTd2,
      }, {
        title: 'd5率/个数',
        dataIndex: 'd5OverdueInfo',
        className: styles.redTd3,
      }, {
        title: 'd7率/个数',
        dataIndex: 'd7OverdueInfo',
        className: styles.redTd4,
      }, {
        title: 'd15率/个数',
        dataIndex: 'd15OverdueInfo',
        className: styles.redTd5,
      }
    ];
    return (
      <Card bordered={false}>
        <Table
          loading={loading}
          bordered
          // scroll={{ x: 1500 }}
          rowKey={(record, index) => index}
          dataSource={list}
          columns={columns}
          pagination={false}
        />
      </Card>
    );
  }
}

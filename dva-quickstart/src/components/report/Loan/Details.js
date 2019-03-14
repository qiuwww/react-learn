import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { getLocationSearch } from '../../../utils/utils.js';
import { Card, Table, } from 'antd';

@connect(({ loan }) => ({
  list: loan.detailList,
}))
export default class Details extends Component {
  state = {
  }

  componentDidMount() {
    this.handleFetch();
  }
  handleFetch = () => {
    this.props.dispatch({
      type: 'loan/fetchDetails',
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
        // fixed: 'left',
      }, {
        title: '注册人数',
        dataIndex: 'registerNum',
      }, {
      //   title: '芝麻分',
      //   dataIndex: 'zmNum',
      // }, {
        title: '个人信息',
        dataIndex: 'personalInfoNum',
      }, {
        title: '运营商',
        dataIndex: 'carrierNum',
      }, {
        title: '银行卡',
        dataIndex: 'bankNum',
      // }, {
      //   title: '人脸',
      //   dataIndex: 'faceNum',
      }, {
        title: '订单申请数',
        dataIndex: 'orderApplyNum',
      }, {
        title: '订单通过数',
        dataIndex: 'orderPassNum',
      }, {
        title: '支付服务费',
        dataIndex: 'serviceFeeNum',
      }, {
        title: '放款成功数',
        dataIndex: 'loanNum',
      }, {
        title: '申请转化率',
        dataIndex: 'applyConverRate',
      }, {
        title: '审核通过率',
        dataIndex: 'auditPassRate',
      }, {
        title: '服务费转化率',
        dataIndex: 'serviceFeeConverRate',
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

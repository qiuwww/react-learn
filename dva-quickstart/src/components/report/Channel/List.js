import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Button, Card, Table, Select, Row, Col, Radio, DatePicker } from 'antd';
import AddModal from './AddModal';
const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(({ channel }) => ({
  channel,
}))
export default class List extends Component {
  state = {
  }

  componentDidMount() {
    this.handleFetch();
  }
  componentWillReceiveProps = (nextProps) => {
    
  }
  handleFetch = (currentPage = 1, pageSize = 20) => {
    this.props.dispatch({
      type: 'channel/fetch',
      payload: { currentPage, pageSize },
    });
  }
  // handleDelete = (record) => {
  //   this.props.dispatch({
  //     type: 'channel/fetchDelete',
  //     payload: { pageId: record.pageId },
  //   });
  // }
  handleAdd = () => {
    this.props.dispatch({
      type: 'channel/showAddModals',
    });
  }
  render() {
    const { startTime, endTime } = this.state;
    const { channel: { list, pagination, loading } } = this.props;
    const columns = [
      {
        title: '创建日期',
        dataIndex: 'createDate',
      }, {
        title: '渠道号',
        dataIndex: 'channelName',
      }, {
        title: '备注',
        dataIndex: 'note',
      }
    ];
    return (
      <Card bordered={false}>
        <div style={{ fontSize: 16, marginBottom: 20, textIndent: 10 }}>
          <Button type="primary" onClick={this.handleAdd}>新增渠道</Button>
        </div>
        <Table
          loading={loading}
          bordered
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
        <AddModal fetch={this.handleFetch} />
      </Card>
    );
  }
}

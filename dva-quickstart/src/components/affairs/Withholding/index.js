import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, Modal, Table, Button, Select } from 'antd';
const Option = Select.Option;

@connect(({ withholding }) => ({
  list: withholding.list,
  pagination: withholding.pagination,
  typeList: withholding.typeList,
  loading: withholding.loading,
  buttonLoading: withholding.buttonLoading,
}))
export default class Withholding extends Component {
  state = {
    overdue: '1',
  }

  componentDidMount() {
    this.handleFetchType();
    this.handleFetch();
  }
  handleFetch = (currentPage = 1, pageSize = 20) => {
    console.log(currentPage,pageSize)
    this.props.dispatch({
      type: 'withholding/fetch',
      payload: {
        overdue: this.state.overdue,
        currentPage,
        pageSize,
      }
    });
  }
  handleFetchType = () => {
    this.props.dispatch({
      type: 'withholding/fetchWithHoldType',
    });
  }
  handleChangeSelect = (value) => {
    this.setState({
      overdue: value || '',
    }, () => {
      this.handleFetch();
    });
  }
  handleTurnDetails = (taskNo) => {
    this.props.dispatch(routerRedux.push(`/affairs/withholding/details?taskNo=${taskNo}`));
  }
  handleExecute = () => {
    this.props.dispatch({
      type: 'withholding/fetchExecute',
      payload: this.state.overdue,
    });
  }
  render() {
    const { loading, list, pagination, typeList, buttonLoading } = this.props;
    let columns = [
      {
        title: '任务Id',
        dataIndex: 'taskNo',
      }, {
        title: '创建时间',
        dataIndex: 'gmtCreate',
      }, {
        title: '结束时间',
        dataIndex: 'finishDate',
      }, {
        title: '任务状态',
        dataIndex: 'status',
        render: (value) => {
          if (value === 1) {
            return '进行中';
          } else if (value === 2) {
            return '已完成';
          } else if (value === 3) {
            return '失败';
          }
          return '';
        }
      }, {
        title: '逾期对象',
        dataIndex: 'type',
        render: (value) => {
          return value === 1 ? '逾期一天以上' : '';
        }
      }, {
        title: '成功扣款笔数',
        dataIndex: 'num',
      }, {
        title: '成功扣款金额',
        dataIndex: 'amount',
      }, {
        title: '任务明细',
        key: 'desc',
        render: (record) => <a onClick={() => this.handleTurnDetails(record.taskNo)}>查看任务明细</a>
      }
    ];

    columns.forEach((item, index) => {
      columns[index].width = `${columns.length / 100}%`;
    });
    return (
      <Card>
        <div style={{ marginBottom: 20 }}>
          <span>执行对象：</span>
          <Select
            style={{ minWidth: 180, marginRight: 40 }}
            value={this.state.overdue}
            onChange={this.handleChangeSelect}>
            {typeList.map(item => <Option key={item.value}>{item.desc}</Option>)}
          </Select>
          <Button
            type="primary"
            style={{ marginRight: 40 }}
            loading={buttonLoading}
            onClick={this.handleExecute}
          >开始扣款</Button>
          <Button onClick={() => this.handleFetch()}>刷新计划</Button>
        </div>
        <Table
          loading={loading}
          style={{ height: 500 }}
          bordered
          scroll={{ y: 450 }}
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

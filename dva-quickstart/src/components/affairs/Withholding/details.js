import React, { Component } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Card, Modal, Table, Button, Select } from "antd";
import { origin } from "../../../utils/hostName";
import TrimSpan from "../../TrimSpan";
import { getLocationSearch } from "../../../utils/utils";
const Option = Select.Option;

@connect(({ withholding }) => ({
  loading: withholding.loading,
  list: withholding.detailsList,
  pagination: withholding.detailsPage,
  statusList: withholding.statusList
}))
export default class Withholding extends Component {
  state = {
    status: ""
  };

  componentDidMount() {
    this.handleFetchStatus();
    this.handleFetch();
  }
  handleFetch = (currentPage = 1, pageSize = 20) => {
    const taskNo = getLocationSearch().taskNo;
    this.props.dispatch({
      type: "withholding/fetchDetails",
      payload: {
        taskNo,
        status: this.state.status,
        currentPage,
        pageSize
      }
    });
  };
  handleFetchStatus = () => {
    this.props.dispatch({
      type: "withholding/fetchWithHoldStatus"
    });
  };
  handleChangeSelect = value => {
    this.setState(
      {
        status: value || ""
      },
      () => {
        this.handleFetch();
      }
    );
  };
  handleExcelDetails = () => {
    const { status } = this.state;
    const taskNo = getLocationSearch().taskNo;
    const url = `${origin}/withhold/task/details/excel?taskNo=${taskNo}&status=${status}`;
    window.location.href = url;
  };
  render() {
    const { loading, list, pagination, statusList } = this.props;
    let columns = [
      {
        title: "任务Id",
        dataIndex: "taskNo"
      },
      {
        title: "订单号",
        dataIndex: "tradeNo"
      },
      {
        title: "商户支付单号",
        dataIndex: "orderNo"
      },
      {
        title: "支付渠道",
        dataIndex: "payChannelName"
      },
      {
        title: "三方支付流水号",
        dataIndex: "billNo"
      },
      {
        title: "客户名称",
        dataIndex: "name"
      },
      {
        title: "客户手机号",
        dataIndex: "mobile"
      },
      {
        title: "代扣银行卡",
        dataIndex: "bankNo"
      },
      {
        title: "代扣发起时间",
        dataIndex: "startDate"
      },
      {
        title: "代扣回执时间",
        dataIndex: "receiptDate"
      },
      {
        title: "代扣金额",
        dataIndex: "amount"
      },
      {
        title: "代扣状态",
        dataIndex: "status",
        render: value => {
          if (value === 0) {
            return "初始化";
          } else if (value === 1) {
            return "成功";
          } else if (value === 2) {
            return "失败";
          }
          return "";
        }
      },
      {
        title: "状态信息",
        dataIndex: "statusInfo",
        render: value => <TrimSpan text={value} />
      }
    ];

    columns.forEach((item, index) => {
      columns[index].width = `${columns.length / 100}%`;
    });
    return (
      <Card>
        <div style={{ marginBottom: 20 }}>
          <span>代扣状态：</span>
          <Select
            allowClear={true}
            style={{ minWidth: 180, marginRight: 40 }}
            value={this.state.status}
            onChange={this.handleChangeSelect}
          >
            {statusList.map(item => (
              <Option key={item.value}>{item.desc}</Option>
            ))}
          </Select>
          <Button type="primary" onClick={this.handleExcelDetails}>
            导出数据
          </Button>
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

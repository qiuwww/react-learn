import React, { Component } from "react";
import { connect } from "dva";
// import { routerRedux } from 'dva/router';
import moment from "moment";
import { Button, Card, Table, DatePicker, message } from "antd";
import { origin } from "../../../utils/hostName";
const { RangePicker } = DatePicker;

@connect(({ apply }) => ({
  list: apply.list,
  pagination: apply.pagination,
  loading: apply.loading
}))
export default class List extends Component {
  state = {
    startDate: "",
    endDate: ""
  };

  componentDidMount() {
    const { exportType } = this.props;
    this.setState(
      {
        startDate: moment()
          .subtract(1, "month")
          .format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD")
      },
      () => {
        this.handleFetch();
      }
    );
  }
  handleFetch = (currentPage = 1, pageSize = 20) => {
    const fetchType =
      this.props.exportType === "noapply"
        ? "fetchNoApply"
        : "fetchNormalRepayment";
    this.props.dispatch({
      type: `apply/${fetchType}`,
      payload: { ...this.state, currentPage, pageSize }
    });
  };
  handleSearch = (value, key) => {
    const parmas = {};
    if (key === "time") {
      if (value.length > 0) {
        parmas.startDate = moment(value[0]).format("YYYY-MM-DD");
        parmas.endDate = moment(value[1]).format("YYYY-MM-DD");
      } else {
        parmas.startDate = "";
        parmas.endDate = "";
      }
    } else {
      parmas[key] = value;
    }
    // if (value === undefined) {
    //   parmas[key] = null;
    // }
    this.setState(
      {
        ...parmas
      },
      () => {
        this.handleFetch();
      }
    );
  };
  handleExportData = () => {
    const { startDate, endDate } = this.state;
    const { exportType, list } = this.props;
    if (list && list.length > 0) {
      this.props.dispatch({
        type: `apply/fetchExport`,
        payload: {
          startDate,
          endDate,
          exportType
        },
        callback: () => {
          window.location.href =
            origin +
            `/user/export/excel?startDate=${startDate}&endDate=${endDate}&exportType=${exportType}`;
        }
      });
    } else {
      message.info("没有数据可导出");
    }
  };
  render() {
    const { startDate, endDate } = this.state;
    const { list, pagination, loading, exportType } = this.props;
    const columns = [
      {
        title: "姓名",
        dataIndex: "name"
        // fixed: 'left',
      },
      {
        title: "手机号",
        dataIndex: "mobile"
      },
      {
        title: "注册日期",
        dataIndex: "registerDate"
      },
      {
        title: "渠道",
        dataIndex: "channel"
      }
    ];
    if (exportType !== "noapply") {
      columns.push({
        title: "最后还款日期",
        dataIndex: "lastRepaymentDate"
      });
    }
    return (
      <Card bordered={false}>
        <div style={{ marginBottom: 20 }}>
          <span>时间范围：</span>
          <RangePicker
            value={startDate ? [moment(startDate), moment(endDate)] : []}
            onChange={value => this.handleSearch(value, "time")}
          />
          <span style={{ marginLeft: 20 }}>
            <Button onClick={this.handleExportData} type="primary">
              导出
            </Button>
          </span>
        </div>
        <Table
          loading={loading}
          bordered
          // scroll={{ x: 1500 }}
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

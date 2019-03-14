import React, { Component } from "react";
import { connect } from "dva";
import { routerRedux, Link } from "dva/router";
import moment from "moment";
import { Button, Card, Table, Select, Row, Col, Radio, DatePicker } from "antd";
import styles from "../index.less";
const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(({ apiStatistical }) => ({
  LoanList: apiStatistical.LoanList,
  list: apiStatistical.list,
  pagination: apiStatistical.pagination,
  loading: apiStatistical.loading
}))
export default class ApiStatistical extends Component {
  state = {
    channelType: null,
    startDate: "",
    endDate: ""
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.setState(
      {
        startDate: moment()
          .subtract(1, "month")
          .format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD")
      },
      () => {
        this.handleFetch();
        this.handleFetchSelect();
      }
    );
  }

  handleFetchSelect = () => {
    this.props.dispatch({
      type: "apiStatistical/queryLoanList"
    });
  };
  handleFetch = (currentPage = 1, pageSize = 20) => {
    this.props.dispatch({
      type: "apiStatistical/fetch",
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
      parmas[key] = value || null;
    }
    this.setState(
      {
        ...parmas
      },
      () => {
        this.handleFetch();
      }
    );
  };
  render() {
    const { startDate, endDate } = this.state;
    const { LoanList, list, pagination, loading } = this.props;
    const columns = [
      {
        title: "贷超",
        dataIndex: "channelName",
      },
      {
        title: "进件数",
        dataIndex: "orderApplyNum"
      },
      {
        title: "审核通过",
        dataIndex: "orderPassNum"
      },
      {
        title: "审核拒绝",
        dataIndex: "orderRejectNum"
      },
      {
        title: "支付服务费",
        dataIndex: "serviceFeeNum"
      },
      {
        title: "放款成功",
        dataIndex: "loanNum"
      },
      {
        title: "放款金额",
        dataIndex: "loanAmount"
      },
      {
        title: "审核通过率",
        dataIndex: "auditPassRate",
        render: value => <text>{value || 0}</text>
      },
      {
        title: "审核通过放款率",
        dataIndex: "auditPassLoanRate",
        render: value => <text>{value || 0}</text>
      }
    ];
    return (
      <Card bordered={false}>
        <Row style={{ marginBottom: 20 }}>
          <Col sm={6} xs={24} style={{ marginBottom: 20 }}>
            <span>贷超：</span>
            <Select
              style={{ width: 150 }}
              allowClear={true}
              onChange={value => this.handleSearch(value, "channelType")}
            >
              {LoanList.map(item => (
                <Option key={item.type} value={item.type}>
                  {item.desc}
                </Option>
              ))}
            </Select>
          </Col>
          <Col sm={10} xs={24}>
            <span>时间范围：</span>
            <RangePicker
              value={startDate ? [moment(startDate), moment(endDate)] : []}
              onChange={value => this.handleSearch(value, "time")}
            />
          </Col>
        </Row>
        <Table
          bordered
          loading={loading}
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

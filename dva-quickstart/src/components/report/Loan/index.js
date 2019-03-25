import React, { Component } from "react";
import { connect } from "dva";
import { routerRedux, Link } from "dva/router";
import moment from "moment";
import { Button, Card, Table, Select, Row, Col, Radio, DatePicker } from "antd";
const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(({ channel, loan }) => ({
  selectList: channel.selectList,
  list: loan.list,
  pagination: loan.pagination,
  loading: loan.loading
}))
export default class Loan extends Component {
  state = {
    channelCode: "",
    startDate: "",
    endDate: ""
  };

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
      type: "channel/fetchSelect"
    });
  };
  handleFetch = (currentPage = 1, pageSize = 20) => {
    this.props.dispatch({
      type: "loan/fetch",
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
  render() {
    const { startDate, endDate } = this.state;
    const { selectList, list, pagination, loading } = this.props;
    const columns = [
      {
        title: "日期",
        dataIndex: "dataTime"
        // fixed: 'left',
      },
      {
        title: "注册人数",
        dataIndex: "registerNum"
      },
      {
        title: "芝麻分",
        dataIndex: "zmNum"
      },
      {
        title: "个人信息",
        dataIndex: "personalInfoNum"
      },
      {
        title: "运营商",
        dataIndex: "carrierNum"
      },
      {
        title: "银行卡",
        dataIndex: "bankNum"
        // }, {
        //   title: '人脸',
        //   dataIndex: 'faceNum',
      },
      {
        title: "订单申请数",
        dataIndex: "orderApplyNum"
      },
      {
        title: "订单通过数",
        dataIndex: "orderPassNum"
      },
      {
        title: "支付服务费",
        dataIndex: "serviceFeeNum"
      },
      {
        title: "放款成功数",
        dataIndex: "loanNum"
      },
      {
        title: "申请转化率",
        dataIndex: "applyConverRate"
      },
      {
        title: "审核通过率",
        dataIndex: "auditPassRate"
      },
      {
        title: "服务费转化率",
        dataIndex: "serviceFeeConverRate"
      },
      {
        title: "详情",
        key: "details",
        render: record =>
          record.dataTime === "全部" ? (
            ""
          ) : (
            <Link
              to={`/operation/loan/statistical-details?dataTime=${
                record.dataTime
              }`}
            >
              查看
            </Link>
          )
      }
    ];
    return (
      <Card bordered={false}>
        <Row style={{ marginBottom: 20 }}>
          <Col sm={6} xs={24} style={{ marginBottom: 20 }}>
            <span>渠道号：</span>
            <Select
              style={{ width: 150 }}
              allowClear={true}
              onChange={value => this.handleSearch(value, "channelCode")}
            >
              {selectList.map(item => (
                <Option key={item.channelCode}>{item.channelName}</Option>
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

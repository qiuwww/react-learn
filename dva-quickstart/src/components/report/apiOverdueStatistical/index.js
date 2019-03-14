import React, { Component } from "react";
import { connect } from "dva";
import { routerRedux, Link } from "dva/router";
import moment from "moment";
import { Button, Card, Table, Select, Row, Col, Radio, DatePicker } from "antd";
import styles from "../index.less";
const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(({ channel, apiOverdueStatistical }) => ({
  selectList: channel.selectList,
  list: apiOverdueStatistical.list,
  channleType: apiOverdueStatistical.channleType,
  pagination: apiOverdueStatistical.pagination,
  loading: apiOverdueStatistical.loading
}))
export default class ApiOverdueStatistical extends Component {
  state = {
    channelCode: "",
    startDate: "",
    endDate: "",
    // isNewUser: "",
    channelType: 1
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
        this.handleFetchNewUser();
      }
    );
  }

  handleFetchSelect = () => {
    this.props.dispatch({
      type: "channel/fetchSelect"
    });
  };
  handleFetchNewUser = () => {
    this.props.dispatch({
      type: "apiOverdueStatistical/fetchNewUserList"
    });
  };
  handleFetch = (currentPage = 1, pageSize = 20) => {
    this.props.dispatch({
      type: "apiOverdueStatistical/fetch",
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
    const { startDate, endDate, isNewUser } = this.state;
    const {
      selectList,
      list,
      pagination,
      loading,
      channleType
    } = this.props;
    const columns = [
      {
        title: "应还日期",
        dataIndex: "dataTime"
        // fixed: 'left',
      },
      {
        //   title: '审核数',
        //   dataIndex: 'auditNum',
        // }, {
        //   title: '通过数',
        //   dataIndex: 'passNum',
        // }, {
        title: "应还账单数",
        dataIndex: "repaymentNum"
      },
      {
        //   title: '放款率',
        //   dataIndex: 'loanRate',
        // }, {
        //   title: '申请金额',
        //   dataIndex: 'applyAmount',
        // }, {
        //   title: '放款金额',
        //   dataIndex: 'loanAmount',
        // }, {
        title: "在逾率/个数",
        dataIndex: "beOverdueInfo",
        className: styles.redTd
      },
      {
        title: "首逾率/个数",
        dataIndex: "firstOverdueInfo",
        className: styles.redTd1
      },
      {
        title: "d3率/个数",
        dataIndex: "d3OverdueInfo",
        className: styles.redTd2
      },
      {
        title: "d5率/个数",
        dataIndex: "d5OverdueInfo",
        className: styles.redTd3
      },
      {
        title: "d7率/个数",
        dataIndex: "d7OverdueInfo",
        className: styles.redTd4
      },
      {
        title: "d15率/个数",
        dataIndex: "d15OverdueInfo",
        className: styles.redTd5
      },
      {
        title: "详情",
        key: "details",
        render: record =>
          record.dataTime === "全部" ? (
            ""
          ) : (
            <Link
              to={`/operation/report/apiOverdueStatistical/detail?dataTime=${
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
            <span>贷超：</span>
            <Select
              style={{ width: 150 }}
              allowClear={true}
              onChange={value => this.handleSearch(value, "channelCode")}
            >
              {channleType.map(item => (
                <Option key={item.type}>{item.desc}</Option>
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
          {/* <Col sm={6} xs={24} style={{ marginBottom: 20 }}>
            <span>用户类型：</span>
            <Select
              style={{ width: 150 }}
              onChange={value => this.handleSearch(value, "isNewUser")}
              value={this.state.isNewUser}
            >
              {isNewUserList.map(item => (
                <Option key={item.type.toString()} value={item.type.toString()}>
                  {item.desc}
                </Option>
              ))}
            </Select>
          </Col> */}
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

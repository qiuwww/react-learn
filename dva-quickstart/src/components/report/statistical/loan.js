import React, { Component } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import moment from "moment";
import {
  Button,
  Card,
  Table,
  Select,
  Row,
  Col,
  Input,
  Radio,
  DatePicker
} from "antd";
const Search = Input.Search;
const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(({ reportLoan }) => ({
  list: reportLoan.list,
  pagination: reportLoan.pagination,
  loading: reportLoan.loading
}))
export default class LoanStatistical extends Component {
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
      }
    );
  }

  handleFetch = (currentPage = 1, pageSize = 20) => {
    this.props.dispatch({
      type: "reportLoan/fetch",
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
    var w = "7.4%";
    const columns = [
      {
        title: "日期",
        dataIndex: "dataTime",
        // fixed: 'left',
        width: "11.2%"
      },
      {
        title: "放款金额",
        dataIndex: "loanCapital",
        width: w
      },
      {
        title: "放款账单数",
        dataIndex: "loanNum",
        width: w
      },
      {
        title: "全额放款金额",
        dataIndex: "fullLoanCapital",
        width: w
      },
      {
        title: "全额放款账单数",
        dataIndex: "fullLoanNum",
        width: w
      },
      {
        title: "服务费扣除放款金额",
        dataIndex: "deductServiceLoanCapital",
        width: w
      },
      {
        title: "服务费扣除放款账单数",
        dataIndex: "deductServiceLoanNum",
        width: w
      },
      {
        title: "新增放款金额",
        dataIndex: "newLoanCapital",
        width: w
      },
      {
        title: "新增放款账单数",
        dataIndex: "newLoanNum",
        width: w
      },
      {
        title: "新增占比率",
        dataIndex: "newLoanRate",
        width: w
      },
      {
        title: "复借放款金额",
        dataIndex: "repeatCapital",
        width: w
      },
      {
        title: "复借放款账单数",
        dataIndex: "repeatNum",
        width: w
      },
      {
        title: "复借占比率",
        dataIndex: "repeatRate",
        width: w
      }
    ];
    // // columns.forEach((item, index) => {
    // //   columns[index].width = `${columns.length / 100}%`;
    // // });
    return (
      <Card bordered={false}>
        <Row style={{ marginBottom: 20 }}>
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

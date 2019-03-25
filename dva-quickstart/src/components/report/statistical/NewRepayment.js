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

@connect(({ newRepayment }) => ({
  list: newRepayment.list,
  pagination: newRepayment.pagination,
  loading: newRepayment.loading
}))
export default class NewRepayment extends Component {
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
        endDate: moment()
          .add(7, "days")
          .format("YYYY-MM-DD")
      },
      () => {
        this.handleFetch();
        // this.handleFetchSelect();
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
      type: "newRepayment/fetch",
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
      },
      {
        title: "应还账单数",
        dataIndex: "repaymentNum"
      },
      {
        title: "实还账单数",
        dataIndex: "paidNum"
      },
      {
        title: "续期占比",
        dataIndex: "renewalRate"
      },
      {
        title: "全额还款占比",
        dataIndex: "fullRepaymentRate"
      },
      {
        title: "未还账单数",
        dataIndex: "norepaymentNum"
      },
      {
        title: "还款率",
        dataIndex: "repaymentRate"
      },
      {
        title: "新客还款率",
        dataIndex: "newGuestRepaymentRate"
      },
      {
        title: "老客还款率",
        dataIndex: "oldGuestRepaymentRate"
      },
      {
        title: "复借账单数",
        dataIndex: "repeatNum"
      },
      {
        title: "复借占比",
        dataIndex: "repeatRate"
      }
    ];
    columns.forEach((item, index) => {
      columns[index].width = `${columns.length / 100}%`;
    });
    return (
      <Card bordered={false}>
        <Row style={{ marginBottom: 20 }}>
          {/* <Col sm={6} xs={24} style={{ marginBottom: 20 }}>
            <span>渠道号：</span>
            <Select
              style={{ width: 150 }}
              allowClear={true}
              onChange={value => this.handleSearch(value, 'channelCode')}
            >
              {selectList.map(item => <Option key={item.channelCode}>{item.channelName}</Option>)}
            </Select>
          </Col> */}
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

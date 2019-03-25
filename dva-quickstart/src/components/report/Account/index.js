import React, { Component } from "react";
import { connect } from "dva";
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
import IntoList from "./IntoList";
import OutList from "./OutList";
const { RangePicker } = DatePicker;

@connect(({ account }) => ({
  account
}))
export default class Account extends Component {
  state = {
    radioValue: "into",
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
        this.handleFetchInfo();
      }
    );
    window.moment = moment;
  }
  componentWillReceiveProps = nextProps => {};
  handleFetch = (currentPage, pageSize) => {
    if (this.state.radioValue === "into") {
      this.handleFetchInfo(currentPage, pageSize);
    } else {
      this.handleFetchOut(currentPage, pageSize);
    }
  };
  handleFetchInfo = (currentPage = 1, pageSize = 20) => {
    this.props.dispatch({
      type: "account/fetchIntoList",
      payload: {
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        currentPage,
        pageSize
      }
    });
  };
  handleFetchOut = (currentPage = 1, pageSize = 20) => {
    this.props.dispatch({
      type: "account/fetchOutList",
      payload: {
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        currentPage,
        pageSize
      }
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
    this.setState(
      {
        ...parmas
      },
      () => {
        this.handleFetch();
      }
    );
  };
  handleChangeRadio = e => {
    this.setState(
      {
        radioValue: e.target.value
      },
      () => {
        this.handleFetch();
      }
    );
  };
  render() {
    const { startDate, endDate } = this.state;
    return (
      <Card bordered={false}>
        <Row style={{ marginBottom: 20 }}>
          <Col sm={6} xs={24} style={{ marginBottom: 20 }}>
            <Radio.Group
              value={this.state.radioValue}
              onChange={this.handleChangeRadio}
              buttonStyle="solid"
            >
              <Radio.Button value="into">入账</Radio.Button>
              <Radio.Button value="out">出账</Radio.Button>
            </Radio.Group>
          </Col>
          <Col sm={10} xs={24}>
            <span>时间范围：</span>
            <RangePicker
              value={startDate ? [moment(startDate), moment(endDate)] : []}
              onChange={value => this.handleSearch(value, "time")}
            />
          </Col>
        </Row>
        {this.state.radioValue === "into" ? (
          <IntoList handleFetch={this.handleFetchInfo} />
        ) : (
          <OutList handleFetch={this.handleFetchOut} />
        )}
      </Card>
    );
  }
}

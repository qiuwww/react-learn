/**
 * Created by Administrator on 2016/11/9.
 */
import React, { Component } from "react";
import { fetchPost } from "../../../../../utils/request";

import { Icon, Card, Spin } from "antd";
import Tongdun from "./Tongdun";
import Black from "./Black";
import Jy from "./Jy";
import Pingan from "./Pingan";

class Risk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      tongDun: null,
      blackList: null,
      jyResult: null,
      pinganResult: null,
      loading: true,
      userId: props.userId,
      message: "",
      timer: null,
      item: props.item
    };
  }

  // 初始化方法
  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(props) {
    if (props.id != this.state.id || props.userId != this.state.userId) {
      this.setState(
        {
          id: props.id,
          userId: props.userId,
          loading: true,
          item: props.item
        },
        () => {
          this.getData();
        }
      );
    }
  }

  componentWillUnmount() {
    clearTimeout(this.state.timer);
  }

  // 请求数据
  getData() {
    if (this.state.id != null) {
      fetchPost("/risk/riskpage", {
        tradeNo: this.state.userId,
        userCode: this.state.id,
        productType: this.state.item.productType
      }).then(json => {
        if (json.code === 0) {
          if (json.data != null) {
            this.setState({
              tongDun: json.data.tongDun,
              blackList: json.data.blackOriginDataList,
              jyResult: json.data.jyResult,
              pinganResult: json.data.pinganQueryResult,
              loading: false
            });
          }
        } else {
          this.setState({
            loading: false,
            message: json.msg
          });
        }
      });
    }
  }

  message() {
    if (this.state.message) {
      this.state.timer = setTimeout(() => {
        this.setState({
          message: ""
        });
      }, 3000);
      return (
        <span className="color-warning warning-animate">
          <Icon type="info-circle-o" /> {this.state.message}
        </span>
      );
    } else {
      return "";
    }
  }

  render() {
    if (!this.state.id) {
      return (
        <Card title="风控数据" noHovering={true}>
          <span className="no-data">
            <Icon type="frown-o" />
            暂无数据
          </span>
        </Card>
      );
    }

    return (
      <Card
        title="风控数据"
        extra={this.message()}
        bodyStyle={{ padding: "5px" }}
        noHovering={true}
      >
        <Spin spinning={this.state.loading}>
          <Tongdun tongDun={this.state.tongDun} />
          <Black blackList={this.state.blackList} />
          <Jy jyResult={this.state.jyResult} />
          <Pingan pinganResult={this.state.pinganResult} />
        </Spin>
      </Card>
    );
  }
}
export default Risk;

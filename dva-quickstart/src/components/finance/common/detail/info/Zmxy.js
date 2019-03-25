/**
 * Created by ziyu on 17/3/15.
 */

import React, { Component } from "react";
import { Card, Col, Icon } from "antd";
import Styles from "./../Index.less";

class Zmxy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "征信信息",
      data: props.data,
      message: "",
      timer: null
    };
  }

  componentWillUnmount() {
    clearTimeout(this.state.timer);
  }

  componentWillReceiveProps(props) {
    if (this.state.data.zmCredit !== props.data.zmCredit) {
      this.setState({
        data: props.data
      });
    }
    if (this.state.message != props.message) {
      this.setState({
        message: props.message
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
    return (
      <div className={Styles.detailModule}>
        <Card
          title={this.state.title}
          extra={this.message()}
          noHovering={true}
          bodyStyle={{ padding: 1 }}
        >
          <div className={Styles.personnelContainer}>
            <Col span={24} className={Styles.item}>
              <Col span={13}>芝麻信用分:</Col>
              <Col span={9}>{this.state.data.zmCredit}</Col>
            </Col>

            <Col span={24} className={Styles.item}>
              <Col span={13}>ivs评分:</Col>
              <Col span={9}>{this.state.data.ivsCredit}</Col>
            </Col>

            <Col span={24} className={Styles.item}>
              <Col span={13}>是否命中黑名单:</Col>
              <Col span={9}>
                {this.state.data.watchMatched ? (
                  <span className="color-warning">是</span>
                ) : (
                  "否"
                )}
              </Col>
            </Col>
          </div>
        </Card>
      </div>
    );
  }
}

export default Zmxy;

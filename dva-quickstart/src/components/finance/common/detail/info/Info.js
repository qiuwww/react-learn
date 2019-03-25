import React, { Component } from "react";
import { Col } from "antd";
import Zmxy from "./Zmxy";
import Identity from "../../../../common/components/users/Identity";
import Profession from "../../../../common/components/users/Profession";
import Account from "./ApplyAccount";
import Ivs from "./Ivs";
import Watch from "./Watch";
import { fetchPost } from "./../../../../../utils/request";

class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.userId,
      tradeNo: props.tradeNo,
      zmData: {},
      id: props.id,
      message: "",
      item: props.item
    };
  }

  componentWillReceiveProps(props) {
    if (this.state.userId != props.userId || this.state.id != props.id) {
      this.setState(
        {
          userId: props.userId,
          tradeNo: props.tradeNo,
          id: props.id,
          item: props.item
        },
        () => {
          this.getData();
        }
      );
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    if (this.state.id) {
      fetchPost(`/user/${this.state.userId}/zm/info`).then(json => {
        if (json.data != null && json.code === 0) {
          this.setState({
            zmData: json.data
          });
        } else {
          this.setState({
            zmData: {},
            message: json.msg
          });
        }
      });
    } else {
      this.setState({
        zmData: {}
      });
    }
  }

  render() {
    return (
      <div style={{ overflow: "hidden", height: 800 }}>
        <div style={{ height: "100%", overflow: "auto" }}>
          <Col span={24}>
            <Account item={this.state.item} userId={this.state.userId} />
          </Col>

          <Col span={24}>
            <Identity userId={this.state.userId} tradeNo={this.state.tradeNo} />
          </Col>

          <Col span={16}>
            <Profession orderId={this.state.id} userId={this.state.userId} />
          </Col>

          <Col span={8}>
            <Zmxy data={this.state.zmData} message={this.state.message} />
          </Col>

          <Col span={24}>
            <Ivs data={this.state.zmData} />
          </Col>

          <Col span={24} className="mt10">
            <Watch data={this.state.zmData} />
          </Col>
        </div>
      </div>
    );
  }
}

export default Info;

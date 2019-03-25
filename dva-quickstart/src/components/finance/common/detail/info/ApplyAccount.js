/**
 * Created by ziyu on 17/3/8.
 */
import React, { Component, message } from "react";
import { Table, Card, Icon } from "antd";
import Styles from "./../Index.less";
import { fetchPost } from "./../../../../../utils/request";

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.userId,
      data: [],
      page: {
        totalNum: 1,
        pageSize: 1
      },
      accountNum: null,
      title: "",
      userDeviceVOList: [],
      message: "",
      timer: null,
      item: props.item
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(props) {
    if (this.state.userId !== props.userId) {
      this.setState(
        {
          userId: props.userId,
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

  getData() {
    if (this.state.tradeNo !== null) {
      fetchPost(`/user/${this.state.tradeNo}/device/info`, {}).then(json => {
        if (json.code === 0 && json.data != null) {
          if (json.data.userDeviceVOList !== null) {
            this.setState({
              userDeviceVOList: json.data.userDeviceVOList,
              title: `申请设备关联账号: ${json.data.userDeviceVOList.length}`
            });
          }
          if (
            json.data.userDeviceVOList == null ||
            json.data.userDeviceVOList == 0
          ) {
            this.setState({
              title: "申请设备关联账号(无)"
            });
          }
        } else {
          this.setState({
            userDeviceVOList: [],
            title: "申请设备关联账号(无)"
          });
        }
      });
    } else {
      this.setState({
        userDeviceVOList: [],
        title: "申请设备关联账号(无)"
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
    let self = this;
    let columns = [
      {
        title: "姓名",
        dataIndex: "userName",
        key: "userName"
      },
      {
        title: "手机号",
        dataIndex: "mobile",
        key: "mobile"
      },
      {
        title: "身份证号",
        dataIndex: "identityNo",
        key: "identityNo"
      },
      {
        title: "设备AppClient",
        dataIndex: "appClient",
        key: "appClient"
      },
      {
        title: "信用额度",
        dataIndex: "creditLimit",
        key: "creditLimit"
      },
      {
        title: "申请数/通过数",
        dataIndex: "applicationTimes",
        key: "applicationTimes",
        render: (text, record) => {
          return (
            <div>
              {text}/{record.passTimes}
            </div>
          );
        }
      },
      {
        title: "申请wifi信息",
        dataIndex: "wifiInfo",
        key: "wifiInfo"
      }
    ];

    return (
      <div className={Styles.detailModule}>
        <Card
          title={this.state.title}
          extra={this.message()}
          bodyStyle={{ padding: 1 }}
          noHovering={true}
        >
          <Table
            columns={columns}
            key="userName"
            pagination={false}
            dataSource={this.state.userDeviceVOList}
            loading={self.state.loading}
            bordered
            style={{ background: "#FFFFFF" }}
            size="small"
          />
        </Card>
      </div>
    );
  }
}

export default Account;

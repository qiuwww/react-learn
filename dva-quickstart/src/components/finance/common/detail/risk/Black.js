/**
 * Created by Administrator on 2016/11/9.
 */
import React, { Component } from "react";
import { Table, Card } from "antd";

class Black extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blackList: props.blackList,
      loading: false
    };
  }

  componentWillReceiveProps(props) {
    if (props.blackList != this.state.blackList) {
      this.setState({
        blackList: props.blackList,
        loading: false
      });
    }
  }

  render() {
    let blackList = this.state.blackList;
    if (blackList == null) {
      return (
        <Card
          title="闪银黑名单"
          noHovering={true}
          style={{ width: "100%", display: "inline-block" }}
        >
          <h3>
            <font color="#f60">请求闪银失败！ </font>
          </h3>
        </Card>
      );
    }
    let blackListSize = this.state.blackList.length;
    if (blackListSize == 0) {
      return (
        <Card
          title="闪银黑名单"
          noHovering={true}
          style={{ width: "100%", display: "inline-block" }}
        >
          <h3>
            <font color="#FF8000">无相关记录！</font>
          </h3>
        </Card>
      );
    }

    const columns = [
      {
        title: "法律状态",
        dataIndex: "legalState",
        key: "legalState"
      },
      {
        title: "逾期金额(元)",
        dataIndex: "overdueAmount",
        key: "overdueAmount"
      },
      {
        title: "逾期时间",
        dataIndex: "overdueDate",
        key: "overdueDate"
      },
      {
        title: "数据库入库时间",
        dataIndex: "数据库入库时间",
        key: "数据库入库时间"
      },
      {
        title: "黑名单类型",
        key: "type",
        dataIndex: "type"
      }
    ];

    return (
      <div>
        <Card
          title="闪银黑名单"
          noHovering={true}
          style={{ width: "100%", display: "inline-block" }}
        >
          <Table
            pagination={false}
            columns={columns}
            dataSource={this.state.blackList}
            bordered
            key="id"
            size="small"
          />
        </Card>
      </div>
    );
  }
}

export default Black;

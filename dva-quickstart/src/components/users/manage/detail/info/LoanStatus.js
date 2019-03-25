/**
 * Created by ziyu on 17/3/14.
 */

import React, { Component } from "react";
import { Table, Card } from "antd";
import Styles from "./../Index.less";
import { fetchPost } from "./../../../../../utils/request";

class LoanStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.userId,
      list: [],
      page: {
        totalNum: 0,
        pageSize: 5
      },
      title: "当前借款状态"
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(props) {
    if (this.state.userId !== props.userId) {
      this.setState(
        {
          userId: props.userId
        },
        () => {
          this.getData();
        }
      );
    }
  }

  getData() {
    if (this.state.userId != null) {
      fetchPost(
        `/user/${this.state.userId}/latestOrder/info`,
        this.state.params
      ).then(json => {
        if (json.code === 0) {
          this.setState({
            list: [json.data]
          });
        }
      });
    } else {
      this.setState({
        list: []
      });
    }
  }

  render() {
    const columns = [
      {
        title: "订单号",
        dataIndex: "orderNo",
        key: "orderNo"
      },
      {
        title: "申请时间",
        dataIndex: "applyDate",
        key: "applyDate"
      },
      {
        title: "信用额度",
        dataIndex: "quota",
        key: "quota"
      },
      {
        title: "借款金额/周期",
        dataIndex: "appClient",
        key: "appClient",
        render: (text, record) => {
          return (
            <span>
              {record.capital} / {record.duration}
            </span>
          );
        }
      },
      {
        title: "借款状态",
        dataIndex: "orderStatusMsg",
        key: "orderStatusMsg"
      }
    ];

    return (
      <div className={Styles.detailModule}>
        <Card
          title={this.state.title}
          bodyStyle={{ padding: 1 }}
          noHovering={true}
        >
          <Table
            columns={columns}
            key="name"
            size="small"
            pagination={false}
            dataSource={this.state.list}
            loading={this.state.loading}
            bordered
          />
        </Card>
      </div>
    );
  }
}

export default LoanStatus;

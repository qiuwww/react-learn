/**
 * Created by Administrator on 2016/11/10.
 */

import React, { Component } from "react";
import { Table, Card } from "antd";

class Jy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jyResult: props.jyResult,
      loading: false
    };
  }

  componentWillReceiveProps(props) {
    if (props.jyResult != this.state.jyResult) {
      this.setState({
        jyResult: props.jyResult,
        loading: false
      });
    }
  }

  render() {
    let jyResult = this.state.jyResult;
    if (jyResult == null) {
      return (
        <Card
          title="91征信"
          noHovering={true}
          style={{ width: "100%", display: "inline-block" }}
        >
          <h3>
            <font color="#FF8000">请求91征信失败！ </font>
          </h3>
        </Card>
      );
    }

    jyResult = this.state.jyResult.borrowJyCreditVoList;
    let jySync = this.state.jyResult.jySync;
    if (!jySync) {
      return (
        <Card
          title="91征信"
          noHovering={true}
          style={{ width: "100%", display: "inline-block" }}
        >
          <h3>
            <font color="#FF8000">未订阅！</font>
          </h3>
        </Card>
      );
    }

    if (jyResult == null) {
      return (
        <Card
          title="91征信"
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
        title: "借款类型",
        dataIndex: "borrowTypeDesc",
        key: "borrowTypeDesc"
      },
      {
        title: "借款状态",
        dataIndex: "borrowStateDesc",
        key: "borrowStateDesc"
      },
      {
        title: "借款金额(万元)",
        dataIndex: "borrowAmountDesc",
        key: "borrowAmountDesc"
      },
      {
        title: "合同日期",
        dataIndex: "contractDate",
        key: "contractDate"
      },
      {
        title: "批贷期数",
        key: "loanPeriod",
        dataIndex: "loanPeriod"
      },
      {
        title: "还款状态",
        key: "repayStateDesc",
        dataIndex: "repayStateDesc"
      },
      {
        title: "欠款金额",
        key: "arrearsAmount",
        dataIndex: "arrearsAmount"
      },
      {
        title: "公司代码",
        key: "companyCode",
        dataIndex: "companyCode"
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
            key="borrowAmountDesc"
            columns={columns}
            dataSource={jyResult}
            bordered
            size="small"
          />
        </Card>
      </div>
    );
  }
}

export default Jy;

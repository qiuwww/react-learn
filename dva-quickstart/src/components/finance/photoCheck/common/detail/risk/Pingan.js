/**
 * Created by Administrator on 2016/11/10.
 */
import React, { Component } from "react";
import { Table, Card, Collapse } from "antd";

const Panel = Collapse.Panel;

class Pingan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pinganResult: props.pinganResult,
      loading: false
    };
  }

  componentWillReceiveProps(props) {
    if (props.pinganResult != this.state.pinganResult) {
      this.setState({
        pinganResult: props.pinganResult,
        loading: false
      });
    }
  }

  render() {
    let pinganResult = this.state.pinganResult;
    if (pinganResult == null) {
      return (
        <Card
          title="凭安征信"
          noHovering={true}
          style={{ width: "100%", display: "inline-block" }}
        >
          <h3>
            <font color="#f80">请求凭安征信失败！ </font>
          </h3>
        </Card>
      );
    }
    let blackResults = pinganResult.blackQueryResults;
    let loanResults = pinganResult.loanQueryResults;
    let overdueResults = pinganResult.overdueQueryResults;
    let tagsResults = pinganResult.tagsQueryResults;

    let defaultActiveKey = [];

    let loanTitle = "暂无数据!";
    //  noHovering={true}
    if (loanResults != null && loanResults.length > 0) {
      defaultActiveKey.push("1");
      loanTitle = `条数:${loanResults.length}`;
    }
    const loanColumns = [
      {
        title: "订单id",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "手机号",
        dataIndex: "phone",
        key: "phone"
      },
      {
        title: "匹配查询的类型",
        dataIndex: "matchType",
        key: "matchType"
      },
      {
        title: "逾期周期",
        dataIndex: "recordPeriod",
        key: "recordPeriod",
        render: text => {
          if (text == "M3") {
            return "最近1到3个月记录";
          }
          if (text == "M6") {
            return "最近4到6个月记录";
          }
          if (text == "M9") {
            return "最近7到9个月记录";
          }
          if (text == "M12") {
            return "最近10到12个月记录";
          }
          if (text == "M24") {
            return "最近13到24个月记录";
          } else {
            return { text };
          }
        }
      },
      {
        title: "数据类型",
        key: "recordType",
        dataIndex: "recordType",
        render: text => {
          if (text == "bank") {
            return "银行贷款记录";
          }
          if (text == "other") {
            return "非银行机构贷款记录";
          } else {
            return { text };
          }
        }
      },
      {
        title: "涉及机构数",
        dataIndex: "orgNums",
        key: "orgNums"
      },
      {
        title: "贷款总金额",
        dataIndex: "loanAmount",
        key: "loanAmount"
      },
      {
        title: "月均还款额",
        dataIndex: "totalAmount",
        key: "totalAmount"
      },
      {
        title: "月需还款最大金额",
        dataIndex: "repayAmount",
        key: "repayAmount"
      }
    ];

    let self = this;
    let overdueTitle = "暂无数据!";
    if (overdueResults != null && overdueResults.length > 0) {
      defaultActiveKey.push("2");
      overdueTitle = `条数:${overdueResults.length}`;
    }
    const overdueColumns = [
      {
        title: "订单id",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "手机号",
        dataIndex: "phone",
        key: "phone"
      },
      {
        title: "匹配查询的类型",
        dataIndex: "matchType",
        key: "matchType"
      },
      {
        title: "逾期周期",
        dataIndex: "recordPeriod",
        key: "recordPeriod",
        render: text => {
          if (text == "M3") {
            return "最近1到3个月记录";
          }
          if (text == "M6") {
            return "最近4到6个月记录";
          }
          if (text == "M9") {
            return "最近7到9个月记录";
          }
          if (text == "M12") {
            return "最近10到12个月记录";
          }
          if (text == "M24") {
            return "最近13到24个月记录";
          } else {
            return { text };
          }
        }
      },
      {
        title: "数据类型",
        key: "recordType",
        dataIndex: "recordType",
        render: text => {
          if (text == "bank") {
            return "银行贷款记录";
          }
          if (text == "other") {
            return "非银行机构贷款记录";
          } else {
            return { text };
          }
        }
      },
      {
        title: "涉及机构数",
        dataIndex: "orgNums",
        key: "orgNums"
      },
      {
        title: "逾期记录的条数",
        dataIndex: "recordNums",
        key: "recordNums"
      },
      {
        title: "最大逾期金额",
        dataIndex: "maxAmount",
        key: "maxAmount"
      },
      {
        title: "最大逾期金额的逾期天数",
        dataIndex: "maxAmountDate",
        key: "maxAmountDate"
      },
      {
        title: "最长逾期天数",
        dataIndex: "longestDays",
        key: "longestDays"
      }
    ];

    let blackTitle = "暂无数据!";
    if (blackResults != null && blackResults.length > 0) {
      defaultActiveKey.push("3");
      blackTitle = `条数:${blackResults.length}`;
    }
    const blackColumns = [
      {
        title: "订单id",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "手机号",
        dataIndex: "phone",
        key: "phone"
      },
      {
        title: "匹配查询的类型",
        dataIndex: "matchType",
        key: "matchType"
      },
      {
        title: "非银机构与其失联时间",
        dataIndex: "orgLostContact",
        key: "orgLostContact"
      },
      {
        title: "银行机构与其失联时间",
        dataIndex: "bankLostContact",
        key: "bankLostContact"
      },
      {
        title: "列为黑名单的机构",
        dataIndex: "orgBlackList",
        key: "orgBlackList"
      },
      {
        title: "最后一次收到严重逾期通时间",
        dataIndex: "seriousOverdueTime",
        key: "seriousOverdueTime"
      },
      {
        title: "催收电话的呼叫时间",
        dataIndex: "dunTelCallTime",
        key: "dunTelCallTime"
      },
      {
        title: "机构逾期期数",
        dataIndex: "orgOverduePeriod",
        key: "orgOverduePeriod"
      },
      {
        title: "银行逾期期数",
        dataIndex: "bankOverduePeriod",
        key: "bankOverduePeriod"
      },
      {
        title: "机构诉讼",
        dataIndex: "orgLitigation",
        key: "orgLitigation"
      },
      {
        title: "银行诉讼",
        dataIndex: "bankLitigation",
        key: "bankLitigation"
      },
      {
        title: "开户30天有逾期",
        dataIndex: "orgOneMonthOvedue",
        key: "orgOneMonthOvedue"
      }
    ];

    let tagsTitle = "暂无数据!";
    if (tagsResults != null && tagsResults.length > 0) {
      defaultActiveKey.push("4");
      tagsTitle = `条数:${tagsResults.length}`;
    }
    const tagsColumns = [
      {
        title: "订单id",
        dataIndex: "id",
        key: "id",
        width: "4%"
      },
      {
        title: "手机号",
        dataIndex: "phone",
        key: "phone",
        width: "10%"
      },
      {
        title: "用户标注标签",
        dataIndex: "label",
        key: "label"
      },
      {
        title: "运营商",
        dataIndex: "operator",
        key: "operator",
        width: "5%"
      },
      {
        title: "城市",
        dataIndex: "city",
        key: "city",
        width: "5%"
      },
      {
        title: "类型",
        dataIndex: "orgBlackList",
        key: "orgBlackList",
        render: text => {
          if (text == "m0") {
            return "当月汇总";
          }
          if (text == "m1") {
            return "前一个月汇总";
          }
          if (text == "t6") {
            return "前6个月整体汇总";
          }
        }
      },
      {
        title: "月份",
        dataIndex: "month",
        key: "month",
        width: "6%"
      },
      {
        title: "0点到6点的通话次数",
        dataIndex: "hourStatMorning",
        key: "hourStatMorning"
      },
      {
        title: "7点到20点的通话次数",
        dataIndex: "hourStatDay",
        key: "hourStatDay"
      },
      {
        title: "21点到23点的通话次数",
        dataIndex: "hourStatNight",
        key: "hourStatNight"
      },
      {
        title: "联系人个数",
        dataIndex: "contactAmount",
        key: "contactAmount"
      },
      {
        title: "日均通话次",
        dataIndex: "dailyCallTimes",
        key: "dailyCallTimes"
      },
      {
        title: "主叫次数",
        dataIndex: "callTimes",
        key: "callTimes"
      },
      {
        title: "被叫次数",
        dataIndex: "calledTimes",
        key: "calledTimes"
      },
      {
        title: "通话间隔的最小值(单位为秒）",
        dataIndex: "activeShortest",
        key: "activeShortest"
      },
      {
        title: "通话间隔的最长值(单位为分钟）",
        dataIndex: "activeLongest",
        key: "activeLongest"
      },
      {
        title: "主叫通话间隔的平均值(单位为分钟)次数",
        dataIndex: "activeAverage",
        key: "activeAverage",
        width: 100
      }
    ];

    return (
      <div>
        <Card title="凭安征信" noHovering={true}>
          <Collapse>
            <Panel
              header={
                <div>
                  贷款信息 &nbsp;&nbsp;<font color="#FF8000">{loanTitle}</font>
                </div>
              }
              key="1"
            >
              <Table
                pagination={false}
                columns={loanColumns}
                dataSource={loanResults}
                loading={self.state.loading}
                bordered
                key="id"
                size="small"
              />
            </Panel>

            <Panel
              header={
                <div>
                  逾期信息 &nbsp;&nbsp;
                  <font color="#FF8000">{overdueTitle}</font>
                </div>
              }
              key="2"
            >
              <Table
                pagination={false}
                columns={overdueColumns}
                dataSource={overdueResults}
                loading={self.state.loading}
                bordered
                key="id"
                size="small"
              />
            </Panel>

            <Panel
              header={
                <div>
                  黑名单信息 &nbsp;&nbsp;
                  <font color="#FF8000">{blackTitle}</font>
                </div>
              }
              key="3"
            >
              <Table
                pagination={false}
                columns={blackColumns}
                dataSource={blackResults}
                loading={self.state.loading}
                bordered
                key="id"
                size="small"
              />
            </Panel>

            <Panel
              header={
                <div>
                  电话标记信息 &nbsp;&nbsp;
                  <font color="#FF8000">{tagsTitle}</font>
                </div>
              }
              key="4"
            >
              <div style={{ height: 500, overflow: "scroll" }}>
                <Table
                  pagination={false}
                  columns={tagsColumns}
                  dataSource={tagsResults}
                  loading={self.state.loading}
                  bordered
                  key="id"
                  size="small"
                />
              </div>
            </Panel>
          </Collapse>
        </Card>
      </div>
    );
  }
}
export default Pingan;

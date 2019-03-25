/**
 * Created by ziyu on 17/3/10.
 */

import React, { Component } from "react";
import moment from "moment";
import { message, Table } from "antd";
import Search from "../../common/components/Search";
import Pannel from "../../common/components/Pannel";
import CommonStyle from "../../common/less/common.less";
import { fetchPost } from "../../../utils/request";
class EnterAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      panelParams: [],
      params: {
        paidStatus: "",
        applyStartDate: moment()
          .subtract("days", 7)
          .format("YYYY-MM-DD"),
        applyEndDate: moment().format("YYYY-MM-DD"),
        findtype: "",
        inputValue: ""
      },
      page: {
        currentPage: 1,
        pageSize: 20,
        totalCount: 0
      },
      searchParams: {
        list: [
          {
            name: "入账时间",
            type: "range",
            key: ["startDate", "endDate"],
            className: "pr20",
            placeHolder: "",
            values: []
          },
          {
            name: "查询类型",
            type: "group",
            key: ["findtype", "inputValue"],
            className: "pr20",
            values: [{ value: "", name: "请选择" }]
          },
          {
            name: "",
            type: "search",
            key: "",
            className: "pr20",
            value: []
          }
        ],
        api: "/common/liquidation/query"
      }
    };
  }

  componentDidMount() {
    this.getData();
  }

  nextpage(current) {
    this.setState(
      {
        page: {
          ...this.state.page,
          currentPage: current
        }
      },
      () => {
        this.getData();
      }
    );
  }

  getData() {
    let self = this;
    let copyState = {};
    for (let i in this.state.params) {
      if (this.state.params[i] != "") {
        copyState[i] = this.state.params[i];
      }
    }
    function GetList() {
      return new Promise((resolve, reject) => {
        fetchPost(
          `/liquidation/checking/list?currentPage=${
            self.state.page.currentPage
          }&pageSize=${self.state.page.pageSize}`,
          copyState
        ).then(res => {
          if (res.code === 0) {
            resolve(res);
          } else {
            message.error(res.msg);
            reject(res);
          }
        });
      });
    }

    function GetPanel() {
      return new Promise((resolve, reject) => {
        fetchPost("/liquidation/checking/stat").then(res => {
          if (res.code === 0) {
            resolve(res);
          } else {
            message.error(res.msg);
            reject(res);
          }
        });
      });
    }

    Promise.all([GetList(), GetPanel()]).then(
      res => {
        let list = res[0];
        let panel = res[1];
        if (list.data.list.length > 0) {
          this.setState({
            list: list.data.list,
            page: list.data.page,
            panelParams: [
              {
                name: "共入账",
                value: `${panel.data.item.paidedAmount}元`
              },
              {
                name: "抵扣",
                value: `${panel.data.item.deductAmount}元`
              },
              {
                name: "app还款",
                value: `${panel.data.item.appAmount}元`
              },
              {
                name: "人工结清",
                value: `${panel.data.item.humanAmount}元`
              }
            ]
          });
        } else {
          this.setState({
            list: [],
            panelParams: [
              {
                name: "共入账",
                value: `${panel.data.item.paidedAmount}元`
              },
              {
                name: "抵扣",
                value: `${panel.data.item.deductAmount}元`
              },
              {
                name: "app还款",
                value: `${panel.data.item.appAmount}元`
              },
              {
                name: "人工结清",
                value: `${panel.data.item.humanAmount}元`
              }
            ]
          });
        }
      },
      () => {
        this.setState({
          list: [],
          panelParams: []
        });
      }
    );
  }

  changeParams(params) {
    if (params.startDate) {
      params.applyStartDate = params.startDate;
      delete params.startDate;
    }

    if (params.endDate) {
      params.applyEndDate = params.endDate;
      delete params.endDate;
    }
    this.setState(
      {
        params
      },
      () => {
        this.getData();
      }
    );
  }

  render() {
    const self = this;
    const columns = [
      {
        title: "订单号",
        dataIndex: "orderNo",
        key: "orderNo"
      },
      {
        title: "还款计划单号",
        dataIndex: "orderBillNo",
        key: "orderBillNo"
      },
      {
        title: "入账时间",
        dataIndex: "actualRepaymentDate",
        key: "actualRepaymentDate"
      },
      {
        title: "应还时间",
        dataIndex: "repaymentDate",
        key: "repaymentDate"
      },
      {
        title: "总金额",
        dataIndex: "totalAmount",
        key: "totalAmount"
      },
      {
        title: "现金",
        dataIndex: "paidAmount",
        key: "paidAmount"
      },
      {
        title: "抵扣",
        dataIndex: "decuctAmount",
        key: "decuctAmount"
      },
      {
        title: "到期应还",
        dataIndex: "amount",
        key: "amount"
      },
      {
        title: "姓名/电话",
        dataIndex: "mobile",
        key: "mobile",
        render: (text, record) => <div>{`${record.name}/${record.mobile}`}</div>
      },
      {
        title: "逾期天数",
        dataIndex: "yuQiDays",
        key: "yuQiDays"
      },
      {
        title: "账单周期(当前/总天数)",
        dataIndex: "period",
        key: "period",
        render: (text, record) => (
          <div>{`${record.period}/${record.duration}`}</div>
        )
      }
    ];

    const pagination = {
      total: this.state.page.totalCount || 0,
      pageSize: this.state.page.pageSize,
      showSizeChanger: false,
      showQuickJumper: true,
      showTotal(total) {
        return `总共 ${total} 条`;
      },
      onChange(current) {
        self.nextpage(current);
      }
    };

    return (
      <div>
        <div className={CommonStyle.searchClass}>
          <Search
            searchParams={this.state.searchParams}
            changeParams={params => this.changeParams(params)}
          />
        </div>

        <div className="mt20">
          <Pannel panelParams={this.state.panelParams} />
        </div>

        <Table
          pagination={pagination}
          size="small"
          key="orderNo"
          columns={columns}
          dataSource={this.state.list}
          loading={this.state.loading}
          bordered
        />
      </div>
    );
  }
}

export default EnterAccount;

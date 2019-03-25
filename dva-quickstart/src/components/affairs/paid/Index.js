/**
 * Created by ziyu on 17/3/10.
 */
import React, { Component } from "react";
import moment from "moment";
import { Table, Button, message } from "antd";
import Search from "../../common/components/Search";
import Pannel from "../../common/components/Pannel";
import searchStyle from "../../common/less/search.less";
import { fetchPost } from "../../../utils/request";
class Paid extends Component {
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
        findtype: "",
        inputValue: "",
        applyEndDate: moment()
          .add("days", 1)
          .format("YYYY-MM-DD")
      },
      page: {
        currentPage: 1,
        pageSize: 20,
        totalCount: 0
      },
      searchParams: {
        list: [
          {
            type: "buttonRadio",
            key: "paidStatus",
            className: "pr20",
            values: [{ name: "全部", value: "" }]
          },
          {
            name: "申请时间",
            type: "range",
            key: ["applyStartDate", "applyEndDate"],
            className: "pr20",
            placeHolder: "",
            values: [moment().subtract("days", 7), moment().add("days", 1)]
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
        api: "/finance/query"
      }
    };
  }

  componentDidMount() {
    this.getData();
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
          `/finance/paying/list?currentPage=${
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
        fetchPost("/finance/pay/stat", {
          paidStatus: self.state.params.paidStatus
        }).then(res => {
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
                name: "总借款金额",
                value: `${panel.data.item.borrowCapital}元`
              },
              {
                name: "总打款金额",
                value: `${panel.data.item.paidCapital}元`
              }
            ]
          });
        } else {
          this.setState({
            list: [],
            panelParams: [
              {
                name: "总借款金额",
                value: `${panel.data.item.borrowCapital}元`
              },
              {
                name: "总打款金额",
                value: `${panel.data.item.paidCapital}元`
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

  confirmPay(record, type, index) {
    this.state.list[index].disabled = true;
    this.setState({
      list: this.state.list
    });

    if (type === "lianlian") {
      fetchPost(`/pay/${record.id}/lianlianPaid`).then(res => {
        if (res.code === 0) {
          this.getData();
        } else {
          message.error(res.msg);
          this.getData();
        }
      });
    } else if (type === "koudai") {
      fetchPost(`/pay/${record.id}/koudayPaid`).then(res => {
        if (res.code === 0) {
          this.getData();
        } else {
          message.error(res.msg);
          this.getData();
        }
      });
    }
  }

  changeParams(params) {
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
        title: "申请时间",
        key: "createdDate",
        dataIndex: "createdDate"
      },
      {
        title: "审核通过时间",
        key: "verifiedDate",
        dataIndex: "verifiedDate"
      },
      {
        title: "姓名",
        key: "name",
        dataIndex: "name"
      },
      {
        title: "手机号",
        key: "mobile",
        dataIndex: "mobile"
      },
      {
        title: "借款金额/周期",
        key: "duration",
        dataIndex: "duration",
        render: (text, record) => (
          <div>{`${record.realCapital}/${record.duration}`}</div>
        )
      },
      {
        title: "打款金额",
        key: "capital",
        dataIndex: "capital"
      },
      {
        title: "开户行",
        key: "bankName",
        dataIndex: "bankName"
      },
      {
        title: "银行卡号",
        key: "bankCardNo",
        dataIndex: "bankCardNo"
      },
      {
        title: "参考信息",
        key: "info",
        dataIndex: "info",
        render: (text, record) => {
          if (this.state.params.paidStatus == -1) {
            return <span className="color-warning">{record.info}</span>;
          } else {
            return <span>{record.info}</span>;
          }
        }
      },
      {
        title: "操作",
        key: "",
        width: "20%",
        className: "text-center",
        dataIndex: "",
        render: (text, record, index) => {
          if (this.state.params.paidStatus !== "-1") {
            return (
              <div>
                <Button
                  disabled={record.disabled}
                  type="primary"
                  onClick={() => {
                    this.confirmPay(record, "lianlian", index);
                  }}
                >
                  连连打款
                </Button>
                <Button
                  disabled={record.disabled}
                  className="ml5"
                  type="default"
                  onClick={() => {
                    this.confirmPay(record, "koudai", index);
                  }}
                >
                  口袋打款
                </Button>
              </div>
            );
          }
        }
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
        <div className={searchStyle.searchClass}>
          <Search
            searchParams={this.state.searchParams}
            changeParams={params => this.changeParams(params)}
            showAllReview={this.state.showAllReview}
          />
        </div>

        <div className="mt20">
          <Pannel panelParams={this.state.panelParams} />
        </div>

        <Table
          pagination={pagination}
          size="small"
          key="name"
          columns={columns}
          dataSource={this.state.list}
          loading={this.state.loading}
          bordered
        />
      </div>
    );
  }
}

export default Paid;

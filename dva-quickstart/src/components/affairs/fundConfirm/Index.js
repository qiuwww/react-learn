/**
 * Created by ziyu on 17/3/10.
 */
/**
 * Created by ziyu on 17/3/10.
 */
import React, { Component } from "react";
import { Popconfirm, Table, Button, message } from "antd";
import Search from "../../common/components/Search";
import Pannel from "../../common/components/Pannel";
import searchStyle from "../../common/less/search.less";
import { fetchPost } from "../../../utils/request";

class FundConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      params: {
        findtype: "",
        inputValue: ""
      },
      panelParams: [],
      page: {
        currentPage: 1,
        pageSize: 20,
        totalCount: 0
      },
      searchParams: {
        list: [
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
          `/finance/payed/list?currentPage=${
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
        fetchPost("/finance/pay/stat", { paidStatus: 1 }).then(res => {
          if (res.code === 0) {
            resolve(res);
          } else {
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
            page: {
              ...this.state.page,
              totalCount: list.data.page.totalCount || 0
            },
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

  queryInfo(record) {
    fetchPost(`/pay/${record.id}/paidQuery`).then(res => {
      if (res.code === 0) {
        message.success(res.msg);
        this.getData();
      } else {
        message.error(res.msg);
      }
    });
    // switch (record.paidChannel) {
    //   case 1:
    //     fetchPost(`/pay/${record.userId}/${record.id}/fcPaidQuery`).then((res) => {
    //       if(res.code === 0) {
    //         message.success(res.msg)
    //         this.getData();
    //       } else {
    //         message.error(res.msg)
    //       }
    //     });
    //     break;
    //   case 2:
    //     fetchPost(`/pay/${record.id}/lianlianPaidQuery`).then((res) => {
    //       if(res.code === 0) {
    //         message.success(res.msg)
    //         this.getData();
    //       } else {
    //         message.error(res.msg)
    //       }
    //     });
    //     break;
    //   case 3:
    //     fetchPost(`/pay/${record.userId}/${record.id}/koudayPaidQuery`).then((res) => {
    //       if(res.code === 0) {
    //         message.success(res.msg)
    //         this.getData();
    //       } else {
    //         message.error(res.msg)
    //       }
    //     });
    //     break;
    //   default:
    // }
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
        title: "打款人",
        key: "paidBy",
        dataIndex: "paidBy"
      },
      {
        title: "打款时间",
        key: "paidDate",
        dataIndex: "paidDate"
      },
      {
        title: "姓名",
        dataIndex: "name",
        key: "name"
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
        dataIndex: "bankName",
        key: "bankName"
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
        render: (text, record, index) => {
          // switch (record.paidChannel) {
          //   case 1:
          //     return (
          //       <div>
          //         <span>{record.info}</span>
          //         <Button className="ml10" type="default" onClick={()=>{this.queryInfo(record)}}>51查询</Button>
          //       </div>
          //     )
          //   case 2:
          //     return (
          //       <div>
          //         <span>{record.info}</span>
          //         <Button className="ml10" type="primary" onClick={()=>{this.queryInfo(record)}}>连连查询</Button>
          //       </div>
          //     )
          //   case 3:
          //     return (
          //       <div>
          //         <span>{record.info}</span>
          //         <Button className="ml10" type="primary" onClick={()=>{this.queryInfo(record)}}>口袋查询</Button>
          //       </div>
          //     )
          // }
          return (
            <div>
              <span>{record.info}</span>
              <Button
                className="ml10"
                type="primary"
                onClick={() => {
                  this.queryInfo(record);
                }}
              >
                打款结果查询
              </Button>
            </div>
          );
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

export default FundConfirm;

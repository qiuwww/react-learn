/**
 * @author lianPf
 * @date 2017-11-14
 * */

import React, { Component } from "react";
import moment from "moment";
import { Table, Button, Modal, message } from "antd";
import Styles from "./index.less";
import UpdateModal from "./updateModal";
import Search from "../../common/components/Search";
import searchStyle from "../../common/less/search.less";
import { fetchPost } from "../../../utils/request";

const confirm = Modal.confirm;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: {
        totalCount: 0,
        pageSize: 10,
        currentPage: 1
      },
      updateModalState: {
        visible: false
      },
      params: {
        startDate: moment()
          .subtract("days", 6)
          .format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD"),
        fundSite: ""
      },
      inputRecordData: [],
      searchParams: {
        list: [
          {
            name: "资方",
            type: "select",
            key: "allOfflineFundSites",
            className: "pr20",
            values: [{ value: "", name: "请选择" }]
          },
          {
            name: "打款日",
            type: "range",
            key: ["startDate", "endDate"],
            className: "pr20",
            placeHolder: "",
            values: [moment().subtract("days", 6), moment().add("days", 0)]
          },
          {
            name: "",
            type: "searchBtn",
            key: "",
            className: "pr20",
            value: []
          }
        ],
        api: "/settle/fund/query"
      }
    };

    this.sendParamsUpdate = this.sendParamsUpdate.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    const { params, page } = this.state;
    let { inputRecordData } = this.state;
    let { currentPage, pageSize, totalCount } = page;

    fetchPost(
      `/settle/fund/listManualRecord?currentPage=${currentPage}&pageSize=${pageSize}`,
      params
    ).then(res => {
      if (res.code === 0) {
        // 数据请求成功
        if (res.data !== null) {
          inputRecordData = res.data.data;
          currentPage = res.data.page.currentPage;
          pageSize = res.data.page.pageSize;
          totalCount = res.data.page.totalCount;

          this.setState({
            inputRecordData,
            page: {
              currentPage,
              pageSize,
              totalCount
            }
          });
        }
      } else {
        // 数据获取失败
        message.error(res.msg);
      }
    });
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
    console.log("--changeParams-搜索--", params);
    const { allOfflineFundSites, startDate, endDate } = params;
    this.setState({
      params: {
        ...this.state.params,
        fundSite: allOfflineFundSites,
        startDate,
        endDate
      }
    });
  }

  searchFunc(params) {
    const { allOfflineFundSites, startDate, endDate } = params;
    this.setState(
      {
        params: {
          ...this.state.params,
          fundSite: allOfflineFundSites,
          startDate,
          endDate
        },
        expandedRowKeysData: []
      },
      () => {
        this.getData();
      }
    );
  }

  updateHandInputItem(item) {
    // console.log('--修改--', item);
    const visible = true;
    this.setState(
      {
        updateModalState: {
          ...this.state.updateModalState,
          ...item,
          visible
        }
      },
      () => {
        // console.log('--修改-after--', this.state.updateModalState);
      }
    );
  }
  sendParamsUpdate(params) {
    const {
      btnType,
      id,
      repaymentDate,
      capital,
      interest,
      managerFee,
      extraInfo
    } = params;
    console.log("--sendParamsUpdate-params--", params);
    this.setState(
      {
        updateModalState: {
          ...this.state.updateModalState,
          visible: false
        }
      },
      () => {
        if (btnType === 0) {
          // update modal OK
          const _params = {
            id,
            repaymentDate,
            capital,
            interest,
            managerFee,
            extraInfo
          };
          console.log("--params-jsonString--", JSON.stringify(_params));
          fetchPost(`/settle/fund/updateManualRecord`, _params).then(res => {
            if (res.code === 0) {
              // 数据请求成功
              message.info(res.msg);
              this.getData();
              this.clearUpdateModalState();
            } else {
              // 数据获取失败
              message.error(res.msg);
            }
          });
        } else {
          // update modal cancel
          this.clearUpdateModalState();
        }
      }
    );
  }
  clearUpdateModalState() {
    this.setState({
      updateModalState: {
        visible: false,
        id: "",
        repaymentDate: "",
        capital: "",
        interest: "",
        totalManagerFee: "",
        extraInfo: ""
      }
    });
  }

  inputRecordDeleteClick(record) {
    const self = this;
    confirm({
      title: "确认删除?",
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      width: "220px",
      onOk() {
        console.log("OK");
        console.log("OK", record);
        const { id } = record;
        fetchPost(`/settle/fund/deleteManualRecord?id=${id}`, {}).then(res => {
          if (res.code === 0) {
            // 数据请求成功
            self.getData();
            message.info(res.msg);
          } else {
            // 数据获取失败
            message.error(res.msg);
          }
        });
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  }

  render() {
    const self = this;
    const columns1 = [
      {
        title: "资方",
        dataIndex: "fundName"
      },
      {
        title: "打款日",
        dataIndex: "loanDate"
      },
      {
        title: "还款日",
        dataIndex: "repaymentDate"
      },
      {
        title: "借款金额",
        dataIndex: "loanAmount"
      },
      {
        title: "期限",
        dataIndex: "loanPeriod"
      },
      {
        title: "应还总额",
        dataIndex: "amount"
      },
      {
        title: "应还本息",
        dataIndex: "capitalAndInterest"
      },
      {
        title: "应还本金",
        dataIndex: "capital"
      },
      {
        title: "应还利息",
        dataIndex: "interest"
      },
      {
        title: "应还服务费",
        dataIndex: "managerFee"
      },
      {
        title: "备注",
        dataIndex: "extraInfo"
      },
      {
        title: "",
        render: record => {
          return (
            <span>
              <a onClick={() => this.updateHandInputItem(record)}>修改</a>
              <span className="ant-divider" />
              <a onClick={() => this.inputRecordDeleteClick(record)}>删除</a>
            </span>
          );
        }
      }
    ];

    const { updateModalState, inputRecordData } = this.state;

    const pagination = {
      current: this.state.page.currentPage,
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
      <div className={Styles.content}>
        <div className={Styles.top}>
          <Search
            searchParams={this.state.searchParams}
            changeParams={params => this.changeParams(params)}
            showAllReview={this.state.showAllReview}
            searchFunc={params => this.searchFunc(params)}
          />
        </div>

        <Table
          bordered
          pagination={pagination}
          columns={columns1}
          dataSource={inputRecordData}
        />

        <UpdateModal
          modalState={updateModalState}
          sendParams={this.sendParamsUpdate}
        />
      </div>
    );
  }
}

export default Index;

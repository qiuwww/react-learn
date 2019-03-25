/**
 * Created by ziyu on 17/3/8.
 */
import React, { Component } from "react";
import { fetchPost } from "../../../utils/request";
import { Table } from "antd";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      params: props.params,
      url: "/audit/manage/info/details",
      page: {
        currentPage: 1,
        pageSize: 13,
        totalCount: 0
      },
      loading: false
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(props) {
    if (
      this.state.params.auditStartDt != props.params.auditStartDt ||
      this.state.params.auditEndDt != props.params.auditEndDt
    ) {
      this.setState(
        {
          params: props.params
        },
        () => {
          this.getData();
        }
      );
    }
  }

  getData() {
    if (this.state.params.auditStartDt && this.state.params.auditEndDt) {
      this.setState({
        loading: true
      });
      fetchPost(this.state.url, this.state.params).then(json => {
        if (json.data.itemList == null) {
          this.setState({
            loading: false,
            list: []
          });
        } else {
          this.setState({
            list: json.data.itemList,
            loading: false
            // page: json.data.page
          });
        }
      });
    } else {
      this.setState({
        list: []
      });
    }
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

  render() {
    const columns = [
      {
        title: "姓名",
        key: "auditor",
        dataIndex: "auditor"
      },
      {
        title: "审核单量",
        key: "auditedCount",
        dataIndex: "auditedCount"
      },
      {
        title: "通过数",
        key: "passCount",
        dataIndex: "passCount"
      },
      {
        title: "拒绝数",
        key: "refusedCount",
        dataIndex: "refusedCount"
      },
      {
        title: "日均审核数",
        key: "averageAuditedCount",
        dataIndex: "averageAuditedCount"
      }
    ];

    return (
      <div>
        <Table
          pagination={false}
          size="small"
          locale={{ emptyText: "请先选择审核时间" }}
          key="auditor"
          columns={columns}
          dataSource={this.state.list}
          loading={this.state.loading}
          bordered
        />
      </div>
    );
  }
}

export default List;

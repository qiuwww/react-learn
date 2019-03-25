/**
 * Created by yujianfu on 2016/11/17.
 */
import React, { Component } from "react";
import { fetchPost } from "../../../utils/request";
import { Table, Card, Button, Icon } from "antd";
import { history } from "../../../utils/config";
import Search from "./Search";
import Detail from "./Detail";
import Styles from "../Index.less";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        name: ""
      },
      data: null,
      activeId: null,
      activeItem: null,
      page: {
        currentPage: 1,
        pageSize: 13
      }
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    fetchPost(
      `/admin/role/list?currentPage=${this.state.page.currentPage}&pageSize=${
        this.state.page.pageSize
      }`,
      this.state.params
    ).then(json => {
      if (json.data != null) {
        let data = json.data.list;
        if (!data.length) {
          this.setState({
            data: null,
            page: {
              currentPage: 1,
              pageSize: 13
            },
            activeItem: null,
            activeId: null
          });
        } else {
          this.setState({
            data,
            page: json.data.page,
            activeItem: data[0],
            activeId: data[0].id
          });
        }
      }
    });
  }

  // 单击行
  handleClickRow(record) {
    this.setState({
      activeId: record.id,
      activeItem: record
    });
  }

  // 单击行 样式改变
  handleChosedRow(itemId) {
    console.log(itemId, this.state.activeId, "rowStyle");
    if (itemId === this.state.activeId) {
      return Styles.activeRow;
    } else {
      return "";
    }
  }

  changeField(value) {
    this.setState(
      {
        params: value
      },
      () => {
        this.getData();
      }
    );
  }

  nextPage(currentPage) {
    this.setState(
      {
        page: {
          ...this.state.page,
          currentPage
        }
      },
      () => {
        this.getData();
      }
    );
  }

  editRole(item = {}) {
    if (item.id) {
      history.push({
        pathname: `/admin/role/edit/${item.id}`,
        state: {
          data: item
        }
      });
    } else {
      history.push({
        pathname: "/admin/role/add"
      });
    }
  }

  render() {
    let self = this;
    const columns = [
      {
        title: "id",
        dataIndex: "id",
        key: "id",
        width: 80
      },
      {
        title: "名称",
        dataIndex: "name",
        key: "name",
        width: 120
      },
      {
        title: "描述",
        dataIndex: "description",
        key: "description"
      },
      {
        title: "操作",
        dataIndex: "",
        key: "",
        render: (text, record) => {
          return (
            <a
              className="operateBtn"
              onClick={() => {
                this.editRole(record);
              }}
              href="javascript:;"
            >
              编辑
            </a>
          );
        }
      }
    ];

    const pagination = {
      total: self.state.page.totalCount,
      pageSize: self.state.page.pageSize,
      showSizeChanger: false,
      showQuickJumper: true,
      showTotal(total) {
        return `总共 ${total} 条`;
      },
      onChange(current) {
        self.nextPage(current);
      }
    };

    return (
      <div>
        <div className={Styles.title}>
          <Icon className={Styles.icon} type="tag-o" />
          角色列表
          <Button
            className="ml20"
            onClick={() => {
              this.editRole();
            }}
            type="primary"
          >
            新增角色
          </Button>
        </div>
        <div className={Styles.searchWrapper}>
          <Search
            changeItem={value => {
              this.changeField(value);
            }}
          />
        </div>
        <div
          style={{
            width: "45%",
            display: "inline-block",
            float: "left",
            background: "#FFFFFF"
          }}
        >
          <Card bodyStyle={{ padding: 0 }} noHovering={true}>
            <Table
              size="small"
              pagination={pagination}
              bordered
              dataSource={this.state.data}
              columns={columns}
              onRowClick={record => this.handleClickRow(record)}
              rowClassName={record => this.handleChosedRow(record.id)}
            />
          </Card>
        </div>

        <div
          style={{
            width: "55%",
            display: "inline-block",
            float: "left",
            paddingLeft: 50
          }}
        >
          <Detail activeItem={this.state.activeItem} />
        </div>
      </div>
    );
  }
}

export default Index;

import React, { Component } from "react";
import Search from "../../common/components/Search";
import { Table, message, Popconfirm, Button, Col, Icon, Tree } from "antd";
import { fetchPost } from "../../../utils/request";
import { history } from "../../../utils/config";
import Style from "../Index.less";
import Detail from "./Detail";
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeId: "",
      activeItem: {},
      searchParams: {
        list: [
          {
            name: "登录名",
            type: "text",
            key: "name",
            className: "pr20",
            values: ""
          },
          {
            name: "中文名",
            type: "text",
            key: "fullName",
            className: "pr20",
            values: ""
          },
          {
            name: "",
            type: "search",
            key: "",
            className: "pr20",
            values: []
          }
        ]
      },
      data: [],
      page: {
        currentPage: 1,
        pageSize: 13
      },
      params: {
        name: "",
        fullName: ""
      }
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    fetchPost(
      `/admin/list?currentPage=${this.state.page.currentPage}&pageSize=${
        this.state.page.pageSize
      }`,
      this.state.params
    ).then(res => {
      if (res.code === 0) {
        if (res.data !== null) {
          let data = res.data.list;
          if (!data.length) {
            this.setState({
              data: null,
              page: {
                currentPage: 1,
                pageSize: 13
              },
              activeId: null,
              activeItem: null
            });
          } else {
            this.setState({
              data,
              page: res.data.page,
              activeId: data[0].id,
              activeItem: data[0]
            });
          }
        }
      } else {
        message.error(res.msg);
      }
    });
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

  forbiddenAdmin(record) {
    fetchPost(`/admin/${record.id}/updateadminstatus`, {
      adminStatus: 1,
      adminId: record.id
    }).then(res => {
      if (res.code === 0) {
        message.success("禁用成功");
        this.getData();
      } else {
        message.error(res.msg);
      }
    });
  }

  editAdmin(item = {}) {
    if (item.id) {
      history.push({
        pathname: `/admin/edit/${item.id}`,
        state: {
          data: item
        }
      });
    } else {
      history.push("/admin/add");
    }
  }

  recoveryAdmin(record) {
    fetchPost(`/admin/${record.id}/updateadminstatus`, {
      adminStatus: 0,
      adminId: record.id
    }).then(res => {
      if (res.code === 0) {
        message.success("恢复成功");
        this.getData();
      } else {
        message.error(res.msg);
      }
    });
  }

  deleteAdmin(item) {
    fetchPost(`/admin/${item.id}/deleteadmin`, { adminId: item.id }).then(
      res => {
        if (res.code === 0) {
          message.success("删除成功");
          this.getData();
        } else {
          message.error(res.msg);
        }
      }
    );
  }

  clickRow(activeItem) {
    this.setState({
      activeItem
    });
  }

  changeRowStyle(record) {
    if (record.id === this.state.activeItem.id) {
      return Style.activeRow;
    } else {
      return "";
    }
  }

  render() {
    let self = this;
    const columns = [
      {
        title: "登陆名",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "中文名",
        dataIndex: "fullName",
        key: "fullName"
      },
      {
        title: "角色",
        dataIndex: "roles",
        key: "roles"
      },
      {
        title: "产品类型",
        dataIndex: "productType",
        key: "productType"
      },
      {
        title: "操作",
        dataIndex: "",
        key: "",
        render: (text, record) => {
          let item = record;
          return (
            <div>
              <a
                className="operateBtn"
                onClick={() => {
                  this.editAdmin(item);
                }}
                href="javascript:;"
              >
                修改
              </a>

              {record.status === 1 ? (
                <span className={Style.forbiddenTip}>已禁用</span>
              ) : (
                <Popconfirm
                  title="确定禁用?"
                  onConfirm={() => {
                    this.forbiddenAdmin(item);
                  }}
                  okText="确定"
                  cancelText="取消"
                >
                  <a className="operateBtn" href="javascript:;">
                    禁用
                  </a>
                </Popconfirm>
              )}

              {record.status === 1 ? (
                <a
                  className="operateBtn"
                  onClick={() => {
                    this.recoveryAdmin(item);
                  }}
                  href="javascript:;"
                >
                  恢复
                </a>
              ) : null}

              <Popconfirm
                title="确定删除?"
                onConfirm={() => {
                  this.deleteAdmin(item);
                }}
                okText="确定"
                cancelText="取消"
              >
                <a className="operateBtn" href="javascript:;">
                  删除
                </a>
              </Popconfirm>
            </div>
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
        <div className={Style.title}>
          <Icon className={Style.icon} type="tag-o" />
          管理员列表
          <Button
            className="ml20"
            onClick={() => {
              this.editAdmin();
            }}
            type="primary"
          >
            新增管理员
          </Button>
        </div>

        <div className="searchWrapper">
          <Search
            changeParams={value => {
              this.changeField(value);
            }}
            searchParams={this.state.searchParams}
          />
        </div>

        <div>
          <Col span={12}>
            <Table
              pagination={pagination}
              key="id"
              columns={columns}
              dataSource={self.state.data}
              loading={self.state.loading}
              bordered
              size="small"
              onRowClick={(record, index) => {
                this.clickRow(record);
              }}
              rowClassName={record => this.changeRowStyle(record)}
            />
          </Col>

          <Col span={12}>
            <div className="pl10">
              <Detail activeItem={this.state.activeItem} />
            </div>
          </Col>
        </div>
      </div>
    );
  }
}

export default Index;

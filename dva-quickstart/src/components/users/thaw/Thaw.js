/**
 * Created by xuxiaoqi on 2017/9/18.
 */

import React, { Component } from "react";
import { Upload, Button, Icon, message, Table, Col } from "antd";
import { fetchPost } from "../../../utils/request";
import { origin } from "../../../utils/config";
import auth from "../../../services/auth";
import styles from "./Index.less";
import Search from "../../common/components/Search";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      list: [],
      searchParams: {
        list: [
          {
            name: "解冻类型",
            type: "select",
            key: "frozenCodeList",
            className: "pr20",
            values: [{ value: "", name: "请选择" }]
          },
          {
            name: "用户类型",
            type: "select",
            key: "appCodeList",
            className: "pr20",
            values: [{ value: "", name: "请选择" }]
          }
        ],
        api: "/user/get/appCode/and/frozenCode"
      }
    };
  }

  componentDidMount() {}

  handleUpload(info) {
    if (info) {
      let fileList = info.fileList;
      fileList = fileList.slice(-1);
      this.setState({ fileList });
      if (info.file.status === "done") {
        let code = info.file.response.code;
        if (code === 0) {
          message.success("解冻成功");
          this.setState({
            list: info.file.response.data.userList
          });
        } else {
          this.setState({
            list: []
          });
          message.error(info.file.response.msg);
        }
      }
    }
  }

  changeParams(params) {
    console.log(params, "params");
    this.setState({
      frozenCode: params.frozenCodeList,
      appCode: params.appCodeList
    });
  }

  beforeUpload(file) {
    if (!this.state.frozenCode || !this.state.appCode) {
      message.error("请先选择解冻类型和产品类型!");
      return false;
    }
  }

  render() {
    const accessToken = auth.getToken();

    const columns = [
      {
        title: "手机号",
        dataIndex: "mobile",
        key: "mobile",
        render: (text, record) => (
          <span className="clr-error" style={{ color: "red" }}>
            {record.mobile}
          </span>
        )
      }
    ];
    let headers = {
      productCategory: sessionStorage.getItem("productCategory"),
      accessToken: accessToken
    };
    let header = JSON.stringify(headers);
    const uploadProps = {
      action: `${origin}/user/${this.state.frozenCode}/${
        this.state.appCode
      }/thawuser/by/mobile`,
      onChange: this.handleUpload.bind(this),
      headers: headers,

      defaultFileList: [...this.state.fileList],
      fileList: this.state.fileList,
      name: "mFile"
    };
    return (
      <div className={styles.wrapper}>
        <div className={styles.titleWrap}>
          <span className={styles.title}>
            <Icon type="tag" />
            解冻用户
          </span>
          <Search
            searchParams={this.state.searchParams}
            changeParams={params => this.changeParams(params)}
          />
          <span className="ml10">
            <Upload
              {...uploadProps}
              beforeUpload={file => this.beforeUpload(file)}
            >
              <Button>
                <Icon type="upload" /> upload
              </Button>
            </Upload>
          </span>
        </div>

        <Col span={12} className={styles.failContent}>
          <Table
            title={() => "解冻失败列表"}
            bordered
            pagination={false}
            dataSource={this.state.list}
            columns={columns}
            style={{ background: "#FFFFFF" }}
          />
        </Col>
      </div>
    );
  }
}

export default Index;

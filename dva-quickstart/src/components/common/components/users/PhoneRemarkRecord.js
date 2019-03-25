/**
 * Created by ziyu on 17/3/13.
 */
import React, { Component } from "react";
import { Table, Card, Icon } from "antd";
import Styles from "../../../finance/common/detail/Index.less";
import { fetchPost } from "../../../../utils/request";

class PhoneRemarkRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.userId,
      loading: false,
      list: [],
      message: "",
      timer: null
    };
  }

  componentWillReceiveProps(props) {
    if (this.state.userId != props.userId) {
      this.setState(
        {
          userId: props.userId
        },
        () => {
          this.getData();
        }
      );
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    this.setState({
      loading: true
    });
    if (this.state.userId) {
      fetchPost(`/audit/user/${this.state.userId}/phone/remark`).then(json => {
        if (json.code === 0) {
          if (json.data != null) {
            this.setState({
              list: json.data.list,
              loading: false
            });
          }
        } else {
          this.setState({
            list: [],
            loading: false,
            message: json.msg
          });
        }
      });
    } else {
      this.setState({
        list: [],
        loading: false
      });
    }
  }

  message() {
    if (this.state.message) {
      this.state.timer = setTimeout(() => {
        this.setState({
          message: ""
        });
      }, 3000);
      return (
        <span className="color-warning warning-animate">
          <Icon type="info-circle-o" /> {this.state.message}
        </span>
      );
    } else {
      return "";
    }
  }

  componentWillUnmount() {
    clearTimeout(this.state.timer);
  }

  render() {
    const columns = [
      {
        title: "操作人",
        dataIndex: "auditor",
        key: "auditor"
      },
      {
        title: "操作时间",
        dataIndex: "promisePayDate",
        key: "promisePayDate"
      },
      {
        title: "姓名",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "电话",
        dataIndex: "mobile",
        key: "mobile"
      },
      {
        title: "关系",
        dataIndex: "relation",
        key: "relation"
      },
      {
        title: "操作内容",
        dataIndex: "content",
        key: "content"
      }
    ];

    return (
      <div className={Styles.PhoneRemarkRecord}>
        <Card
          title="信审备注记录"
          extra={this.message()}
          bodyStyle={{ padding: 1 }}
          noHovering={true}
        >
          <Table
            pagination={false}
            size="small"
            bordered
            dataSource={this.state.list}
            columns={columns}
            loading={this.state.loading}
          />
        </Card>
      </div>
    );
  }
}

export default PhoneRemarkRecord;

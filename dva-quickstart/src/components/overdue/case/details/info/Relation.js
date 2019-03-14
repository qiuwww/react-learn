/**
 * Created by ziyu on 17/5/15.
 */

import React, { Component, PropTypes } from "react";
import {
  Card,
  Table,
  Icon,
  message,
  Popover,
  Input,
  Button,
  Popconfirm
} from "antd";
import Styles from "../Index.less";
import { fetchPost } from "../../../../../utils/request";

class Relation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.userId,
      data: [
        {
          name: "name0",
          inputName: "inputName0",
          relation: "relation0",
          mobile: "mobile0"
        }
      ],
      message: "",
      timer: null,
      id: props.id,
      item: props.item,
      collectionType: props.collectionType
    };
  }

  componentWillReceiveProps(props) {
    if (this.state.id != props.id) {
      this.setState(
        {
          userId: props.userId,
          id: props.id,
          item: props.item
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

  componentWillUnmount() {
    clearTimeout(this.state.timer);
  }

  getData() {
    if (this.state.userId != null) {
      fetchPost(`/user/${this.state.userId}/contact/info`, {}).then(json => {
        if (json.data != null && json.code === 0) {
          this.setState({
            data: json.data.contacts
          });
        } else {
          this.setState({
            data: [],
            message: json.msg
          });
        }
      });
    } else {
      this.setState({
        data: []
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

  showSend(type, name, relation, mobile) {
    let content = "";
    let buttonContact = "确认";
    if (type == 1 && relation != "本人") {
      return (
        <div style={{ width: 300 }}>
          <Input
            addonBefore="称呼："
            defaultValue={name}
            onBlur={e => {
              name = e.target.value;
            }}
          />
          <Input
            addonBefore="关系："
            defaultValue={relation}
            onBlur={e => {
              relation = e.target.value;
            }}
          />
          <Input
            addonBefore="手机："
            defaultValue={mobile}
            onBlur={e => {
              mobile = e.target.value;
            }}
          />
          <div style={{ overflow: "hidden" }}>
            <Button
              style={{ float: "right" }}
              type="primary"
              size="small"
              onClick={e =>
                this.showContent(type, name, relation, mobile, content)
              }
            >
              {buttonContact}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ width: 300 }}>
        <Input
          addonBefore="称呼："
          defaultValue={name}
          onBlur={e => {
            name = e.target.value;
          }}
        />
        <Input
          addonBefore="关系："
          defaultValue={relation}
          onBlur={e => {
            relation = e.target.value;
          }}
        />
        <Input
          addonBefore="手机："
          defaultValue={mobile}
          onBlur={e => {
            mobile = e.target.value;
          }}
        />
        <Input
          addonBefore="内容："
          type="textarea"
          placeholder="请输入内容"
          onBlur={e => {
            content = e.target.value;
          }}
          autosize={{ minRows: 4, maxRows: 6 }}
        />
        <div style={{ overflow: "hidden" }}>
          <Button
            style={{ float: "right" }}
            type="primary"
            size="small"
            onClick={e =>
              this.showContent(type, name, relation, mobile, content)
            }
          >
            {buttonContact}
          </Button>
        </div>
      </div>
    );
  }

  // 表单提交
  showContent(type, name, relation, mobile, content) {
    if (
      (type == 1 && relation == "本人" && content == "") ||
      (type == 2 && content == "")
    ) {
      message.error("请输入内容");
      return false;
    }

    fetchPost("/collection/comment/add", {
      userCode: this.state.userId,
      tradeNo: this.state.item.tradeNo,
      collectionNo: this.state.item.collectionNo,
      followId: this.state.item.followId,
      followUp: this.state.item.followUp,
      name,
      relation,
      mobile,
      content,
      type
    }).then(json => {
      if (json.code === 0) {
        message.info("添加成功");
        this.props.refreshOverdueRecord();
      } else {
        message.error(json.msg);
      }
    });
  }

  handleOutCall(mobile) {
    // clickOutNum(mobile)
  }
  render() {
    let columns = [];
    if (this.state.collectionType === "0") {
      columns = [
        {
          title: "称谓",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "输入称谓",
          dataIndex: "inputName",
          key: "inputName"
        },
        {
          title: "关系",
          dataIndex: "relation",
          key: "relation"
        },
        {
          title: "电话号码 / 绑定次数",
          dataIndex: "mobile",
          render: (text, record) => (
            <span>
              <Popconfirm
                title="你确定要外呼号码?"
                onConfirm={phone => this.props.outCallDo(record.mobile)}
              >
                <a href="javascript">
                  <font color="red">{record.mobile}</font>
                </a>
              </Popconfirm>
              / {record.bindTimes}
            </span>
          )
        },
        {
          title: "电话",
          render: record => {
            return (
              <Popover
                key={Math.random()
                  .toString(16)
                  .substring(2)}
                content={this.showSend(
                  2,
                  record.name,
                  record.relation,
                  record.mobile
                )}
                title="电话内容"
                trigger="click"
              >
                <Button type="primary" size="small">
                  催记
                </Button>
              </Popover>
            );
          }
        }
        // {
        //   title: '短信通知',
        //   render: (record) => {
        //     return (
        //       <Popover key={Math.random().toString(16).substring(2)}
        //                content={this.showSend(1, record.name, record.relation,
        //                  record.mobile)}
        //                title='短信内容'
        //                trigger='click'
        //       >
        //         <Button type='primary' size='small'>短信通知</Button>
        //       </Popover>
        //     )
        //   },
        // },
      ];
    } else {
      columns = [
        {
          title: "称谓",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "输入称谓",
          dataIndex: "inputName",
          key: "inputName"
        },
        {
          title: "关系",
          dataIndex: "relation",
          key: "relation"
        },
        {
          title: "电话号码 / 绑定次数",
          dataIndex: "mobile",
          render: (text, record) => (
            <span>
              <Popconfirm
                title="你确定要外呼号码?"
                onConfirm={phone => this.props.outCallDo(record.mobile)}
              >
                <a href="javascript">
                  <font color="red">{record.mobile}</font>
                </a>
              </Popconfirm>
              / {record.bindTimes}
            </span>
          )
        },
        {
          title: "电话",
          render: record => {
            return (
              <Popover
                key={Math.random()
                  .toString(16)
                  .substring(2)}
                content={this.showSend(
                  2,
                  record.name,
                  record.relation,
                  record.mobile
                )}
                title="电话内容"
                trigger="click"
              >
                <Button type="primary" size="small">
                  催记
                </Button>
              </Popover>
            );
          }
        }
      ];
    }

    return (
      <div className={Styles.detailModule}>
        <Card
          title="社会关系(紧急联系人)"
          extra={this.message()}
          bodyStyle={{ padding: 0, height: 186, overflowY: scroll }}
          noHovering={true}
        >
          <Table
            size="small"
            pagination={false}
            bordered
            dataSource={this.state.data}
            columns={columns}
            key="name"
          />
        </Card>
      </div>
    );
  }
}

export default Relation;

import React, { Component } from "react";
import {
  Tabs,
  Card,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Col
} from "antd";
import Info from "./info/Info";
import CollectionRecord from "../../../common/components/users/CollectionRecord";
import BorrowRecord from "../../../common/components/users/BorrowRecord";
import CheckRecord from "../../../common/components/users/CheckRecord";
import PhoneRemarkRecord from "../../../common/components/users/PhoneRemarkRecord";
import Risk from "./risk/Risk";
import Contacts from "../../../common/components/users/Contacts";
import Carrier from "../../../common/components/users/Carrier";
import FacePhoto from "../../../common/components/users/Photos";
import Relation from "../../../common/components/users/Relation";
import Styles from "./Index.less";
import { fetchPost } from "../../../../utils/request";

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const CheckableTag = Tag.CheckableTag;

class UncontrolledCheckableTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activity: props.activity
    };
  }

  componentWillReceiveProps(props) {
    if (props.activity != this.state.activity) {
      this.setState({
        activity: props.activity
      });
    }
  }

  handleChange(activity) {
    this.setState({
      activity: !this.state.activity
    });
    this.props.chooseTag(activity);
  }

  render() {
    return (
      <CheckableTag
        checked={this.state.activity}
        onChange={this.handleChange.bind(this)}
      >
        {this.props.tagName}
      </CheckableTag>
    );
  }
}

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      userId: props.userId,
      activeKey: props.activeKey,
      item: props.item,
      showDetail: true,
      stepType: props.stepType,
      visible: false,
      processNode: props.processNode,
      tagData: [],
      tagIDs: {},
      managerInfo: {
        finish: "",
        remain: ""
      },
      currentType: ""
    };
  }

  componentDidMount() {
    console.log(111, this.state.item);
    this.getData();
  }

  getData() {
    let self = this;
    if (this.state.userId != null) {
      function getTags() {
        return new Promise((resolve, reject) => {
          fetchPost(
            `/audit/usertag/${self.state.userId}/${
              self.state.processNode
            }/query`
          ).then(res => {
            if (res.code === 0) {
              if (res.data.list != null) {
                resolve(res);
              } else {
                reject("");
              }
            } else {
              message.error(res.msg);
              reject(res);
            }
          });
        });
      }

      // function getManagerInfo() {
      //   return new Promise((resolve, reject) => {
      //     fetchPost(`/audit/usertag/${self.state.userId}/query`).then((res) => {
      //       if(res.code === 0) {
      //         resolve(res)
      //       } else {
      //         message.error(res.msg)
      //         reject(res)
      //       }
      //     })
      //   })
      // }

      Promise.all([getTags()]).then(res => {
        let [resTags, resManagerInfo] = [res[0], res[1]];
        resTags.data.list.forEach((value, index) => {
          value.childList.forEach((val, ind) => {
            if (val.activity) {
              this.state.tagIDs[val.tagId] = true;
            }
          });
        });

        self.setState({
          tagData: resTags.data.list || [],
          managerInfo: {
            remain: "",
            finish: ""
          }
        });
      });
    }
  }

  componentWillReceiveProps(props) {
    if (this.state.id != props.id || this.state.userId != props.userId) {
      this.setState(
        {
          id: props.id,
          activeKey: props.activeKey,
          userId: props.userId,
          stepType: props.stepType,
          item: props.item
        },
        () => {
          this.getData();
        }
      );
    }
  }

  onChange(activeKey) {
    this.setState({ activeKey });
  }

  changeOrder(type, id) {
    this.props.changeOrder(type, id);
  }

  changeModal() {
    this.setState({
      visible: !this.state.visible
    });
  }

  operation(type) {
    this.setState(
      {
        currentType: type
      },
      () => {
        // this.state.currentType = type;
        console.log(this.state.currentType, "this.state.currentType");
        let reason = this.props.form.getFieldValue("checkReason");
        let self = this;
        let tagIdList = [];
        for (let i in this.state.tagIDs) {
          tagIdList.push(i);
        }
        if (!reason && this.state.currentType == "refuse") {
          message.info("请输入原因");
          return false;
        }

        this.props.form.validateFields((errors, values) => {
          if (!errors) {
            let operationParams = {
              auditNo: this.state.id,
              message: reason,
              userCode: this.state.userId,
              processNode: this.state.processNode,
              tagIdList
            };

            switch (type) {
              case "pass":
                if (this.state.processNode === "1") {
                  fetchPost("/audit/operate/skippass", {
                    ...operationParams,
                    targetNode: 3
                  }).then(json => {
                    if (json.code === 0) {
                      self.clearReason();
                      this.state.tagIDs = {};
                      self.changeOrder("pass", self.state.id);
                      message.success("操作成功");
                    } else {
                      message.error(json.msg);
                    }
                  });
                } else {
                  fetchPost("/audit/operate/pass", operationParams).then(
                    json => {
                      if (json.code === 0) {
                        self.clearReason();
                        this.state.tagIDs = {};
                        self.changeOrder("pass", self.state.id);
                        message.success("操作成功");
                      } else {
                        message.error(json.msg);
                      }
                    }
                  );
                }

                break;

              case "directPass":
                fetchPost("/audit/operate/skippass", {
                  ...operationParams,
                  targetNode: 4
                }).then(json => {
                  if (json.code === 0) {
                    self.clearReason();
                    this.state.tagIDs = {};
                    self.changeOrder("pass", self.state.id);
                    message.success("操作成功");
                  } else {
                    message.error(json.msg);
                  }
                });
                break;

              case "wait":
                fetchPost("/audit/operate/pass", operationParams).then(json => {
                  if (json.code === 0) {
                    self.clearReason();
                    self.changeOrder("wait", self.state.id);
                    this.state.tagIDs = {};
                    message.success("操作成功");
                  } else {
                    message.error(json.msg);
                  }
                });
                break;

              case "refuse":
                fetchPost("/audit/operate/refuse", operationParams).then(
                  json => {
                    if (json.code === 0) {
                      self.clearReason();
                      self.changeOrder("refuse", self.state.id);
                      this.state.tagIDs = {};
                      message.success("操作成功");
                    } else {
                      message.error(json.msg);
                    }
                  }
                );
                break;

              default:
            }
          }
        });
      }
    );
  }

  clearReason() {
    this.props.form.setFieldsValue({
      checkReason: ""
    });
    this.setState(
      {
        visible: false,
        tagIDs: {}
      },
      () => {
        this.getData();
      }
    );
  }

  extraContent() {
    return (
      <span>
        {this.state.managerInfo.finish ? (
          <span className="ml10">
            {" "}
            已完成:
            <span className="color-main">
              {`${this.state.managerInfo.finish}单`}
            </span>
          </span>
        ) : (
          ""
        )}

        {this.state.managerInfo.remain ? (
          <span className="ml10">
            {" "}
            剩余:
            <span className="color-main">
              {`${this.state.managerInfo.remain}单`}
            </span>
          </span>
        ) : (
          ""
        )}

        <span className="ml10">
          {" "}
          交易号:{" "}
          <span className="color-main">{this.state.item.tradeNo || ""}</span>
        </span>
        <span className="ml10 mr10">
          {" "}
          借款金额/周期:
          <span className="color-main">
            {`${this.state.item.realCapital || ""}元/${this.state.item
              .productDuration || ""}`}
          </span>
        </span>
        {this.state.stepType !== "passOrder" &&
        this.state.stepType !== "refuseOrder" &&
        this.state.userId ? (
          <Button type="primary" onClick={this.changeModal.bind(this)}>
            操作
          </Button>
        ) : null}
      </span>
    );
  }

  chooseTag(activity, id, name) {
    let self = this;
    let form = this.props.form;
    this.state.tagData.forEach((value, index) => {
      value.childList.forEach((val, ind) => {
        if (val.tagId == id) {
          val.activity = activity;
        }
      });
    });

    this.setState({
      tagData: this.state.tagData || []
    });

    if (activity) {
      this.state.tagIDs[id] = true;
      if (form.getFieldValue("checkReason")) {
        form.setFieldsValue({
          checkReason: `${self.props.form.getFieldValue("checkReason") + name};`
        });
      } else {
        form.setFieldsValue({
          checkReason: `${name};`
        });
      }
    } else {
      let beforeReason = self.props.form.getFieldValue("checkReason");
      let currentReason = beforeReason.replace(new RegExp(`${name};`, "g"), "");
      form.setFieldsValue({
        checkReason: currentReason
      });
      delete this.state.tagIDs[id];
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Modal
          visible={this.state.visible}
          onOk={this.clearReason.bind(this)}
          onCancel={this.clearReason.bind(this)}
          footer={null}
        >
          <Form>
            <FormItem className={Styles.operationHeader}>
              <span className={Styles.title}>订单审核操作</span>

              {this.state.processNode !== "2" &&
              this.state.processNode !== "3" ? (
                <Popconfirm
                  placement="top"
                  title="确认通过到照片审核?"
                  onConfirm={() => {
                    this.operation("pass");
                  }}
                >
                  <Button type="primary" className="ml20">
                    照片审核
                  </Button>
                </Popconfirm>
              ) : (
                ""
              )}

              {this.state.processNode === "2" ||
              this.state.processNode === "3" ? (
                <Popconfirm
                  placement="top"
                  title="确认通过?"
                  onConfirm={() => {
                    this.operation("pass");
                  }}
                >
                  <Button type="primary" className="ml20">
                    通过
                  </Button>
                </Popconfirm>
              ) : (
                ""
              )}

              {this.state.processNode !== "2" &&
              this.state.processNode !== "3" ? (
                <Popconfirm
                  placement="top"
                  title="确认等待电审?"
                  onConfirm={() => {
                    this.operation("wait");
                  }}
                >
                  <Button type="default" className="ml10">
                    等待电审
                  </Button>
                </Popconfirm>
              ) : (
                ""
              )}

              <Popconfirm
                placement="top"
                title="确认拒绝?"
                onConfirm={() => {
                  this.operation("refuse");
                }}
              >
                <Button type="default" className="ml10">
                  拒绝
                </Button>
              </Popconfirm>

              <Popconfirm
                placement="top"
                title="确认直接全部通过?"
                onConfirm={() => {
                  this.operation("directPass");
                }}
              >
                <Button type="primary" className="ml10">
                  直接全部通过
                </Button>
              </Popconfirm>
            </FormItem>

            <FormItem>
              {getFieldDecorator("checkReason", {
                rules: [
                  {
                    required: this.state.currentType == "refuse" ? true : false,
                    message: "请输入原因"
                  }
                ]
              })(
                <Input
                  placeholder="请输入原因"
                  className="mh150"
                  type="textarea"
                />
              )}
            </FormItem>
          </Form>

          <Card noHovering={true}>
            {this.state.tagData.map((cate, index) => (
              <div key={index}>
                <span className="font13 color-main">{cate.typeName}</span>:
                <br />
                {cate.childList.map((tag, index) => (
                  <UncontrolledCheckableTag
                    key={index}
                    chooseTag={activity =>
                      this.chooseTag(activity, tag.tagId, tag.name)
                    }
                    tagName={tag.name}
                    activity={tag.activity}
                  />
                ))}
              </div>
            ))}
          </Card>
        </Modal>

        <div className={Styles.hideScroll}>
          <Card bodyStyle={{ padding: 0 }} bordered={false} noHovering={true}>
            <div className="">
              <Tabs
                className={Styles.tabs}
                activeKey={this.state.activeKey}
                onChange={e => this.onChange(e)}
                tabBarExtraContent={this.extraContent()}
              >
                <TabPane tab="个人信息 / 通讯录" key="detail">
                  {this.state.activeKey === "detail" ? (
                    <div className={Styles.tabsWrapper}>
                      {
                        <Col span={14}>
                          <Card
                            title=""
                            bodyStyle={{ padding: "5px" }}
                            noHovering={true}
                          >
                            <Info
                              id={this.state.id}
                              userId={this.state.userId}
                              item={this.state.item}
                              tradeNo={this.state.item.tradeNo}
                            />
                          </Card>
                        </Col>
                      }

                      <Col span={10}>
                        <Card
                          title="通讯录"
                          bodyStyle={{ padding: "5px" }}
                          noHovering={true}
                        >
                          <Relation
                            id={this.state.id}
                            userId={this.state.userId}
                          />
                          <Contacts
                            id={this.state.id}
                            userId={this.state.userId}
                          />
                        </Card>
                      </Col>
                    </div>
                  ) : (
                    <span />
                  )}
                </TabPane>

                <TabPane tab="运营商 / 风控 / 照片/数据" key="carrier">
                  {this.state.activeKey === "carrier" ? (
                    <div className={Styles.tabsWrapper}>
                      <br />
                      <Col span={12}>
                        <Carrier userId={this.state.userId} />
                      </Col>
                      <Col span={12}>
                        <Risk
                          item={this.state.item}
                          userId={this.state.userId}
                          id={this.state.id}
                        />
                        <FacePhoto
                          userId={this.state.userId}
                          tradeNo={this.state.item.tradeNo}
                        />
                      </Col>
                    </div>
                  ) : (
                    <span />
                  )}
                </TabPane>

                <TabPane tab="借款记录 / 催收记录" key="records">
                  {this.state.activeKey === "records" ? (
                    <div className={Styles.tabsWrapper}>
                      <BorrowRecord userId={this.state.userId} />
                      <br />
                      <CollectionRecord userId={this.state.userId} />
                      <br />
                      <CheckRecord
                        userId={this.state.userId}
                        tradeNo={this.state.item.tradeNo}
                      />
                      <br />
                      <PhoneRemarkRecord userId={this.state.userId} />
                    </div>
                  ) : (
                    <span />
                  )}
                </TabPane>
              </Tabs>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}

Detail = Form.create()(Detail);

export default Detail;

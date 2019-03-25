import React, { Component } from "react";
import { Form, Input, Button, Select, message, Icon, Row, Col } from "antd";
import Style from "../Index.less";
import { fetchPost } from "../../../utils/request";
import { history } from "../../../utils/config";
import Title from "../../common/components/Title";
const FormItem = Form.Item;
const Option = Select.Option;
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: [],
      data: {},
      isEdit: false,
      productList: [],
      sdzzProductListData: [],
      sdzzProductList: [],
      sdzzProductSelectState: "none",
      sdzzProductRequireState: false,
      selectedRoles: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.params.id) {
      console.log(
        this.props.location.state.data,
        "this.props.location.state.data"
      );
      let rolesS = this.props.location.state.data.roleIds;
      let roles = trimSpace(rolesS);
      this.setState(
        {
          data: this.props.location.state.data,
          isEdit: true,
          selectedRoles: roles
        },
        () => {
          console.log(this.state.selectedRoles, "");
        }
      );
    }
    function trimSpace(array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] !== "" || typeof array[i] !== "undefined") {
          array[i] = "" + array[i] + "";
        }
      }
      return array;
    }
    this.getRoles();
    this.getProductType();
    this.getSdzzProductType();
  }

  getRoles() {
    fetchPost("/admin/role/list?currentPage=1&pageSize=500", {}).then(json => {
      let data = json.data.list;
      this.setState({
        roles: data
      });
    });
  }

  getProductType() {
    fetchPost("/admin/producttype/list", {}).then(res => {
      if (res.code === 0) {
        let list = res.data.list;
        if (list.length) {
          list.unshift({
            code: "all",
            name: "通用"
          });
          this.setState({
            productList: list
          });
        }
      }
    });
  }

  getSdzzProductType() {
    fetchPost("/admin/sdzzproduct/list", {}).then(res => {
      if (res.code === 0) {
        let list = res.data.list;
        if (list.length) {
          this.setState({
            sdzzProductListData: list
          });
        }
      }
    });
  }

  getRoleOptions() {
    let roles = this.state.roles;
    let options = [];
    if (roles !== null) {
      roles.map(function(role) {
        options.push(<Option key={role.id}>{role.name}</Option>);
      });
      return options;
    }
  }

  handleChange(event) {
    // console.log('--handleChange--', event)
    let {
      sdzzProductList,
      sdzzProductListData,
      sdzzProductSelectState,
      sdzzProductRequireState
    } = this.state;
    if (event === "sdzzall" || event === "sdzzold") {
      sdzzProductList = sdzzProductListData;
      sdzzProductSelectState = "";
      sdzzProductRequireState = true;
    } else {
      sdzzProductList = [];
      sdzzProductSelectState = "none";
      sdzzProductRequireState = false;
    }
    this.setState({
      sdzzProductList,
      sdzzProductSelectState,
      sdzzProductRequireState
    });
  }

  handleSubmit() {
    let self = this;
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const {
          name,
          productCode,
          mobilephone,
          fullName,
          roles
        } = this.props.form.getFieldsValue();
        let { productAuthId } = this.props.form.getFieldsValue();
        if (productCode === "sdzzall" || productCode === "sdzzold") {
          if (productAuthId === "全部") {
            productAuthId = 1;
          }
        } else {
          productAuthId = "";
        }
        if (this.state.isEdit) {
          fetchPost(`/admin/${self.props.params.id}/update`, {
            name,
            productCode,
            mobilephone,
            fullName,
            roles,
            productAuthId
          }).then(json => {
            if (json.code === 0) {
              message.success("修改成功");
              history.push("/admin/list");
            } else {
              message.error(json.msg);
            }
          });
        } else {
          // console.log('--111-1-', {name, productCode, mobilephone, fullName, roles, productAuthId});
          fetchPost("/admin/add", {
            name,
            productCode,
            mobilephone,
            fullName,
            roles,
            productAuthId
          }).then(json => {
            if (json.code === 0) {
              message.success("添加成功");
              history.push("/admin/list");
            } else {
              message.error(json.msg);
            }
          });
        }
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Title title={this.state.isEdit ? "编辑管理员" : "新增管理员"} />
        <div className={Style.editAdminWrapper}>
          <Form horizontal>
            <FormItem {...formItemLayout} label="登录名" hasFeedback>
              {getFieldDecorator("name", {
                initialValue: this.state.data.name || "",
                rules: [{ required: true, message: "名称不能为空!" }]
              })(<Input />)}
            </FormItem>

            <FormItem {...formItemLayout} label="中文名" hasFeedback>
              {getFieldDecorator("fullName", {
                initialValue: this.state.data.fullName || "",
                rules: [{ required: true, message: "名称不能为空!" }]
              })(<Input />)}
            </FormItem>

            <FormItem {...formItemLayout} label="手机号" hasFeedback>
              {getFieldDecorator("mobilephone", {
                initialValue: this.state.data.mobilephone || "",
                rules: [{ required: true, message: "手机号不能为空!" }]
              })(<Input />)}
            </FormItem>

            <FormItem {...formItemLayout} label="角色选择">
              {getFieldDecorator("roles", {
                rules: [{ required: true, message: "选择角色", type: "array" }],
                initialValue: this.state.selectedRoles
              })(
                <Select multiple placeholder="选择角色">
                  {this.getRoleOptions()}
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="产品类型">
              <Row gutter={8}>
                <Col span={12}>
                  {getFieldDecorator("productCode", {
                    initialValue:
                      this.state.isEdit && this.state.data.productCode
                        ? this.state.data.productCode.toString()
                        : "all",
                    rules: [{ required: true, message: "产品类型不能为空!" }]
                  })(
                    <Select
                      placeholder="类型"
                      onChange={e => this.handleChange(e)}
                    >
                      {this.state.productList.map((value, index) => (
                        <Option value={value.code} key={value.code}>
                          {value.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Col>
                <Col
                  span={12}
                  style={{ display: this.state.sdzzProductSelectState }}
                >
                  {getFieldDecorator("productAuthId", {
                    initialValue: "全部",
                    rules: [
                      { required: true, message: "详细产品类型不能为空!" }
                    ]
                  })(
                    <Select placeholder="类型">
                      {this.state.sdzzProductList.map((value, index) => (
                        <Option value={value.id} key={value.id}>
                          {value.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Col>
              </Row>
            </FormItem>

            <FormItem wrapperCol={{ span: 12, offset: 6 }}>
              <Button
                type="primary"
                onClick={this.handleSubmit}
                htmlType="submit"
              >
                {this.state.isEdit ? "更改" : "添加"}
              </Button>
              &nbsp;
              <Button type="ghost" onClick={e => this.handleReset(e)}>
                <Icon type="reload" />
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

Index = Form.create()(Index);
export default Index;

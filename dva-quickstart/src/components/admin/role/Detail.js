/**
 * Created by yujianfu on 2016/11/17.
 */
import React, { Component } from "react";
import { Tree, message, Card, Button, Popconfirm } from "antd";
import { fetchPost } from "../../../utils/request";

const TreeNode = Tree.TreeNode;

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      activeItem: {
        id: 0
      },
      expandMenuIds: ["1"],
      checkedKeys: [],
      params: {
        roleId: null,
        menuIds: null
      }
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(props) {
    let activeItem = props.activeItem;
    if (this.state.activeItem.id != activeItem.id) {
      this.setState(
        {
          activeItem
        },
        () => {
          this.getRoleMenuIds(activeItem.id);
        }
      );
    }
  }

  getData() {
    fetchPost("/menu/list", {}).then(json => {
      let data = json.data.list;
      this.setState({
        data: data || []
      });
    });
  }

  getRoleMenuIds(roleId) {
    fetchPost(`/menu/role/${roleId}/ids`, {}).then(json => {
      let data = json.data.list;
      console.log(data, "fetchExpandedKeys");
      this.setState({
        checkedKeys: data || [],
        expandMenuIds: data || []
      });
    });
  }

  onCheck(checkIds) {
    console.log(checkIds, "onCheck");
    let roleId = this.state.activeItem.id;
    this.setState({
      checkedKeys: checkIds,
      expandMenuIds: checkIds,
      params: {
        menuIds: checkIds,
        roleId
      }
    });
  }

  onExpand(checkIds) {
    console.log(checkIds, "onExpand");
    this.setState({
      expandMenuIds: checkIds
    });
  }

  confirm() {
    fetchPost("/permission/role/menu", this.state.params).then(json => {
      if (json.code === 0) {
        message.info("添加成功");
      } else {
        message.error(json.msg);
      }
    });
  }

  createFirstClassTreeNode() {
    let self = this;
    let menus = this.state.data;
    let treeNodes = [];

    menus.map(function(menu) {
      treeNodes.push(
        <TreeNode title={menu.parentName} key={menu.id}>
          {self.createTreeNode(menu.navs)}
        </TreeNode>
      );
    });

    return treeNodes;
  }

  createTreeNode(menus) {
    let self = this;
    if (menus != null && menus.length != 0) {
      let treeNodes = [];
      menus.map(function(menu) {
        treeNodes.push(
          <TreeNode title={menu.key} key={menu.id}>
            {self.createTreeNode(menu.navs)}
          </TreeNode>
        );
      });

      return treeNodes;
    }
  }

  operateBtn() {
    return (
      <Popconfirm
        placement="top"
        title={"确认操作"}
        onConfirm={e => this.confirm(e)}
        okText="是"
        cancelText="否"
      >
        <Button type="primary">赋予/更新权限</Button>
      </Popconfirm>
    );
  }

  render() {
    console.log(this.state.expandMenuIds, "expandKeys");
    return (
      <div>
        <Card title="操作" extra={this.operateBtn()} noHovering={true}>
          <div style={{ overflow: "scroll", background: "#FFFFFF" }}>
            <Tree
              checkable
              checkStrictly
              onCheck={e => this.onCheck(e.checked)}
              onExpand={e => this.onExpand(e)}
              defaultExpandAll
              autoExpandParent
              defaultExpandedKeys={this.state.expandMenuIds}
              expandedKeys={this.state.expandMenuIds}
              checkedKeys={this.state.checkedKeys}
            >
              {this.createFirstClassTreeNode()}
            </Tree>
            <br />
          </div>
        </Card>
      </div>
    );
  }
}

export default Detail;

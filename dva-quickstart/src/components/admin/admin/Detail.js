/**
 * Created by yujianfu on 2016/11/17.
 */
import React, { Component } from "react";
import { Tree, message, Card } from "antd";
import { fetchPost } from "./../../../utils/request";

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
    if (this.state.activeItem.id !== activeItem.id && props.activeItem.id) {
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
    fetchPost("/menu/list", {}).then(res => {
      let data = res.data.list;
      this.setState({
        data: data || []
      });
    });
  }

  getRoleMenuIds(adminId) {
    fetchPost(`/admin/${adminId}/ids`, {}).then(res => {
      if (res.code === 0) {
        let data = res.data.list;
        this.setState({
          checkedKeys: data || [],
          expandMenuIds: data || []
        });
      } else {
        this.setState({
          checkedKeys: [],
          expandMenuIds: []
        });
        message.error(res.msg);
      }
    });
  }

  createFirstClassTreeNode() {
    let self = this;
    let menus = this.state.data;
    let treeNodes = [];

    menus.map(function(menu) {
      treeNodes.push(
        <TreeNode disableCheckbox title={menu.parentName} key={menu.id}>
          {self.createTreeNode(menu.navs)}
        </TreeNode>
      );
    });

    return treeNodes;
  }

  createTreeNode(menus) {
    let self = this;
    if (menus !== null && menus.length) {
      let treeNodes = [];
      menus.map(function(menu) {
        treeNodes.push(
          <TreeNode disableCheckbox title={menu.key} key={menu.id}>
            {self.createTreeNode(menu.navs)}
          </TreeNode>
        );
      });

      return treeNodes;
    }
  }

  render() {
    return (
      <div>
        <Card title="权限" noHovering={true}>
          <div style={{ overflow: "scroll", background: "#FFFFFF" }}>
            <Tree
              checkable
              checkStrictly
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

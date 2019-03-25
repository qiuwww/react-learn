import React, { Component } from "react";
import { Link } from "dva/router";
import { Menu, Icon } from "antd";
import { history } from "../../utils/config";
import { connect } from "dva";
const SubMenu = Menu.SubMenu;

class SiderParent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "inline",
      menus: [],
      defaultOpenKeys: [],
      activeModule: null,
      urlValue: "",
      defaultSelectedKeys: [],
      showIndex: false
    };
  }

  componentWillReceiveProps(props) {
    if (this.state.activeModule !== props.activeModule) {
      this.setState(
        {
          activeModule: props.activeModule,
          menus: props.menus,
          defaultOpenKeys: [],
          defaultSelectedKeys: []
        },
        () => {
          this.clickSwitchPage();
        }
      );
    }
  }

  clickSwitchPage() {
    let [self, activeModule, firstUrl, key] = [
      this,
      this.state.activeModule,
      null,
      null
    ];
    if (this.state.menus) {
      this.state.menus.map(function(menu) {
        if (menu.parentName === activeModule) {
          firstUrl = self.getLinkUrl(menu.navs);
        }
      });
    }

    self.setState(
      {
        urlValue: firstUrl
      },
      () => {
        let saveUrl = sessionStorage.getItem("saveUrl");
        if (this.props.isFromHome) {
          history.replace(`/${firstUrl}`);
          this.getUrl({ key: firstUrl });
          sessionStorage.setItem("setSelect", firstUrl);
        } else {
          if (saveUrl) {
            history.push(`/${saveUrl}`);
          } else {
            history.push(`/${firstUrl}`);
          }
        }
      }
    );
  }

  getLinkUrl(navs) {
    let url = "";
    let keys = this.state.defaultOpenKeys;
    let seleteKeys = this.state.defaultSelectedKeys;
    let setOpenKey = sessionStorage.getItem("setOpenKey");
    let setSelect = sessionStorage.getItem("setSelect");

    if (navs[0].value !== null && navs[0].value !== "") {
      url = navs[0].value;
      seleteKeys.push(navs[0].value);
      if (this.props.isFromHome) {
        this.setState({
          defaultOpenKeys: keys,
          defaultSelectedKeys: seleteKeys
        });
      } else {
        if (setOpenKey && setSelect) {
          let arr = setOpenKey.split(",");
          let getSelect = setSelect.split(",");
          this.setState({
            defaultOpenKeys: arr,
            defaultSelectedKeys: getSelect
          });
        } else if (setOpenKey) {
          let arr = setOpenKey.split(",");
          this.setState({
            defaultOpenKeys: arr,
            defaultSelectedKeys: seleteKeys
          });
        } else if (setSelect) {
          let getSelect = setSelect.split(",");
          this.setState({
            defaultOpenKeys: keys,
            defaultSelectedKeys: getSelect
          });
        } else {
          this.setState({
            defaultOpenKeys: keys,
            defaultSelectedKeys: seleteKeys
          });
        }
      }
    } else {
      url = this.getLinkUrl(navs[0].navs);
      keys.push(navs[0].key);
      seleteKeys.push(navs[0].navs[0].value);
      // let setOpenKey = sessionStorage.getItem('setOpenKey');
      // let setSelect = sessionStorage.getItem('setSelect');
      if (this.props.isFromHome) {
        this.setState({
          defaultOpenKeys: keys,
          defaultSelectedKeys: seleteKeys
        });
      } else {
        if (setOpenKey && setSelect) {
          let arr = setOpenKey.split(",");
          let getSelect = setSelect.split(",");
          this.setState({
            defaultOpenKeys: arr,
            defaultSelectedKeys: getSelect
          });
        } else if (setOpenKey) {
          let arr = setOpenKey.split(",");
          this.setState({
            defaultOpenKeys: arr,
            defaultSelectedKeys: seleteKeys
          });
        } else if (setSelect) {
          let getSelect = setSelect.split(",");
          this.setState({
            defaultOpenKeys: keys,
            defaultSelectedKeys: getSelect
          });
        } else {
          this.setState({
            defaultOpenKeys: keys,
            defaultSelectedKeys: seleteKeys
          });
        }
      }
    }
    return url;
  }

  getUrl(item) {
    sessionStorage.setItem("saveUrl", item.key);
  }

  createSubMenuContent(parentName, subNavs, value) {
    const nav = [];
    if (!subNavs.length) {
      nav.push(
        <Menu.Item key={value}>
          <Link to={`/${value}`}>{parentName}</Link>
        </Menu.Item>
      );
      return nav;
    } else {
      subNavs.map(function(subNav) {
        nav.push(
          <Menu.Item key={subNav.value}>
            <Link to={`/${subNav.value}`}>
              <Icon type="minus" />
              {subNav.key}
            </Link>
          </Menu.Item>
        );
      });

      return (
        <SubMenu
          key={parentName}
          title={
            <span>
              <Icon type="bars" />
              <span>{parentName}</span>
            </span>
          }
        >
          {nav}
        </SubMenu>
      );
    }
  }

  onOpenChange(openKeys) {
    sessionStorage.setItem("setOpenKey", openKeys);
    this.setState({
      defaultOpenKeys: openKeys
    });
  }

  onSelect(item) {
    sessionStorage.setItem("setSelect", item.key);
    let selectedKeys = [];
    selectedKeys.push(item.key);
    this.setState({
      defaultSelectedKeys: selectedKeys
    });
  }

  createSiderNav() {
    const nav = [];
    let self = this;
    let currentModule = [];
    let activeModule = self.state.activeModule;
    this.state.menus.map(function(menu) {
      if (menu.parentName === activeModule) {
        currentModule = menu.navs;
      }
    });
    currentModule.map(function(menu) {
      nav.push(self.createSubMenuContent(menu.key, menu.navs, menu.value));
    });

    return (
      <Menu
        style={{ border: "none" }}
        mode={this.state.mode}
        onOpenChange={e => this.onOpenChange(e)}
        onSelect={item => this.onSelect(item)}
        onClick={item => this.getUrl(item)}
        openKeys={this.state.defaultOpenKeys}
        selectedKeys={this.state.defaultSelectedKeys}
      >
        {nav}
      </Menu>
    );
  }

  render() {
    return <div>{this.createSiderNav()}</div>;
  }
}

function mapStateToProps(state) {
  const { isFromHome } = state.siderParent;
  return { isFromHome };
}

export default connect(mapStateToProps)(SiderParent);

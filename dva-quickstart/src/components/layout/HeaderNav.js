import React, { Component } from "react";
import { Menu, Icon, Dropdown, Button, message } from "antd";
import auth from "../../services/auth";
import styles from "./MainLayout.less";
import { history } from "../../utils/config";
import { fetchPost } from "../../utils/request";

//imgs
import logo from "../../assets/jyd-logo.png";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: [],
      categories: [],
      productCategory: null,
      productCategoryName: null,
      apps: [],
      appName: null,
      appCode: null
    };
  }

  componentWillReceiveProps(props) {
    if (!this.state.menus.length) {
      let clickActiveModule = sessionStorage.getItem("clickActiveModule");
      if (props.activeModule) {
        this.setState({
          menus: props.menus || [],
          activeModule: props.activeModule
        });
      } else if (clickActiveModule) {
        this.setState(
          {
            menus: props.menus || [],
            activeModule: clickActiveModule
          },
          () => {
            this.props.setActiveModule(clickActiveModule);
          }
        );
      } else {
        this.setState({
          menus: props.menus || [],
          activeModule:
            props.menus && props.menus.length > 0
              ? props.menus[0].parentName
              : ""
        });
      }
    }
  }

  componentDidMount() {
    // this.getAppList();
    this.getCategoryList();
  }

  getAppList() {
    var apps = [
      { appName: "轻松有钱app", appCode: "1" },
      { appName: "金壹贷app", appCode: "0" }
    ];
    this.setState(
      {
        apps: apps,
        appName:
          sessionStorage.getItem("appName") == null
            ? apps[0].appName
            : sessionStorage.getItem("appName"),
        appCode:
          sessionStorage.getItem("appCode") == null
            ? apps[0].appCode
            : sessionStorage.getItem("appCode")
      },
      () => {
        if (sessionStorage.getItem("appName") == null) {
          sessionStorage.setItem("appName", apps[0].appName);
          sessionStorage.setItem("appCode", apps[0].appCode);
        }
      }
    );
  }

  getCategoryList() {
    fetchPost("/admin/productCategory/list").then(res => {
      sessionStorage.setItem("appCode", "0");
      if (res.code === 0) {
        var data = res.data.list;
        if (data.length > 0) {
          this.setState(
            {
              categories: data,
              productCategory:
                sessionStorage.getItem("productCategory") == null
                  ? data[0].productCategory
                  : sessionStorage.getItem("productCategory"),
              productCategoryName:
                sessionStorage.getItem("productCategoryName") == null
                  ? data[0].productCategoryName
                  : sessionStorage.getItem("productCategoryName")
            },
            () => {
              if (sessionStorage.getItem("productCategory") == null) {
                sessionStorage.setItem(
                  "productCategory",
                  data[0].productCategory
                );
                sessionStorage.setItem(
                  "productCategoryName",
                  data[0].productCategoryName
                );
              }
            }
          );
        }
      } else {
        message.error(res.msg);
      }
    });
  }

  handleAppClick(e) {
    // console.log(e);
    this.setState(
      {
        appCode: e.key,
        appName: e.item.props.children
      },
      () => {
        sessionStorage.setItem("appCode", e.key);
        sessionStorage.setItem("appName", e.item.props.children);
        window.location.reload();
      }
    );
  }

  handleMenuClick(e) {
    this.setState(
      {
        productCategory: e.key,
        productCategoryName: e.item.props.children
      },
      () => {
        sessionStorage.setItem("productCategory", e.key);
        sessionStorage.setItem("productCategoryName", e.item.props.children);
        window.location.reload();
      }
    );
  }

  getCategorySwitch() {
    var data = [];
    this.state.categories.map(category => {
      data.push(
        <Menu.Item style={{ paddingLeft: 15 }} key={category.productCategory}>
          {category.productCategoryName}
        </Menu.Item>
      );
    });
    return data;
  }

  getAppSwitch() {
    var data = [];
    this.state.apps.map(app => {
      data.push(<Menu.Item key={app.appCode}>{app.appName}</Menu.Item>);
    });

    return data;
  }

  render() {
    // const menu = (this.state.activeModule!="运营"?
    //   <Menu onClick={(e) => this.handleMenuClick(e)}>
    //     {this.getCategorySwitch()}
    //   </Menu>:
    //     <Menu onClick={(e) => this.handleAppClick(e)}>
    //       {this.getAppSwitch()}
    //     </Menu>
    // );
    const menu = (
      <Menu onClick={e => this.handleAppClick(e)}>
        {this.getCategorySwitch()}
      </Menu>
    );

    return (
      <div className={styles.headerWrapper}>
        <div
          style={{
            minWidth: "144px",
            height: "48px",
            float: "left",
            lineHeight: "48px"
            // paddingLeft: '22px',
          }}
        >
          {/* <img src={logo} className={styles.logoImg} /> */}
          <h3 style={{ textAlign: "center", fontSize: "20px" }}>
            {this.state.activeModule}
          </h3>
        </div>

        <div className={styles.tabs}>
          {this.state.activeModule !== "用户管理" ? (
            <Menu mode="horizontal" className={styles.headNav}>
              {/*
                  this.state.activeModule !== '运营'?
                    <Dropdown overlay={menu}>
                      <Button style={{
                        // width: '120px',
                        height: '38px',
                        paddingLeft: '10px',
                        paddingRight: '10px',
                        'backgroundColor': '#ec5853',
                        color: '#fff',
                      }}>
                        <span style={{float: 'left'}}>{this.state.productCategoryName}</span>
                        <Icon style={{
                          position: 'relative',
                          // right: -35
                        }} type="down"/>
                      </Button>
                    </Dropdown>
                    :

                */}
              <Dropdown overlay={menu}>
                <Button
                  type="primary"
                  style={{
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    height: "38px",
                    color: "#fff"
                  }}
                >
                  {this.state.productCategoryName} <Icon type="down" />
                </Button>
              </Dropdown>
            </Menu>
          ) : (
            <span />
          )}
        </div>

        <div className={styles.user}>
          <Menu mode="horizontal" className={styles.headNav}>
            <Menu.Item className={` ${styles.pl10} ${styles.introNone}`}>
              <Icon type="user" />
              <span>
                <span
                  onClick={e => {
                    auth.Mylogin();
                  }}
                >
                  欢迎您,
                  {auth.getUserName()}
                </span>
              </span>
            </Menu.Item>
            <Menu.Item className={` ${styles.pl10} ${styles.introNone}`}>
              <span
                onClick={() => {
                  history.push("/homePage");
                }}
              >
                <span>返回首页</span>
                <Icon type="logout" />
              </span>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    );
  }
}

export default Header;

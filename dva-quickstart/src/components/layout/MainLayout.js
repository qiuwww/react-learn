import React, { Component } from "react";
import Header from "./HeaderNav";
import SiderParent from "./SiderParent";
import { fetchPost } from "../../utils/request";
import styles from "./MainLayout.less";
import { Icon } from "antd";
import { connect } from "dva";
class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "inline",
      menus: [],
      defaultOpenKeys: ["业务管理", "优惠券管理"],
      content: null,
      activeModule: "",
      menuList: "show"
    };
  }

  componentDidMount() {
    this.getData();
  }

  changeShowList() {
    if (this.state.menuList === "show") {
      this.setState({
        menuList: "hide"
      });
    } else {
      this.setState({
        menuList: "show"
      });
    }
  }

  getData() {
    let menus = this.props.menus;
    let clickActiveModule = window.sessionStorage.getItem("clickActiveModule");
    if (menus.length) {
      if (clickActiveModule) {
        this.setState({
          menus,
          activeModule: clickActiveModule
        });
      } else {
        this.setState({
          menus,
          activeModule: menus[0].parentName
        });
      }
    } else {
      fetchPost("/menu/user", {}).then(res => {
        if (res.code === 0) {
          let list = res.data.list;
          let currentModule = [];
          if (clickActiveModule) {
            if (list.length) {
              for (let i in list) {
                let value = list[i];
                if (value.parentName === clickActiveModule) {
                  currentModule.push(value);
                  break;
                }
              }
            }
            this.setState({
              menus: currentModule,
              activeModule: clickActiveModule
            });
          }
        }
      });
    }
    this.props.dispatch({
      type: "mainLayout/save",
      payload: {
        isFromHome: false
      }
    });
  }

  changeField(field, value) {
    this.props.dispatch({
      type: "mainLayout/save",
      payload: {
        [field]: value
      }
    });
  }

  render() {
    return (
      <div className={styles.mainLayout}>
        <div className={styles.headerClass}>
          <Header
            menus={this.state.menus}
            activeModule={this.props.activeModule}
            setActiveModule={activeModule =>
              this.changeField("activeModule", activeModule)
            }
          />
        </div>
        <div
          className={`${
            this.state.menuList === "show"
              ? styles.siderNav
              : styles.siderNavHide
          }`}
        >
          <SiderParent
            menus={this.state.menus}
            activeModule={this.props.activeModule}
          />
        </div>

        <button
          className={styles.switchBtn}
          onClick={() => {
            this.changeShowList();
          }}
        >
          {
            <Icon
              type="ellipsis"
              style={{ width: "10px", height: "10px", fontSize: 8 }}
            />
          }
        </button>

        <div
          className={`${
            this.state.menuList === "show"
              ? styles.childrenComponentCp
              : styles.childrenComponent
          }`}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { activeModule, menus } = state.mainLayout;
  return { activeModule, menus };
}

export default connect(mapStateToProps)(MainLayout);

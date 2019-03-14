import React, { Component, PropTypes } from 'react'
import Header from './HeaderMenu'
import styles from './Index.less'
import { Button } from 'antd'
import { connect } from 'dva'
import { history } from '../../utils/config'
import {fetchPost} from '../../utils/request'

//logo
import financePic from '../../assets/financeBtn.png'
import affairsPic from '../../assets/affairsBtn.png'
import overduePic from '../../assets/overdueBtn.png'
import rightPic from '../../assets/rightBtn.png'
import spreadPic from '../../assets/spread.png'
import statisticPic from '../../assets/statisticBtn.png'
import userManagePic from '../../assets/userManageBtn.png'
import reportPic from '../../assets/report.png'
import logo from '../../assets/logo_small.png'
import orderPic from '../../assets/order.png';

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      menus: []
    }
  }

  componentDidMount() {
      this.getData()
  }

  getData () {
    if(!this.state.menus.length) {
      fetchPost('/menu/user', {}).then(res => {
        if(res.code === 0) {
          this.setState({
            menus: res.data.list
          })
        }
      });
    }
  }

  goPages (menu) {
    this.props.dispatch({
      type: 'mainLayout/save',
      payload: {
        activeModule: menu.parentName,
        menus: [menu]
      }
    })
    this.props.dispatch({
      type: 'siderParent/save',
      payload: {
        isFromHome: true
      }
    })
    window.sessionStorage.setItem('clickActiveModule', menu.parentName)
    history.push('/')
  }

  render () {
    return (
      <div className={styles.mainLayout}>
        <div className={styles.bg}></div>
        <div className={styles.headerClass}>
          <Header menus={this.state.menus}
            setActiveModule={(activeModule) => this.changeField(
              'activeModule', activeModule)} />
        </div>
        <div className={styles.logoWrap}>
          {/*<img src={logo} />*/}
        </div>
        <div className={styles.modulesContent}>
          <div className={styles.modulesItem}>
            {
              this.state.menus.map((value, index) => {
                switch (value.parentName) {
                  case '管理':
                    return (
                      <a className={styles.modulesBtn} href='javascript:;' key={index} type='primary'
                         onClick={() => { this.goPages(value) }}>
                        <img src={rightPic}/>
                      </a>
                    )
                  case '信审管理':
                    return (
                      <a className={styles.modulesBtn} href='javascript:;' key={index} type='primary'
                         onClick={() => { this.goPages(value) }}>
                        <img src={financePic}/>
                      </a>
                    )
                  case '统计':
                    return (
                      <a className={styles.modulesBtn} href='javascript:;' key={index} type='primary'
                         onClick={() => { this.goPages(value) }}>
                        <img src={statisticPic}/>
                      </a>
                    )
                  case '财务':
                    return (
                      <a className={styles.modulesBtn} href='javascript:;' key={index} type='primary'
                         onClick={() => { this.goPages(value) }}>
                        <img src={affairsPic}/>
                      </a>
                    )
                  case '运营':
                    return (
                      <a className={styles.modulesBtn} href='javascript:;' key={index} type='primary'
                         onClick={() => { this.goPages(value) }}>
                        <img src={spreadPic}/>
                      </a>
                    )
                  case '用户管理':
                    return (
                      <a className={styles.modulesBtn} href='javascript:;' key={index} type='primary'
                         onClick={() => { this.goPages(value) }}>
                        <img src={userManagePic}/>
                      </a>
                    )
                  case '催收管理':
                    return (
                      <a className={styles.modulesBtn} href='javascript:;' key={index} type='primary'
                         onClick={() => { this.goPages(value) }}>
                        <img src={overduePic}/>
                      </a>
                    )
                  case '报表':
                    return (
                      <a className={styles.modulesBtn} href='javascript:;' key={index} type='primary'
                         onClick={() => { this.goPages(value) }}>
                        <img src={reportPic}/>
                      </a>
                    )
                  case '订单':
                    return (
                      <a className={styles.modulesBtn} href='javascript:;' key={index} type='primary'
                         onClick={() => { this.goPages(value) }}>
                        <img src={orderPic}/>
                      </a>
                    )
                }
              })
            }
          </div>
        </div>

      </div>

    )
  }
}

export default connect()(Index)

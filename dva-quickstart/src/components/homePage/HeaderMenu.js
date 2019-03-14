import React, { Component, PropTypes } from 'react'
import { Menu, Icon } from 'antd'
import auth from '../../services/auth'
import styles from './Index.less'
import { history } from '../../utils/config'

//img
import logo from '../../assets/jyd-logo.png'

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      menus: [],
      activeModule: ''
    }
  }

  componentWillReceiveProps (props) {
    if (!this.state.menus.length) {
      let clickActiveModule = sessionStorage.getItem('clickActiveModule')
      if (clickActiveModule) {
        this.setState({
          menus: props.menus || [],
          activeModule: clickActiveModule
        })
      } else {
        this.setState({
          menus: props.menus || [],
          activeModule: props.menus[0].parentName
        })
      }
    }
  }

  render () {
    return (
      <div className={styles.headerWrapper}>
        <div onClick={this.handleClick}
          style={{
            minWidth: '160px',
            height: '48px',
            float: 'left',
            lineHeight: '48px',
            paddingLeft: '22px'
          }}
        >
          {/*<img src={logo} className={styles.logoImg} />*/}
        </div>

        <div className={styles.tabs} />

        <div className={styles.user}>
          <Menu
            mode='horizontal'
            className={styles.headNav}
          >
            <Menu.Item className={` ${styles.pl10} ${styles.introNone}`}>
              <span>
                <Icon type='user' />
               欢迎您,
                {
                  auth.getUserName()
                }
              </span>
            </Menu.Item>
            {/*<Menu.Item className={` ${styles.pl10} ${styles.introNone}`}>*/}
              {/*<span onClick={e => {*/}
                {/*history.push('/admin/list')*/}
              {/*}}> 修改密码*/}
                    {/*<Icon type='edit' />*/}
              {/*</span>*/}
            {/*</Menu.Item>*/}
            <Menu.Item className={` ${styles.pl10} ${styles.introNone}`}>
              <span onClick={e => {
                auth.logout()
              }}> 登出
                    <Icon type='logout' />
              </span>
            </Menu.Item>

          </Menu>
        </div>

      </div>
    )
  }
}

export default Header

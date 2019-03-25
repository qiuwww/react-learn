/**
 * Created by ziyu on 2017/7/31.
 */
import React, { Component,  } from 'react'
import { Icon } from 'antd'
import Style from '../less/title.less'
class Index extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div className={Style.title}>
        <Icon className={Style.icon} type='tag-o' />
        {this.props.title}
      </div>
    )
  }
}

export default Index

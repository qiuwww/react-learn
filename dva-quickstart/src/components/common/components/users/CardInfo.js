/**
 * Created by ziyu on 17/3/15.
 */
/**
 * Created by ziyu on 17/3/14.
 */

import React, { Component, PropTypes } from 'react'
import { Card, Col } from 'antd'
import Styles from '../../../users/manage/detail/Index.less'
import { fetchPost } from '../../../../utils/request'

class CardInfo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      data: {
        userName:''
      },
      page: {
        totalNum: 0,
        pageSize: 5
      },
      title: '银行卡信息'
    }
  }

  componentDidMount () {
    this.getData()
  }

  componentWillReceiveProps (props) {
    console.log('this.state.userId',props.userId)
    if (this.state.userId !== props.userId) {
      this.setState({
        userId: props.userId
      }, () => {
        this.getData()
      })
    }
  }

  getData () {
    if (this.state.userId != null) {
      fetchPost(`/user/${this.state.userId}/bank/info`).then((res) => {
        if(res.code == 0){
          this.setState({
            data: res.data
          })
        }

      })
    }
  }

  render () {
    return (
      <div className={`${Styles.detailModule} ${Styles.partLeft}`}>
        <Card title={this.state.title} bodyStyle={{padding: 1,height:200, }} noHovering={true}>
          <div className={Styles.personnelContainer}>
            <Col span={24} className={Styles.item}>
              <Col span={5} offset={2}>姓名:</Col>
              <Col span={17}>{this.state.data.userName}</Col>
            </Col>

            <Col span={24} className={Styles.item}>
              <Col span={5} offset={2}>开户行:</Col>
              <Col span={17}>{this.state.data.bankName}</Col>
            </Col>

            <Col span={24} className={Styles.item}>
              <Col span={5} offset={2}>银行卡:</Col>
              <Col span={17}>{this.state.data.number}</Col>
            </Col>
            {
              this.props.type=='userManage'
              ?
                <Col span={24} className={Styles.item}>
                  <Col span={5} offset={2}>是否授权代扣:</Col>
                  <Col span={17}>{this.state.data.isNewDaiKou}</Col>
                </Col>
                :
                <span></span>
            }
          </div>
        </Card>
      </div>
    )
  }
}

export default CardInfo

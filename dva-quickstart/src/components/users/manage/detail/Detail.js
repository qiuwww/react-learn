import React, {Component, PropTypes} from 'react'
import {Tabs, Card, Form, message, Col} from 'antd';
import Styles from './Index.less'
import Register from './info/Register'
import LoanStatus from './info/LoanStatus'
import Identity from '../../../common/components/users/Identity'
import Profession from '../../../common/components/users/Profession'
import CardInfo from '../../../common/components/users/CardInfo'
import CollectionRecord from '../../../common/components/users/CollectionRecord'
import BorrowRecord from '../../../common/components/users/BorrowRecord'
import CheckRecord from '../../../common/components/users/CheckRecord'
import RepayDetail from '../../../common/components/users/RepayDetail'
import ApplyRecord from '../../../common/components/users/applyRecord'
import {fetchPost} from '../../../../utils/request'

const TabPane = Tabs.TabPane;

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.userId,
      tradeNo:props.tradeNo,
      activeKey: props.activeKey,
      showDetail: true,
      showShade: false,
      visible: false
    };
  }

  componentWillReceiveProps(props) {
    if (this.state.userId != props.userId) {
      this.setState({
        activeKey: props.activeKey,
        userId: props.userId,
        tradeNo:props.tradeNo
      })
    }
  }

  onChange(activeKey) {
    this.setState({activeKey,});
  }

  changeField(field, value) {
    this.setState({
      [field]: value,
    });
  }

  changeModal() {
    this.setState({
      visible: !this.state.visible
    })
  }

  getDetailClass() {
    return this.state.showDetail ? Styles.detailInit : Styles.detailAfter;
  }

  getShadeClass() {
    return this.state.showShade ? Styles.shadeAfter : Styles.shadeInit;
  }

  switch() {
    this.handleOperate()
  }

  handleOperate() {
    let [state, toggle] = [this.state.showDetail, this.state.showShade];
    this.setState({
      showDetail: state == false,
      showShade: toggle == false
    });
  }

  handleCancel() {
    this.setState({
      visible: false
    })
  }

  handleOk() {
    this.setState({
      visible: false
    })
  }

  chooseTag(id, name) {
    let self = this;
    if (self.props.form.getFieldValue('checkReason')) {
      this.props.form.setFieldsValue({
        checkReason: `${self.props.form.getFieldValue('checkReason') + name};`
      })
    } else {
      this.props.form.setFieldsValue({
        checkReason: `${name};`
      })
    }

  }

  render() {
    return (
      <div className={Styles.hideScroll}>
        <div className={this.getDetailClass()}>
          {/*<Card bodyStyle={{padding:0}} bordered={false}>*/}
          <div className="">

            {/*<Tabs className={Styles.tabs} activeKey={this.state.activeKey} onChange={(e) => this.onChange(e)}>*/}

            {/*<TabPane tab="个人信息" key="detail">*/}
            {/*{*/}
            {/*this.state.activeKey == 'detail' ?*/}
            {/*<div>*/}
            {/*<Register userId={this.state.userId}/>*/}
            {/*<LoanStatus userId={this.state.userId}/>*/}
            {/*<Identity userId={this.state.userId}/>*/}
            {/*<Col span={16}>*/}
            {/*<Profession userId={this.state.userId}/>*/}
            {/*</Col>*/}
            {/*<Col span={8}>*/}
            {/*<CardInfo userId={this.state.userId}/>*/}
            {/*</Col>*/}

            {/*</div>*/}
            {/*:*/}
            {/*<span></span>*/}
            {/*}*/}
            {/*</TabPane>*/}

            {/*<TabPane tab="借款记录 / 催收记录" key="records">*/}
            {/*{*/}
            {/*this.state.activeKey == 'records' ?*/}
            {/*<div>*/}
            {/*<BorrowRecord userId={this.state.userId}/>*/}
            {/*<CardInfo userId={this.state.userId} type="userManage"/>*/}
            {/*<CheckRecord userId={this.state.userId}/>*/}
            {/*<CollectionRecord userId={this.state.userId}/>*/}
            {/*<ApplyRecord userId={this.state.userId}/>*/}
            {/*<RepayDetail userId={this.state.userId}/>*/}
            {/*<br/>*/}
            {/*<CheckRecord userId={this.state.userId}/>*/}

            {/*</div>*/}
            {/*:*/}
            {/*<span></span>*/}
            {/*}*/}
            {/*</TabPane>*/}
            {/*</Tabs>*/}
            <div>
              {/*<BorrowRecord userId={this.state.userId}/>*/}
              <div style={{height:'auto',float:'left',width:'50%'}}>

                <ApplyRecord userId={this.state.userId} tradeNo={this.state.tradeNo}/>

                <CollectionRecord userId={this.state.userId} tradeNo={this.state.tradeNo}/>
              </div>
              <div style={{height:'auto',float:'left',width:'50%'}}>
                <CheckRecord userId={this.state.userId} tradeNo={this.state.tradeNo}/>
                <CardInfo userId={this.state.userId} type="userManage"/>
              </div>
              <RepayDetail userId={this.state.userId} tradeNo={this.state.tradeNo}/>
              <br/>
              {/*<CheckRecord userId={this.state.userId}/>*/}

            </div>
          </div>

          <div className={this.getShadeClass()} onClick={() => {
            this.switch()
          }}></div>
          {/*</Card>*/}

        </div>
      </div>
    );
  }
}

Detail = Form.create()(Detail);

export default Detail

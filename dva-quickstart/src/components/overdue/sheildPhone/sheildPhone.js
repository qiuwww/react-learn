/**
 * Created by xuxiaoqi on 2017/12/21.
 */
import React, { Component, PropTypes } from 'react'
import { Button} from 'antd'
import {fetchPost} from '../../../utils/request'
class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      phoneStatus:0,
      phoneId:''
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData () {
    // 获取当前开关状态是开还是关：屏蔽通讯录／显示通讯录
    let self = this;
    fetchPost('/user/addressBook/status/get').then(res=>{
      if(res.code == 0){
        self.setState({
          phoneStatus:res.data.status,
          phoneId:res.data.id
        })
      }
    })
  }

  changeDisplayPhone(){
  //修改开关状态
    let status;
    if(this.state.phoneStatus == 0){
      status = 1;
    }else if(this.state.phoneStatus == 1){
      status = 0;
    }
    let self = this;
    if(this.state.phoneId){
      fetchPost('/user/addressBook/'+this.state.phoneId+'/'+status+'/update').then(res=>{
        if(res.code == 0){
          self.setState({
            phoneStatus:status
          })
        }
      })
    }

  }

  render () {
    return (
      <div>
        <Button style={{marginLeft: 10,marginTop:5}} type="primary" onClick={() => this.changeDisplayPhone()}>
          {this.state.phoneStatus?'屏蔽通讯录':'显示通讯录'}
        </Button>
      </div>
    )
  }
}

export default Index

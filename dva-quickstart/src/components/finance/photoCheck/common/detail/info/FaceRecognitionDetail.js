/**
 * Created by yujianfu on 2017/4/6.
 */
import React, {Component, PropTypes} from 'react'
import {
  Form,
  Card,
  Icon
} from 'antd'
import { fetchPost } from './../../../../../../utils/request'

class FaceRecognitionDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      loading: false,
      list: [],
      compareData: []
    }
  }

  // 初始化方法
  componentDidMount () {
    this.getData()
  }

  // 请求数据
  getData () {
    this.setState({
      loading: true
    })
    if (this.state.userId != null) {
      fetchPost(`/user/${this.state.userId}/faceRecognition/info`, {}).then(json => {
        this.setState({
          list: json.data.list,
          compareData: json.data.compare,
          loading: false
        })
      })
    }
  }

  componentWillReceiveProps (props) {
    if (this.state.userId != props.userId) {
      this.setState({
        userId: props.userId
      }, () => {
        this.props.form.resetFields()
        this.getData()
      })
    }
  }

  render () {
    if (this.state.list == null || this.state.list.length == 0) {
      return <span className="no-data"><Icon type='frown-o' />暂无数据</span>
    }

    let showContent = []

    this.state.list.map(function (content) {
      showContent.push(
        <Card key={content.imgName} title={content.imgName} style={{marginBottom: 10}}
          noHovering={true}
        >
          <img style={{width: 250, float: 'left'}} src={content.imgUrl} />
          <div style={{width: '50%', float: 'left', paddingLeft: '10%'}}>
            <p>真实身份证：{content.truePercent}</p>
            <p>屏幕翻拍：{content.screenReverce}</p>
            <p>临时身份证：{content.tempPercent}</p>
            <p>复印件：{content.copyPercent}</p>
            <p>被编辑：{content.editedPercent}</p>
          </div>
        </Card>)
    })
    return (
      <div>
        {showContent}
        <Card key='compare' title={`人脸照片&身份证头像 相似度${this.state.compareData.likePercent}`}
          noHovering={true}
        >
          <div style={{maxHeight: 195, overflow: 'auto'}}>
            <div style={{ width: 200, display: 'inline-block'}}>
              <Card style={{ width: 200}} bodyStyle={{ padding: 0 }}
                noHovering={true}
              >
                <div>
                  <img alt='example' height='170' width='100%' src={this.state.compareData.faceUrl} />
                </div>
                <div>
                  <p>背景照</p>
                </div>
              </Card>
            </div>
            <div style={{ width: 200, display: 'inline-block'}}>
              <Card style={{ width: 200}} bodyStyle={{ padding: 0 }} noHovering={true}>
                <div>
                  <img alt='example' height='170' width='100%' src={this.state.compareData.idAvatar} />
                </div>
                <div>
                  <p>身份证头像</p>
                </div>
              </Card>
            </div>

            <div style={{ width: 200, display: 'inline-block'}}>
              <Card style={{ width: 200 }} bodyStyle={{ padding: 0 }} noHovering={true}>
                <div>
                  <img alt='example' height='170' width='100%' src={this.state.compareData.oneActionUrl} />
                </div>
                <div>
                  <p>动作1</p>
                </div>
              </Card>
            </div>
            <div style={{ width: 200, display: 'inline-block'}}>
              <Card style={{ width: 200 }} bodyStyle={{ padding: 0 }} noHovering={true}>
                <div>
                  <img alt='example' height='170' width='100%' src={this.state.compareData.secondActionUrl} />
                </div>
                <div>
                  <p>动作2</p>
                </div>
              </Card>
            </div>
            <div style={{ width: 200, display: 'inline-block'}}>
              <Card style={{ width: 200 }} bodyStyle={{ padding: 0 }} noHovering={true}>
                <div>
                  <img alt='example' height='170' width='100%' src={this.state.compareData.thirdActionUrl} />
                </div>
                <div>
                  <p>动作3</p>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    )
  }
}

FaceRecognitionDetail = Form.create()(FaceRecognitionDetail)
export default FaceRecognitionDetail

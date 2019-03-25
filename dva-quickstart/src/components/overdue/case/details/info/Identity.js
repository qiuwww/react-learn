/**
 * Created by yujianfu on 2016/11/10.
 */
import React, {Component, } from 'react'
import {Tabs, Card, Table, Icon, Collapse} from 'antd'
import Styles from './../Index.less'
import {fetchPost} from './../../../../../utils/request'
import Viewer from 'react-viewer'
import 'react-viewer/dist/index.css'
const Panel = Collapse.Panel
class Identity extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      data: [],
      visible: false,
      activeIndex: 0,
      photos: []
    }
  }

  componentWillReceiveProps (props) {
    if (this.state.userId != props.userId) {
      this.setState({
        userId: props.userId
      }, () => {
        this.getData()
      })
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData () {
    if (this.state.userId != null) {
      fetchPost(`/user/${this.state.userId}/identity`, {}).then(json => {
        if (json.data != null) {
          this.setState({
            data: json.data.list,
            photos: json.data.photos
          })
        }
      })
    }
  }

  createContent () {
    let data = this.state.data
    let content = []
    data.map(function (item) {
      let value = item.value
      if (value == null) { value = '--' }
      content.push(
        <div key={item.name} className={Styles.content}>

          <span style={{width: '20%'}}>{item.name}</span>
          :
          <span style={{width: '80%', paddingLeft: 5}}>{value}</span>
        </div>)
    })

    return content
  }

  getTitle () {
    let data = this.state.data
    if (data == null || data.length == 0) { return '身份详情 (无)' }

    return '身份详情'
  }
  createPhoto (photos, images, slf) {
    if (photos == null || photos.length == 0) {
      return <span className="no-data"><Icon type='frown-o' />暂无数据</span>
    }
    let content = []

    photos.map(function (item) {
      let index = images.length
      images.push({src: item.key, alt: item.lastModified})
      content.push(
        <div key={Math.random().toString(16).substring(2)} style={{ width: 200, display: 'inline-block'}}
          onClick={() => { slf.setState({visible: true, activeIndex: index }) }}>
          <Card style={{ width: 200 }} bodyStyle={{ padding: 0 }} noHovering={true}>
            <div>
              <img alt='example' height='160' width='100%'
                src={item.key} />
            </div>
            <div>
              <p>日期:{item.lastModified}</p>
            </div>
          </Card>
        </div>
      )
    })

    return content
  }

  render () {
    let images = []
    let slf = this
    return (
      <div className={Styles.detailModule}>
        <Card title={this.getTitle()} bodyStyle={{padding: 1}} noHovering={true}>
          <Collapse defaultActiveKey={['1']}>
            <Panel header='手持身份证' key='1'>
              <div style={{height: 180, overflow: 'auto'}}>
                {this.createPhoto(this.state.photos, images, slf)}
              </div>

            </Panel>
          </Collapse>
          {this.createContent()}
        </Card>
        <Viewer
          visible={this.state.visible}
          onClose={() => { this.setState({ visible: false }) }}
          images={images}
          activeIndex={this.state.activeIndex}
         />

      </div>

    )
  }
}

export default Identity

/**
 * Created by yujianfu on 2016/11/23.
 */
import React, { Component, PropTypes } from 'react'
import { Card, Radio, Button, Popconfirm, message } from 'antd'
import { sortable } from 'react-sortable'
import Styles from './Index.less'
import Add from './Add'
import { fetchPost } from './../../../utils/request'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      effective: '0',
      reload: false,
      orderChanged: false,
      sortableListItem: null,
      draggingIndex: null,

      data: {
        items: null
      },
      page: {
        pageSize: 15,
        totalNum: 0,
        pageNum: 1
      },
      params: [],
      sortData: {
        originIds: [],
        sortedIds: []
      }
    }
  }

  onchange (current) {
    this.setState({
      page: {
        ...this.state.page,
        pageNum: current
      }
    }, () => {
      this.getData()
    })
  }

  confirmOff (id) {
    var self = this
    fetchPost('/banner/' + id + '/off').then(json => {
      if (json.code == 0) {
        message.info('操作成功')
        self.getData()
      } else {
        message.error(json.msg)
      }
    })
  }

  componentDidMount () {
    this.getSortableData()
  }

  getSortableData () {
    var self = this
    let ListItem = React.createClass({
      displayName: 'SortableListItem',
      removeBanner (id) {
        fetchPost(`/cms/banner/${id}/unshelve`,{}).then(res => {
          if(res.code === 0) {
            message.success('下架成功!')
            this.props.children.refreshData()
          } else {
            message.error(res.msg)
          }
        });
      },
      render: function () {
        console.log(this.props, 'ef')
        return (
          <div {...this.props} className={Styles.item}>
            <Card noHovering={true}>
              <div className={Styles.itemContent}>
                <img src={this.props.children.pictureUrl}/>
              </div>
              <div className={Styles.itemContent} style={{width: '63%'}}>
                <p>位置:{this.props.children.locationDesc}</p>
                <p>
                  热点位置: {this.props.children.hotspotLocationDesc}
                </p>
                <p>
                  跳转位置：{this.props.children.jumpLocationDesc}
                </p>
                <p>
                  跳转链接：{this.props.children.jumpUrl}
                </p>
                <p>
                  持续时间：{this.props.children.effectiveStart.split(' ')[0]} - {this.props.children.effectiveEnd
                  .split(' ')[0]}
                </p>
                <p>
                  备注：{this.props.children.comment}
                </p>
              </div>

              <div className={Styles.itemContent} style={{width: '10%', float: 'right'}}>
                {
                  this.props.children.effective === '0'?
                    <Popconfirm placement="top" title={'确认下架？'} onConfirm={() => {this.removeBanner(this.props.children.cmsHotspotId)}}
                                okText="是"
                                cancelText="否">
                      <Button type="primary" style={{float: 'right'}}>
                        下架
                      </Button>
                    </Popconfirm>
                    :
                    <Button  type="dashed" disabled style={{float: 'right'}}>
                      已下架
                    </Button>
                }
              </div>
            </Card>
          </div>
        )
      }
    })

    this.setState({
      sortableListItem: sortable(ListItem)
    }, () => {
      this.getData()
    })
  }

  getData () {
    let appType = window.sessionStorage.getItem('appCode')
    fetchPost(`/cms/banner/${this.state.effective}/${appType}/list`, {}).then(json => {
      if (json.data != null) {
        var data = json.data.itemList
        var ids = []
        data.map(function (item) {
          ids.push(item.cmsHotspotId)
        })

        this.setState({
          data: {
            items: data
          },
          sortData: {
            ...this.state.sortData,
            originIds: ids
          }
        })
      }
    })
  }

  updateState (obj) {
    console.log(obj, 'obj')
    if (obj.draggingIndex != null) {
      var sortedIds = []
      if (typeof(obj.items) != 'undefined') {
        obj.items.map(function (item) {
          sortedIds.push(item.cmsHotspotId)
        })
      }

      this.setState({
        orderChanged: true,
        draggingIndex: obj.draggingIndex,
        sortData: {
          ...this.state.sortData,
          sortedIds: sortedIds
        }
      }, () => {
        console.log(this.state)
      })
    }
  }

  reload () {
    this.getData()
  }

  changeParams (params) {
    this.getData()
  }

  confirmOrderReset () {
    var self = this
    fetchPost('/banner/order/reset', {
      originIds: this.state.sortData.originIds,
      sortedIds: this.state.sortData.sortedIds
    }).then(json => {
      if (json.code == 0) {
        message.info('操作成功')
        self.getData()
        self.setState({
          orderChanged: false,
          sortData: {
            originIds: [],
            sortedIds: []
          }
        })
      } else {
        message.error(json.msg)
      }
    })
  }

  render () {
    var self = this
    let listItems = null
    if (this.state.sortableListItem != null && this.state.data.items != null) {
      let SortableListItem = this.state.sortableListItem
      console.log(this.state.effective, 'ef2')
      listItems = this.state.data.items.map((item, i) => {
        return (
          <SortableListItem
            key={i}
            updateState={(e) => this.updateState(e)}
            items={this.state.data.items}
            draggingIndex={this.state.draggingIndex}
            sortId={i}
            outline="list"
            childProps={() => {this.getData()}}
          >{{...item,  effective: this.state.effective,refreshData:  () => {this.getData()}}}</SortableListItem>
        )
      }, this)
    } else {
      listItems = (<div></div>)
    }

    return (
      <div style={{width: '70%'}}>

        <div style={{'marginTop': 20, width: '80%', display: 'inline-block'}}>
          <Add changeParams={() => this.changeParams()}/>
        </div>
        <div className="mt20 pl10">
          <RadioGroup onChange={(e) => {
            console.log(e, 'onChange')
            this.setState({
              effective: e.target.value
            }, () => {
              this.getData()
            })
          }} defaultValue="0">
            <RadioButton value="0">上架banner</RadioButton>
            <RadioButton value="1">历史banner</RadioButton>
          </RadioGroup>
        </div>
        <div style={{'marginTop': 10, width: '100%'}}>
          {listItems}
        </div>

      </div>
    )
  }
}

export default Index

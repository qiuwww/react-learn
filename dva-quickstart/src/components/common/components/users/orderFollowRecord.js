/**
 * Created by ziyu on 17/5/9.
 */
/**
 * Created by ziyu on 17/3/13.
 */
import React, { Component, PropTypes } from 'react'
import { Table, Icon, Card } from 'antd'
import Styles from '../../../overdue/case/details/Index.less'
import { fetchPost } from '../../../../utils/request'
class OrderFollowRecord extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      id: props.id,
      loading: false,
      list: [],
      message: '',
      timer: null
    }
  }

  componentDidMount () {
    this.getData()
  }

  componentWillReceiveProps (props) {
    if (this.state.id != props.id || props.refreshOrderFollow) {
      this.setState({
        id: props.id
      }, () => {
        this.getData()
      })
    }
  }

  componentWillUnmount () {
    clearTimeout(this.state.timer)
  }

  getData () {
    this.setState({
      loading: true
    })
    if (this.state.id) {
      fetchPost(`/collection/follow/record/${this.state.id}/query`).then(json => {
        if (json.code === 0) {
          if (json.data != null) {
            this.setState({
              list: json.data.itemList,
              loading: false
            })
          }
        } else {
          this.setState({
            list: [],
            loading: false,
            message: json.msg
          })
        }
      })
    } else {
      this.setState({
        list: [],
        loading: false
      })
    }
  }

  message () {
    if (this.state.message) {
      this.state.timer = setTimeout(() => {
        this.setState({
          message: ''
        })
      }, 3000)

      return (
        <span className='color-warning warning-animate'><Icon type='info-circle-o' />                                {this.state.message}</span>
      )
    } else {
      return ''
    }
  }

  render () {
    const columns = [
      {
        title: '跟进人',
        dataIndex: 'followUp',
        key: 'followUp'
      },
      {
        title: '跟进时间',
        dataIndex: 'followDate',
        key: 'followDate'
      },
      {
        title: '操作类型',
        dataIndex: 'typeDesc',
        key: 'typeDesc'
      },
      {
        title: '备注',
        dataIndex: 'content',
        key: 'content'
      }
    ]

    return (
      <div className={Styles.orderFollowRecord}>
        <Card title='订单跟进记录' extra={this.message()} bodyStyle={{padding: 1}} noHovering={true}>
          <Table
            pagination={false}
            bordered
            size='small'
            dataSource={this.state.list}
            columns={columns}
            loading={this.state.loading}
          />
        </Card>
      </div>
    )
  }
}

export default OrderFollowRecord

/**
 * Created by ziyu on 17/3/13.
 */
import React, { Component,  } from 'react'
import { Table, Icon, Card } from 'antd'
import Styles from '../../../finance/common/detail/Index.less'
import { fetchPost } from '../../../../utils/request'
class BorrowRecord extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      loading: false,
      list: [],
      message: '',
      timer: null
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

  componentWillUnmount () {
    clearTimeout(this.state.timer)
  }

  getData () {
    this.setState({
      loading: true
    })
    if (this.state.userId) {
      fetchPost(`/order/borrowrecord/${this.state.userId}/query`).then(json => {
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

  title () {
    if (this.state.message) {
      setTimeout(() => {
        this.setState({
          message: ''
        })
      })
      return (
        <div>
          <span className='mr10'>借款记录</span>
          <span className='color-warning warning-animate'><Icon type='info-circle-o' />                                {this.state.message}</span>
        </div>
      )
    } else {
      return '借款记录'
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
        title: '借款时间',
        dataIndex: 'createdDt',
        key: 'createdDt'
      },
      {
        title: '订单号',
        dataIndex: 'tradeNo',
        key: 'tradeNo'
      },
      {
        title: '银行卡号',
        dataIndex: 'number',
        key: 'number'
      },
      {
        title: '借款金额',
        dataIndex: 'realCapital',
        key: 'realCapital'
      },
      {
        title: '借款周期',
        dataIndex: 'duration',
        key: 'duration'
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatusDesc',
        key: 'orderStatusDesc'
      },
      {
        title: '审核人',
        dataIndex: 'auditor',
        key: 'auditor'
      }
    ]

    return (
      <div className={Styles.borrowRecord}>
        <Card title='借款记录' extra={this.message()} bodyStyle={{padding: 1}} noHovering={true}>
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

export default BorrowRecord

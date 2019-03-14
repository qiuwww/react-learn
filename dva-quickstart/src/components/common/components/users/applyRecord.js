/**
 * Created by xuxiaoqi on 2017/9/18.
 */
import React, { Component, PropTypes } from 'react'
import { Table, Card, Icon } from 'antd'
import Styles from '../../../finance/common/detail/Index.less'
import { fetchPost } from '../../../../utils/request'

class CheckRecord extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      tradeNo: props.tradeNo,
      loading: false,
      list: [],
      message: '',
      timer: null
    }
  }

  componentWillReceiveProps (props) {
    if (this.state.userId != props.userId) {
      this.setState({
        userId: props.userId,
        tradeNo: props.tradeNo
      }, () => {
        this.getData()
      })
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData () {
    this.setState({
      loading: true
    })
    if (this.state.tradeNo) {
      fetchPost(`/audit/user/${this.state.tradeNo}/apply`).then(json => {
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
        <span className='color-warning warning-animate'><Icon type='info-circle-o'/> {this.state.message}</span>
      )
    } else {
      return ''
    }
  }

  componentWillUnmount () {
    clearTimeout(this.state.timer)
  }

  render () {
    const columns = [
      {
        title: '订单号',
        dataIndex: 'tradeNo',
        key: 'tradeNo'
      },
      {
        title: '申请时间',
        dataIndex: 'createdDt',
        key: 'createdDt'
      },
      {
        title: '银行卡号',
        dataIndex: 'bankNo',
        key: 'bankNo'
      },
      {
        title: '银行名称',
        dataIndex: 'bankName',
        key: 'bankName'
      },
      {
        title: '金额',
        dataIndex: 'realCapital',
        key: 'realCapital'
      },
      {
        title: '天数',
        dataIndex: 'productDuration',
        key: '',
        render: (text, record) => (
          <span>
            {record.productDuration}
          </span>
        )
      },
      {
        title: '状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus'
      },
      {
        title: '产品类型',
        dataIndex: 'productName',
        key: 'productName'
      }
    ]

    return (
      <div className={`${Styles.checkRecord} ${Styles.partRight}`}>
        <Card title='申请记录' extra={this.message()}
              bodyStyle={{padding: 1, height: 300, overflow: 'auto', textAlign: 'center'}} noHovering={true}>
          <Table
            pagination={false}
            size='small'
            bordered
            dataSource={this.state.list}
            columns={columns}
            loading={this.state.loading}
          />
        </Card>
      </div>

    )
  }
}

export default CheckRecord

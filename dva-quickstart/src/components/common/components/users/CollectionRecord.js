
import React, { Component, PropTypes } from 'react'
import { Table, Card, Icon } from 'antd'
import { fetchPost } from '../../../../utils/request'
import Styles from '../../../finance/common/detail/Index.less'

class CollectionRecord extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      tradeNo:props.userId,
      collectionData: [],
      loading: false,
      message: '',
      timer: null
    }
  }

  componentDidMount () {
    console.log('--CollectionRecord-0--');
    this.getData()
  }

  componentWillReceiveProps (props) {
    if (this.state.userId != props.userId) {
      this.setState({
        userId: props.userId,
        tradeNo:props.userId,
        collectionData: []
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
    console.log('--CollectionRecord-1--', this.state.tradeNo);

    if (this.state.tradeNo) {
      fetchPost(`/usercollection/overdue/history/${this.state.tradeNo}/query`,
        this.state.params).then(json => {
          if (json.code === 0) {
            this.setState({
              collectionData: json.data.itemList,
              loading: false
            })
          } else {
            this.setState({
              collectionData: [],
              loading: false,
              message: json.msg
            })
          }
        })
    } else {
      this.setState({
        collectionData: [],
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

  changeField (field, value) {
    this.setState({
      [field]: value
    })
  }

  render () {
    const collectionColumns = [
      {
        key: 'tradeNo',
        title: '订单号',
        dataIndex: 'tradeNo'
      },
      {
        key: 'followUp',
        title: '跟进人',
        dataIndex: 'followUp'
      },
      {
        key: 'followDate',
        title: '跟进时间',
        dataIndex: 'followDate'
      },
      {
        key: 'productDuration',
        title: '借款类型',
        dataIndex: 'productDuration'
      },
      {
        key: 'overdueDays',
        title: '逾期天数',
        dataIndex: 'overdueDays'
      },
      {
        key: 'type',
        title: '操作类型',
        dataIndex: 'type'
      },
      {
        key: 'operateDesc',
        title: '操作内容',
        dataIndex: 'operateDesc'
      }
    ]

    return (
      <div style={{overflow: 'auto',}} className={Styles.partLeft}>
        <Card title='催收记录' extra={this.message()} bodyStyle={{padding: 1 }} noHovering={true}>
          <Table
            pagination={false}
            size='small'
            columns={collectionColumns}
            dataSource={this.state.collectionData}
            bordered
            loading={this.state.loading}
            />
        </Card>
      </div>
    )
  }
}
export default CollectionRecord

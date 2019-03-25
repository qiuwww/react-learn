/**
 * Created by xuxiaoqi on 2017/9/18.
 */
import React, { Component,  } from 'react'
import { Table, Card, Icon } from 'antd'
import Styles from '../../../finance/common/detail/Index.less'
import { fetchPost } from '../../../../utils/request'

class RepayDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      tradeNo:props.tradeNo,
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
        tradeNo:props.tradeNo,
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
      fetchPost(`/user/${this.state.tradeNo}/payback/detail`).then(json => {
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

  componentWillUnmount () {
    clearTimeout(this.state.timer)
  }

  render () {
    const columns = [
      {
        title: '实际还款时间',
        dataIndex: 'payOffDate',
        key: 'payOffDate',
        render:(text, record) => (
          record.billPayStatus == 2
            ?
            <span style={{color:'red'}}>{record.payOffDate}</span>
            :
            <span>{record.payOffDate}</span>

        )
      },
      {
        title: '交易号',
        dataIndex: 'tradeNo',
        key: 'tradeNo',
        render:(text, record) => (
        record.billPayStatus == 2
          ?
          <span style={{color:'red'}}>{record.tradeNo}</span>
          :
          <span>{record.tradeNo}</span>

      )
      },
      {
        title: '借款日',
        dataIndex: 'receivedDate',
        key: 'receivedDate',
        render:(text, record) => (
          record.billPayStatus == 2
            ?
            <span style={{color:'red'}}>{record.receivedDate}</span>
            :
            <span>{record.receivedDate}</span>

        )
      },
      {
        title: '借款金额',
        dataIndex: 'borrowCapital',
        key: 'borrowCapital',
        render:(text, record) => (
          record.billPayStatus == 2
            ?
            <span style={{color:'red'}}>{record.borrowCapital}</span>
            :
            <span>{record.borrowCapital}</span>

        )
      },
      {
        title: '应还时间',
        dataIndex: 'repaymentDate',
        key: 'repaymentDate',
        render:(text, record) => (
          record.billPayStatus == 2
            ?
            <span style={{color:'red'}}>{record.repaymentDate}</span>
            :
            <span>{record.repaymentDate}</span>

        )
      },
      {
        title: '应还金额',
        dataIndex: 'repaymentCapital',
        key: 'repaymentCapital',
        render:(text, record) => (
          record.billPayStatus == 2
            ?
            <span style={{color:'red'}}>{record.repaymentCapital}</span>
            :
            <span>{record.repaymentCapital}</span>

        )
      },
      {
        title: '未还金额',
        dataIndex: 'unPaidCaptial',
        key: 'unPaidCaptial',
        render:(text, record) => (
          record.billPayStatus == 2
            ?
            <span style={{color:'red'}}>{record.unPaidCaptial}</span>
            :
            <span>{record.unPaidCaptial}</span>

        )

      },
      {
        title: '逾期天数',
        dataIndex: 'overdueDays',
        key: 'overdueDays',
        render:(text, record) => (
          record.billPayStatus == 2
            ?
            <span style={{color:'red'}}>{record.overdueDays}</span>
            :
            <span>{record.overdueDays}</span>

        )
      },
      {
        title: '还款金额',
        dataIndex: 'flowPaidCaptial',
        key: 'flowPaidCaptial',
        render:(text, record) => (
          record.billPayStatus == 2
            ?
            <span style={{color:'red'}}>{record.flowPaidCaptial}</span>
            :
            <span>{record.flowPaidCaptial}</span>

        )
      },
      {
        title: '抵扣券',
        dataIndex: 'discountCapital',
        key: 'discountCapital',
        render:(text, record) => (
          record.billPayStatus == 2
            ?
            <span style={{color:'red'}}>{record.discountCapital}</span>
            :
            <span>{record.discountCapital}</span>

        )
      },
      {
        title: '操作人',
        dataIndex: 'repaymentOperator',
        key: 'repaymentOperator',
        render:(text, record) => (
          record.billPayStatus == 2
            ?
            <span style={{color:'red'}}>{record.repaymentOperator}</span>
            :
            <span>{record.repaymentOperator}</span>

        )
      }
    ]

    return (
      <div className={`${Styles.checkRecord} ${Styles.allPart}`}>
        <Card title='还款详情' extra={this.message()} bodyStyle={{padding: 1, maxHeight: 300, overflow: 'auto', textAlign: 'center'}} noHovering={true}>
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

export default RepayDetail

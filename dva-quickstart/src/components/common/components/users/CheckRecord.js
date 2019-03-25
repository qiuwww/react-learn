/**
 * Created by ziyu on 17/3/13.
 */
import React, {Component, } from 'react'
import {Table, Card, Icon, Popover, Button} from 'antd'
import Styles from '../../../finance/common/detail/Index.less'
import {fetchPost} from '../../../../utils/request'

class CheckRecord extends Component {
  constructor(props) {
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

  componentWillReceiveProps(props) {
    if (this.state.userId != props.userId || this.state.tradeNo != props.tradeNo) {
      this.setState({
        userId: props.userId,
        tradeNo: props.tradeNo,
      }, () => {
        this.getData()
      })
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    this.setState({
      loading: true
    })
    const {tradeNo} = this.state;
    if (!tradeNo && tradeNo === "object") {
      this.setState({
        list: [],
        loading: false
      })
    } else {
      fetchPost(`/audit/user/${this.state.tradeNo}/record`).then(json => {
        if (json.code === 0) {
          this.setState({
            loading:false
          },()=>{
            if(json.data&&json.data.list){
              this.setState({
                list:json.data.list
              })
            }
          })
        } else {
          this.setState({
            list: [],
            loading: false,
            message: json.msg
          })
        }
      })
    }
  }

  message() {
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

  componentWillUnmount() {
    clearTimeout(this.state.timer)
  }

  render() {
    const columns = [
      {
        title: '交易号',
        dataIndex: 'tradeNo',
        key: 'tradeNo'
      },
      {
        title: '操作人',
        dataIndex: 'auditor',
        key: 'auditor'
      },
      {
        title: '操作时间',
        dataIndex: 'verifiedDate',
        key: 'verifiedDate'
      },
      {
        title: '产品类型',
        dataIndex: '',
        key: '',
        render: (text, record) => (
          <span>
            {record.productType}/{record.productDuration}
          </span>
        )
      },
      {
        title: '结果',
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: '备注',
        dataIndex: 'reason',
        key: 'reason'
      },
      {
        title: '详细',
        dataIndex: 'auditDetail',
        key: 'auditDetail',
        render: (text, record) => (
          record.auditDetail
            ?
            <div style={{width: 70, position: 'relative', whiteSpace: 'nowrap'}}>
              <Popover placement="top" title="" content={record.auditDetail} trigger="click" arrowPointAtCenter>
                <Button>详细</Button>
              </Popover>
            </div>
            :
            <span></span>
        )
      }
    ]

    return (
      <div className={`${Styles.checkRecord} ${Styles.partRight}`}>
        <Card title='审核记录' extra={this.message()}
          bodyStyle={{padding: 1, overflow: 'auto', textAlign: 'center'}} noHovering={true}>
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

/**
 * Created by ziyu on 2017/7/26.
 */
import React, { Component, PropTypes } from 'react'
import { Table, message,Modal,Button ,Popconfirm} from 'antd'
import Title from '../../common/components/Title'
import { fetchPost } from '../../../utils/request'
import ListDetail from './ListDetail'
import {env,origin} from '../../../utils/config'


class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      params: {
        curBatchNo: null,
        realName: null,
        mobile: null,
        collectionNo: null,
        tradeNo: null
      },
      list: [],
      listDetail: [],
      loading: false,
      page: {
        currentPage: 1,
        pageSize: 30,
        totalCount: 1
      },
      visible: false
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData () {
    let self = this;
    fetchPost(`/collection/outOrderStatGet/list?currentPage=${self.state.page.currentPage}&pageSize=${self.state.page.pageSize}`, {}).then(res => {
      if (res.code === 0) {
        this.setState({
          list: res.data.collectionDistributeOutStatVos,
          page: res.page
        })
      } else {
        this.setState({
          list: []
        }, () => {
          message.error(res.msg)
        })
      }
    })
  }

  exportExcel(record) {
    var batchNo = record.batchNo;
    let url = `${origin}/collection/outOrderDetailGet/exportToExcel`;
    if (typeof(batchNo) != 'undefined') {
      url += `?batchNo=${batchNo}`
    }
    window.open(url)
  }

  showModal(record) {// 将modal显示
    this.setState({
      curBatchNo: record.batchNo,
      visible: true
    });

    this.setState({
      params:{
        ...this.state.params,
        curBatchNo:record.batchNo
      }
    });
  }

  showCount() {
    return <div>
      <h2>
        单批次导出条数建议不超过5000条
      </h2>
    </div>
  }
  nextpage(current) {
    this.setState({
      page: {
        ...this.state.page,
        currentPage: current
      }
    }, () => {
      // console.log(this.state.page,'this.state.page')
      this.getData();
    });
  }
  sendCancelAndhideModal = (e) => { // 调用子组件撤单并将modal隐藏
    this.refs.getListDetailButton.collectionCancel(e);
    this.setState({
      visible: false,
    }, () => {
      this.getData();
    });
  };


  hideModal = (e) => { // 将modal隐藏
    this.setState({
      visible: false,
    }, () => {
      this.getData();
    });
  };

  changeItem(key, value) { //提供给ListDetail回调
    this.setState({
      [key]: value
    });
  };

  render () {
    let self = this
    const columns = [
      {
        title: '催收批次',
        dataIndex: 'batchNo',
        key: 'batchNo'
      },
      {
        title: '催收人',
        dataIndex: 'followUp',
        key: 'followUp'
      },
      {
        title: '分单数',
        dataIndex: 'allocationNum',
        key: 'allocationNum'
      },
      {
        title: '催回数',
        dataIndex: 'paidNum',
        key: 'paidNum'
      }, {
        title: '撤单数',
        dataIndex: 'cancelNum',
        key: 'cancelNum'
      },
      {
        title: '在催数',
        dataIndex: 'onCollectionNum',
        key: 'onCollectionNum'
      },
      {
        title: '操作',
        render: (text, record) => {
          return <span>
            <Button type="primary" onClick={(e) => {
              this.showModal(record)
            }}>详细</Button>
            &nbsp;&nbsp;
            <Popconfirm title="你确定要导出此批次订单吗?" onConfirm={(e) => this.exportExcel(record)}>
              <Button type="primary">导出</Button>
            </Popconfirm>
          </span>
        }
      }

    ]

    const pagination = {
      total: this.state.page.totalCount || 0,
      pageSize: this.state.page.pageSize,
      showSizeChanger: false,
      showQuickJumper: true,
      showTotal(total) {
        return `总共 ${total} 条`;
      },
      onChange(current) {
        self.nextpage(current)
      }
    };

    return (
      <div>
        {this.showCount()}
        <Title title='外催对账列表' />
        <div>
          <Table pagination={pagination} key='orderNo'
            rowKey='orderNo' columns={columns} dataSource={self.state.list}
            loading={self.state.loading}
            bordered
            size='small'
          />
        </div>
        <Modal
          visible={this.state.visible}
          title={`详细列表(${this.state.curBatchNo})`}
          width="1080px"
          onOk={this.sendCancelAndhideModal}
          onCancel={this.hideModal}
          okText="确定"
          cancelText="取消"
        >
          <div>
            <ListDetail ref="getListDetailButton"
                        changeItem={(key, value) => this.changeItem(key, value)}
                        params={this.state.params}
            />
          </div>
        </Modal>
      </div>
    )
  }
}

export default Index

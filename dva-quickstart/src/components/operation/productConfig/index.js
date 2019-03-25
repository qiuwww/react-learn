import React, { Component,  } from 'react';
import { connect } from 'dva';
import { Card, Input, Button, Popconfirm, Table } from 'antd';
import AddModal from './modal';
const TextArea = Input.TextArea;

@connect(({ product }) => ({
  loading: product.loading,
  list: product.list,
}))


export default class ProductConfig extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount = () => {
    this.props.dispatch({
      type: 'product/fetch',
    });
    this.props.dispatch({
      type: 'product/fetchOptions',
    });
  }
  handleShowAddModal = () => {
    this.props.dispatch({
      type: 'product/showModals',
    });
  }
  handleEdit = (record) => {
    this.props.dispatch({
      type: 'product/showModals',
      payload: {
        data: { ...record },
      },
    });
  }
  handleUpdateFlag = (record) => {
    this.props.dispatch({
      type: 'product/fetchFlag',
      payload: {
        productId: record.productId,
        showFlag: record.showFlag === '1' ? '0' : '1',
      },
    });
  }
  render () {
    const { loading, list } = this.props;
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 16},
    };
    const columns = [
      {
        title: '借款金额',
        dataIndex: 'principalMoney',
      }, {
        title: '服务费',
        dataIndex: 'serviceCharge',
      }, {
        title: '借款利率',
        dataIndex: 'annualized',
      }, {
        title: '是否展期',
        dataIndex: 'isRenewable',
        render: (value) => {
          if (value) {
            return '是';
          } else {
            return '否';
          }
        }
      }, {
        title: '展期费',
        dataIndex: 'renewalCharge',
      }, {
        title: '逾期管理费',
        dataIndex: 'overdueServiceCharge',
      }, {
        title: '逾期利率',
        dataIndex: 'penaltyRate',
      }, {
        title: '操作',
        key: 'opera',
        width: 200,
        render: (record) => {
          const text = record.showFlag === '0' ? '上架' : '下架';
          const btn = record.showFlag === '0' ? <Button type="primary">上架</Button> : <Button>下架</Button>;
          return (<span>
            <Button onClick={() => this.handleEdit(record)} style={{ marginRight: 20 }}>编辑</Button>
            <Popconfirm title={`确定要${text}吗？`} onConfirm={() => this.handleUpdateFlag(record)}>
              {btn}
            </Popconfirm>
          </span>)
        }
      }
    ];
    return (
      <Card loading={loading}>
        <h3 style={{ marginBottom: 20, fontSize: 18 }}>借款产品列表</h3>
        <div style={{ marginBottom: 20 }}>
          <Button type="primary" onClick={this.handleShowAddModal}>新增借款产品</Button>
        </div>
        <Table
          bordered
          rowKey={(record, index) => index}
          dataSource={list}
          columns={columns}
          pagination={false}
        />
        <AddModal />
      </Card>
    )
  }
}

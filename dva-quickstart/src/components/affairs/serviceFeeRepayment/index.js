/**
 * Created by ziyu on 17/3/10.
 */

import Styles from './index.less';
import { fetchPost } from '../../../utils/request';
import moment from 'moment';
import { origin } from '../../../utils/hostName';


import React, { Component, PropTypes } from 'react'
import { Table, Button, Card, Modal, Row, Radio, Form, message, Col, Input, DatePicker, Select } from 'antd';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;



// 日期选择，默认当天
const today = moment();
const formatReg = 'YYYY-MM-DD';
const defaultDate = today.format(formatReg);
const FormItem = Form.Item;

class ServiceFeeRepayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 查询类型选项
      selectType: [],
      params: {
        'type': '',
        'context': '',
        'startDate': defaultDate,
        'endDate': defaultDate,
        'status': '0',
      },
      table: {
        loading: false,
        list: [],
        pagination: {
          current: 1,
          currentPage: 1,
          pageSize: 10,
        },
        columns: [
          {
            title: '交易订单号',
            dataIndex: 'tradeNo',
            // fixed: 'left',
          }, {
            title: '支付订单号',
            dataIndex: 'payNo',
          }, {
            title: '支付流水号',
            dataIndex: 'payBillNo',
          }, {
            title: '申请时间',
            dataIndex: 'applyDate',
          }, {
            title: '通过时间',
            dataIndex: 'passDate',
          }, {
            title: '姓名',
            dataIndex: 'name',
          }, {
            title: '手机',
            dataIndex: 'mobile',
          }, {
            title: '支付状态',
            dataIndex: 'status',
          }, {
            title: '支付方式',
            dataIndex: 'payType',
          }
        ]
      }
    }
  }

  componentDidMount() {
    this.getCheckList();
    this.getTableData();
  }
  getTableData() {
    let self = this;
    let table = this.state.table;
    let { pagination } = this.state.table;
    return new Promise((resolve, reject) => {
      fetchPost(`/order/service/page?currentPage=${pagination.currentPage}&pageSize=${pagination.pageSize}`, {
        ...self.state.params
      }, 'POST').then((res) => {
        if (res.code === 0) {
          self.setState({
            table: Object.assign({}, table, {
              list: res.data.serviceTradeList,
              pagination: {
                ...res.page,
                current: res.page.currentPage,
                total: res.page.totalCount,
              }
            })
          });
          resolve(res);
        } else {
          reject(res);
          message.error(res.msg)
        }
      })
    })
  }
  // pagenation的处理函数
  handleFetch = (currentPage = 1) => {
    let self = this;
    let { table } = self.state;
    let copyTable = Object.assign({}, table);
    copyTable.pagination.currentPage = currentPage;
    copyTable.pagination.current = currentPage;
    this.setState({ table: copyTable });
    self.getTableData();
  }
  async getCheckList() {
    let self = this;
    fetchPost('/order/get/select_type', {}, 'GET').then((res) => {
      if (res.code === 0) {
        self.setState({
          selectType: res.data.selectType
        });
      } else {
        message.error(res.msg)
      }
    })
  }
  refreshParams = (cb) => {
    let self = this;
    const { validateFields } = this.props.form;
    validateFields((err, values) => {
      if (!err) {
        let params = {};
        params.type = values.type || '';
        params.status = values.status || '';
        params.startDate = values.date ? moment(values.date[0]).format(formatReg) : '';
        params.endDate = values.date ? moment(values.date[1]).format(formatReg) : '';
        params.context = values.context || '';
        self.setState({
          params
        }, cb);
      } else {
        message.error('数据填写有误')
      }
    });
  }
  searchHandler = (json) => {
    var newParams = json || {};
    this.refreshParams(() => {
      let table = this.state.table;
      this.setState({
        table: {
          ...table,
          pagination: {
            current: 1,
            currentPage: 1,
            pageSize: 10,
          }
        },
        params: {
          ...this.state.params,
          ...newParams,
        }
      }, () => {
        this.getTableData();
      })
    });
  }
  // 当前面的radio改变的时候，触发重新搜索的接口
  changeField(e) {
    this.searchHandler({status: e.target.value});
  }

  exportData = () => {
    this.refreshParams(() => {
      let exportType = 'service';
      let query = '?';
      let params = this.state.params;
      Object.keys(params).forEach((item) => {
        query += `${item}=${params[item]}&`;
      });
      window.location.href = origin + `/order/export/excel${query}exportType=${exportType}`;
    });
  }
  render() {
    let { selectType, table, params } = this.state;
    let { loading, list, pagination, columns } = table;

    const { getFieldDecorator } = this.props.form;
    return (
      <Card bordered={false} className={Styles.wrap}>
        <Form className={Styles.header}>
          <Row gutter={16}>
            <Col span="5">
              <FormItem label="" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                {getFieldDecorator('status', {
                  initialValue: params.status,
                })(
                  <RadioGroup onChange={this.changeField.bind(this)}>
                    <RadioButton value="0">全部</RadioButton>
                    <RadioButton value="1">待支付</RadioButton>
                    <RadioButton value="2">已支付</RadioButton>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem
                {...{
                  labelCol: {
                    span: 8
                  },
                  wrapperCol: {
                    span: 16
                  }
                }}
                label="申请时间">
                {getFieldDecorator('date', {
                  initialValue: [today, today]
                })(
                  <RangePicker />
                )}
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem
                {...{
                  labelCol: {
                    span: 10
                  },
                  wrapperCol: {
                    span: 14
                  }
                }}
                label="查询类型">
                {getFieldDecorator('type', {
                  initialValue: '',
                })(
                  <Select>
                    <Option value=''>全部</Option>
                    {selectType.length ? selectType.map((item) => {
                      return <Option value={String(item.type)} key={item.type}>{item.desc}</Option>;
                    }) : null}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem
                {...{
                  labelCol: {
                    span: 8
                  },
                  wrapperCol: {
                    span: 16
                  }
                }}
                label="输入值"
              >
                {getFieldDecorator('context', {

                })(
                  <Input placeholder="请输入查询类型的参数"/>
                )}
              </FormItem>
            </Col>
            <Col span="3" >
              <FormItem >
                <Button type="primary" onClick={() => this.searchHandler()}>搜索</Button>
              </FormItem>
            </Col>

          </Row>
          <Row>
            <Col>
              <Button type="primary" onClick={this.exportData.bind(this)}>导出数据</Button>
            </Col>
          </Row>
        </Form>
        <Table
          loading={loading}
          bordered
          rowKey={(record, index) => index}
          dataSource={list}
          columns={columns}
          pagination={{
            showQuickJumper: true,
            // showTotal,
            ...pagination,
            showTotal: (total, range) => `总共${total}条`,
            onChange: (page, pageSize) => {
              this.handleFetch(page, pageSize);
            }
          }}
        />
      </Card >);
  }
}

ServiceFeeRepayment = Form.create()(ServiceFeeRepayment)

export default ServiceFeeRepayment;

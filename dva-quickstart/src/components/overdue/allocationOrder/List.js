import React, { Component, PropTypes } from 'react'
import { fetchPost } from '../../../utils/request'
import {
  Table,
  message,
  Button,
  Form,
  Input,
  Modal,
  Select,
  Card,
} from 'antd'
import Styles from './Index.less'

const FormItem = Form.Item
const Option = Select.Option

class List extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: null,
      params: props.params,
      list: [],
      loading: false,
      page: {
        currentPage: 1,
        pageSize: 11,
        totalCount: null,
      },
      clickRowId: null,
      selectedRowKeys: [],
      selectRows: [],
      visible: false,
      overdueAdminList: [],
      currentIndex: 0,

    }
  }

  componentDidMount () {
    this.getData()
    this.getAdminCollectionList()
  }

  componentWillReceiveProps (props) {
    if (props.params != this.state.params) {
      this.setState({
        params: props.params,
      }, () => {
        this.getData()
      })
    }
  }

  getData () {
    this.setState({
      loading: true,
    })

    let currentPage = this.state.page.currentPage
    let pageSize = this.state.page.pageSize
    let copyParams = {
      isToday: 0,
    }
    for (let i in this.state.params) {
      let value = this.state.params[i]
      if (!value) {
        copyParams[i] = null
      } else {
        copyParams[i] = value
      }
    }

    fetchPost(
      `/collection/overdueOrderGet/list?currentPage=${currentPage}&pageSize=${pageSize}`,
      copyParams).then(json => {
      let list = json.data.itemList
      if (json.code === 0) {
        if (list.length > 0) {
          this.setState({
            userId: list[0].tradeNo,
            collectionNo: list[0].collectionNo,
            list,
            page: json.page,
            loading: false,
            selectedRowKeys: [],
          }, () => {
            this.props.changeField({
              userId: list[0].tradeNo,
              item: list[0],
            })
          })
        } else {
          this.setState({
            userId: null,
            list: [],
            loading: false,
            page: {
              currentPage: 1,
              pageSize: 11,
              totalCount: null,
            },
            selectedRowKeys: [],
          }, () => {
            this.props.changeField({
              userId: null,
              item: {},
            })
          })
        }
      } else {
        message.error(json.msg)
        this.setState({
          userId: null,
          list: [],
          loading: false,
          page: {
            currentPage: 1,
            pageSize: 11,
            totalCount: null,
          },
          selectedRowKeys: [],
        }, () => {
          this.props.changeField({
            userId: null,
            item: {},
          })
        })
      }
    })
  }

  getAdminCollectionList () {
    fetchPost('/collection/admin/query', {}).then(json => {
      if (json.code === 0) {
        let list = json.data.itemList;
        if (list !== null && list.length > 0) {
          this.setState({
            overdueAdminList: list,
          }, () => {
            this.props.changeField({
              overdueAdminList: list,
            })
          })
        }
      } else {
        message.error(json.msg)
      }
    })
  }

  nextpage (current) {
    this.setState({
      page: {
        ...this.state.page,
        currentPage: current,
      },
    }, () => {
      this.getData()
    })
  }

  // 单击行
  handleClickRow (record, index) {
    this.setState({
      userId: record.tradeNo,
      collectionNo: record.collectionNo,
      currentIndex: index,
    }, () => {
      this.props.changeField({
        userId: record.tradeNo,
        collectionNo: record.collectionNo,
        item: record,
      })
    })
  }

  // 单击行，样式改变
  handleChosedRow (itemId, index) {
    if (index === this.state.currentIndex) {
      return Styles.active
    } else {
      return ''
    }
  };

  isShow (record) {
    if (record.followUp === null) {
      return false
    }
    return true
  }

  batchDistribute () {
    if (this.state.params.isNewAdd == null) {
      message.error('请先选择新增或复借')
      return
    }

    if (this.state.params.isAllocation == null ||
      this.state.params.isAllocation == 1) {
      message.error('请先选择分单状态为：未分配')
      return
    }

    this.setState({
      visible: true,
    })
  }

  getOverdueAdmin (formItemLayout, getFieldDecorator) {
    if (this.state.overdueAdminList != null &&
      this.state.overdueAdminList.length > 0) {
      let content = []
      this.state.overdueAdminList.map(function (item) {
        content.push(
          <Option key={item.followId}
                  value={`${item.followId.toString()}|${item.name}`}>{item.name}</Option>,
        )
      })
      return <FormItem
        {...formItemLayout}
        label='催收人'
      >
        {getFieldDecorator('followId', {
          initialValue: '',
          rules: [{required: true, message: 'Please select your follow!'}],
        })(
          <Select placeholder='催收人'
                  style={{width: 230}}>
            <Option value=''>请选择</Option>
            {content}
          </Select>,
        )}
      </FormItem>
    }
    return ''
  }

  showDetail () {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    }
    return <div>
      <Form horizontal onSubmit={this.handleSubmit}
            style={{marginTop: 15, width: '90%'}}>

        {this.getOverdueAdmin(formItemLayout, getFieldDecorator)}

        <FormItem
          {...formItemLayout}
          label='分成'
        >
          {getFieldDecorator('externalRate', {
              initialValue: '0.00',
              rules: [
                {
                  required: true,
                  message: 'Please input your externalRate!',
                }],
            },
          )(
            <Input placeholder='0到1之间'/>,
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='批次号'
        >
          {getFieldDecorator('batchNo', {
            rules: [{required: true, message: 'Please input your batchNo!'}],
          })(
            <Input placeholder='如：20160824hf001'/>,
          )}
        </FormItem>
      </Form>
    </div>
  }

  handleCancel () {
    this.props.form.resetFields()
    this.setState({visible: false})
  }

  distribute () {
    // 验证
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return false
      }
      if (values.externalRate >= 1 || values.externalRate < 0) {
        message.error('分成比例在0和1之间！')
        return false
      }

      let tradeNos = this.state.selectRows.map((value, index) => (
        value.tradeNo
      ))
      let follow = values.followId ? values.followId.split('|') : null;
      if (this.state.selectedRowKeys.length > 0) {
        fetchPost('/collection/order/distribute', {
          batchNo: values.batchNo,
          externalRate: values.externalRate,
          followId: follow ? follow[0] : '',
          followUp: follow ? follow[1] : '',
          tradeNos,
          isNewAdd: this.state.params.isNewAdd,
        }).then(json => {
          if (json.code === 0) {
            message.info('分单成功')
            this.setState({
              selectedRowKeys: [],
              visible: false,
            })
            this.props.form.resetFields()
            this.getData()
          } else {
            message.error(json.msg)
          }
        })
      }
    })
  }

  changePage (value) {
    if (!value) {
      value = 11
    }
    this.setState({
      page: {
        currentPage: 1,
        pageSize: value,
        totalCount: 1,
      },
    }, () => {
      this.getData()
    })
  }

  render () {
    let self = this
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '手机号码',
        dataIndex: 'mobile',
        key: 'mobile',
      }, {
        title: '身份证',
        key: 'identityNo',
        dataIndex: 'identityNo',
      }, {
        title: '借款金额',
        key: 'realCapital',
        dataIndex: 'realCapital',
      }, {
        title: '应还总额',
        key: 'expireAmount',
        dataIndex: 'expireAmount',
      }, {
        title: '已还金额',
        key: 'paidAmount',
        dataIndex: 'paidAmount',
      }, {
        title: '罚息金额',
        key: 'lateFee',
        dataIndex: 'lateFee',
      }, {
        title: '跟进人',
        key: 'followUp',
        dataIndex: 'followUp',
      },
    ]

    const pagination = {
      total: self.state.page.totalCount,
      pageSize: self.state.page.pageSize,
      showSizeChanger: false,
      showQuickJumper: true,
      showTotal (total) {
        return `总共 ${total} 条`
      },
      onChange (current) {
        self.nextpage(current)
      },
    }
    const selectedRowKeys = this.state.selectedRowKeys
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        let selectRows = []
        selectedRows.map(function (item) {
          selectRows.push(item)
        })
        this.setState({
          selectedRowKeys,
          selectRows,
        })
      },
      getCheckboxProps: (record) => (
        {
          disabled: this.isShow(record),
        }
      ),
    }

    const hasSelected = selectedRowKeys.length > 0
    const {getFieldDecorator} = this.props.form
    return (
      <div className='mt10'>
        <div className='ant-layout-container'>
          <div style={{marginBottom: 16}}>
            分页条数：
            {
              getFieldDecorator('pagination', {
                initialValue: '',
              })(
                <Select style={{width: 100}}
                        onChange={(e) => this.changePage(e)}>
                  <Option value=''>默认</Option>
                  <Option value='100'>100条</Option>
                  <Option value='200'>200条</Option>
                  <Option value='500'>500条</Option>
                </Select>,
              )
            }
            &nbsp;&nbsp;
            <Button type='primary' disabled={!hasSelected}
                    onClick={(e) => this.batchDistribute()}>分单</Button>
            <span style={{marginLeft: 8}}>{hasSelected
              ? `已选中 ${selectedRowKeys.length} 条`
              : ''}</span>
          </div>
          <div>注：已还金额和未还金额为(本金+罚息)</div>
          <Card bodyStyle={{padding: 0}} noHovering={true}>
            <Table
              key='collectionNo'
              pagination={pagination}
              columns={columns}
              dataSource={self.state.list}
              loading={self.state.loading}
              onRowClick={(record, index) => this.handleClickRow(record, index)}
              rowClassName={(record, index) => this.handleChosedRow(
                record.collectionNo, index)}
              bordered
              size='small'
              style={{background: '#FFFFFF'}}
              rowSelection={rowSelection}
            />
          </Card>
          <Modal
            visible={this.state.visible}
            title='逾期分单'
            onCancel={() => { this.handleCancel() }}
            footer={[
              <Button key='back' type='ghost' size='large'
                      onClick={() => { this.handleCancel() }}>取消</Button>,
              <Button key='submit' type='primary' size='large'
                      onClick={() => { this.distribute() }}>
                确定分单
              </Button>]}
          >
            {this.showDetail()}
          </Modal>

        </div>
      </div>
    )
  }
}

List = Form.create()(List)
export default List

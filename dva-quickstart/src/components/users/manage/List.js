/**
 * Created by ziyu on 17/3/7.
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { fetchPost } from '../../../utils/request';
import { Table, message, Card, Popconfirm, Modal, Select, Form } from 'antd';
import styles from './Index.less';
const FormItem = Form.Item;

@connect((state) => ({
  manage: state.manage,
}))
@Form.create()

export default class List extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      refresh: false,
      params: {
        key: '',
        keyType: '',
        productType: null,
        borrowCashFrom: '',
        verifyType: 1,
      },
      page: {
        currentPage: 1,
        pageSize: 20,
        totalCount: 0,
      },
      list: [],
      loading:false,
      id: null,
      visible: false,
      userCode: '',
    }
  }

  //初始化方法
  componentDidMount () {
    this.props.dispatch({
      type: 'manage/fetchBlackSelect',
      payload: {}
    });
  }

  componentWillReceiveProps (props) {
    this.setState({
      loading: props.loading
    })
    if (props.list.length > 0) {
      if (props.userId != this.state.userId || props.list != this.state.list) {
        this.setState({
          list: props.list,
          userId: props.userId,
          page: props.page
        })
      }
    } else {
      this.setState({
        list: [],
        id: null,
        userId: null
      })
    }
  }

  //请求数据
  // getData () {
  //   let mobile = this.state.params.mobile
  //   // debugger;
  //
  //   if (typeof(mobile) === 'undefined') {
  //     return false
  //   }
  //
  //   let url = `/user/mobile/${mobile}?currentPage=${this.state.page.currentPage}&pageSize=${this.state.page.pageSize}`
  //   let urlNew = `/user/userlist/by/type?currentPage=${this.state.page.currentPage}&pageSize=${this.state.page.pageSize}`
  //   fetchPost(urlNew, this.state.params).then(json => {
  //     if (json.code === 0) {
  //       let list = json.data.userInfoVOList
  //       console.log(list,';list')
  //       if (list.length > 0) {
  //         // let page = json.data.page
  //         this.setState({
  //           list,
  //           userId: list[0].userCode,
  //           loading: false
  //         },()=>{
  //           console.log(this.state.list,'this.state.list1323')
  //         })
  //
  //         this.props.changeOrder({
  //           userId: list[0].userCode,
  //         })
  //       } else {
  //         this.setState({
  //           list,
  //           userId: null,
  //           loading: false
  //         })
  //
  //         this.props.changeOrder({
  //           userId: null,
  //           refresh: false,
  //         })
  //       }
  //     } else {
  //       message.error(json.msg)
  //     }
  //   })
  // }

  //单击行
  handleClickRow (record) {
    this.setState({
      userId: record.userCode,
    }, () => {
      this.props.changeOrder({
        userId: record.userCode,
        tradeNo:record.tradeNo,
      })
    })
  }

  //单击行 样式改变
  handleChosedRow (itemId) {
    if (itemId == this.state.userId) {
      return `${styles.listItem} ${styles.active}`
    } else {
      return styles.listItem
    }
  }

  show (count, overCount) {
    let color = '#2db7f5'
    if (overCount > 0) {
      color = 'red'
    }
    return <div>
      <a href="JavaScript:void(0);">{count} / <span
        style={{color,}}>{overCount}</span></a>
    </div>
  }

  setPagination () {
    let self = this
    return {
      total: this.state.page.totalCount,
      pageSize: this.state.page.pageSize,
      showSizeChanger: false,
      showQuickJumper: true,
      showTotal (total) {
        return `总共 ${total} 条`
      },
      onChange (current) {
        self.setState({
          page: {
            ...self.state.page,
            current
          }
        }, () => {
          self.props.currentPage(current)
        })
      }
    }
  }
  handleChangeBlack = (type, userCode, userClass = null) => {
    this.props.dispatch({
      type: 'manage/fetchUpdateBlack',
      payload: {
        userCode: userCode,
        operationType: type,
        type: 1,
        userClass,
      },
      callback: () => {
        const { params } = this.props;
        this.props.fetch();
        this.handleHideModal();
      }
    });
  }
  handleShowBlackModal = (userCode) => {
    this.setState({
      visible: true,
      userCode: userCode,
    });
  }
  handleHideModal = () => {
    this.setState({
      visible: false,
      userCode: '',
    });
  }
  handleModalOk = () => {
    const { userCode } = this.state;
    const { form: { validateFields, setFieldsValue } } = this.props;
    validateFields(['userClass'], (err, values) => {
      if (!err) {
        this.handleChangeBlack('add', this.state.userCode, values.userClass);
        setFieldsValue({
          userClass: undefined,
        });
      }
    });
  }
  handleDeleteUser = (userCode) => {
    this.props.dispatch({
      type: 'manage/fetchUpdateBlack',
      payload: {
        userCode: userCode,
        operationType: 'add',
        type: 2,
      },
      callback: () => {
        // const { params } = this.props;
        this.props.fetch();
      }
    });
  }
  render () {
    const { manage: { blackSelect }, form: { getFieldDecorator } } = this.props;
    let self = this;

    const columns = [
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        width: 80
      }, {
        title: '手机号/身份证号',
        key: 'mobile',
        dataIndex: '',
        render: (text, record) => (
          <div>
            {`${record.mobile}`}
            <br/>
            {`${record.identityNo}`}
          </div>
        ),
        width:100,
        textAlign:"center"
      },{
        title: '申请次数/借款次数/逾期次数',
        key: 'count',
        dataIndex: 'count',
        render: (text, record) => (
          <div>
            {`${record.applyCount}次/`}
            {`${record.passCount}次/`}
            {`${record.overdueCount}次`}
          </div>
        ),
        width:100
      },{
        title: '注册时间',
        key: 'registerDate',
        dataIndex: 'registerDate',
        render: (text, record) => text ? text.split(" ")[0] : '',
        width:100
      },{
        title: '当前状态',
        key: 'orderStatus',
        dataIndex: 'orderStatus',
        width:50
      }, {
        title: '黑名单',
        dataIndex: 'isBlack',
        width: 50,
        render: (value, record) => {
          const text = value ? '移除' : '添加';
          return value ? <Popconfirm placement="right" title={`确认${text}吗？`} onConfirm={() => this.handleChangeBlack('delete', record.userCode)}>
            <a>{text}</a>
          </Popconfirm> :
          <a onClick={() => this.handleShowBlackModal(record.userCode)}>{text}</a>;
        }
      }, {
        title: '永久删除',
        key: 'delete',
        width: 50,
        render: (value, record) => <Popconfirm placement="right" title={`确认永久删除客户资料吗？`}
          onConfirm={() => this.handleDeleteUser(record.userCode)}>
          <a>删除</a>
        </Popconfirm>
      }
    ]

    return (

      <div className="ant-layout-container">
        <Card bodyStyle={{padding: 0, height: 1300,width:'auto'}} bordered={false} noHovering={true}>
          <Table pagination={this.setPagination(this)} key='tradeNo' columns={columns} style={{textAlign:"center",}}
            dataSource={self.state.list}
            loading={self.state.loading}
            bordered
            onRowClick={(record) => this.handleClickRow(record)}
            rowClassName={(record) => this.handleChosedRow(record.userCode)}
            size="small"
          >
          </Table>
        </Card>
        <Modal
          title="添加黑名单"
          visible={this.state.visible}
          onOk={this.handleModalOk}
          onCancel={this.handleHideModal}
          okText="确认"
          cancelText="取消"
        >
          <Form>
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 14}}
              label='类别'
            >
              {getFieldDecorator('userClass', {
                rules: [{ required: true, message: '请选择类别!' }],
              })(
                <Select style={{ width: 200 }}>
                  {blackSelect.map((item) => <Select.Option key={item.type}>{item.desc}</Select.Option>)}
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>

    )
  }
}

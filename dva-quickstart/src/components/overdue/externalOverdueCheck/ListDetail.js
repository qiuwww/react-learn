import React from "react";
import {fetchPost} from "../../../utils/request";
import {Button, Card, Col, Form, Input, message, Table, Popconfirm} from "antd";
import Styles from "./Index.less";

const InputGroup = Input.Group;

class List extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      params: props.params,
      list: [],
      listDetail: [],
      loading: false,
      page: {
        currentPage: 1,
        pageSize: 13,
        totalCount: 1
      },
      clickRowId: null,
      selectedRowKeys: [],
      selectRows: [],
      visible: false,
    };
  }

  initState() {
    return {
      loading: false,
      selectedRowKeys: [],
      selectRows: []
    }
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(props) {
    if(props.params!=this.state.params){
      this.setState(this.initState);// 页面重新打开后初始化成员
      this.setState({
        params: props.params
      }, ()=> {
        this.getData();
      });
    }
  }


  getData() {
    this.setState({
      loading: true
    });
    fetchPost('/collection/outOrderDetailGet/list?currentPage=' + this.state.page.currentPage + "&pageSize=" + this.state.page.pageSize,
      this.state.params).then(json => {
      if (json.code == 0) {
        this.setState({
          listDetail: json.data.list,
          page: json.page,
          loading: false
        });
      } else {
        message.error(json.msg);
      }
    });
  }

  nextpage(current) {
    this.setState({
      page: {
        ...this.state.page,
        currentPage: current
      },
      selectedRowKeys: [],
      selectRows: []
    }, ()=> {
      this.getData();
    });
  }

  //单击行
  handleClickRow(record) {
    this.setState({
      tradeNo: record.tradeNo
    });
  }

  //单击行，样式改变
  handleChosedRow(itemId) {
    if (this.state.tradeNo !=null && itemId == this.state.tradeNo) {
      return Styles.active;
    } else {
      return "";
    }
  };

  handleChange(key, value) {
    this.setState(this.initState);
    if (key == 'params') {
      this.setState({
        [key]: value
      }, () => {
        this.getData()
      });
    } else {
      this.setState({
        params: {
          ...this.state.params,
          [key]: value
        }
      }, () => {
        this.getData()
      })
    }
  }

  isShow(record) {
    if ("已催回" == record.paidStatus)
      return true;
    else
      return false;
  }

  batchCancel(e) {//全部撤单
    e.preventDefault();
    fetchPost('/collection/outOrder/cancel', {
      batchNo: this.state.params.curBatchNo
    }).then(json => {
      if (json.code == 0) {
        message.info('单批次撤单成功');
        this.setState(this.initState, () => {
          this.getData();
        });
      } else {
        message.error(json.msg);
      }
    });
  }

  collectionCancel(e) {//发送撤单请求
    e.preventDefault();
    fetchPost('/collection/outOrder/cancel', {
      tradeNos: this.state.selectRows
    }).then(json => {
      if (json.code == 0) {
        message.info('撤单成功');
        this.setState(this.initState, () => {
          this.getData();
        });
      } else {
        message.error(json.msg);
      }
    });
  }

  changeItem(key, value) {
    this.setState({
      params: {
        ...this.state.params,
        [key]: value
      }
    })
  }

  render() {
    var self = this;
    const columns = [{
      title: '借款人姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '手机号码',
      dataIndex: 'mobile',
      key: 'mobile'
    }, {
      title: '订单号',
      key: 'tradeNo',
      dataIndex: 'tradeNo'
    }, {
      title: '未还金额',
      key: 'noPayAmount',
      dataIndex: 'noPayAmount'
    }, {
      title: '当前状态',
      key: 'paidStatus',
      dataIndex: 'paidStatus'
    }
    ];

    const pagination = {
      total: self.state.page.totalCount,
      pageSize: self.state.page.pageSize,
      showSizeChanger: false,
      showQuickJumper: true,
      showTotal(total){
        return `总共 ${total} 条`;
      },
      onChange(current) {
        self.nextpage(current)
      }
    };

    const selectedRowKeys = this.state.selectedRowKeys;
    const rowSelection = {
      selectedRowKeys: selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        var selectRows = [];
        selectedRows.map(function (item) {
          selectRows.push(item.tradeNo);
        });
        this.setState({
          selectedRowKeys: selectedRowKeys,
          selectRows: selectRows
        })
      },
      getCheckboxProps: (record) => ({
        disabled: this.isShow(record)
      })
    };

    const hasSelected = selectedRowKeys.length > 0;

    return (
      <div className="ant-layout-container">
        <InputGroup size="large">
          <Col span="5">
            <Input addonBefore="借款人姓名" value={this.state.params.realName}
                   onChange={(e) => this.changeItem('realName', e.target.value)}
                   onBlur={(e) => this.handleChange('realName', e.target.value)}/>
          </Col>
          <Col span="5">
            <Input addonBefore="手机号码" value={this.state.params.mobile}
                   onChange={(e) => this.changeItem('mobile', e.target.value)}
                   onBlur={(e) => this.handleChange('mobile', e.target.value)}/>
          </Col>
          <Col span="5">
            <Input addonBefore="订单号" value={this.state.params.tradeNo}
                   onChange={(e) => this.changeItem('tradeNo', e.target.value)}
                   onBlur={(e) => this.handleChange('tradeNo', e.target.value)}/>
          </Col>
          <Button type="primary" onClick={(e) => this.collectionCancel(e)}>撤单</Button>&nbsp;&nbsp;
          <Popconfirm title="确认全部撤单?" onConfirm={(e) => this.batchCancel(e)}>
            <Button type="primary">全部撤单</Button>
          </Popconfirm>
        </InputGroup>

        <div style={{ marginBottom: 16 }}>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `已选中 ${selectedRowKeys.length} 条` : ''}</span>
        </div>

        <Card bodyStyle={{padding: 0}} bordered={false} noHovering={true}>
          <Table
            rowKey='tradeNo'
            pagination={pagination}
            columns={columns}
            dataSource={self.state.listDetail}
            loading={self.state.loading}
            onRowClick={(record) => this.handleClickRow(record)}
            rowClassName={(record) => this.handleChosedRow(record.tradeNo)}
            bordered
            size="small"
            style={{background: '#FFFFFF'}}
            rowSelection={rowSelection}
          >
          </Table>
        </Card>
      </div>
    )
  }
}

export  default List;

/**
 * Created by yujianfu on 2016/11/17.
 */
import React, {Component, PropTypes} from 'react'
import {fetchPost} from './../../../utils/request'
import {Table , Select} from 'antd';
const Option = Select.Option;

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reload: false,
      mode: "full",
      data: null,
      page: {
        pageNum: 1,
        pageSize: 6
      }
    }
  }

  componentWillReceiveProps(props) {
    if (props.reload == true) {
      this.getData();
    }
    if (props.mode != this.state.mode) {
      this.setState({
        mode: props.mode
      })
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    fetchPost('/banner/draft/list?pageNum=' + this.state.page.pageNum + "&pageSize=" + this.state.page.pageSize).then(json => {
      if (json.data != null) {
        var data = json.data.list;
        this.setState({
          data: data,
          page: json.data.page,
        });
      }
    });
  }

  nextPage(currentPage) {
    this.setState({
      page: {
        ...this.state.page,
        pageNum: currentPage
      }
    }, () => {
      this.getData();
    })
  }

  render() {
    var self = this;
    if (this.state.mode == "full") {
      var columns = [{
        title: 'id',
        dataIndex: 'id',
        key: 'id',
        width: 50
      }, {
        title: '图片',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        width: 150,
        render: (text, record) => (
          <img style={{width: '100%'}} src={record.imageUrl}/>
        )
      }, {
        title: '通告名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '类型',
        dataIndex: 'typeMsg',
        key: 'typeMsg',
        render: (text, record) => (
          <div>
            {record.type == 2 ? record.typeMsg + " ( " + record.startDate + " ~ " + record.endDate + " ) " : record.typeMsg}
          </div>
        )
      }, {
        title: '跳转地址',
        dataIndex: 'url',
        key: 'url',
      }];
    }
    else {
      var columns = [ {
        title: '图片',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        width: 150,
        render: (text, record) => (
          <img style={{width: '100%'}} src={record.imageUrl}/>
        )
      }, {
        title: '通告名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '类型',
        dataIndex: 'typeMsg',
        key: 'typeMsg',
        render: (text, record) => (
          <div>
            {record.type == 2 ? record.typeMsg + " ( " + record.startDate + " ~ " + record.endDate + " ) " : record.typeMsg}
          </div>
        )
      }];
    }

    const pagination = {
      total: self.state.page.totalNum,
      pageSize: self.state.page.pageSize,
      showSizeChanger: false,
      showQuickJumper: true,
      showTotal(total){
        return `总共 ${total} 条`;
      },
      onChange(current) {
        self.nextPage(current)
      }
    };

    return (
      <div style={{paddingLeft:10}}>
        <Table
          pagination={pagination}
          bordered
          dataSource={this.state.data}
          columns={columns}
          title={() => 'banner池'}
        />
      </div>
    )
  }
}


export default List;

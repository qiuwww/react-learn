/**
 * Created by ziyu on 17/3/14.
 */

import React, { Component, PropTypes } from 'react'
import { Table, Card } from 'antd';
import Styles from './../Index.less'
import { fetchPost } from './../../../../../utils/request'

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.userId,
      list: [],
      page: {
        totalNum: 0,
        pageSize: 5
      },
      title: '用户注册信息'
    }
  }

  componentDidMount () {
    this.getData()
  }

  componentWillReceiveProps(props) {
    if (this.state.userId !== props.userId) {
      this.setState({
        userId: props.userId
      }, () => {
        this.getData()
      })
    }
  }

  getData() {
    if(this.state.userId != null) {
      fetchPost(`/user/${this.state.userId}/register/info`, this.state.params).then(json => {
        if (json.code === 0) {
          this.setState({
            list: [json.data]
          })
        }
      });
    } else {
      this.setState({
        list: []
      })
    }

  }


  render() {
    const columns = [
      {
        title: '用户id',
        dataIndex: 'userId',
        key: 'userId'
      },
      {
        title: '姓名/手机号',
        dataIndex: 'telephone',
        key: 'telephone',
        render: (text, record) => {
          return <span>{record.userName} / {record.mobile}</span>
        }
      },
      {
        title: '渠道',
        dataIndex: 'channel',
        key: 'channel'
      },
      {
        title: 'app版本号',
        dataIndex: 'version',
        key: 'version',
        render: (text, record) => {
          return <span>{record.platform} / {record.version}</span>
        }
      },
      {
        title: '注册时间',
        dataIndex: 'registerDate',
        key: 'registerDate'
      },
      {
        title: '申请数/通过数',
        dataIndex: 'times',
        key: 'times',
        render: (text, record) => {
          return <span>{record.applyCount} / {record.passCount}</span>
        }
      }
    ];

    return (
      <div className={Styles.detailModule}>
        <Card title={this.state.title} bodyStyle={{padding: 1}} noHovering={true}>
          <Table columns={columns} key='name' pagination={false} dataSource={this.state.list}
                 loading={this.state.loading}
                 bordered
                 size="small"
          >
          </Table>
        </Card>

      </div>
    )
  }

}

export default Register

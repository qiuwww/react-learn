/**
 * Created by yujianfu on 2016/11/10.
 */
import React, {Component, PropTypes} from 'react'
import {Card, Table, Icon, message, Popover, Input, Button} from 'antd'
import Styles from '../../../finance/common/detail/Index.less'
import {fetchPost} from '../../../../utils/request'

class Relation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: props.userId,
      data: [],
      message: '',
      timer: null,
      id: props.id,
    }
  }

  componentWillReceiveProps (props) {
    if (this.state.userId != props.userId) {
      this.setState({
        userId: props.userId,
        id: props.id
      }, () => {
        this.getData()
      })
    }
  }

  componentDidMount () {
    this.getData()
  }

  componentWillUnmount () {
    clearTimeout(this.state.timer)
  }

  getData () {
    if (this.state.userId != null) {
      fetchPost(`/user/${this.state.userId}/contact/info`, {}).then(json => {
        if (json.data != null && json.code === 0) {
          this.setState({
            data: json.data.contacts
          })
        } else {
          this.setState({
            data: [],
            message: json.msg
          })
        }
      })
    } else {
      this.setState({
        data: []
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
        <span className='color-warning warning-animate'><Icon type='info-circle-o' /> {this.state.message}</span>
      )
    } else {
      return ''
    }
  }

  showSend (type, name, relation, mobile) {
    let content = ''
    let buttonContact = '确认'
    if (type == 1 && relation != '本人') {
      return <div style={{width: 300}}>
        <Input addonBefore='称呼：' defaultValue={name} onBlur={(e) => {
          name = e.target.value
        }} />
        <Input addonBefore='关系：' defaultValue={relation} onBlur={(e) => {
          relation = e.target.value
        }} />
        <Input addonBefore='手机：' defaultValue={mobile} onBlur={(e) => {
          mobile = e.target.value
        }} />
        <div style={{overflow: 'hidden'}}>
          <Button style={{float: 'right'}} type='primary' size='small'
            onClick={(e) => this.showContent(type, name, relation, mobile, content)}>{buttonContact}</Button>
        </div>
      </div>
    }

    return <div style={{width: 300}}>
      <Input addonBefore='称呼：' defaultValue={name} onBlur={(e) => {
        name = e.target.value
      }} />
      <Input addonBefore='关系：' defaultValue={relation} onBlur={(e) => {
        relation = e.target.value
      }} />
      <Input addonBefore='手机：' defaultValue={mobile} onBlur={(e) => {
        mobile = e.target.value
      }} />
      <Input addonBefore='内容：' type='textarea' placeholder='请输入内容' onBlur={(e) => {
        content = e.target.value
      }}
        autosize={{minRows: 4, maxRows: 6}} />
      <div style={{overflow: 'hidden'}}>
        <Button style={{float: 'right'}} type='primary' size='small'
          onClick={(e) => this.showContent(name, relation, mobile, content)}>{buttonContact}</Button>
      </div>
    </div>
  }

  // 表单提交
  showContent (name, relation, mobile, content) {
    if (content == null || content == '') {
      message.error('请输入内容')
      return
    }
    if (content == null || content == '' && relation == '本人') {
      message.error('请输入内容')
      return
    }

    this.send(name, relation, mobile, content)
  }

  send (name, relation, mobile, content) {
    const self = this;
    fetchPost('/audit/operate/phone/remark', {
      auditNo: this.state.id,
      name,
      relation,
      mobile,
      content,
    }).then(json => {
      if (json.code === 0) {
        message.info('添加成功')
        self.getData();
      } else {
        message.error(json.msg)
      }
    })
  }

  handleVisibleChange = (visible) => {
    console.log("--popover--", visible);
    // this.setState({ visible });
  }

  render () {
    const columns = [
      {
        title: '称谓',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '输入称谓',
        dataIndex: 'inputName',
        key: 'inputName'
      },
      {
        title: '关系',
        dataIndex: 'relation',
        key: 'relation'
      },
      {
        title: '电话号码 / 绑定次数',
        dataIndex: 'mobile',
        render: (text, record) => (
          <span>{record.mobile} / {record.bindTimes}</span>
        )
      },
      {
        title: '电话',
        render: (record) => {
          return (
            <Popover key={Math.random().toString(16).substring(2)}
                     content={this.showSend(2, record.name, record.relation, record.mobile)}
                     onVisibleChange={this.handleVisibleChange}
                     title='电话内容'
                     trigger='click'>
              <Button type='primary' size='small'>电话</Button>
            </Popover>);
        }
      }
    ]

    return (
      <div className={Styles.detailModule}>
        <Card title='社会关系(紧急联系人)' extra={this.message()} bodyStyle={{padding: 0}} noHovering={true}>
          <Table
            size='small'
            pagination={false}
            bordered
            dataSource={this.state.data}
            columns={columns}
            key='name'
          />
        </Card>
      </div>
    )
  }
}

export default Relation

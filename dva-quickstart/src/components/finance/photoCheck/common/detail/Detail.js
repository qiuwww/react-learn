import React, { Component, PropTypes } from 'react'
import {
  Card,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Col,
} from 'antd'
import CheckRecord from '../../../../common/components/users/CheckRecord'
import Styles from './Index.less'
import { fetchPost } from '../../../../../utils/request'
import Identity from '../../../../common/components/users/Identity'
import Photos from '../../../../common/components/users/Photos'

const FormItem = Form.Item
const CheckableTag = Tag.CheckableTag

class UncontrolledCheckableTag extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activity: props.activity,
    }
  }

  componentWillReceiveProps (props) {
    if (props.activity != this.state.activity) {
      this.setState({
        activity: props.activity,
      })
    }
  }

  handleChange (activity) {
    this.setState({
      activity: !this.state.activity,
    })
    this.props.chooseTag(activity)
  };

  render () {
    return <CheckableTag checked={this.state.activity}
                         onChange={this.handleChange.bind(this)}>
      {this.props.tagName}
    </CheckableTag>
  }
}

class Detail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      id: props.id,
      userId: props.userId,
      tradeNo:props.tradeNo,
      activeKey: props.activeKey,
      processNode: props.processNode,
      item: props.item,
      showDetail: true,
      stepType: props.stepType,
      visible: false,
      tagData: [],
      tagIDs: {},
      managerInfo: {
        finish: '',
        remain: '',
      },
      photoType: '',
      currentType:''
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData () {
    let self = this
    if (this.state.userId) {
      fetchPost(`/audit/usertag/${self.state.userId}/phone/query`, {}).then((res) => {
        if (res.code === 0) {
          res.data.list.forEach((value, index) => {
            value.childList.forEach((val, ind) => {
              if (val.activity) {
                this.state.tagIDs[val.tagId] = true
              }
            })
          })

          self.setState({
            tagData: res.data.list || [],
            managerInfo: {
              remain: '',
              finish: '',
            },
          })
        } else {
          message.error(res.msg)
        }
      })
    }
  }

  componentWillReceiveProps (props) {
    if (this.state.id != props.id || this.state.userId != props.userId) {
      this.setState({
        id: props.id,
        activeKey: props.activeKey,
        userId: props.userId,
        tradeNo:props.tradeNo,
        stepType: props.stepType,
        item: props.item,
      }, () => {
        this.getData()
      })
    }
  }

  onChange (activeKey) {
    this.setState({activeKey})
  }

  changeOrder (type, id) {
    this.props.changeOrder(type, id)
  }

  changeModal () {
    this.setState({
      visible: !this.state.visible,
    })
  }

  operation (type) {
    this.setState({
      currentType:type
    },()=>{
      let reason = this.props.form.getFieldValue('checkReason')
      let self = this
      let tagIdList = []
      if(this.state.currentType == 'refuse' && !reason){
        message.info("请输入原因");
        return false;
      }
      for (let i in this.state.tagIDs) {
        tagIdList.push(i)
      }

      this.props.form.validateFields((errors, values) => {
        if (!errors) {
          let operationParams = {
            auditNo: this.state.id,
            message: reason,
            userCode: this.state.userId,
            processNode: this.state.processNode,
            tagIdList,
            photoType: this.state.photoType
          }

          switch (type) {
            case 'pass':
              fetchPost('/audit/operate/pass', operationParams).then((json) => {
                if (json.code === 0) {
                  self.clearReason()
                  this.state.tagIDs = {}
                  self.changeOrder('pass', self.state.id)
                  message.success('操作成功')
                } else {
                  message.error(json.msg)
                }
              })
              break

            case 'refuse':
              fetchPost('/audit/operate/refuse', operationParams).then((json) => {
                if (json.code === 0) {
                  self.clearReason()
                  self.changeOrder('refuse', self.state.id)
                  this.state.tagIDs = {}
                  message.success('操作成功')
                } else {
                  message.error(json.msg)
                }
              })
              break

            default:
          }
        }
      })
    })
  }

  clearReason () {
    this.props.form.setFieldsValue({
      checkReason: '',
    })
    this.setState({
      visible: false,
      tagIDs: {},
    }, () => {
      this.getData()
    })
  }

  extraContent () {
    return (
      <span>
        {
          this.state.managerInfo.finish
            ? <span className='ml10'> 已完成:
              <span className='color-main'>
                {`${this.state.managerInfo.finish}单`}
              </span>
            </span>
            : ''
        }

        {
          this.state.managerInfo.remain
            ? <span className='ml10'> 剩余:
              <span className='color-main'>
                {`${this.state.managerInfo.remain}单`}
              </span>
            </span>
            : ''
        }

        <span className='ml10'> 交易号: <span
          className='color-main'>{this.state.item.tradeNo || ''}</span></span>
        <span className='ml10 mr10'> 借款金额/周期:
          <span className='color-main'>
            {`${this.state.item.realCapital ||
            ''}元/${this.state.item.productDuration || ''}`}
          </span>
        </span>
        {
          this.state.userId ? <Button type='primary'
                                      onClick={this.changeModal.bind(
                                        this)}>操作</Button>
            : null
        }
      </span>
    )
  }

  chooseTag (activity, id, name) {
    let self = this
    let form = this.props.form
    this.state.tagData.forEach((value, index) => {
      value.childList.forEach((val, ind) => {
        if (val.tagId == id) {
          val.activity = activity
        }
      })
    })

    this.setState({
      tagData: this.state.tagData || [],
    })

    if (activity) {
      this.state.tagIDs[id] = true
      if (form.getFieldValue('checkReason')) {
        form.setFieldsValue({
          checkReason: `${form.getFieldValue('checkReason') + name};`,
        })
      } else {
        form.setFieldsValue({
          checkReason: `${name};`,
        })
      }
    } else {
      let beforeReason = self.props.form.getFieldValue('checkReason')
      let currentReason = beforeReason.replace(new RegExp(`${name};`, 'g'), '')
      form.setFieldsValue({
        checkReason: currentReason,
      })
      delete this.state.tagIDs[id]
    }
  }

  changeParams (data) {
      if(data.photoType) {
        this.setState({
            photoType: data.photoType
        })
      }
  }

  render () {
    const {getFieldDecorator} = this.props.form
    return (
      <div>
        <Modal visible={this.state.visible}
               onOk={this.clearReason.bind(this)}
               onCancel={this.clearReason.bind(this)}
               footer={null}
        >
          <Form>
            <FormItem className={Styles.operationHeader}>
              <span className={Styles.title}>订单审核操作</span>
              <Popconfirm placement='top' title='确认通过?'
                          onConfirm={() => { this.operation('pass') }}>
                <Button type='primary' className='ml20'>通过</Button>
              </Popconfirm>

              <Popconfirm placement='top' title='确认拒绝?'
                          onConfirm={() => { this.operation('refuse') }}>
                <Button type='default' className='ml10'>拒绝</Button>
              </Popconfirm>
            </FormItem>

            <FormItem>
              {getFieldDecorator('checkReason',
                {rules: [{ message: '请输入原因'}]})(
                <Input placeholder='请输入原因' className='mh150' type='textarea'/>,
              )}
            </FormItem>
          </Form>

          <Card noHovering={true}>
            {
              this.state.tagData.map((cate, index) => (
                <div key={index}>

                  <span className='font13 color-main'>{cate.typeName}</span>:
                  <br />
                  {
                    cate.childList.map((tag, index) => (
                      <UncontrolledCheckableTag
                        key={index}
                        chooseTag={(activity) => this.chooseTag(activity,
                          tag.tagId, tag.name)} tagName={tag.name}
                        activity={tag.activity}/>
                    ))
                  }
                </div>
              ))
            }
          </Card>

        </Modal>

        <div className={Styles.photoDetailWrap}>
          <div className='mb10'>{this.extraContent()}</div>
          <Card bodyStyle={{padding: 0}} bordered={false} noHovering={true}>
            <Col span={14}>
              <Photos changeParams={(data)=>{this.changeParams(data)}} userId={this.state.userId} tradeNo={this.state.tradeNo}/>
            </Col>
            <Col span={10}>
              <Identity userId={this.state.userId} tradeNo={this.state.tradeNo}/>
              <CheckRecord userId={this.state.userId} tradeNo={this.state.tradeNo}/>
            </Col>
          </Card>

        </div>
      </div>
    )
  }
}

Detail = Form.create()(Detail)

export default Detail

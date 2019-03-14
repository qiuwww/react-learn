import React, {Component, PropTypes} from 'react'
import { Form, Input, message, Row, Col, Button, DatePicker, Checkbox, Select, Icon, Radio, Card} from 'antd'
import {fetchPost} from '../../../utils/request'

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const Option = Select.Option

class Search extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      params: this.initState(),
      overdueAdminList: []
      // productTypeArr: []
    }
  }

  initState () {
    return {
      overdueDays: null,
      leOverdueDays: null,
      isAllocation: null,
      // productType: null,
      channel: '',
      mobile: '',
      name: '',
      collectionStatus: null,
      followId: null
    }
  }

  componentWillReceiveProps (props) {
    this.setState({
      overdueAdminList: props.overdueAdminList
    })
  }

// 初始化方法
  componentDidMount () {
    this.getData()
  }

  // 请求数据
  getData () {
    // fetchPost('/collection/product/query', {}).then(json => {
    //   if (json.code === 0) {
    //     let list = json.data.itemList
    //     if (list != null && list.length > 0) {
    //       this.setState({
    //         productTypeArr: list
    //       })
    //     }
    //   } else {
    //     message.error(json.msg)
    //   }
    // })
  }

  handleSubmit (e) {
    e.preventDefault()
    const values = this.props.form.getFieldsValue()
    this.setState({
      ...values
    })
    this.props.changeItem('params', this.state.params)
  }

  handleReset (e) {
    e.preventDefault()
    this.props.form.resetFields()
    let init = this.initState()
    this.setState({
      params: {...init}
    })
    this.props.changeItem('params', this.initState())
  }

  changeItem (key, value) {
    this.props.changeItem(key, value)
    this.setState({
      params: {
        ...this.state.params,
        [key]: value
      }
    })
  }
  getOverdueAdmin (getFieldDecorator) {
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
    }
    if (this.state.overdueAdminList !== null && this.state.overdueAdminList.length) {
      let content = []
      this.state.overdueAdminList.map((item) => {
        content.push(
          <Option key={Math.random().toString(16).substring(2)} value={item.followId.toString()}>{item.name}</Option>
        )
      })
      return (
        <FormItem
          label='催收人'
          {...formItemLayout}
        >
          {getFieldDecorator('followId', {
            initialValue: ''
          })(
            <Select onChange={(e) => this.changeItem('followId', e)} style={{width: '100%'}} placeholder='催收人'>
              <Option value=''>请选择</Option>
              {content}
            </Select>
          )}
        </FormItem>
      )
    }
    return ''
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
    }
    const formItemLayoutx = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    }
    const formItemLayoutButton = {
      labelCol: {span: 0},
      wrapperCol: {span: 24},
    }
    return (
      <Form inline>
        <div>
          <FormItem>
            {getFieldDecorator('isNewAdd', {
              initialValue: ''
            })(
              <RadioGroup onChange={(e) => this.changeItem('isNewAdd', e.target.value)}>
                <RadioButton value=''>全部</RadioButton>
                <RadioButton value='0'>新增</RadioButton>
                <RadioButton value='1'>复借</RadioButton>
              </RadioGroup>
          )}
          </FormItem>
          <FormItem label='分单状态'>
            {getFieldDecorator('isAllocation', {
              initialValue: ''
            })(
              <Select style={{width: 100}} onChange={(e) => this.changeItem('isAllocation', e)}>
                <Option value=''>全部</Option>
                <Option value='0'>未分配</Option>
                <Option value='1'>已分配</Option>
              </Select>
          )}
          </FormItem>

          <FormItem label='借款来源'>
            {getFieldDecorator('channel', {
              initialValue: ''
            })(
              <Select style={{width: 100}} onChange={(e) => this.changeItem('channel', e)}>
                <Option value=''>全部</Option>
                <Option value='fqgj'>分期管家</Option>
                <Option value='h5'>h5</Option>
                <Option value='pro'>pro</Option>
                <Option value='sdzz'>闪电周转</Option>
                <Option value='sdzx'>闪电周转(旧)</Option>
              </Select>
          )}
          </FormItem>
          <FormItem label='逾期天数(大于等于)'>
            {getFieldDecorator('overdueDays')(
              <Input onBlur={(e) => this.changeItem('overdueDays', e.target.value)} placeholder='逾期天数'
                style={{width: 180}} />
          )}
          </FormItem>
          <FormItem label='逾期天数(小于等于)'>
            {getFieldDecorator('leOverdueDays')(
              <Input onBlur={(e) => this.changeItem('leOverdueDays', e.target.value)} placeholder='逾期天数'
                style={{width: 180}} />
          )}
          </FormItem>

        </div>
        <div className='mt20'>
          <FormItem label='姓名'>
            {getFieldDecorator('name')(
              <Input onBlur={(e) => this.changeItem('name', e.target.value)} placeholder='姓名'
                style={{width: 180}} />
          )}
          </FormItem>
          <FormItem label='电话'>
            {getFieldDecorator('mobile')(
              <Input onBlur={(e) => this.changeItem('mobile', e.target.value)} placeholder='电话'
                style={{width: 180}} />
          )}
          </FormItem>

          <FormItem label='催收状态'>
            {getFieldDecorator('collectionStatus', {
              initialValue: ''
            })(
              <Select style={{width: 100}} onChange={(e) => this.changeItem('collectionStatus', e)}>
                <Option value=''>请选择</Option>
                <Option value='7'>承诺</Option>
                <Option value='5'>失联</Option>
                <Option value='6'>疑难</Option>
                <Option value='8'>跳票</Option>
              </Select>
          )}
          </FormItem>

          {this.getOverdueAdmin(getFieldDecorator)}

          <FormItem>

            <Button type='primary' onClick={(e) => this.handleSubmit(e)}><Icon type='search' /></Button>
          &nbsp;&nbsp;&nbsp;
            <Button type='ghost' onClick={(e) => this.handleReset(e)}><Icon type='reload' /></Button>
          </FormItem>
        </div>
      </Form>
    )
  }
}

Search = Form.create()(Search)
export default Search
{/* <FormItem label='所属省份'> */}
{/* {getFieldDecorator('province', { */}
{/* initialValue: '' */}
{/* })( */}
{/* <Select style={{width: 100}} onChange={(e) => this.changeItem('province', e)}> */}
{/* <Select.Option value=''>请选择</Select.Option> */}
{/* <Select.Option value='1'>北京市</Select.Option> */}
{/* <Select.Option value='2'>天津市</Select.Option> */}
{/* <Select.Option value='3'>河北省</Select.Option> */}
{/* <Select.Option value='4'>山西省</Select.Option> */}
{/* <Select.Option value='5'>内蒙古</Select.Option> */}
{/* <Select.Option value='6'>辽宁省</Select.Option> */}
{/* <Select.Option value='7'>吉林省</Select.Option> */}
{/* <Select.Option value='8'>黑龙江省</Select.Option> */}
{/* <Select.Option value='9'>上海</Select.Option> */}
{/* <Select.Option value='10'>江苏省</Select.Option> */}
{/* <Select.Option value='11'>浙江省</Select.Option> */}
{/* <Select.Option value='12'>安徽省</Select.Option> */}
{/* <Select.Option value='13'>福建省</Select.Option> */}
{/* <Select.Option value='14'>江西省</Select.Option> */}
{/* <Select.Option value='15'>山东省</Select.Option> */}
{/* <Select.Option value='16'>河南省</Select.Option> */}
{/* <Select.Option value='17'>湖北省</Select.Option> */}
{/* <Select.Option value='18'>湖南省</Select.Option> */}
{/* <Select.Option value='19'>广东省</Select.Option> */}
{/* <Select.Option value='20'>广西省</Select.Option> */}
{/* <Select.Option value='21'>海南省</Select.Option> */}
{/* <Select.Option value='22'>重庆市</Select.Option> */}
{/* <Select.Option value='23'>四川省</Select.Option> */}
{/* <Select.Option value='24'>贵州省</Select.Option> */}
{/* <Select.Option value='25'>云南省</Select.Option> */}
{/* <Select.Option value='26'>西藏省</Select.Option> */}
{/* <Select.Option value='27'>陕西省</Select.Option> */}
{/* <Select.Option value='28'>甘肃省</Select.Option> */}
{/* <Select.Option value='29'>青海省</Select.Option> */}
{/* <Select.Option value='30'>宁夏省</Select.Option> */}
{/* <Select.Option value='31'>新疆省</Select.Option> */}
{/* <Select.Option value='32'>N/A</Select.Option> */}
{/* </Select> */}
{/* )} */}
{/* </FormItem> */}

{/*<FormItem label='产品类型'>*/}
  {/*{getFieldDecorator('productType', {*/}
    {/*initialValue: ''*/}
  {/*})(*/}
    {/*<Select style={{width: 100}} onChange={(e) => this.changeItem('productType', e)}>*/}
      {/*<Option value=''>全部</Option>*/}
      {/*{*/}
        {/*this.state.productTypeArr.map(value => (*/}
          {/*<Option key={value.type} value={value.type}>{value.desc}</Option>*/}
        {/*))*/}
      {/*}*/}
    {/*</Select>*/}
{/*)}*/}
{/*</FormItem>*/}


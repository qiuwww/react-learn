/**
 * Created by ziyu on 17/5/8.
 */

import React, { Component, PropTypes } from 'react'
import Styles from './Index.less'
import SearchStyle from '../../common/less/search.less'
import { message, Col, Icon,Button,Modal,Form ,Input} from 'antd'
import { fetchPost } from '../../../utils/request'
import List from './List'
import Pannel from '../../common/components/Pannel'
import Search from '../../common/components/Search'
import Detail from './details/Index'
import tel from './../../../assets/tel.png';
const FormItem = Form.Item

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      newCaseCount: null,
      outCaseCount: null,
      isNewAdd: props.isNewAdd,
      collectionType: props.collectionType,
      api: props.api,
      id: null,
      userId: null,
      activeKey: 'baseInfo',
      item: {},
      page: {
        currentPage: 1,
        pageSize: 13,
        totalCount: 0
      },
      outCallParams: {
        fromExten: '',
        exten: '',
      },
      switchBoolean: true,
      params: {
        findType: '',
        collectionStatus: '',
        overdueTime: '',
        inputValue: '',
        overdueType: '',
        sort: "1",
      },
      panelParams: [],
      searchParams: {
        list: [
          {
            name: '姓名',
            type: 'text',
            key: 'name',
            className: 'pr20',
            placeHolder: '请输入姓名',
            values: []
          },
          {
            name: '手机号',
            type: 'text',
            key: 'mobile',
            className: 'pr20',
            placeHolder: '请输入手机号',
            values: []
          },
          {
            name: '身份证',
            type: 'text',
            key: 'identityNo',
            className: 'pr20',
            placeHolder: '请输入身份证',
            values: []
          },
          {
            name: '状态',
            type: 'select',
            key: 'collectionStatus',
            className: 'pr20',
            values: [{value: '', name: '请选择'}]
          },
          {
            name: '逾期天数',
            type: 'select',
            key: 'overdueTime',
            className: 'pr20',
            values: [{value: '', name: '请选择'}]
          },
          {
            name: '',
            type: 'search',
            key: '',
            className: 'pr20',
            values: []
          }
        ],
        api: '/common/collection/case/query'
      },
      list: [],
      isShowPanel: false,
      visible:false,
      phoneStatus:0
    }
  }

  componentDidMount () {
    this.getData()
    this.getStatus()
  }

  getStatus(){
    let self = this
    fetchPost('/user/addressBook/status/get').then(res => {
      if (res.code == 0) {
        // debugger;
        self.setState({
          phoneStatus: res.data.status
        })
      }
    })
  }

  getData () {
    let copyState = {}
    let self = this
    for (let i in this.state.params) {
      if (this.state.params[i] !== '') {
        copyState[i] = this.state.params[i]
      }
    }

    function GetList () {
      return new Promise((resolve, reject) => {
        fetchPost(
          `${self.state.api}?currentPage=${self.state.page.currentPage}&pageSize=${self.state.page.pageSize}`,
          {...copyState, isNewAdd: self.state.isNewAdd, collectionType: self.state.collectionType}).then(res => {
            if (res.code === 0) {
              resolve(res)
            } else {
              reject(res)
            }
          })
      })
    }

    // function GetPanel() {
    //   return new Promise((resolve, reject) => {
    //     fetchPost('/collection/statistics/query').then(res => {
    //       if(res.code === 0) {
    //         resolve(res);
    //       } else {
    //         reject(res);
    //       }
    //     })
    //   })
    // }

    Promise.all([GetList()]).then(res => {
      let [listData, index] = [res[0], 0]
      if (listData.code === 0) {
        let list = listData.data.itemList
        if (list.length) {
          if (this.state.id) {
            for (let i in listData.data.itemList) {
              if (listData.data.itemList[i].orderId == this.state.id) {
                index = i
              }
            }
          }
          this.setState({
            newCaseCount: listData.data.newCaseCount,
            outCaseCount: listData.data.outCaseCount,
            id: list[index].collectionNo,
            userId: list[index].tradeNo,
            page: {
              ...this.state.page,
              totalCount: listData.page.totalCount || 0
            },
            item: list[index],
            activeKey: 'baseInfo',
            isFetch: true,
            list
          }, () => {
           })
        } else {
          self.setState({
            newCaseCount: listData.data.newCaseCount,
            outCaseCount: listData.data.outCaseCount,
            id: null,
            userId: null,
            orderStatus: null,
            item: {},
            activeKey: 'baseInfo',
            isFetch: true,
            list: [],
            page: {
              ...this.state.page,
              totalCount: listData.page.totalCount || 0
            },
          })
          message.warning('没有更多订单了')
        }
      } else {
        self.setState({
          newCaseCount: 0,
          outCaseCount: 0,
          id: null,
          userId: null,
          orderStatus: null,
          item: {},
          activeKey: 'baseInfo',
          isFetch: true,
          list: [],
          page: {
            ...this.state.page,
            totalCount: 0
          },
        }, () => {
          message.error(listData.msg)
        })
      }

      // if(panelData.code === 0) {
      //   if(panelData.data.display) {
      //     this.setState({
      //       isShowPanel: true
      //     }, () => {
      //       this.setState({
      //         panelParams: [
      //           {
      //             name: '当日入库(个)',
      //             value: panelData.data.todayInWarehouse || ''
      //           },
      //           {
      //             name: '当日出库(个)',
      //             value: panelData.data.todayOutWarehouse || ''
      //           }
      //         ]
      //       })
      //     })
      //   } else {
      //     this.setState({
      //       isShowPanel: false
      //     })
      //   }
      // }
    }, (error) => {
      self.setState({
        id: null,
        userId: null,
        orderStatus: null,
        item: {},
        activeKey: 'baseInfo',
        isFetch: true,
        list: []
      }, () => {
        message.error(error.msg)
      })
    })
  }

  currentPage (current) {
    this.setState({
      page: {
        ...this.state.page,
        currentPage: current
      }
    }, () => {
      this.getData()
    })
  }

  chooseOrder (data) {
    this.setState({
      ...data
    })
  }

  changeParams (params) {
    if (params.inputValue || params.findType) {
      if (params.findType && params.inputValue) {
        this.setState({
          params,
          isFetch: false
        }, () => {
          this.getData()
        })
      } else {
        message.warning('请先选择查询类型并且输入值')
      }
    } else {
      this.setState({
        params,
        isFetch: false
      }, () => {
        this.getData()
      })
    }
  }

  handleCallCenter () {
    this.props.form.validateFields((error, values) => {
      if(!error) {
        const { fromExten } = values;
        this.setState({
          visible: false,
          outCallParams: {
            ...this.state.outCallParams,
            fromExten,
          }
        }, ()=>{
          console.log('--jobNumber--', this.state.outCallParams);
          this.props.form.resetFields()
        })
      }
    })
  }
  outCallDo(phone) {
    console.log('--外呼中心-phone-', phone);
    const self = this;
    const { fromExten } = this.state.outCallParams;
    const _params = {
      fromExten,
      exten: phone,
    };
    if (fromExten.length) {
      fetchPost(`/collection/outer/call`, _params).then(res => {
        if (res.code === 0) {
          message.info(res.msg);
          self.setState({
            outCallParams: {
              ...this.state.outCallParams,
              ..._params,
            }
          })
        } else {
          message.error(res.msg);
        }
      })
    } else {
      message.info("请先输入工号!")
    }
  }

  refreshList () {
    this.getData()
  }

  switchChange() {
    const { switchBoolean, params } = this.state;
    let sort = '';
    if (switchBoolean) {
      sort = '2';
    } else {
      sort = '1';
    }
    this.setState({
      switchBoolean: !switchBoolean,
      params: {
        ...params,
        sort,
      }
    }, () => {
      this.getData();
    })
  }

  render () {
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };
    const {getFieldDecorator} = this.props.form

    return (
      <div className={Styles.box}>
        <Modal title="坐席工号" visible={this.state.visible} onOk={() => {this.handleCallCenter()}} onCancel={() => {
          this.setState({
            visible: false,
          })
        }}>
          <Form horizontal>
            <FormItem
              {...formItemLayout}
              label="坐席工号"
            >
              {getFieldDecorator('fromExten', {
                rules: [
                  {required: true, message: '坐席工号不能为空'},
                  // {pattern: /^80[0-9]*$/, message: '请输入正确的坐席工号'},
                  {whitespace: true}
                ]
              })(
                <Input placeholder='请输入坐席工号' />
              )}
            </FormItem>
          </Form>
        </Modal>
        <div className={SearchStyle.searchClass}>

          <Search searchParams={this.state.searchParams}
            changeParams={(params) => this.changeParams(params)} button={true} callPutButton={()=>{this.setState({
            visible: true
          })}}/>
           {/*<Button style={{marginLeft: 10}} type="primary">*/}
            {/*<img src={tel} style={{width:'30px',height:'30px',float:'left',position: 'absolute',*/}
              {/*left: '239px',*/}
              {/*top: '56px'}}  onClick={() => {*/}
              {/*this.setState({*/}
                {/*visible: true*/}
              {/*})*/}
            {/*}} alt=""/>*/}
          {/*<span style={{marginLeft: 10}} id="ztth_phone_error"></span>*/}
          {/*</Button>*/}

        </div>

        {
          this.state.isShowPanel ? <div className='mt20'>
            <Pannel panelParams={this.state.panelParams} />
          </div>
            : ''
        }

        <div className={Styles.detailWrapper}>
          <Col span={7}>
            <div className={Styles.listClass}>
              <div>
                <List
                  list={this.state.list}
                  id={this.state.id}
                  userId={this.state.userId}
                  isFetch={this.state.isFetch}
                  page={this.state.page}
                  chooseOrder={(params) => this.chooseOrder(params)}
                  currentPage={(current) => this.currentPage(current)}
                  switchChange={() => this.switchChange()}
                  newCaseCount={this.state.newCaseCount}
                  outCaseCount={this.state.outCaseCount}
                />
              </div>
            </div>
          </Col>

          <Col span={17}>
            <div id='detailClass' className={Styles.detailClass}>
              <Detail
                activeKey={this.state.activeKey}
                id={this.state.id}
                userId={this.state.userId}
                item={this.state.item}
                refreshList={() => { this.refreshList() }}
                changeOrder={(type, id) => this.changeOrder(type, id)}
                collectionType={this.state.collectionType}
                outCallDo={(phone) => this.outCallDo(phone)}
                phoneStatus={this.state.phoneStatus}
              />
            </div>
          </Col>

        </div>

      </div>
    )
  }
}
Index = Form.create()(Index)
export default Index

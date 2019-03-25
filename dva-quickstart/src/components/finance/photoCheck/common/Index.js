/**
 * Created by ziyu on 17/3/7.
 */
import React, { Component,  } from 'react'
import Styles from './Index.less'
import SearchStyle from '../../../common/less/search.less'
import { message, Col, Icon } from 'antd'
import { fetchPost } from '../../../../utils/request'
import List from './List'
import Search from '../../../common/components/Search'
import Detail from './detail/Detail'
// import $ from 'jquery'

class Index extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isNewAdd: props.isNewAdd,
      processNode: props.processNode,
      userId: null,
      tradeNo:null,
      getListApi: props.getListApi,
      id: null,
      refresh: false,
      processingCount: null,
      stepType: props.stepType,
      list: [],
      item: {},
      isFetch: false,
      showList: 'show',
      page: {
        currentPage: 1,
        pageSize: 13,
        totalCount: 0
      },
      params: {
        isShowAll: '',
        findtype: '',
        duration: '',
        realCapital: '',
        inputValue: ''
      },
      activeKey: 'detail',
      searchParams: {
        list: [],
        api: '/common/query'
      },
      searchParamsList0: [
        {
          name: '',
          type: 'buttonRadio',
          key: 'isShowAll',
          className: 'pr20',
          values: [
            {
              value: '',
              name: '我的订单',
            },
            {
              value: '1',
              name: '全部订单',
            }
          ],
        },
        {
          name: '审核人',
          type: 'select',
          key: 'auditor',
          className: 'pr20',
          values: [{value: '', name: '全部'}]
        },
        {
          name: '查询类型',
          type: 'group',
          key: ['findtype', 'inputValue'],
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
      searchParamsList1: [
        {
          name: '',
          type: 'buttonRadio',
          key: 'isShowAll',
          className: 'pr20',
          values: [
            {
              value: '',
              name: '我的订单',
            }
          ],
        },
        {
          name: '查询类型',
          type: 'group',
          key: ['findtype', 'inputValue'],
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
      detailDom: ''
    }
  }

  componentDidMount () {
    // this.state.detailDom = $('#detailClass')
    this.getData()
    // this.state.detailDom.addClass('animated fadeInRightBig').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
    //   $(this).removeClass('animated fadeInRightBig');
    // });
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

  getData () {
    let copyState = {}
    let self = this
    for (let i in this.state.params) {
      if (this.state.params[i] != '') {
        copyState[i] = this.state.params[i]
      }
    }

    fetchPost(
      // `${this.state.getListApi}?currentPage=${this.state.page.currentPage}&pageSize=${this.state.page.pageSize}`,
      {...copyState, isNewAdd: this.state.isNewAdd, processNode: this.state.processNode}).then((res) => {
        if (res.code === 0) {
          const {orderList, isAuditorHeadman} = res.data;
          const list = orderList;

          if (isAuditorHeadman) {
            this.setState({
              searchParams: {
                ...this.state.searchParams,
                list: this.state.searchParamsList0,
              },
              isAuditorHeadman,
            })
          } else {
            this.setState({
              searchParams: {
                ...this.state.searchParams,
                list: this.state.searchParamsList1,
              },
              isAuditorHeadman,
            })
          }


          if (list.length > 0 && list != null) {
            this.setState({
              id: list[0].auditNo,
              userId: list[0].userCode,
              tradeNo:list[0].tradeNo,
              page: {
                ...this.state.page,
                totalCount: res.page.totalCount || 0
              },
              item: list[0],
              activeKey: 'detail',
              isFetch: true,
              list
            })
          } else {
            self.setState({
              id: null,
              userId: null,
              tradeNo:null,
              item: {},
              activeKey: 'detail',
              isFetch: true,
              list: [],
              page: {
                ...this.state.page,
                totalCount: res.page.totalCount || 0
              },
            })
            message.warning('没有更多订单了')
          }
        } else {
          self.setState({
            id: null,
            userId: null,
            tradeNo:null,
            item: {},
            activeKey: 'detail',
            isFetch: true,
            list: []
          }, () => {
            message.error(res.msg)
          })
        }
      })
  }

  changeParams (params) {
    if (params.inputValue) {
      if (params.findtype) {
        this.setState({
          params: {
            ...this.state.params,
            ...params,
          },
          isFetch: false
        }, () => {
          this.getData()
        })
      } else {
        message.warning('请先选择查询类型')
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

  chooseOrder (params) {
    this.setState({
      id: params.id,
      userId: params.userId,
      tradeNo:params.tradeNo,
      activeKey: params.activeKey,
      item: params.item,
      isFetch: false
    })
  }

  changeOrder (type, id) {
    setTimeout(() => {
      this.state.list.forEach((val, index) => {
        if (val.auditNo == id) {
          this.state.list.splice(index, 1)
        }
      })
      // debugger;
      let list = this.state.list
      if (list.length === 0) {
        this.getData()
      } else {
        // this.setState({
        //   id: list[0].auditNo,
        //   userId: list[0].userId,
        //   tradeNo:list[0].tradeNo,
        //   item: list[0],
        //   activeKey: 'detail',
        //   list,
        //   isFetch: false
        // })
        this.getData();

        // this.state.detailDom.addClass('animated fadeInRightBig').
        //   one(
        //     'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        //     function () {
        //       $(this).removeClass('animated fadeInRightBig')
        //     })
      }
    }, 500)
  }

  showList () {
    // return `${Styles.listClass} ${Styles.listRight}`
  }

  detailClass () {
    // return `${Styles.detailClass} ${Styles.detailRight}`
  }

  render () {
    return (
      <div className={Styles.box}>
        <div className={SearchStyle.searchClass}>
          <Search searchParams={this.state.searchParams}
            changeParams={(params) => this.changeParams(params)} />
        </div>

        <div className={Styles.detailWrapper}>
          <div className={this.showList()}>
            <div>
              <List
                list={this.state.list}
                id={this.state.id}
                userId={this.state.userId}
                isFetch={this.state.isFetch}
                stepType={this.state.stepType}
                page={this.state.page}
                chooseOrder={(params) => this.chooseOrder(params)}
                currentPage={(current) => this.currentPage(current)}
              />
            </div>
          </div>

          <div id='detailClass' className={this.detailClass()}>
            <Detail
              activeKey={this.state.activeKey}
              id={this.state.id}
              userId={this.state.userId}
              tradeNo={this.state.tradeNo}
              stepType={this.state.stepType}
              item={this.state.item}
              processNode={this.state.processNode}
              changeOrder={(type, id) => this.changeOrder(type, id)} />
          </div>
        </div>

      </div>
    )
  }
}

export default Index

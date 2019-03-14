/**
 * Created by ziyu on 2017/7/28.
 */
/**
 * Created by ziyu on 17/3/7.
 */
import React, { Component, PropTypes } from 'react'
import Styles from './Index.less'
import SearchStyle from '../../common/less/search.less'
import { message, Col, Icon } from 'antd'
import { fetchPost } from '../../../utils/request'
import List from './OrderViewList'
import Search from '../../common/components/Search'
import Detail from './detail/Detail'
import $ from 'jquery'

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isNewAdd: props.isNewAdd,
      processNode: props.processNode,
      userId: null,
      orderStatus: null,
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
        totalCount: 0,
      },
      params: {
        findtype: '',
        duration: '',
        realCapital: '',
        inputValue: '',
      },
      activeKey: 'detail',
      searchParams: {
        list: [
          //{
          //  name: '',
          //  type: 'buttonRadio',
          //  key: 'channelCode',
          //  className: 'pr20',
          //  values: [{value: '', name: '全部'}],
          //},
          {
            name: '',
            type: 'buttonRadio',
            key: 'isNewAdd',
            className: 'pr20',
            values: [
              {
                value: '',
                name: '全部',
              },
              {
                value: '0',
                name: '新增',
              },
              {
                value: '1',
                name: '复借',
              }],
          },
          {
            name: '',
            type: 'buttonRadio',
            key: 'auditType',
            className: 'pr20',
            values: [
              {
                value: '',
                name: '全部',
              },
              {
                value: '0',
                name: '系统审核',
              },
              {
                value: '1',
                name: '人工审核',
              }],
          },
          {
            name: '查询类型',
            type: 'group',
            key: ['findtype', 'inputValue'],
            className: 'pr20',
            values: [{value: '', name: '请选择'}],
          },
          {
            name: '',
            type: 'search',
            key: '',
            className: 'pr20',
            values: [],
          },
        ],
        api: '/common/query',
      },
      detailDom: '',
    }
  }

  componentDidMount () {
    this.state.detailDom = $('#detailClass')
    this.getData()
    // this.state.detailDom.addClass('animated fadeInRightBig').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
    //   $(this).removeClass('animated fadeInRightBig');
    // });
  }

  currentPage (current) {
    this.setState({
      page: {
        ...this.state.page,
        currentPage: current,
      },
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
      `${this.state.getListApi}?currentPage=${this.state.page.currentPage}&pageSize=${this.state.page.pageSize}`,
      copyState).then((res) => {
      if (res.code === 0) {
        let list = res.data.list
        if (list.length > 0 && list != null) {
          this.setState({
            id: list[0].auditNo,
            userId: list[0].tradeNo,
            page: {
              ...this.state.page,
              totalCount: res.page.totalCount || 0,
            },
            orderStatus: list[0].orderStatus,
            item: list[0],
            activeKey: 'detail',
            isFetch: true,
            list,
          })
        } else {
          self.setState({
            id: null,
            userId: null,
            orderStatus: null,
            item: {},
            activeKey: 'detail',
            isFetch: true,
            list: [],
            page: {
              ...this.state.page,
              totalCount: res.page.totalCount || 0,
            },
          })
          message.warning('没有更多订单了')
        }
      } else {
        self.setState({
          id: null,
          userId: null,
          orderStatus: null,
          item: {},
          activeKey: 'detail',
          isFetch: true,
          list: [],
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
          params,
          isFetch: false,
        }, () => {
          this.getData()
        })
      } else {
        message.warning('请先选择查询类型')
      }
    } else {
      this.setState({
        params,
        isFetch: false,
      }, () => {
        this.getData()
      })
    }
  }

  chooseOrder (params) {
    console.log(params);
    this.setState({
      id: params.id,
      userId: params.userId,
      orderStatus: params.orderStatus,
      activeKey: params.activeKey,
      item: params.item,
      isFetch: false,
    })
  }

  changeOrder (type, id) {
    setTimeout(() => {
      this.state.list.forEach((val, index) => {
        if (val.auditNo == id) {
          this.state.list.splice(index, 1)
        }
      })

      let list = this.state.list
      if (list.length === 0) {
        this.getData()
      } else {
        this.setState({
          id: list[0].auditNo,
          userId: list[0].tradeNo,
          orderStatus: list[0].orderStatus,
          item: list[0],
          activeKey: 'detail',
          list,
          isFetch: false,
        })

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
    return `${Styles.listClass}
    // ${Styles.listRight}`
  }

  detailClass () {
    return `${Styles.detailClass} 
    // ${Styles.detailRight}`
  }

  render () {
    console.log(this.state.page, 'page')
    return (
      <div className={Styles.box}>
        <div className={SearchStyle.searchClass}>
          <Search searchParams={this.state.searchParams}
                  changeParams={(params) => this.changeParams(params)}/>
        </div>

        <div className={Styles.detailWrapper}>
          <div
            className={this.showList()}
          >
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

          <div id='detailClass' className={this.detailClass()}
          >
            <Detail
              activeKey={this.state.activeKey}
              id={this.state.id}
              userId={this.state.userId}
              stepType={this.state.stepType}
              orderStatus={this.state.orderStatus}
              item={this.state.item}
              processNode={this.state.processNode}
              changeOrder={(type, id) => this.changeOrder(type, id)}/>
          </div>
        </div>

      </div>
    )
  }
}

export default Index

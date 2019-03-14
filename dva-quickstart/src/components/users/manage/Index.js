/**
 * Created by ziyu on 17/3/7.
 */
import React, { Component, PropTypes } from 'react';
import Styles from './Index.less';
import SearchStyle from '../../common/less/search.less';
import { message, Col, Icon } from 'antd';
import { fetchPost } from '../../../utils/request';
import List from './List';
import Search from '../../common/components/Search';
import Detail from './detail/Detail';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      tradeNo:null,
      id: null,
      params: {
        findtype: '',
        inputValue:''
      },
      activeKey: 'records',
      searchParams: {
        list: [
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
        api: '/user/find/type/list'
      },
      page: {
        currentPage: 1,
        pageSize: 20,
        totalCount: 0,
      },
      list:[],
      loading:true,
    };
  }

  componentWillMount(){
    this.getData();
  }

  changeParams(params) {
    // this.setState({
    //   params,
    // })
    // console.log(params,'params')
    if (params.inputValue) {
      if (params.findtype) {
        this.setState({
          params,
          loading:true
        },()=>{
          this.getData();
        })
      } else {
        message.warning('请先选择查询类型')
      }
    } else {
      this.setState({
        params,
        loading:true
      },()=>{
        this.getData();
      })
    }
  }

  currentPage (current) {
    this.setState({
      page: {
        ...this.state.page,
        currentPage: current
      },
      loading:true
    }, () => {
      // console.log(this.state.page,'this.state.page===q9e-=qwr-0e')
      this.getData()
    })
  }
  fetchList = () => {
    this.setState({
      loading:true
    }, () => {
      this.getData();
    });
  }
  getData(currentPage, pageSize, params){
    fetchPost(`/user/userlist/by/type?currentPage=${currentPage || this.state.page.currentPage}&pageSize=${pageSize || this.state.page.pageSize}`, params || this.state.params).then(res=>{
      if(res.code == 0){
        let list = res.data.userInfoVOList
        // console.log(list,';list')
        if (list.length > 0) {
          // let page = json.data.page
          this.setState({
            list:list,
            userId: list[0].userCode,
            tradeNo:list[0].tradeNo,
            loading: false,
            page: {
              ...this.state.page,
              totalCount: res.page.totalCount || 0
            },
          },()=>{
            // console.log(this.state.list,'this.state.list1323')
          })
        } else {
          this.setState({
            list,
            userId: null,
            loading: false
          })
        }
      }
    })
  }

  changeOrder(params) {
    this.setState({
      userId: params.userId,
      tradeNo:params.tradeNo
    })
  }

  changeField(field, value) {
    this.setState({
      [field]: value,
    });
  }

  render() {
    return (
      <div>
        <Col  span={24} className={`${SearchStyle.searchClass} mb20`}>
          <Search searchParams={this.state.searchParams} changeParams={(params)=>this.changeParams(params)}/>
        </Col>
        <Col span={8} className={Styles.listClass}>
          <div>
            <List
              loading={this.state.loading}
              list={this.state.list}
              userId={this.state.userId}
              page={this.state.page}
              changeOrder={(params)=>this.changeOrder(params)}
              currentPage={(current) => this.currentPage(current)}
              fetch={this.fetchList}
            />
          </div>
        </Col>

        <Col span={16} className={Styles.detailClass}>
          <Detail
            activeKey={this.state.activeKey}
            userId={this.state.userId}
            tradeNo={this.state.tradeNo}
            refuse={this.state.refuse}
            changeField={(field,value)=>this.changeField(field,value)}/>
        </Col>
      </div>
    )
  }
}

export default Index;

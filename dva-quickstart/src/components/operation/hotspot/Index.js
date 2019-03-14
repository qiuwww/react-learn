/**
 * Created by ziyu on 17/3/15.
 */
import React, { Component, PropTypes } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { fetchPost } from '../../../utils/request'
import {history} from '../../../utils/config'

import Styles from './Index.less';


class HotMenu extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      list: [{
        title: '',
        picUrl: '',
        gmtCreate: '',
        picHeight: '',
        picWidth: ''
      }],
      loading: false,
    }
  }

  componentDidMount () {
    this.getData()
  }

  getData () {
    let appType = window.sessionStorage.getItem('appCode')
    fetchPost(`/cms/hotspot/${appType}/query`, {}).then(json => {
      if(json.code === 0) {
        this.setState({
          list: json.data.cmsHotspotVoList
        })
      }
    })
  }

  editPoster (record) {
    history.push({
      pathname: '/operation/hotspot/edit',
      state: {
        data: record
      }
    })
  }

  createPoster () {
    history.push('/operation/hotspot/add')
  }

  render () {
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: '图片',
        dataIndex: 'picUrl',
        key: 'picUrl',
        render: (text, record) => (
          <img width='200px' src={record.picUrl}/>
        )
      },
      {
        title: '图片像素',
        dataIndex: '',
        key: '',
        render: (text, record) => (
          <div>{`${record.picWidth} x ${record.picHeight}`}</div>
        )
      },
      {
        title: '添加时间',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate'
      },
      {
        title: '编辑',
        dataIndex: '',
        key: '',
        render: (text, record) => {
          return (
            <Button type='primary' onClick={()=>{this.editPoster(record)}}>编辑</Button>
          )
        }
      },
      {
        title: '下架',
        dataIndex: 'handle',
        key: 'handle',
        render: (text, record, index) => {
          return (
            <Popconfirm title="确定下架?" onConfirm={()=>{this.deleteMenu(record, index)}} okText="确定" cancelText="取消">
              <Button type='primary'>下架</Button>
            </Popconfirm>
          )
        }
      }
    ];
    return (
      <div>
        <div className={Styles.menuHeader}>
          <span className={Styles.title}>热点菜单列表</span>
          <Button className="ml20" type='primary' onClick={()=>{this.createPoster()}}>新增热点</Button>
        </div>

        <Table pagination={false} rowKey='cmsHotspotId' size="small" key='cmsHotspotId' columns={columns} dataSource={this.state.list} rowClassName={(record, index)=>(record.display==0?'hide':'')} loading={this.state.loading}
               bordered
        >
        </Table>
      </div>
    )
  }

  deleteMenu (record, index) {

    fetchPost(`/cms/hotspot/${record.cmsHotspotId}/unShelve`).then((res) => {
      if(res.code === 0) {
        this.getData();
      }
    })
  }

}

export default HotMenu

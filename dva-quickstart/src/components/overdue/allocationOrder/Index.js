import React, { Component,  } from 'react'

import { Card, Col } from 'antd'
import List from './List'
import Search from './Search'
import Detail from '../common/Record'
import BillDetail from '../common/BillDetail'

class Index extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: null,
      overdueAdminList: [],
      params: {
        isNewAdd: null,
        isAllocation: null,
        productType: null,
        channel: null,
        overdueDays: null,
        mobile: null,
        name: null,
        collectionStatus: null,
        followId: null
      },
      item: {}
    }
  }

  handleSearch (key, value) {
    if (key === 'params') {
      this.setState({
        [key]: value
      })
    } else {
      this.setState({
        params: {
          ...this.state.params,
          [key]: value
        }
      })
    }
  }

  changeField (key, value) {
    this.setState({
      [key]: value
    })
  }

  changeRow (value) {
    this.setState(value)
  }

  render () {
    return (
      <div>
        <Search
          overdueAdminList={this.state.overdueAdminList}
          changeItem={(key, value) => this.handleSearch(key, value)}
        />

        <Col span={12}>
          <div>
            <List
              params={this.state.params}
              changeField={(value) => this.changeRow(value)}
            />
          </div>
        </Col>

        <Col span={12} style={{marginTop:63}}>
          <div className='mt10 pl10'>
            <Card noHovering={true}>
              <Detail
                userId={this.state.userId}
                item={this.state.item}
              />

              <div className='mt10'>
                <BillDetail item={this.state.item}
                  userId={this.state.userId}
               />
              </div>
            </Card>
          </div>
        </Col>
      </div>
    )
  }
}

export default Index

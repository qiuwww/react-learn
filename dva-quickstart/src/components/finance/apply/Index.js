import React, {Component, PropTypes} from 'react'
import List from './List'
import Search from './Search'

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      params: {
        startDate: '',
        endDate: ''
      }
    }
  }

  changeParam (params) {
    this.setState({
      params,
    })
  }

  render () {
    return (
      <div>
        <div style={{padding: 10, margin: 10}}>
          <Search changeParams={(params) => this.changeParam(params)} />
        </div>

        <div style={{width: '100%', display: 'inline-block', float: 'left'}}>
          <div>
            <List
              params={this.state.params}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Index

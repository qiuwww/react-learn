/**
 * @author lianPf
 * @date 2017-11-09
 * */

import React, { Component } from "react";
import { Tabs } from "antd";
import LoanRecord from "./loanRecord";
import RepaymentRecord from "./repaymentRecord";

const { TabPane } = Tabs;

class Index extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    function callback(key) {
      console.log(key);
    }

    return (
      <div>
        <Tabs onChange={callback} type="card">
          <TabPane tab="借款记录" key="1">
            <LoanRecord />
          </TabPane>
          <TabPane tab="还款记录" key="2">
            <RepaymentRecord />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Index;

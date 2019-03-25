/**
 * Created by ziyu on 17/3/8.
 */
import React, { Component } from "react";
import Styles from "./Index.less";
import SearchStyle from "../../common/less/search.less";
import Search from "../../common/components/Search";
import Pannel from "../../common/components/Pannel";
import List from "./List";
import moment from "moment";
import { fetchPost } from "../../../utils/request";

class TotalData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        auditStartDt: moment()
          .subtract("days", 7)
          .format("YYYY-MM-DD"),
        auditEndDt: moment().format("YYYY-MM-DD")
      },
      searchParams: {
        list: [
          {
            name: "审核时间",
            type: "range",
            key: ["startDate", "endDate"],
            className: "pr20"
          }
        ],
        api: ""
      },
      panelParams: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    fetchPost("/audit/manage/info").then(res => {
      let item = res.data.item;
      let panelData = [
        {
          name: "当前剩余工单",
          value: item.rightNowSurplusCount
        },
        {
          name: "今日已审工单",
          value: item.todayAuditedCount
        },
        {
          name: "今日新增工单",
          value: item.todayNewCreateCount
        },
        {
          name: "通过量",
          value: item.todayPassCount
        },
        {
          name: "拒绝量",
          value: item.todayRefusedCount
        },
        {
          name: "昨日剩余工单",
          value: item.yesterdayRemainderCount
        }
      ];

      this.setState({
        panelParams: panelData
      });
    });
  }

  changeParams(params) {
    let dateParams = {
      auditStartDt: params.startDate || "",
      auditEndDt: params.endDate || ""
    };
    this.setState({
      params: dateParams
    });
  }

  render() {
    return (
      <div className={Styles.TotalData}>
        <Pannel panelParams={this.state.panelParams} />

        <div className={SearchStyle.searchClass}>
          <Search
            searchParams={this.state.searchParams}
            changeParams={params => {
              this.changeParams(params);
            }}
          />
        </div>

        <div className={Styles.listClass}>
          <List params={this.state.params} />
        </div>
      </div>
    );
  }
}

export default TotalData;

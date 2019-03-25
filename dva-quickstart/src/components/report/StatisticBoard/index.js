import React, { Component, Fragment } from "react";
import { connect } from "dva";
import moment from "moment";
import { Button, Card, Input, InputNumber, Row, Col } from "antd";
import styles from "./index.less";

@connect(({ reportBoard }) => ({
  data: reportBoard.data
}))
export default class StatisticBoard extends Component {
  state = {
    // loading: false,
  };

  componentDidMount() {
    this.handleFetch();
  }
  componentWillReceiveProps = nextProps => {};

  handleFetch = () => {
    console.log(1);
    this.props.dispatch({
      type: "reportBoard/fetch"
    });
  };

  render() {
    const { data } = this.props;
    const columns = [
      {
        title: "放款总额",
        data: data.loanAmount,
        color: ["#01D5E5", "#00BDCC"]
      },
      {
        title: "服务费实收",
        data: data.serviceCollectAmount,
        color: ["#6C8FA1", "#5F8295"]
      },
      {
        title: "还款金额",
        data: data.repaymentAmount,
        color: ["#21D0B8", "#1EBBA6"]
      },
      {
        title: "待收总额",
        data: data.waitCollectAmount,
        color: ["#6C8FA1", "#5F8295"]
      },
      {
        title: "未逾待收金额",
        data: data.noOverdueAmount,
        color: ["#6C8FA1", "#5F8295"]
      }
    ];
    const columns2 = [
      {
        title: "当日待收金额",
        data: data.todayWaitCollectAmount,
        color: ["#01D5E5", "#00BDCC"]
      },
      {
        title: "3日内逾期待收",
        data: data.d3OverdueAmount,
        color: ["#EA8080", "#E66C6C"]
      },
      {
        title: "7日内逾期待收",
        data: data.d7OverdueAmount,
        color: ["#EA8080", "#E66C6C"]
      },
      {
        title: "15日内逾期待收",
        data: data.d15OverdueAmount,
        color: ["#EA8080", "#E66C6C"]
      },
      {
        title: "15日以上逾期待收",
        data: data.d15AboveOverdueAmount,
        color: ["#EA8080", "#E66C6C"]
      }
    ];
    return (
      <Card>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {data &&
            columns.map((item, index) => (
              <Card
                key={item.title}
                bodyStyle={{ padding: 0 }}
                className={styles.cardStyle}
                style={{
                  background: `linear-gradient(${item.color[0]}, ${
                    item.color[1]
                  })`
                }}
              >
                <p>{item.data || ""}</p>
                <p className={styles.title}>{item.title}</p>
              </Card>
            ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {data &&
            columns2.map((item, index) => (
              <Card
                key={item.title}
                bodyStyle={{ padding: 0 }}
                className={styles.cardStyle}
                style={{
                  background: `linear-gradient(${item.color[0]}, ${
                    item.color[1]
                  })`
                }}
              >
                <p>{item.data || ""}</p>
                <p className={styles.title}>{item.title}</p>
              </Card>
            ))}
        </div>
      </Card>
    );
  }
}

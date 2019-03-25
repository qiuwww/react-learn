/**
 * Created by Administrator on 2016/11/9.
 */
import React, { Component } from "react";
import { Card } from "antd";

class Tongdun extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tongDun: props.tongDun
    };
  }

  componentWillReceiveProps(props) {
    if (props.tongDun != this.state.tongDun) {
      this.setState({
        tongDun: props.tongDun
      });
    }
  }

  render() {
    let tongDun = this.state.tongDun;
    if (tongDun == null) {
      return (
        <Card
          title="同盾"
          noHovering={true}
          style={{ width: "100%", display: "inline-block" }}
        >
          <h3>
            <font color="#f60">未订阅!</font>
          </h3>
        </Card>
      );
    }
    if (tongDun != null && !tongDun.tongdunSync) {
      return (
        <Card
          title="同盾"
          noHovering={true}
          style={{ width: "100%", display: "inline-block" }}
        >
          <h3>
            <font color="#ff8000">未订阅!</font>
          </h3>
        </Card>
      );
    }

    let [color, desc] = ["", ""];
    if (tongDun.finalDecision == "Reject") {
      color = "#f60";
      desc = "建议拒绝";
    }
    if (tongDun.finalDecision == "Review") {
      color = "#C0504D";
      desc = "建议审核";
    }
    if (tongDun.finalDecision == "Accept") {
      color = "#2db7f5";
      desc = "建议通过";
    }

    let itemName = JSON.parse(tongDun.itemName);
    let itemNameArr = [];
    let itemNameIndex = 0;
    for (let i in itemName) {
      let items = itemName[i];
      itemNameArr[itemNameIndex] = {
        name: i
      };
      itemNameArr[itemNameIndex].values = items.map((value, index) => {
        let itemDetail = value.split(":");
        return {
          name: itemDetail[0],
          value: itemDetail[1]
        };
      });
      itemNameIndex++;
    }

    return (
      <div>
        <Card
          title="同盾同盾检测结果："
          noHovering={true}
          extra={
            <div style={{ color, width: 100, fontSize: 15 }}>
              {desc}：{tongDun.finalScore}
            </div>
          }
          style={{ width: "100%", display: "inline-block" }}
        >
          <h3>
            {itemNameArr.map((value, index) => {
              return (
                <div style={{ marginBottom: "10" }}>
                  <div style={{ color: "#09c" }}>{value.name}:</div>
                  {value.values.map((val, ind) => {
                    return (
                      <span style={{ marginRight: "5" }}>
                        {val.name} :{" "}
                        <span style={{ color: "#f80" }}>{val.value} ; </span>
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </h3>
        </Card>
      </div>
    );
  }
}

export default Tongdun;

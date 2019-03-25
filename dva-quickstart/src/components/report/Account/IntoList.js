import React from "react";
import { connect } from "dva";
import { Table } from "antd";
import moment from "moment";
import styles from "../index.less";
console.log(styles.grayTd);

const IntoList = props => {
  const {
    account: { intoList, intoPagination }
  } = props;
  const columns = [
    {
      title: "日期",
      dataIndex: "dataTime"
    },
    {
      title: "支付服务费",
      dataIndex: "serviceCapital",
      className: styles.redTd
    },
    {
      title: "连连支付",
      dataIndex: "lianlianPayCapital"
    },
    {
      title: "畅捷支付",
      dataIndex: "changjiePayCapital"
    },
    {
      title: "支付宝",
      dataIndex: "alipayPayCapital"
    },
    {
      title: "微信支付",
      dataIndex: "wechatPayCapital"
    },
    {
      title: "还款总金额",
      dataIndex: "totalCapital",
      className: styles.redTd
    },
    {
      title: "连连还款",
      dataIndex: "lianlianCapital"
    },
    {
      title: "畅捷还款",
      dataIndex: "changjieCapital"
    },
    {
      title: "畅捷代扣",
      dataIndex: "changjiedaiCapital"
    },
    {
      title: "支付宝还款",
      dataIndex: "alipayCapital"
    },
    {
      title: "微信还款",
      dataIndex: "wechatCapital"
    }
  ];

  return (
    <Table
      bordered
      rowKey={(record, index) => index}
      dataSource={intoList}
      columns={columns}
      pagination={{
        ...intoPagination,
        onChange: (page, pageSize) => {
          props.handleFetch(page, pageSize);
        }
      }}
    />
  );
};

export default connect(({ account }) => ({ account }))(IntoList);

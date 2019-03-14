import React ,{ PropTypes } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import moment from 'moment';

const OutList = (props) => {
  const { account: { outList, outPagination } } = props;
  const columns = [
    {
      title: '日期',
      dataIndex: 'dataTime',
    }, {
      title: '放款总金额',
      dataIndex: 'totalCapital',
    // }, {
    //   title: '连连放款',
    //   dataIndex: 'lianlianCapital',
    // }, {
    //   title: '畅捷放款',
    //   dataIndex: 'changjieCapital',
    // }, {
    //   title: '易宝放款',
    //   dataIndex: 'yibaoCapital',
    }
  ];

  
  return (
    <Table
      bordered
      rowKey={(record, index) => index}
      dataSource={outList}
      columns={columns}
      pagination={{
        ...outPagination,
        onChange: (page, pageSize) => {
          props.handleFetch(page, pageSize);
        }
      }}
    />
  );
}

export default connect(({ account }) => ({ account }))(OutList);

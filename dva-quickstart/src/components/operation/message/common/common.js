import {Tree, Table, Card, Button, Form, notification,Message, Row, Col, DatePicker,Modal,Input,Lable, Select,Popconfirm } from 'antd'
// 将树形数据进行处理（子节点加上isLeaf属性）。
export let treeDeal = (titleData) => {

    function dealTitle (datas) {
      if (!datas || datas.length === 0) {
        return;
      }
      for (var i=0;i<datas.length ; i++) {
        var item = datas[i];
        if (item.children || item.appInfoVoList) {
          dealTitle(item.children)
        }
        else {
          item.isLeaf = true
        }
      }
    }
    if (titleData) {
      dealTitle(titleData)
    }
}

var parentId

export let treeRefTitleDeal = (titleData) => {

  function dealRefTitle (datas) {
    if (!datas || datas.length === 0) {
      return;
    }
    for (var i=0;i<datas.length ; i++) {
      var item = datas[i];
      if(item.key) {
        parentId = item.key
      }
      if (item.children || item.appInfoVoList) {
        if (item.appInfoVoList) {
          parentId = item.key
          dealRefTitle(item.appInfoVoList)
        } else{
          dealRefTitle(item.children)
        }
      }
      else {
        console.log(item)
        if (item.appId) {
          console.log(parentId)
          item.key = parentId + '-' + item.appId
          item.title = item.appName
        }
        item.isLeaf = true
      }
    }
  }
  if (titleData) {
    dealRefTitle(titleData)
    console.log(titleData)
  }
}

export let successNotify = (message,desc) => {
  openNotificationWithIcon('success',message,desc)
};
export let errorNotify = (message,desc) => {
  openNotificationWithIcon('error',message,desc)
};

const openNotificationWithIcon = (type,message,desc) => {
  notification[type]({
    message: message,
    description: desc,
  });
};


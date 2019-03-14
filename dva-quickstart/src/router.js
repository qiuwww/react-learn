import React, { PropTypes } from "react";
import { Router, Route } from "dva/router";
import auth from "./services/auth";

import HomePage from "./components/homePage/Index";

// ================================================login
import Login from "./components/login/Login";

// ============================================MainLayout

import MainLayout from "./components/layout/MainLayout";

// ==========================================admin
import MenuAdd from "./components/admin/menu/Add";
import MenuList from "./components/admin/menu/Index";
import AdminList from "./components/admin/admin/Index";
import AddAdminRole from "./components/admin/role/Edit";
import AdminRoleList from "./components/admin/role/Index";
import AdminEdit from "./components/admin/admin/Edit";
// ===========================================finance

import CheckTotal from "./components/finance/checkTotal/Index";
import Apply from "./components/finance/apply/Index";
import InitialOrderNew from "./components/finance/initialOrder/New";
import InitialOrderRepeat from "./components/finance/initialOrder/Repeat";
import TelOrderNew from "./components/finance/telOrder/New";
import TelOrderRepeat from "./components/finance/telOrder/Repeat";
import PhotoCheckNew from "./components/finance/photoCheck/New";
import PhotoCheckRepeat from "./components/finance/photoCheck/Repeat";
import PassOrder from "./components/finance/OrderView/PassOrder";
import RefuseOrder from "./components/finance/OrderView/RefuseOrder";

// ===========================================overdue
import internalOverdueCaseNew from "./components/overdue/case/internalCollection/NewCase";
import internalOverdueCaseRepeat from "./components/overdue/case/internalCollection/RepeatCase";
import externalOverdueCaseNew from "./components/overdue/case/externalCollection/NewCase";
import externalOverdueCaseRepeat from "./components/overdue/case/externalCollection/RepeatCase";
import OverdueList from "./components/overdue/allocationOrder/Index";
import TodayOverdueList from "./components/overdue/TodayAllocationOrder/Index";
import ExternalOverdueCheck from "./components/overdue/externalOverdueCheck/Index";
import PersonalCheckList from "./components/overdue/personalCheckList/Index";
import SheildPhone from "./components/overdue/sheildPhone/sheildPhone";

// 当日应还列表
import Today_repay from "./components/overdue/case/today_repay/Index";

// ===================================== user
import UserManage from "./components/users/manage/Index";
import UserThaw from "./components/users/thaw/Thaw";

//=============================================affairs

import Paid from "./components/affairs/paid/Index";
import Checking from "./components/affairs/checking/Index";
import EnterAccount from "./components/affairs/enterAccount/Index";
import PayBack from "./components/affairs/payBack/Index";
import FundConfirm from "./components/affairs/fundConfirm/Index";
import TransferSign from "./components/affairs/transferSign/Index";
import CapitalClear from "./components/affairs/capitalClear/Index";
import HandInput from "./components/affairs/handInput/Index";
import InputRecord from "./components/affairs/inputRecord/Index";
import LineCapitalList from "./components/affairs/lineCapitalList/Index";
import PaymentCenter from "./components/affairs/paymentCenter/Index";
// 财务页面添加三table
import ServiceFeeRepayment from "./components/affairs/serviceFeeRepayment/index";
import LoanList from "./components/affairs/loanList/index";
import RepaymentList from "./components/affairs/repaymentList/index";
import Withholding from "./components/affairs/Withholding/index"; //批量代扣
import WithholdingDetails from "./components/affairs/Withholding/details"; //批量代扣

//=================================================operation(运营)
import BannerAdd from "./components/operation/banner/Add";
import BannerList from "./components/operation/banner/Index";
import PushList from "./components/operation/push/List";

import HotspotList from "./components/operation/hotspot/Index";
import HotContent from "./components/operation/hotspot/hotContent/Index";
import SmsMessage from "./components/operation/smsmessage/List";
import MessageSearch from "./components/operation/message/searchmsg";
import MessageApp from "./components/operation/message/app";
import MessageBiz from "./components/operation/message/biz";
import MessageList from "./components/operation/message/messageList";
import MessageServicer from "./components/operation/message/servicer";
import MessageTemplate from "./components/operation/message/template";
import AboutUs from "./components/operation/aboutus"; //app设置关于我们
import ProductConfig from "./components/operation/productConfig"; //额度配置
import MemberConfig from "./components/operation/memberConfig"; //会员设置

/*------------- 报表 ---------------*/
import channelList from "./components/report/Channel/List";
import loanStatistical from "./components/report/Loan";
import loanStatisticalDetails from "./components/report/Loan/Details";
import overdueStatistical from "./components/report/Overdue";
import overdueStatisticalDetails from "./components/report/Overdue/Details";
import accountStatistical from "./components/report/Account";
// 新增页面 qiu 报表部分的放款统计与还款统计
import Q_LoanStatistical from "./components/report/statistical/loan";
import NewLoanStatistical from "./components/report/statistical/NewLoan";
import Q_repaymentStatistical from "./components/report/statistical/repayment";
import newRepaymentStatistical from "./components/report/statistical/NewRepayment"; // 新还款统计
import ConsumeStatistical from "./components/report/statistical/ConsumeFee"; // 新还款统计
import StatisticBoard from "./components/report/StatisticBoard"; // 数据报表
/*------------- 订单 ---------------*/
import WaitForPayOrder from "./components/order/Repayment/WaitForPay"; // 新还款统计
import PayOffOrder from "./components/order/Repayment/PayOff"; // 新还款统计
import AuditPassOrder from "./components/order/AuditPass"; //机审通过订单
/*------------- 用户管理 ---------------*/
import registerNoApply from "./components/users/ApplyStatistical/NoApply"; // 注册未申请
import registerNormalRepayment from "./components/users/ApplyStatistical/NormalRepayment"; // 注册未申请

import apiStatistical from "./components/report/apiStatistical";
import apiOverdueStatistical from "./components/report/apiOverdueStatistical";
import apiOverdueStatisticalDetail from "./components/report/apiOverdueStatistical/Details";

const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({
      pathname: "/login",
      state: { nextPathname: nextState.location.pathname }
    });
  }
};

export default function({ history }) {
  return (
    <Router history={history}>
      <Route path="/login" component={Login} />
      <Route path="/homePage" component={HomePage} />

      <Route path="/" component={MainLayout} onEnter={requireAuth}>
        {/*权限*/}
        <Route path="/admin">
          <Route path="menu/add" component={MenuAdd} />
          <Route path="menu/list" component={MenuList} />
          <Route path="list" component={AdminList} />
          <Route path="add" component={AdminEdit} />
          <Route path="edit/:id" component={AdminEdit} />
          <Route path="role/add" component={AddAdminRole} />
          <Route path="role/edit/:id" component={AddAdminRole} />
          <Route path="role/list" component={AdminRoleList} />
        </Route>

        {/*信审*/}
        <Route path="/finance">
          <Route path="initialOrder/new" component={InitialOrderNew} />
          <Route path="initialOrder/repeat" component={InitialOrderRepeat} />
          <Route path="telOrder/new" component={TelOrderNew} />
          <Route path="telOrder/repeat" component={TelOrderRepeat} />
          <Route path="photoCheck/new" component={PhotoCheckNew} />
          <Route path="photoCheck/repeat" component={PhotoCheckRepeat} />
          <Route path="passOrder/index" component={PassOrder} />
          <Route path="refuseOrder/index" component={RefuseOrder} />
          <Route path="check_total/index" component={CheckTotal} />
          <Route path="apply/index" component={Apply} />
        </Route>

        {/*催收管理*/}
        <Route path="/overdue">
          <Route
            path="externalOverdueCheck"
            component={ExternalOverdueCheck}
          />
          <Route path="overduelist" component={OverdueList} />
          <Route path="today-overduelist" component={TodayOverdueList} />
          <Route
            path="case/internal/new"
            component={internalOverdueCaseNew}
          />
          <Route
            path="case/internal/repeat"
            component={internalOverdueCaseRepeat}
          />
          <Route
            path="case/external/new"
            component={externalOverdueCaseNew}
          />
          <Route
            path="case/external/repeat"
            component={externalOverdueCaseRepeat}
          />
          <Route path="personalCheck" component={PersonalCheckList} />
          <Route path="urgentSwitch" component={SheildPhone} />
          {/* 当日应还列表 */}
          <Route path="today_repay" component={Today_repay} />
        </Route>

        {/*用户管理*/}
        <Route path="/users">
          <Route path="manage" component={UserManage} />
          <Route path="thaw" component={UserThaw} />
          <Route path="no-apply" component={registerNoApply} />
          <Route
            path="normal-repayment"
            component={registerNormalRepayment}
          />
        </Route>

        {/*财务*/}
        <Route path="/affairs">
          <Route path="paid" component={Paid} />
          <Route path="fund_confirm" component={FundConfirm} />
          <Route path="repayment_list" component={PayBack} />
          <Route path="booking_list" component={EnterAccount} />
          <Route path="capitalClear" component={CapitalClear} />
          <Route path="handInput" component={HandInput} />
          <Route path="inputRecord" component={InputRecord} />
          <Route path="lineCapitalList" component={LineCapitalList} />
          <Route path="paymentCenter" component={PaymentCenter} />

          <Route path="service" component={ServiceFeeRepayment} />
          <Route path="loan" component={LoanList} />
          <Route path="repayment" component={RepaymentList} />
          <Route path="withholding" component={Withholding} />
          <Route path="withholding/details" component={WithholdingDetails} />

          {/*<Route path='transfer_sign' component={TransferSign}/>*/}
        </Route>
        {/*运营*/}
        <Route path="/operation">
          <Route path="hotspot/list" component={HotspotList} />
          <Route path="hotspot/add" component={HotContent} />
          <Route path="hotspot/edit" component={HotContent} />
          <Route path="banner/add" component={BannerAdd} />
          <Route path="banner/list" component={BannerList} />
          <Route path="push/list" component={PushList} />
          <Route path="smsmessage/list" component={SmsMessage} />
          <Route path="message/search" component={MessageSearch} />
          <Route path="message/app" component={MessageApp} />
          <Route path="message/biz" component={MessageBiz} />
          <Route path="message/servicer" component={MessageServicer} />
          <Route path="message/template" component={MessageTemplate} />
          <Route path="message/messageList" component={MessageList} />
          <Route path="aboutus/config" component={AboutUs} />
          <Route path="product/config" component={ProductConfig} />
          <Route path="member/config" component={MemberConfig} />
        </Route>
        {/*报表*/}
        <Route path="/operation">
          <Route path="channel/list" component={channelList} />
          <Route path="loan/statistical" component={loanStatistical} />
          {/*放款统计*/}
          <Route path="overdue/statistical" component={overdueStatistical} />
          {/*逾期统计*/}
          <Route path="account/statistical" component={accountStatistical} />
          {/* 报表借款统计 */}
          <Route
            path="repayment/statistical"
            component={Q_repaymentStatistical}
          />
          <Route
            path="loan/account/statistical"
            component={Q_LoanStatistical}
          />
          <Route
            path="new-loan/account/statistical"
            component={NewLoanStatistical}
          />
          <Route
            path="new-repayment/statistical"
            component={newRepaymentStatistical}
          />
          <Route path="consume/statistical" component={ConsumeStatistical} />
          <Route path="statistic-board" component={StatisticBoard} />
          <Route
            path="loan/statistical-details"
            component={loanStatisticalDetails}
          />
          {/*放款统计详情*/}
          <Route
            path="overdue/statistical-details"
            component={overdueStatisticalDetails}
          />
          {/*逾期统计详情*/}
          {/* api进件统计 */}
          <Route path="report/apiStatistical" component={apiStatistical} />
          {/* api逾期统计 */}
          <Route
            path="report/apiOverdueStatistical"
            component={apiOverdueStatistical}
          />
          {/* api逾期统计查看详情 */}
          <Route
            path="report/apiOverdueStatistical/detail"
            component={apiOverdueStatisticalDetail}
          />
        </Route>
        {/*订单*/}
        <Route path="/order">
          <Route path="repayment/list-payoff" component={PayOffOrder} />
          <Route path="repayment/list-wait" component={WaitForPayOrder} />
          <Route path="repayment/audit-pass" component={AuditPassOrder} />
        </Route>
      </Route>
    </Router>
  );
}

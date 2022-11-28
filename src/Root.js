import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
// import MembershipStatus from './components/membershipStatus';

import Home from "./pages/home.js.old";
import Login from "./pages/login";
import AltHome from "./pages/AltHome";
import ManageUsers from "./pages/ManageUsers";
import AccountSetting from "./pages/AccountSettings";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";
import UserHome from "./pages/UserHome";
import Disputes from "./pages/Disputes";
import MyDisputes from "./pages/MyDisputes";
import TransactionRequest from "./pages/TransactionRequest";
import SentEvidence from "./pages/SentEvidence";
import Layout from "./hoc/layout";
import AuthRoute from "./components/AuthRoute";
import Teams from "./pages/Teams";
import Processes from "./pages/Process";
import AuditTrail from "./pages/AuditTrail";
import ReconDisputes from "./pages/ReconDisputes";
import ReconRevalidation from "./pages/ReconRevalidation";
import Report from "./pages/Report";
import ExpiredQueue from "./pages/ExpiredQueue";
import MasterComSetting from "./pages/mastercomsetting";
import DraftEmail from "./pages/DraftEmail";
import AgentLogin from "./pages/AgentLogin";
import Email from "./pages/Email";
import FTPSettings from "./pages/FTPSettings";
import ViewException from "./pages/ViewExceptions";
import UploadSettlment from "./pages/UploadSettlment";
import MailLogs from "./pages/MailLogs";
import ManageAgents from "./pages/ManageAgents";
import ViewSettlement from "./pages/ViewSettlement";
import FailedTransactions from "./pages/FailedTransactions";
import ApproveDeclineActions from "./pages/ApproveDeclineActions";
import MakerHome from "./pages/home.maker";
import CheckerHome from "./pages/home.checker";
import { appConstants } from "./services/helpers";
import LoginReport from "./pages/LoginReport";
import AdminHome from "./pages/home.admin";
import MyRequestHistory from "./pages/MyRequestHistory";
import ISODSuperAdminManageUsers from "./pages/ManageUsers.superadmin";
import ServiceLog from "./pages/ServiceLog";
import RouteDispute from "./pages/RouteDispute";
import BranchHome from "./pages/BranchHome";
import CrmUserHome from "./pages/UserHomeCrm";
import ReconReversals from "./pages/ReconReversals";
import GRU from "./pages/Recon/GRU";
import UploadFailedReports from "./pages/Recon/UploadFailedReports";
import OpenItemsFTPSettings from "./pages/Recon/OpenItemsFTPSettings";
import SearchDispute from "./pages/SearchDispute";
import MyLoginReport from "./pages/MyLoginReport";
import FilterAuditTrail from "./pages/FilterAuditTrail";
import UserReport from "./pages/UserReport";
import DormantUserReport from "./pages/DormantUserReport";
import UploadAtmJournalException from "./pages/UploadAtmJournalException";
import AdjustmentfileItems from "./pages/adjustment_file/AdjustmentfileItems";

import ProductPaperForm from "./pages/product_paper/ProductPaperForm";
import ProductPaperSearch from "./pages/product_paper/ProductPaperSearch";
import ProductPaperFormDetail from "./pages/product_paper/ProductPaperFormDetail";
import ProductPaperBusinessEntity from "./pages/product_paper/ProductPaperBusinessEntity";
import ProductPaperDirectorateEntity from "./pages/product_paper/ProductPaperDirectorateEntity";
import ProductPaperDepartmentEntity from "./pages/product_paper/ProductPaperDepartmentEntity";
import ProductPaperNewEntity from "./pages/product_paper/ProductPaperNewEntity";
import AdjustmentPendingItems from "./pages/adjustment_file/AdjustmentPendingItems";
import AdjustmentUploadTreatedItems from "./pages/adjustment_file/AdjustmentUploadTreatedItems";
import AdjustmentGenerateTTUM from "./pages/adjustment_file/AdjustmentGenerateTTUM";
import OpenItemsReport from "./pages/Recon/OpenItemsReport";
import ExportGeneratedExcel from "./pages/Recon/ExportGeneratedExcel";
import FilterBackgroundLog from "./pages/FilterBackgroundLog";
import CommentLog from "./pages/comment_log/CommentLog";



function Root() {
  return (
    <Layout>
      <BrowserRouter>
        <Switch>
          {/* <AuthRoute userLevel="Admin" exact path="/" component={Home} /> */}
          {/* <AuthRoute userLevel={[appConstants.admin[0]]} exact path="/" component={Home} /> */}
          <AuthRoute exact path="/user/crm/dashboard" component={CrmUserHome} />
          
          <AuthRoute userLevel="Admin" exact path="/admin" component={AdminHome} />
          <AuthRoute userLevel={[...appConstants.maker]} exact path="/maker" component={MakerHome} />
          <AuthRoute userLevel={[...appConstants.checker]} exact path="/checker" component={CheckerHome} />
          <AuthRoute exact path="/user/home" component={AltHome} />
                    
          <Route exact path="/disputes" component={Disputes} />
          <AuthRoute
            exact
            path="/agent/transaction/requests"
            component={TransactionRequest}
          />
          <AuthRoute
            exact
            path="/agent/sent-evidences"
            component={SentEvidence}
          />
          <AuthRoute userLevel={[...appConstants.audit, 
            ...appConstants.agent, ...appConstants.recon, "TeamLead",...appConstants.user, "ReconTeamLead"
            ]} exact path="/m-disputes" component={ReconDisputes} />

          <AuthRoute userLevel={[...appConstants.audit, 
            ...appConstants.agent, ...appConstants.recon, "TeamLead",...appConstants.user, "ReconTeamLead"
            ]} exact path="/m-revalidation" component={ReconRevalidation} />

          <AuthRoute userLevel={[...appConstants.audit]} exact path="/user/disputes" component={MyDisputes} />
          <AuthRoute userLevel={[...appConstants.agent, ...appConstants.user, ...appConstants.recon, "TeamLead", "ReconTeamLead"]} exact path="/user/dashboard" component={UserHome} />
          <AuthRoute
            userLevel="Admin"
            exact
            path="/draft-email"
            component={DraftEmail}
          />
          <AuthRoute userLevel="Admin" exact path="/emails" component={Email} />
          <AuthRoute
            userLevel={[...appConstants.audit, ...appConstants.checker, "Admin"]}
            exact
            path="/audit-trail"
            component={AuditTrail}
          />
          <AuthRoute component={ViewException} path="/view-exceptions" exact />
          <AuthRoute
            userLevel={[...appConstants.audit ,"Admin", ...appConstants.teamLead]}
            exact
            path="/report"
            component={Report}
          />
          <AuthRoute
            userLevel="Admin"
            exact
            path="/expired-queue"
            component={ExpiredQueue}
          />
          <AuthRoute
            userLevel="Admin"
            exact
            path="/mastercom-setting"
            component={MasterComSetting}
          />
          <AuthRoute path="/view-settlement" exact component={ViewSettlement} />
          <AuthRoute
            userLevel={["Admin", ...appConstants.maker]}
            exact
            path="/agents/manage"
            component={ManageAgents}
          />


          <AuthRoute
            exact
            path="/failed-transactions"
            component={FailedTransactions}
          />
          <AuthRoute
            userLevel="Admin"
            exact
            path="/mail-logs"
            component={MailLogs}
          />
          <AuthRoute
            component={UploadSettlment}
            path="/upload-settlement"
            exact
          />
          <AuthRoute userLevel={[...appConstants.admin, ...appConstants.maker, ...appConstants.teamLead, ...appConstants.reconTeamLead ]} exact path="/users/manage" component={ManageUsers} />
          {/* <Route exact path="/users/manage" component={ManageUsers} /> */}
          <AuthRoute userLevel={[...appConstants.audit, ...appConstants.checker, "Admin"]} exact path="/logs" component={Logs} />
          <AuthRoute userLevel={[...appConstants.audit]} exact path="/login-report" component={LoginReport} />
          <AuthRoute exact path="/recon/open-items-report" component={OpenItemsReport} />
          <AuthRoute exact path="/recon/export-recon-report" component={ExportGeneratedExcel} />
          <AuthRoute exact path="/report/filter-service-log" component={FilterBackgroundLog} />
          <AuthRoute exact path="/comment-log" component={CommentLog} />
          

          
          
          
          <AuthRoute
            exact
            path="/user/account/setting"
            component={AccountSetting}
          />
          {/* <Route
            exact
            path="/user/account/setting"
            component={AccountSetting}
          /> */}
          <AuthRoute 
          userLevel={[...appConstants.audit, ...appConstants.checker, "Admin"]}
          exact path="/settings" component={Settings} />
          <AuthRoute userLevel={["Admin", ...appConstants.maker]} exact path="/teams" component={Teams} />
          {/* <Route exact path="/teams" component={Teams} /> */}
          <AuthRoute userLevel={["Admin", "ReconTeamLead"]} exact path="/processes" component={Processes} />
          <AuthRoute userLevel={[...appConstants.checker]} exact path="/action" component={ApproveDeclineActions} />
          <AuthRoute
            userLevel="ReconTeamLead"
            exact
            path="/ftp-settings"
            component={FTPSettings}
          />
          <AuthRoute userLevel={[...appConstants.checker, appConstants.teamLead[0], appConstants.admin[1]]} exact path="/m-requests" component={MyRequestHistory} />
          <AuthRoute userLevel={[appConstants.admin[0]]} exact path="/s-manage-users" component={ISODSuperAdminManageUsers} />
          <AuthRoute userLevel={[appConstants.admin[1],...appConstants.maker]} exact path="/service-logs" component={ServiceLog} />
          <AuthRoute userLevel={[appConstants.teamLead[0]]} exact path="/route-dispute" component={RouteDispute} />
          
          
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={Login} />
          <Route exact path="/agent/login" component={AgentLogin} />
          <AuthRoute exact path="/branch/" component={BranchHome} />
          <AuthRoute userLevel={[appConstants.reconTeamLead[0], appConstants.recon[0]]} exact path="/recon/reversals" component={ReconReversals} />
          <AuthRoute userLevel={[appConstants.reconTeamLead[0], appConstants.recon[0]]} exact path="/recon/gru-open-items" component={GRU} />
          <AuthRoute userLevel={[appConstants.reconTeamLead[0], appConstants.recon[0]]} exact path="/recon/upload-failed-reports" component={UploadFailedReports} />

          <AuthRoute userLevel={[appConstants.reconTeamLead[0], appConstants.recon[0]]} exact path="/recon/open-items-ftp" component={OpenItemsFTPSettings} />
          <AuthRoute
            userLevel={[...appConstants.audit ,"Admin", ...appConstants.teamLead]}
            exact
            path="/search-dispute"
            component={SearchDispute}
          />
          <AuthRoute exact path="/m-login" component={MyLoginReport} />
          <AuthRoute exact path="/filter-audit-trail" component={FilterAuditTrail} />
          <AuthRoute exact path="/user-report" component={UserReport} />
          <AuthRoute exact path="/dormant-user-report" component={DormantUserReport} />
          <AuthRoute exact path="/upload-atm-journal-exception" component={UploadAtmJournalException} />
          {/* Arbiter Adjustment File */}
          <AuthRoute exact path="/adjustment/upload-file" component={AdjustmentfileItems} />
          <AuthRoute exact path="/adjustment/generate" component={AdjustmentGenerateTTUM} />
          <AuthRoute exact path="/adjustment/treat-pending" component={AdjustmentPendingItems} />
          <AuthRoute exact path="/adjustment/upload-merchant-file" component={AdjustmentfileItems} />
          <AuthRoute exact path="/adjustment/upload-treated" component={AdjustmentUploadTreatedItems} />
          
          
          {/* prodcut paper */}
          <AuthRoute exact path="/user/form" component={ProductPaperForm} />
          <AuthRoute exact path="/form/search" component={ProductPaperSearch} />
          <AuthRoute exact path="/form/detail" component={ProductPaperFormDetail} />
          <AuthRoute exact path="/user/business-group" component={ProductPaperBusinessEntity} />
          <AuthRoute exact path="/user/directorates" component={ProductPaperDirectorateEntity} />
          <AuthRoute exact path="/user/departments" component={ProductPaperDepartmentEntity} />
          <AuthRoute exact path="/user/entity" component={ProductPaperNewEntity} />
          
          {/* new routes */}
          {/* <Route exact path="/maker/add/user" component={MakerAddUser} />
          <Route exact path="/super/add/user" component={SuperAdminAddUser} />
          <Route exact path="/maker/add/team" component={MakerAddTeam} /> */}

          
        </Switch>
      </BrowserRouter>
    </Layout>
  );
}

export default Root;

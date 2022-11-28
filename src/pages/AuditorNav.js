import React, { useEffect } from "react";
import Dashboard from "../hoc/Dashboard";
import { SummaryBox, BoxShadow, Header } from "../custom";
import { Link } from "react-router-dom";
import App from "../services";
import { connect } from "react-redux";
import * as actions from "../actions";
import { appConstants } from "../services/helpers";

function AuditorNavigation() {
  return (<BoxShadow className="bg-white h-100 py-5 d-flex align-items-center logs-menu">
    <ul>
      {[...appConstants.audit,...appConstants.teamLead, appConstants.admin[1], ...appConstants.user].includes(App.getUserRole()) && (
        <>
          {
            [...appConstants.audit].includes(App.getUserRole()) &&
            <>
              <li className={ window.location.href.includes("/logs") && "active"}>
                <Link style={{ color: "#000" }} to="/logs">
                  Logs
                </Link>
              </li>
              <li className={ window.location.href.includes("/service-logs") && "active"}>
                <Link style={{ color: "#000" }} to="/service-logs">
                    Service Logs
                </Link>
              </li>
            </>
          }
            <li className={ window.location.href.includes("/audit-trail") && "active"}>
              <Link style={{ color: "#000" }} to="/audit-trail">
                Audit Trail
              </Link>
            </li>
            <li className={ window.location.href.includes("/filter-audit-trail") && "active"}>
              <Link style={{ color: "#000" }} to="/filter-audit-trail">
                Filter Audit
              </Link>
            </li>
          <li className={ window.location.href.endsWith("/report") && "active"}>
            <Link style={{ color: "#000" }} to="/report">
            Dispute Report
            </Link>
          </li>
          <li className={ window.location.href.includes("/search-dispute") && "active"}>
            <Link style={{ color: "#000" }} to="/search-dispute">
            Search Dispute
            </Link>
          </li>
            {
              [...appConstants.audit,"Control"].includes(App.getUserRole()) &&
              <>
                  <li className={ window.location.href.includes("/login-report") && "active"}>
                    <Link style={{ color: "#000" }} to="/login-report">
                      Login Records
                    </Link>
                  </li>
                  <li className={ window.location.href.includes("/user-report") && "active"}>
                    <Link style={{ color: "#000" }} to="/user-report">
                      User Report
                    </Link>
                  </li>
                  <li className={ window.location.href.includes("/dormant-user-report") && "active"}>
                    <Link style={{ color: "#000" }} to="/dormant-user-report">
                      Dormant Users
                    </Link>
                  </li>
              </>
            }
            {
              [appConstants.admin[1], appConstants.teamLead[0], ...appConstants.user].includes(App.getUserRole()) && 
              <li>
                <Link style={{ color: "#000" }} to="/expired-queue">
                  Expired queue
                </Link>
              </li>
            }
        </>
      )}
      {App.getUserRole() === "ReconTeamLead" && (
        <li className={ window.location.href.includes("/ftp-settings") && "active"}>
          <Link style={{ color: "#000" }} to="/ftp-settings">
            FTP Settings
          </Link>
        </li>
      )}
      {App.getUserRole() === "ReconTeamLead" && (
        <li className={ window.location.href.includes("/view-exceptions") && "active"}>
          <Link style={{ color: "#000" }} to="/view-exceptions">
            View Exceptions
          </Link>
        </li>
      )}
      <li className={ window.location.href.includes("/report/filter-service-log") && "active"}>
        <Link style={{ color: "#000" }} to="/report/filter-service-log">
          Service Log
        </Link>
      </li>
    </ul>
  </BoxShadow>);
}

export default connect(null)(AuditorNavigation);

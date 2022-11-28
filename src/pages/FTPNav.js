import React, { useState } from "react";
import Dashboard from "../hoc/Dashboard";
import {
  SummaryBox,
  BoxShadow,
  Header,
  Label,
  Input,
  Button,
  Select,
} from "../custom";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";

import App from "../services";

function FTPNav({ startLoading }) {


  return (
    <ul>
      {App.getUserRole() === "Admin" && (
        <>
          <li>
            <Link style={{ color: "#000" }} to="/logs">
              Logs
            </Link>
          </li>

          <li>
            <Link style={{ color: "#000" }} to="/audit-trail">
              Audit Trail
            </Link>
          </li>

          {/* <li>Reports</li> */}
          {/* <li>Notification</li> */}
          <li>
            <Link style={{ color: "#000" }} to="#">
              Settings
            </Link>
          </li>
          <li>
            <Link style={{ color: "#000" }} to="/report">
              Report
            </Link>
          </li>
        </>
      )}
      {["ReconTeamLead", "Recon"].includes(App.getUserRole()) && (
        <li className={window.location.href.includes("/ftp-settings") ? "active": ""}>
          <Link style={{ color: "#000" }} to="/ftp-settings">
            FTP Settings
          </Link>
        </li>
      )}
      {(App.getUserRole() === "ReconTeamLead" ||
        App.getUserRole() === "Recon") && (
        <li className={window.location.href.includes("/view-exceptions") ? "active": ""}>
          <Link style={{ color: "#000" }} to="/view-exceptions">
            View Exceptions
          </Link>
        </li>
      )}
      {(App.getUserRole() === "ReconTeamLead" ||
        App.getUserRole() === "Recon") && (
        <li className={window.location.href.includes("/upload-settlement") ? "active": ""}>
          <Link
            style={{ color: "#000" }}
            to="/upload-settlement"
          >
            Upload Settlement File
          </Link>
        </li>
      )}
      {(App.getUserRole() === "ReconTeamLead" ||
        App.getUserRole() === "Recon") && (
        <li className={window.location.href.includes("/view-settlement") ? "active": ""}>
          <Link style={{ color: "#000" }} to="/view-settlement">
            View Settlment
          </Link>
        </li>
      )}
      {(App.getUserRole() === "ReconTeamLead" ||
        App.getUserRole() === "Recon") && (
        <li className={window.location.href.includes("/failed-transactions") ? "active": ""}>
          <Link
            style={{ color: "#000" }}
            to="/failed-transactions"
          >
            Failed Transactions
          </Link>
        </li>
      )}
      {(App.getUserRole() === "ReconTeamLead" ||
        App.getUserRole() === "Recon") && (
        <li className={window.location.href.includes("/gru-ftp") ? "active": ""}>
          <Link
            style={{ color: "#000" }}
            to="/recon/open-items-ftp"
          >
            Open Items
          </Link>
        </li>
      )}
    </ul>
  );
}

export default connect(null, actions)(FTPNav);

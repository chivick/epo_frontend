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
import { appConstants } from "../services/helpers";

function ReversalsNav({ startLoading }) {


  return (
    <ul>
      {[...appConstants.recon, ...appConstants.reconTeamLead].includes(App.getUserRole()) && (
        <>
          <li className={window.location.href.includes("/recon/gru-open-items") ? "active": ""}>
            <Link style={{ color: "#000" }} to="/recon/gru-open-items">
              GRU Open Items
            </Link>
          </li>
          <li className={window.location.href.includes("/recon/upload-failed-reports") ? "active": ""}>
            <Link style={{ color: "#000" }} to="/recon/upload-failed-reports">
              Failed Reports
            </Link>
          </li>
          <li className={window.location.href.includes("/recon/open-items-report") ? "active": ""}>
            <Link style={{ color: "#000" }} to="/recon/open-items-report">
              Open Items Report
            </Link>
          </li>
          <li className={window.location.href.includes("/recon/export-recon-report") ? "active": ""}>
            <Link style={{ color: "#000" }} to="/recon/export-recon-report">
              Export Report
            </Link>
          </li>
        </>
      )}
    </ul>
  );
}

export default connect(null, actions)(ReversalsNav);

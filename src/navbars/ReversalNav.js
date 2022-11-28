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
          <li className={window.location.href.includes("/recon/reversals") ? "active": ""}>
            <Link style={{ color: "#000" }} to="/recon/reversals">
                Transactions Reversals
              </Link>
          </li>
        </>
      )}
    </ul>
  );
}

export default connect(null, actions)(ReversalsNav);

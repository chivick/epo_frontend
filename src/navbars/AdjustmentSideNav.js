import React, { useEffect } from "react";
import Dashboard from "../hoc/Dashboard";
import { SummaryBox, BoxShadow, Header } from "../custom";
import { Link } from "react-router-dom";
import App from "../services";
import { connect } from "react-redux";
import * as actions from "../actions";
import { appConstants } from "../services/helpers";

function AdjustmentSideNav() {
  return (<BoxShadow className="bg-white h-100 py-5 d-flex align-items-center logs-menu">
    <ul>
      {(
        <>
          <li className={ window.location.href.includes("/adjustment/upload-file") && "active"}>
            <Link style={{ color: "#000" }} to="/adjustment/upload-file">
              Upload Adjustment File
            </Link>
          </li>
          <li className={ window.location.href.includes("/adjustment/treat-pending") && "active"}>
            <Link style={{ color: "#000" }} to="/adjustment/treat-pending">
              Download Pending items
            </Link>
          </li>
          <li className={ window.location.href.includes("/adjustment/upload-treated") && "active"}>
            <Link style={{ color: "#000" }} to="/adjustment/upload-treated">
              Upload Treated Items
            </Link>
          </li>
          <li className={ window.location.href.includes("/adjustment/generate") && "active"}>
            <Link style={{ color: "#000" }} to="/adjustment/generate">
              Generate TTUM
            </Link>
          </li>
        </>  
            
        
      )}
    </ul>
  </BoxShadow>);
}

export default connect(null)(AdjustmentSideNav);

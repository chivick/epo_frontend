import React from "react";
import Dashboard from "../hoc/Dashboard";
import { Header, SummaryBox, Button } from "../custom";
import { Link } from "react-router-dom";
import LogRow from "../components/LogsRow";

function AltHome() {
  return (
    <Dashboard>
      <div className="container py-3">
        <Header>Overview</Header>
        <div className="row">
          <div className="col-md-4">
            <div className="px-2">
              <SummaryBox>
                <div className="d-flex justify-content-between py-2 px-3">
                  <div className="counter-summary">
                    <h4>DISPUTES</h4>
                    <h5>Unresolved</h5>
                  </div>
                  <div className="d-flex counter-report align-items-center">
                    <h4>246</h4>
                  </div>
                </div>
                <div className="see-more-wrapper py-2">
                  <Link to="#">see more</Link>
                </div>
              </SummaryBox>
            </div>
          </div>
          <div className="col-md-4">
            <div className="px-2">
              <SummaryBox>
                <div className="d-flex justify-content-between py-2 px-3">
                  <div className="counter-summary">
                    <h4>DISPUTES</h4>
                    <h5>Resolved</h5>
                  </div>
                  <div className="d-flex counter-report align-items-center">
                    <h4 style={{ color: "#000" }}>246</h4>
                  </div>
                </div>
                <div className="see-more-wrapper py-2">
                  <Link to="#">see more</Link>
                </div>
              </SummaryBox>
            </div>
          </div>
          <div className="col-md-4">
            <div className="px-2">
              <SummaryBox>
                <div className="d-flex justify-content-between py-2 px-3">
                  <div className="counter-summary">
                    <h4>DISPUTES</h4>
                    <h5>Assigned</h5>
                  </div>
                  <div className="d-flex counter-report align-items-center">
                    <h4 style={{ color: "#000" }}>246</h4>
                  </div>
                </div>
                <div className="see-more-wrapper py-2">
                  <Link to="#">see more</Link>
                </div>
              </SummaryBox>
            </div>
          </div>
        </div>
        <Header>Disputes</Header>
        <div className="row">
          <div className="col-md-6">
            <SummaryBox style={{ padding: "10px 16px" }}>
              <div className="d-flex justify-content-end">
                <div style={{ width: 100 }}>
                  <Button>see all</Button>
                </div>
              </div>

              <table className="logs-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Type</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <LogRow
                    status="Resolved"
                    type="Notifications"
                    date="13/10/2020 at 08:18:16 AM"
                  />
                  <LogRow
                    status="Resolved"
                    type="Notifications"
                    date="13/10/2020 at 08:18:16 AM"
                  />
                  <LogRow
                    status="Resolved"
                    type="Notifications"
                    date="13/10/2020 at 08:18:16 AM"
                  />
                  <LogRow
                    status="Resolved"
                    type="Notifications"
                    date="13/10/2020 at 08:18:16 AM"
                  />
                </tbody>
              </table>
            </SummaryBox>
          </div>
          <div className="col-md-6">
            <SummaryBox
              className="dispute-report"
              style={{
                padding: "10px 8px",
                height: "100%",
                position: "relative",
              }}
            >
              <h4>Disputes</h4>
              <h5>Status</h5>
              <div
                className="d-flex justify-content-center"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                }}
              >
                <ul>
                  <li className="assigned">
                    <span className="assigned-circle"></span>Assigned
                  </li>
                  <li className="resolved">
                    <span className="resolved-circle"></span>Resolved
                  </li>
                  <li className="unresolved">
                    <span className="unresolved-circle"></span>Unresolved
                  </li>
                </ul>
              </div>
            </SummaryBox>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default AltHome;

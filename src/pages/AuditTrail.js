import React, { useEffect, useState } from "react";
import Dashboard from "../hoc/Dashboard";
import { Link } from "react-router-dom";
import { SummaryBox, BoxShadow, Header, GrayCircleAvatar } from "../custom";
// import CusotmLogRow from "../components/CusotmLogRow";
import AuditorNavigation from "./AuditorNav";
import * as actions from "../actions";
import { connect } from "react-redux";

import App from "../services";
function AuditTrail({startLoading}) {
  const [logs, setLog] = useState([]);
  // const handleLogRowClick = (e) => {
  //   window.$("#logModal").modal("show");
  // };
  const closeModal = (id) => {
    window.$(id).modal("hide");
  };
  useEffect(() => {
    startLoading(true);
    // const logDt = JSON.parse(App.getFromLocalStorage("fb-logs"));
    let trailDt = JSON.parse(App.getFromLocalStorage("fb-audit"));
    if (!trailDt) trailDt = [];
    // console.log("trail: ", trailDt);
    App.getAuditTrail().then(response => {
      if (response) {
        trailDt = [...trailDt, ...response.Data];
        trailDt = trailDt.sort((a, b) => new Date(b.Date) - new Date(a.Date));
        setLog(trailDt);
      }
    }).finally(() => startLoading(false));

    
  }, [setLog]);
  return (
    <Dashboard>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-12">
            <SummaryBox
              className=""
              style={{ maxHeight: "70vh", height: "70vh", overflowX: "hidden" }}
            >
              <div className="row h-100">
                <div className="col-md-2 h-100">
                  <AuditorNavigation />
                </div>
                <div
                  className="col-md-10"
                  style={{ height: "100%", overflowY: "scroll" }}
                >
                  <div className="px-1 py-2">
                    <Header className="mb-2">Audit Trail</Header>
                    {/* <div className="row px-4 mb-2">
                      <div className="col-md-8">
                        <Input placeholder="Search Logs" />
                      </div>
                      <div className="col-md-4">
                        <Input type="date" />
                      </div>
                    </div> */}
                    <div className="row px-4 mb-2">
                      <div className="col-md-12">
                        <table className="logs-report-table w-100">
                          <thead>
                            <tr>
                              <td>Action</td>
                              <th> StaffId</th>
                              <th> IpAddress</th>
                              <th> Description</th>
                              <th> Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {logs.map((log, i) => {
                              return (
                              <tr style={{ cursor: "pointer" }} key={i}>
                                <td>{log.Action}</td>
                                <td>{log.StaffId}</td>
                                <td>{log.IpAddress}</td>
                                <td>{log.Description}</td>
                                <td>{App.convertToTimeString(log.Date)}</td>
                              </tr>
                            )}
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SummaryBox>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="logModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div
            class="modal-content py-4"
            style={{ backgroundColor: "#F8F9FB" }}
          >
            <div class="modal-body p-0">
              <section className="py-3 d-flex align-items-center justify-content-between px-3">
                <h2 style={{ color: "#000", fontSize: 20, fontWeight: "bold" }}>
                  Log Details
                </h2>
                <GrayCircleAvatar onClick={() => closeModal("#logModal")}>
                  X
                </GrayCircleAvatar>
              </section>

              <div className="row mt-3 px-4 pb-5">
                <div className="col-md-12">
                  <Header style={{ fontSize: 13, marginBottom: 4 }}>
                    Notification
                  </Header>
                  <span style={{ fontSize: 10 }}>
                    13 October 2020 at 08:18:16 AM
                  </span>
                </div>
              </div>
              <div className="row mt-3 px-4">
                <div className="col-md-2">
                  <Header
                    style={{ fontSize: 13, marginBottom: 0, marginTop: 0 }}
                  >
                    Status
                  </Header>
                </div>
                <div className="col-md-10">
                  <span style={{ fontSize: 12 }}>Resolved</span>
                </div>
              </div>
              <div className="row mt-3 px-4">
                <div className="col-md-2">
                  <Header
                    style={{ fontSize: 13, marginBottom: 0, marginTop: 0 }}
                  >
                    Notificatin
                  </Header>
                </div>
                <div className="col-md-10">
                  <span style={{ fontSize: 12 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. In pellentesque massa placerat duis ultricies. Nulla
                    malesuada pellentesque elit eget gravida. Pharetra magna ac
                    placerat vestibulum. Leo vel orci porta non pulvinar neque
                    laoreet suspendisse. Felis eget velit aliquet sagittis id
                    consectetur purus ut faucibus. Interdum velit laoreet id
                    donec ultrices tincidunt arcu non. Congue mauris rhoncus
                    aenean vel elit scelerisque mauris pellentesque pulvinar.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default connect(null, actions)(AuditTrail);

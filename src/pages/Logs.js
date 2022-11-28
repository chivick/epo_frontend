import React, { useEffect, useState } from "react";
import Dashboard from "../hoc/Dashboard";
import { Link } from "react-router-dom";
import {
  SummaryBox,
  BoxShadow,
  Header,
  GrayCircleAvatar,
  Button,
  Hr,
} from "../custom";
// import CusotmLogRow from "../components/CusotmLogRow";
import App from "../services";
import { appConstants } from "../services/helpers";
import AuditorNavigation from "./AuditorNav";

function Logs() {
  const [logs, setLog] = useState([]);

  const closeModal = (id) => {
    window.$(id).modal("hide");
  };
  useEffect(() => {
    const logDt = JSON.parse(App.getFromLocalStorage("fb-logs"));
    // [{id: i, logs: []}]
    if (logDt) {
      const logTrx = [];
      Object.keys(logDt).forEach((key) => {
        logTrx.push({ id: key, logs: logDt[key], title: "Logs Report" });
      });

      setLog(() => [...logTrx]);
    }
  }, [setLog]);
  const viewLogs = (logs) => {
    

    // window.$("#example").DataTable().clear();
    window.$("#example").DataTable({
      data: logs.logs,
      columns: [
        {
          title: "Batch",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Batch;
            }
            return row.Batch;
          },
          responsivePriority: 1000,
        },
        {
          title: "Logs",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Logs;
            }
            return row.Logs;
          },
          responsivePriority: 2,
        },
        {
          title: "Date Time",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return App.convertToTimeString(row.DateTime);
            }
            return App.convertToTimeString(row.DateTime);
          },
          responsivePriority: 5,
        },
      ],
      dom: "Bfrtip",
      buttons: [
        "copy",
        "csv",
        "excel",
        {
          extend: "pdfHtml5",
          orientation: "landscape",
          pageSize: "LEGAL",
        },
        {
          extend: "print",
          orientation: "landscape",
          pageSize: "LEGAL",
        },
      ],
      responsive: true,
      bDestroy: true,
    });
    window.$("#viewLogs").modal("show");
  };
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
                    <Header className="mb-2">Logs</Header>
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
                              <th>Batch</th>
                              <th>Title</th>
                              {/* <th>Date</th> */}
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {logs.map((log, i) => (
                              <tr key={i}>
                                <td style={{ fontSize: 11 }}>{log.id}</td>
                                <td style={{ fontSize: 11 }}>{log.title}</td>
                                <td>
                                  <Button
                                    onClick={() => viewLogs(log)}
                                    style={{ maxWidth: 130 }}
                                  >
                                    View All
                                  </Button>
                                </td>
                              </tr>
                            ))}
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
      <div
        class="modal fade"
        id="viewLogs"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-body p-0">
              <section className="py-3 d-flex align-items-center justify-content-between px-3">
                <h2
                  style={{ color: "#EAAA00", fontSize: 20, fontWeight: "bold" }}
                >
                  Logs
                </h2>
                <GrayCircleAvatar onClick={() => closeModal("#viewLogs")}>
                  X
                </GrayCircleAvatar>
              </section>
              <Hr />
              <div className="container" style={{ overflowY: "auto" }}>
                <table
                  id="example"
                  className="table table-striped display responsive nowrap w-100 table-bordered"
                ></table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default Logs;

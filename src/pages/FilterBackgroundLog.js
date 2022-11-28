import React, { useEffect, useState } from "react";
import Dashboard from "../hoc/Dashboard";
import { Link } from "react-router-dom";
import { SummaryBox, BoxShadow, Header, GrayCircleAvatar, Label, Select, Input, Button } from "../custom";
// import CusotmLogRow from "../components/CusotmLogRow";
import AuditorNavigation from "./AuditorNav";
import moment from "moment";
import { urls } from "../services/urls";
import App from "../services";
import * as actions from "../actions";
import { connect } from "react-redux";

function FilterBackgroundLog({startLoading}) {
  const [logs, setLog] = useState([]);
  const [reportType, setReportType] = useState("All");
  const [reportTypes, setReportTypes] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const [staffId, setStaffId] = useState("");
  // const handleLogRowClick = (e) => {
  //   window.$("#logModal").modal("show");
  // };
  const closeModal = (id) => {
    window.$(id).modal("hide");
  };
  useEffect(() => {
    // const logDt = JSON.parse(App.getFromLocalStorage("fb-logs"));
    
    getActionTypes();
    setSelectedDateRange(moment().subtract(29, "days").format("YYYY-MM-DD") + ":" + moment().format("YYYY-MM-DD"));
    window.$('input[name="daterange"]').daterangepicker(
      {
        opens: "right",
        startDate: moment().subtract(29, "days"),
        ranges: {
          Today: [moment(), moment()],
          Yesterday: [
            moment().subtract(1, "days"),
            moment().subtract(1, "days"),
          ],
          "Last 7 Days": [moment().subtract(6, "days"), moment()],
          "Last 30 Days": [moment().subtract(29, "days"), moment()],
          "This Month": [moment().startOf("month"), moment().endOf("month")],
          "Last Month": [
            moment().subtract(1, "month").startOf("month"),
            moment().subtract(1, "month").endOf("month"),
          ],
        },
      },
      function (start, end, label) {
        setSelectedDateRange(start.format("YYYY-MM-DD") + ":" + end.format("YYYY-MM-DD"));
      }
    );
    setSelectedDateRange(moment().subtract(6, "days") + ":" + moment().subtract(6, "days"));
    getReport();
    
  }, []);

  const getActionTypes = () => {
    App.showNotifiction("info", "Getting Service Types");
    App.getRequest(urls.getServiceLogTypes).then(result => {
      if (result && result.Status) {
        setReportTypes(result.Result);
        App.showNotifiction("info", "Service Types Gotten");
      }
    })
  }
  
  const getReport = () => {
    const dateSelected = selectedDateRange.split(":");
    // console.log("dateSelected: " + dateSelected);
    const _type = reportType;
    App.showNotifiction("info", "Fetching Report",true);
    App.getRequest(urls.filterServiceLogs(reportType, dateSelected[0], dateSelected[1])).then(result => {
      if (result && result.Status ) {
        App.showNotifiction("info", "Report Gotten", true);
        setLog(result.Result);
        renderAuditTrail(result.Result);
      }
    }).finally(() => startLoading(false));
  }

  const renderAuditTrail = (report) => {
    window.$("#audit-trail").DataTable({
      data: report,
      columns: [
        {
          title: "Log",
          render: (data, type, row, meta) => {
            console.log(row.Logs);
            if (type === "display") {
              return row.Logs;
            }
            return row.Logs;
          },
          responsivePriority: 1000,
        },
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
          title: "LogType",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.LogType;
            }
            return row.LogType;
          },
          responsivePriority: 2,
        },
        {
          title: "Date",
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
  }

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
                    <Header className="mb-2">Filter Service Logs</Header>
                    <div className="row px-4 mb-2">
                        <div className="col-md-4">
                          <Label>Report Type</Label>
                          <Select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                          >
                            <option value="All">All</option>
                            {
                              reportTypes && reportTypes.map(item => (<option value={item}>{item}</option>))
                            }
                          </Select>
                        </div>


                        <div className="col-md-4">
                          <Label>Date Range</Label>
                          <Input type="text" id="daterange" name="daterange" />
                          {/* <DateRangePicker
                            ranges={[selectionRange]}
                            onChange={handleSelect}
                          /> */}
                        </div>

                        <div className="col-md-4">
                          <Label>Staff Id</Label>
                          <Input type="text" id="staffId" name="staffId" onChange={(e) => {setStaffId(e.target.value)}} placeholder={"Staff Id"} />
                          {/* <DateRangePicker
                            ranges={[selectionRange]}
                            onChange={handleSelect}
                          /> */}
                        </div>
                      
                        <div className="col-md-4 pt-3">
                            <Button onClick={() => getReport()} style={{ width: 170 }}>
                              Get Report
                            </Button>
                        </div>
                    </div>
                    <div className="row px-4 mb-2">
                      <div className="col-md-12">
                        <table id="audit-trail" className="logs-report-table w-100">
                          {/* <thead>
                            <tr>
                              <td>Action</td>
                              <th> StaffId</th>
                              <th> IpAddress</th>
                              <th> Description</th>
                              <th> Date</th>
                            </tr>
                          </thead> */}
                          {/* <tbody>
                            {logs && logs.map((log, i) => {
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
                          </tbody> */}
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

export default connect(null, actions)(FilterBackgroundLog);

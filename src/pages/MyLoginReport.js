import React, { useEffect, useState } from "react";
import Dashboard from "../hoc/Dashboard";
import { Link } from "react-router-dom";
// import CusotmLogRow from "../components/CusotmLogRow";
import AuditorNavigation from "./AuditorNav";
import {
  SummaryBox,
  BoxShadow,
  Header,
  GrayCircleAvatar,
  Select,
  Label,
  Button,
  Input,
} from "../custom";
import App from "../services";
import { log } from "../services/helpers";
import * as actions from "../actions";
import moment from "moment";
import { connect } from "react-redux";
import { urls } from "../services/urls";

function MyLoginReport ({startLoading}){
  const [reports, setReports] = useState([]);
  const [reportType, setReportType] = useState("All");
  const [selectedDateRange, setSelectedDateRange] = useState("");
  

  useEffect(() => {
    // startLoading(true);
    
    setSelectedDateRange(moment().subtract(29, "days").format("YYYY-MM-DD") + ":" + moment().format("YYYY-MM-DD"));
    getReport("", ":");
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
    
  }, []);

  const getReport = (_type="",dateSelected=selectedDateRange) => {
    startLoading(true);
    
    App.getRequest(urls.myLoginReport(App.getFromLocalStorage("fb-staffId"), _type, dateSelected.split(":"))).then(result => {
      if (result !== undefined) {
        setReports(result);
        renderMyLoginReport(result);
      }
    }).finally(() => startLoading(false));
  }

  const renderMyLoginReport = (report) => {
    window.$("#example").DataTable({
      data: report,
      columns: [
        {
          title: "Date Logged In",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return moment(row.DateLoggedIn).format("yyyy/MM/DD hh:mm");
            }
            return moment(row.DateLoggedIn).format("yyyy/MM/DD hh:mm");
          },
          responsivePriority: 1000,
        },
        {
          title: "IP Address",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.IPAddress;
            }
            return row.IPAddress;
          },
          responsivePriority: 1000,
        },
        {
          title: "Full Name",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.FullName;
            }
            return row.FullName;
          },
          responsivePriority: 2,
        },
        {
          title: "Is LoggedIn",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return (row.IsLoggedIn) ? "Yes" : "No";
            }
            return (row.IsLoggedIn) ? "Yes" : "No";
          },
          responsivePriority: 5,
        },
        {
          title: "Expiry Date",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.ExpiryDate ? moment(row.ExpiryDate).format("yyyy/MM/DD hh:mm") : "n/a" ;
            }
            return row.ExpiryDate ? moment(row.ExpiryDate).format("yyyy/MM/DD hh:mm") : "n/a" ;
          },
          responsivePriority: 3,
        },
        {
          title: "Logout Date",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.LogoutDate ? moment(row.LogoutDate).format("yyyy/MM/DD hh:mm") : "n/a";
            }
            return row.LogoutDate ? moment(row.LogoutDate).format("yyyy/MM/DD hh:mm") : "n/a";
          },
          responsivePriority: 3,
        },
        {
          title: "StaffId	",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.StaffId	;
            }
            return row.StaffId	;
          },
          responsivePriority: 6,
        },
        {
          title: "Status",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Status;
            }
            return row.Status;
          },
          responsivePriority: 2,
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
                  <div
                    className="col-md-12"
                    style={{ height: "100%", overflowY: "scroll" }}
                  >
                    <div className="px-1 py-2">
                      <Header className="mb-2">Login Report</Header>
                      {/* <div className="row px-4 mb-2">
                      <div className="col-md-4">
                        <Label>Report Type</Label>
                        <Select
                          value={reportType}
                          onChange={(e) => setReportType(e.target.value)}
                        >
                          <option value="All">All</option>
                          <option value="Failed">Failed</option>
                          <option value="LoginSuccessful">Successful</option>
                          <option value="AwaitingToken">Pending</option>
                        </Select>
                      </div>


                      <div className="col-md-4">
                        <Label>Date Range</Label>
                        <Input type="text" id="daterange" name="daterange" />
                        <DateRangePicker
                          ranges={[selectionRange]}
                          onChange={handleSelect}
                        />
                      </div>
                    
                    <div className="col-md-4 pt-4">
                        <Button onClick={() => getReport()} style={{ width: 170 }}>
                          Get Report
                        </Button>
                    </div>
                    </div> */}
                    
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
                          <table
                            id="example"
                            className="table table-striped display responsive nowrap w-100 table-bordered"
                          ></table>
                        </div>
                          {/* <table className="logs-report-table w-100">
                            <thead>
                              <tr>
                                <td>Date Logged In</td>
                                <th>IP Address</th>
                                <th>Full Name</th>
                                <th>Staff Id</th>
                                <th>Is Logged In</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reports.map((report, i) => (
                                <tr style={{ cursor: "pointer" }} key={i}>
                                  <td>{
                                      App.convertToTimeString(report.DateLoggedIn)
                                    }
                                  </td>
                                  <td>{report.IPAddress}</td>
                                  <td>{report.FullName}</td>
                                  <td>{report.StaffId}</td>
                                  <td>{report.IsLoggedIn ? "Yes" : "No"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table> */}
                      </div>
                    </div>
                  </div>
                </div>
              </SummaryBox>
            </div>
          </div>
        </div>
      </Dashboard>
    );
}

export default connect(null, actions)(MyLoginReport);


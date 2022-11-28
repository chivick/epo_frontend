import React, { useEffect, useState } from "react";
import Dashboard from "../../hoc/Dashboard";
import { Link } from "react-router-dom";
// import CusotmLogRow from "../components/CusotmLogRow";
import AuditorNavigation from "../AuditorNav";
import {
  SummaryBox,
  BoxShadow,
  Header,
  GrayCircleAvatar,
  Select,
  Label,
  Button,
  Input,
} from "../../custom";
import App from "../../services";
import { log } from "../../services/helpers";
import * as actions from "../../actions";
import moment from "moment";
import { connect } from "react-redux";
import { urls } from "../../services/urls";
import GRUNav from "../../navbars/GRUNav";
import { Icon } from "@material-ui/core";

function ExportGeneratedExcel ({startLoading}){
  const [reports, setReports] = useState([]);
  const [reportType, setReportType] = useState("CBAOutstanding");
  const [selectedDateRange, setSelectedDateRange] = useState("");
  

  useEffect(() => {
    // startLoading(true);
    
    setSelectedDateRange(moment().subtract(29, "days").format("YYYY-MM-DD") + ":" + moment().format("YYYY-MM-DD"));
    window.$('input[name="daterange"]').daterangepicker(
      {
        opens: "right",
        startDate: moment(),
        singleDatePicker: true,
      },
      function (start, end, label) {
        setSelectedDateRange(start.format("YYYY-MM-DD") + ":" + end.format("YYYY-MM-DD"));
      }
    );
    
  }, []);

  const getReport = () => {
    
    const dateSelected = selectedDateRange.split(":");
    // console.log("dateSelected: " + dateSelected);
    const _type = reportType;
    startLoading(true);
    App.getRequestExcelData(urls.pullExcelFromLocal(_type, dateSelected), _type + dateSelected[0]).then(result => {
      console.log(result);
    }).finally(() => startLoading(false));
    
    // App.getRequest(urls.pullExcelFromLocal(_type, dateSelected)).then(result => {
    //   if (result !== undefined) {
    //     setReports(result);
    //     //renderOpenItemsReport(result);
    //   }
    // }).finally(() => startLoading(false));
  }

  const renderOpenItemsReport = (report) => {
    window.$("#example").DataTable({
      data: report,
      columns: [
        {
          title: "Stan",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Stan;
            }
            return row.Stan;
          },
          responsivePriority: 1000,
        },
        {
          title: "RRN",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.RRR;
            }
            return row.RRR;
          },
          responsivePriority: 1000,
        },
        {
          title: "TerminalId",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.TerminalId;
            }
            return row.TerminalId;
          },
          responsivePriority: 1000,
        },
        {
          title: "Amount",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Amount?? "n/a"	;
            }
            return row.Amount?? "n/a"	;
          },
          responsivePriority: 1000,
        },
        {
          title: "Status",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Status?? "n/a"	;
            }
            return row.Status?? "n/a"	;
          },
          responsivePriority: 2,
        },
        {
          title: "TLMCode",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.TLMCode;
            }
            return row.TLMCode;
          },
          responsivePriority: 1000,
        },
        {
          title: "AcctName",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.AcctName;
            }
            return row.AcctName;
          },
          responsivePriority: 1000,
        },
        {
          title: "LedgerAcct",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.LedgerAcct;
            }
            return row.LedgerAcct;
          },
          responsivePriority: 2,
        },
        {
          title: "ItemKey",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return (row.ItemKey);
            }
            return (row.ItemKey);
          },
          responsivePriority: 5,
        },
        {
          title: "Sign",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Sign;
            }
            return row.Sign;
          },
          responsivePriority: 3,
        },
        {
          title: "Type",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Type;
            }
            return row.Type;
          },
          responsivePriority: 3,
        },
        {
          title: "ValDate",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return App.convertToTimeString(row.ValDate) ?? "n/a"	;
            }
            return App.convertToTimeString(row.ValDate) ?? "n/a"	;
          },
          responsivePriority: 6,
        },
        {
          title: "Postdate",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return App.convertToTimeString(row.Postdate)?? "n/a"	;
            }
            return App.convertToTimeString(row.Postdate) ?? "n/a"	;
          },
          responsivePriority: 2,
        },
        {
          title: "EscalationLevel",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.EscalationLevel?? "n/a"	;
            }
            return row.EscalationLevel?? "n/a"	;
          },
          responsivePriority: 2,
        },
        {
          title: "Age",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Age?? "n/a"	;
            }
            return row.Age?? "n/a"	;
          },
          responsivePriority: 2,
        },
        {
          title: "LifeSpan",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.LifeSpan?? "n/a"	;
            }
            return row.LifeSpan?? "n/a"	;
          },
          responsivePriority: 2,
        },
        {
          title: "AgeafterLifeSpan",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.AgeafterLifeSpan?? "n/a"	;
            }
            return row.AgeafterLifeSpan?? "n/a"	;
          },
          responsivePriority: 2,
        },
        {
          title: "Comment",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Comment?? "n/a"	;
            }
            return row.Comment?? "n/a"	;
          },
          responsivePriority: 2,
        },
        {
          title: "Narration",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Narration?? "n/a"	;
            }
            return row.Narration?? "n/a"	;
          },
          responsivePriority: 2,
        },
        {
          title: "Narration2",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Narration2?? "n/a"	;
            }
            return row.Narration2?? "n/a"	;
          },
          responsivePriority: 2,
        },
        {
          title: "OffshoreAcct",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.OffshoreAcct?? "n/a"	;
            }
            return row.OffshoreAcct?? "n/a"	;
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
                  <div className="col-md-2 h-100">
                  <BoxShadow className="bg-white h-100 py-5 d-flex align-items-center logs-menu">
                    <GRUNav />
                  </BoxShadow>
                    
                  </div>
                  <div
                    className="col-md-10"
                    style={{ height: "100%", overflowY: "scroll" }}
                  >
                    <div className="px-1 py-2">
                      <Header className="mb-2">Reconcillation Report</Header>
                      <div className="px-4 mb-2">
                        <div className="col-md-4">
                          <Label>Report Type</Label>
                          <Select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                          >
                            <option value="CBAOutstanding">AB Visa Outstanding</option>
                            <option value="CBAGBReconiledReport">AB Visa Recon ReconciledEntries</option>
                            <option value="FailedAgencyMDB">AB Visa Oustanding Settlement for FIS Feedback</option>
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
                      
                        <div className="col-md-4 pt-4">
                            <Button onClick={() => getReport()} style={{ width: 170 }}>
                              Export Report
                            </Button>
                        </div>
                    </div>
                    
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

export default connect(null, actions)(ExportGeneratedExcel);


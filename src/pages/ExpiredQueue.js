import React, { useEffect, useState } from "react";
import Dashboard from "../hoc/Dashboard";
import { Link } from "react-router-dom";
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
// import "react-date-range/dist/styles.css"; // main style file
// import "react-date-range/dist/theme/default.css";
// import { DateRangePicker } from "react-date-range";
// import CusotmLogRow from "../components/CusotmLogRow";
// import App from "../services";
import * as actions from "../actions";
import { connect } from "react-redux";
import App from "../services";
import AuditorNav from "./AuditorNav";
function ExpiredQueue({ startLoading }) {
  //   const [logs, setLog] = useState([]);
  //   const handleLogRowClick = (e) => {
  //     window.$("#logModal").modal("show");
  //   };
  const [report, setReport] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const moment = window.moment;

  const closeModal = (id) => {
    window.$(id).modal("hide");
  };
  const [reportType, setReportType] = useState("");
  const getReport = async () => {
    try {
      //   if (reportType.trim() === "")
      //     return App.showNotifiction("info", "Please select a report type");
      const dateSelected = window.$("#daterange").val();
      if (dateSelected.trim() === "")
        return App.showNotifiction("info", "Please choose a daterange");

      console.log(dateSelected);
      startLoading(true);
      const response = await App.expiredQueue(dateSelected);
      console.log("response: ", response);

      setReport(response);
      window.$("#example").DataTable().clear().draw();

      startLoading(false);
      console.log(response);
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };

  useEffect(() => {
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
        console.log(
          "A new date selection was made: " +
            start.format("YYYY-MM-DD") +
            " to " +
            end.format("YYYY-MM-DD")
        );
      }
    );

    window.$("#example tbody").on("click", "button", function () {
      // var data = table.row( $(this).parents('tr') ).data();
      const id = window.$(this).attr("data-id");
      console.log(id);
      //   showJournal(id);
    });

    window.$("#example").DataTable({
      data: report,
      columns: [
        {
          title: "Dispute ID",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.DisputeLogId;
            }
            return row.DisputeLogId;
          },
          responsivePriority: 1000,
        },
        {
          title: "Merchant Name",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.MerchantName;
            }
            return row.TransId;
          },
          responsivePriority: 1000,
        },
        {
          title: "Acct No",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.CardType;
            }
            return row.AcctNo;
          },
          responsivePriority: 2,
        },
        {
          title: "Category",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Category;
            }
            return row.Category;
          },
          responsivePriority: 5,
        },
        {
          title: "RRN",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.IssuerRRN;
            }
            return row.IssuerRRN;
          },
          responsivePriority: 3,
        },
        {
          title: "Platform",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Platform;
            }
            return row.Platform;
          },
          responsivePriority: 6,
        },
        {
          title: "PAN",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.PAN;
            }
            return row.PAN;
          },
          responsivePriority: 2,
        },
        {
          title: "STAN",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Stan;
            }
            return row.Stan;
          },
          responsivePriority: 8,
        },
        {
          title: "Transaction Date",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return App.convertToTimeString(row.Transaction_Date);
            }
            return App.convertToTimeString(row.Transaction_Date);
          },
          responsivePriority: 9,
        },
        // {
        //   title: "View journal",
        //   render: (data, type, row, meta) => {
        //     if (type === "display") {
        //       return `<button data-id=${row.Id}>View Journal</button>`;
        //     }
        //     return `<button data-id=${row.Id}>View Journal</button>`;
        //   },
        //   responsivePriority: 2,
        // },
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
    return () => {
      // window.$("#example").DataTable().destroy(true);
    };
  }, [report, moment]);
  // const selectionRange = {
  //   startDate: new Date(),
  //   key: "selection",
  // };
  // const handleSelect = (e) => {
  //   console.log(e);
  // };
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
                  <AuditorNav />
                  
                </div>
                <div
                  className="col-md-10"
                  style={{ height: "100%", overflowY: "scroll" }}
                >
                  <div className="px-1 py-2">
                    <Header className="mb-2">Expired Queue</Header>
                    <div className="row px-4 mb-2">
                      {/* <div className="col-md-6">
                        <Label>Report Type</Label>
                        <Select
                          value={reportType}
                          onChange={(e) => setReportType(e.target.value)}
                        >
                          <option value="">Choose Report</option>
                          <option value="SystemResolved">
                            System Resolved
                          </option>
                          <option value="Resolved">Resolved</option>
                          <option value="Pending">Pending</option>
                          <option value="Expired">Expired</option>
                          <option value="UnAssigned">UnAssigned</option>
                        </Select>
                      </div> */}
                      <div className="col-md-6">
                        <Label>Date</Label>
                        <Input type="date" id="daterange" />
                        {/* <DateRangePicker
                          ranges={[selectionRange]}
                          onChange={handleSelect}
                        /> */}
                      </div>
                    </div>
                    <div className="row px-4 mb-2">
                      <div className="col-md-12">
                        <div className="d-flex w-100 justify-content-end">
                          <Button onClick={getReport} style={{ width: 170 }}>
                            Get Report
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="row px-4 mb-2">
                      <div className="col-md-12">
                        <table
                          id="example"
                          className="table table-striped display responsive nowrap w-100 table-bordered"
                        ></table>
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
      {/* {popUp && (
        <div
          className="popup"
          id="popup"
          tabindex="-1"
          role="dialog"
          aria-labelledby="ViewJournalModal"
          aria-hidden="true"
          onClick={closePopUp}
        >
          <div className="p-4">
            <div className="mr-auto">
              <GrayCircleAvatar onClick={closePopUp}>X</GrayCircleAvatar>
            </div>
            <img
              src={`data:image/png;base64,${imgSrc}`}
              alt="Journal display"
              className="mx-auto d-block"
            />
          </div>
        </div>
      )} */}
    </Dashboard>
  );
}

export default connect(null, actions)(ExpiredQueue);

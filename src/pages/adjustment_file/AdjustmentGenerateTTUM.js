import React, { useEffect, useState } from "react";
import Dashboard from "../../hoc/Dashboard";
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
  Hr,
} from "../../custom";
// import "react-date-range/dist/styles.css"; // main style file
// import "react-date-range/dist/theme/default.css";
// import { DateRangePicker } from "react-date-range";
// import CusotmLogRow from "../components/CusotmLogRow";
// import App from "../services";
import * as actions from "../../actions";
import { connect } from "react-redux";
import App from "../../services";
import AuditorNav from "../AuditorNav";
import { log } from "../../services/helpers";
import { urls } from "../../services/urls";
import AdjustmentSideNav from "../../navbars/AdjustmentSideNav";
function AdjustmentGenerateTTUM({ startLoading }) {
  //   const [logs, setLog] = useState([]);
  //   const handleLogRowClick = (e) => {
  //     window.$("#logModal").modal("show");
  //   };
  const [report, setReport] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [title, setTitle] = useState("");
  const [reportType, setReportType] = useState("");
  const [decisionType, setDecisionType] = useState("");
  const [_type, set_Type] = useState("");
  
  const moment = window.moment;

  const closeModal = (id) => {
    window.$(id).modal("hide");
  };
  
  const getReport = async () => {
    try {
      const dateSelected = window.$("#daterange").val();
      if (dateSelected.trim() === "") return App.showNotifiction("info", "Please choose a daterange");

      startLoading(true);
      App.getRequest(urls.AdjustmentFileTTUM(dateSelected.split("-"))).then(result => {
        log("initial", result);
        if (result && result.status) {
          setReport(result.data);
        }
      }).catch(err => {
        App.showNotifiction("error", "items not found.")
      }).finally(() => startLoading(false));

      
      window.$("#example").DataTable().clear().draw();
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };


  // close journal popup
  /**
   *
   * @param {e} event
   */
  const closePopUp = (e) => {
    // if (e.target.id !== "popup") {
    setPopUp(false);
    setImgSrc("");
    // }
  };

  useEffect(() => {
    window.$('input[name="daterange"]').daterangepicker(
      {
        opens: "right",
        startDate: moment(),
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
    });
    renderDatatable();

  }, [report, moment]);
  
  const renderDatatable = () => {
    return window.$("#example").DataTable({
      data: report,
      columns: [
        {
          title: "Account Number",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.ReversalAccount ?? "n/a";
            }
            return row.ReversalAccount ?? "n/a";
          },
          responsivePriority: 1000,
        },
        {
          title: "Narration",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.narration ?? "n/a";
            }
            return row.narration ?? "n/a";
          },
          responsivePriority: 1000,
        },
        {
          title: "Amount",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.TransactionAmount ?? "n/a";
            }
            return row.TransactionAmount ?? "n/a";
          },
          responsivePriority: 3,
        },
        {
          title: "C/D",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.PartTranType ?? "n/a";
            }
            return row.PartTranType ?? "n/a";
          },
          responsivePriority: 8,
        },
        {
          title: "Log Code",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.LogCode ?? "n/a";
            }
            return row.LogCode ?? "n/a";
          },
          responsivePriority: 2,
        },
        {
          title: "Status",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Status ?? "n/a";
            }
            return row.Status ?? "n/a";
          },
          responsivePriority: 2,
        },
        {
          title: "Acquirer",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Acquirer ?? "n/a";
            }
            return row.Acquirer ?? "n/a";
          },
          responsivePriority: 2,
        },
        // {
        //   title: "Reversal Account",
        //   render: (data, type, row, meta) => {
        //     if (type === "display") {
        //       return row.ReversalAccount ?? "n/a";
        //     }
        //     return row.ReversalAccount ?? "n/a";
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
  }

  const onStatusChanged = (e) => {
    const _type = e.target.value;
    set_Type(_type);
    // destrouy the data table
    // window.$("#example").dataTable({
    //   'destroy': true
    // })
    //window.$("#example").DataTable().rows().invalidate('data').draw(false);

    renderDatatable();
    window.$("thead tr th:last-child").html((_type == "InitialLogCode") ? "Initial LogCode" : ((_type == "AccountToCredit") ? "Account Number" : ""));
  }

  return(
    <Dashboard>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-12">
            <SummaryBox>
              <div className="row h-100">
                <div className="col-md-2 h-100">
                  <AdjustmentSideNav />
                </div>
                <div
                  className="col-md-10"
                  style={{ height: "100%", overflowY: "scroll" }}
                >
                  <Header>Treat pending adjustment items</Header>
                  <div className="px-1 py-2">
                    <Hr/>
                    <Label>Download Items to be treated</Label>
                    <Hr/>
                    <div className="row px-4 mb-2">
                      <div className="col-md-6">
                        <Label>Settlement Date</Label>
                        <Input type="text" id="daterange" name="daterange" />
                      </div>
                      <div className="col-md-6 px-4 mb-2 pt-4">
                        <Button onClick={getReport} style={{ width: 170 }}>
                          Submit
                        </Button>
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
      {popUp && (
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
      )}
    </Dashboard>
  );
}

export default connect(null, actions)(AdjustmentGenerateTTUM);

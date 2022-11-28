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
import AuditorNav from "./../AuditorNav";
import { log, splitWordByCasingAndSpace } from "../../services/helpers";
import { urls } from "../../services/urls";
import AdjustmentSideNav from "../../navbars/AdjustmentSideNav";
function AdjustmentPendingItems({ startLoading }) {
  //   const [logs, setLog] = useState([]);
  //   const handleLogRowClick = (e) => {
  //     window.$("#logModal").modal("show");
  //   };
  const [report, setReport] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [title, setTitle] = useState("");
  const moment = window.moment;

  const closeModal = (id) => {
    window.$(id).modal("hide");
  };
  const [reportType, setReportType] = useState("");
  const [decisionType, setDecisionType] = useState("");
  const [_type, set_Type] = useState("");
  const getReport = async () => {
    try {
      if (_type.trim() === "")
      {
        return App.showNotifiction("info", "Please select a type.");  
      }

      startLoading(true);
      App.getRequest(`${urls.adjustmentFilePending}${_type}`).then(result => {
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

  // function to show journal
  /**
   *
   * @param {id} id of journal to be viewed
   */
  const showJournal = (id) => {
    
    if (report.length === 0) {
      return;
    }
    
    let copyState = [...report];
    let newObj = copyState.filter((e) => {
      if ( e.Id == id) {
        return e;
      }
    });
    
    if (newObj.length > 0) {

      
      if (!newObj || !newObj[0] || !newObj[0].Journal) {
        return;
      }

      setPopUp(true);
      setImgSrc(newObj[0].Journal);
    }
    
    // console.log(copyState[0]);
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
          title: "Log Code",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.LogCode ?? "n/a";
            }
            return row.LogCode ?? "n/a";
          },
          responsivePriority: 1000,
        },
        {
          title: "Acquirer",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Acquirer ?? "n/a";
            }
            return row.Acquirer ?? "n/a";
          },
          responsivePriority: 1000,
        },
        {
          title: "RRN",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.RetrievalReferenceNumber ?? "n/a";
            }
            return row.RetrievalReferenceNumber ?? "n/a";
          },
          responsivePriority: 3,
        },
        {
          title: "STAN",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Stan ?? "n/a";
            }
            return row.Stan ?? "n/a";
          },
          responsivePriority: 8,
        },
        {
          title: "Scheme",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Scheme ?? "n/a";
            }
            return row.Scheme ?? "n/a";
          },
          responsivePriority: 2,
        },
        {
          title: "Transaction Amount",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.TransactionAmount ?? "n/a";
            }
            return row.TransactionAmount ?? "n/a";
          },
          responsivePriority: 2,
        },
        {
          title: "Transaction Date",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return App.convertToTimeString(row.TransactionDate) ?? "n/a";
            }
            return App.convertToTimeString(row.TransactionDate) ?? "n/a";
          },
          responsivePriority: 9,
        },
        {
          title: "Dispute Region",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.DisputeType ?? "n/a";
            }
            return row.DisputeType ?? "n/a";
          },
          responsivePriority: 3,
        },
        {
          title: title,
          render: (data, type, row, meta) => {
            if (type === "display") {
              return "";
            }
            return "";
          },
          responsivePriority: 3,
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

  const onStatusChanged = (e) => {
    const _type = e.target.value;
    set_Type(_type);
    // destrouy the data table
    // window.$("#example").dataTable({
    //   'destroy': true
    // })
    //window.$("#example").DataTable().rows().invalidate('data').draw(false);

    renderDatatable();
    window.$("thead tr th:last-child").html(splitWordByCasingAndSpace(_type)) ;
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
                        <Label>Status</Label>
                        <Select
                          value={_type}
                          onChange={(e) => {
                            onStatusChanged(e);
                          }}
                        >
                          <option value="">Select</option>
                          <option value="InitialLogCode">Initial LogCode</option>
                          <option value="AccountToCredit">Account To Credit</option>
                          <option value="AccountToDebit">Account To Debit</option>
                        </Select>
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

export default connect(null, actions)(AdjustmentPendingItems);

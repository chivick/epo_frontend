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
import { log } from "../services/helpers";
import { urls } from "../services/urls";
function SearchDispute({ startLoading }) {
  //   const [logs, setLog] = useState([]);
  //   const handleLogRowClick = (e) => {
  //     window.$("#logModal").modal("show");
  //   };
  const [report, setReport] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [dispute, setDispute] = useState("");
  const moment = window.moment;

  const closeModal = (id) => {
    window.$(id).modal("hide");
  };
  const [reportType, setReportType] = useState("");
  const [decisionType, setDecisionType] = useState("");
  const getReport = async () => {
    try {
      if (dispute.trim() === "")
      {
        return App.showNotifiction("info", "Please enter dispute log code,RRN or transaction ID.");  
      }

      startLoading(true);
      App.getRequest(`${urls.searchDispute}${dispute}`).then(result => {
        log("initial", result);
        if (result) {
          setReport(result);
        }
      }).catch(err => {
        App.showNotifiction("error", "Dispute not found.")
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
      console.log(id);
      showJournal(id);
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
          title: "Transaction ID",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.TransId;
            }
            return row.TransId;
          },
          responsivePriority: 1000,
        },
        {
          title: "Assigned To",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.StaffId ?? "";
            }
            return row.StaffId ?? "";
          },
          responsivePriority: 1000,
        },
        {
          title: "Card Type",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.CardType;
            }
            return row.CardType;
          },
          responsivePriority: 2,
        },
        {
          title: "Dispute Status",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Status;
            }
            return row.Status;
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
        {
          title: "Dispute Region",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.Org_SW;
            }
            return row.Org_SW;
          },
          responsivePriority: 3,
        },
        {
          title: "Dispute Date",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return App.convertToTimeString(row.DisputeDate);
            }
            return App.convertToTimeString(row.DisputeDate);
          },
          responsivePriority: 9,
        },
        {
          title: "Date Created",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return App.convertToTimeString(row.DateCreated);
            }
            return App.convertToTimeString(row.DateCreated);
          },
          responsivePriority: 9,
        },
        {
          title: "View journal",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return `<button data-id=${row.Id}>View Journal</button>`;
            }
            return `<button data-id=${row.Id}>View Journal</button>`;
          },
          responsivePriority: 2,
          // defaultContent: "<button>Click!</button>",
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

  return(
    <Dashboard>
      <div>
        <div>
          <div>
            <SummaryBox>
              <div className="row h-100">
                <div className="col-md-2 h-100">
                  <AuditorNav />
                </div>
                <div
                  className="col-md-10"
                  style={{ height: "100%", overflowY: "scroll" }}
                >
                  <div className="px-1 py-2">
                    <Header className="mb-2">Dispute Report</Header>
                    <div className="row px-4 mb-2">
                      <div className="col-md-6">
                        <Label>Dispute</Label>
                        <Input onChange={(e) => setDispute(e.target.value)} placeholder="Search Dispute" />
                      </div>
                      <div className="col-md-6 px-4 mb-2 pt-4">
                        <Button onClick={getReport} style={{ width: 170 }}>
                          Get Report
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

export default connect(null, actions)(SearchDispute);

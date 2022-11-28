import React, { useEffect, useState, useRef } from "react";
import Dashboard from "../hoc/Dashboard";
import {
  Header,
  SummaryBox,
  YellowBox,
  CircleAvatar,
  Button,
  GrayCircleAvatar,
  Hr,
  Input,
  Select,
  FileSelect,
  Label,
  BoxShadow,
} from "../custom";
import { Link } from "react-router-dom";
// import LogRow from "../components/LogsRow";
import Swal from "sweetalert2";
import Chart from "chart.js";
// import DisputeReport from "../components/DisputeReport";
import App from "../services";
import * as actions from "../actions";
import { downloadFile, log, appConstants, myFilter } from "../services/helpers";
import { connect } from "react-redux";
import { LinearProgress } from "@material-ui/core";
import TableRow from "../components/TableRow";
import { baseURL } from "../Axios";

function CheckerHome({ startLoading }) {
  const [logs, setLogs] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [teams, setTeam] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [staffTeam, setStaffTeam] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [file, setFile] = useState({});
  const [userType, setUserType] = useState("");
  const [resp, setResp] = useState("");
  const [resErr, setResErr] = useState(false);
  const [requests, setRequests] = useState([]);
  const [originalRequests, setOriginalRequests] = useState([]);
  const [request, setRequest] = useState({});

  // ref elements
  const download = useRef();

  const getRequests = async () => {
    const requests = await App.getAllRequests();
    log("initial", "requests", requests);
    startLoading(false);
    if (requests) {
      setRequests(requests);
      setOriginalRequests(requests);
    }
  }

  useEffect(() => {
    const getDashboardSetting = async () => {
      try {
        startLoading(true);
        const response = await App.getDashboardSettings();
        getRequests();
        
        const {
          TotalAssigned,
          TotalResolvedCount,
          TotalUnresolved,
          UserCount,
        } = response;
        startLoading(false);
        setUserCount(UserCount);
      } catch (error) {
        startLoading(false);
        App.logError(error);
      }
    };
    getDashboardSetting();
  }, [setLogs, setUserCount, startLoading]);
  const fileSelected = (e) => {
    console.log(e.target.files[0]);
    const fileDt = e.target.files[0];
    setFile(fileDt);
  };
  const closeModal = (id) => {
    setFile((file) => null);
    setResp("");
    if (resErr) {
      console.log(true);
      window.URL.revokeObjectURL(download.current.href);
    }
    setResErr(false);
    window.$(id).modal("hide");
    // window.$("#example").DataTable().destroy();
    // document.getElementById("file-uploader").value = "";
  };
  const browseFile = (e) => {
    e.preventDefault();
    window.$("#file-uploader").click();
  };
  const browseFileUser = (e) => {
    e.preventDefault();
    window.$("#file-uploader2").click();
  };
  const fileSelectedUser = (e) => {
    console.log(e.target.files[0]);
    const fileDt = e.target.files[0];
    setFile(fileDt);
  };

  const viewLogs = (logs) => {
    // console.log(logs);

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

  const upgradeAgent = async (e) => {
    e.preventDefault();
    try {
      e.preventDefault();
      if (userType.trim() === "" || file === null) {
        console.log(e.target);
        return App.showNotifiction(
          "info",
          "Please select user type and upload file"
        );
      }
      startLoading(true);
      const response = await App.upgradeAgent(userType, file);
      console.log(response);
      if (response !==null) {
        let file = response.Log.join("\r\n");
        setResp({
          failed: response.TotalFailed,
          success: response.TotalSuccessful,
          modified: response.TotalModified,
        });
        setResErr(true);
        downloadFile(file, "text/plain", "logs.txt", download.current);
      }

     
      startLoading(false);
      App.showNotifiction("success", "Action successful");
      e.target.reset();
      setFile(null);
      window.$("#result").DataTable().destroy();
      window.$("#result").DataTable({
        data: response.Result,
        columns: [
          {
            title: "Action",
            render: (data, type, row, meta) => {
              if (type === "display") {
                return row[0];
              }
              return row[0];
            },
            responsivePriority: 1000,
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
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };

  const uploadMultipleUserFile = async (e) => {
    e.preventDefault();
    try {
      startLoading(true);
      await App.uploadMultiplUsers(file);
      startLoading(false);
      window.$("#file-uploader").val(null);
      App.showNotifiction("success", "Action successful");
      e.target.reset();
      setFile(null);
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };

  const handleRequestAction = (actionIndex, requestId) => {

    window.$("#viewRequest").modal("show");
    setRequest(requests.filter(x => x.Id === requestId)[0]);
    log("initial", "requests[actionIndex]", requests.filter(x => x.Id === requestId)[0]);
  }

  const showSweetAlertDialog = (requestId) => {
    return Swal.fire({
      icon: "info",
      title: `Reason`,
      text: `Enter Reason`,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: `Submit`,
      preConfirm: (value) => {
        log("initial", "value", value);
        return fetch(`${baseURL}/ISOC/DeclineRequest?reason='${value}'&requestId=${requestId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json; charset=utf8",
            "Authorization": "Bearer " + App.getToken(),
          },
        })
          .then(async tokenResponse => {
            if (!tokenResponse.ok) {
              throw new Error(tokenResponse.statusText)
            }
            else if (tokenResponse.status === 401) {
              return "/login";
            }
            else {
              App.showNotifiction("success", "Request Denied");
              // deleted
              getRequests();
            }
            return;
          })
          .catch(error => {
            Swal.showValidationMessage(
              `Request failed: ${error}`
            )
          })
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        // App.showNotifiction("success", "Token Verified");
      }
      closeModal("#viewRequest");
    });
  }

  const filterRequests = (value) => {
    
    if (value) {
      log("initial", "typed", value);
      setRequests(myFilter(originalRequests, value, "RequestType", "includes", ['RequestType', 'CreatedBy', 'Status']));
    }
    else {
      setRequests(originalRequests);
    }
  }

  const fixBootstrapModal = () => {
    var modalNode = document.querySelector('.modal[tabindex="-1"]');
    if (!modalNode) return;
  
    modalNode.removeAttribute('tabindex');
    modalNode.classList.add('js-swal-fixed');
  }

  return (
    <Dashboard>
      <div className="container-fluid py-3">
          <Header>Requests</Header>
          <div className="col-md-12">
              <SummaryBox style={{ padding: "16px" }}>
                  <div className="row py-3 pr-3">
                      <div className="d-flex w-100 justify-content-end">
                        <div className="mr-3">
                          <Input placeholder="search" onChange={(e) => filterRequests(e.target.value)} />
                        </div>
                      </div>
                  </div>
                  <table className="logs-table" style={{ width: "100%" }}>
                      <thead>
                        <tr>
                          {/* <th>S/N</th> */}
                          <th>Request Type</th>
                          <th>Created By</th>
                          <th>Date Created</th>
                          <th>Status</th>
                          {/* <th></th> */}
                          <th></th>
                          {/* <th></th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {requests.reverse().map((request, index) => {
                          if (request.Status.toLowerCase() != "pending") return;
                          return (<TableRow 
                          opts={[
                            request.RequestType,
                            request.CreatedBy,
                            App.convertToTimeString(request.DateCreated),
                          ]}
                          action={[
                            <span style={{color: ((request.Status == "Approved") ? "green" : ((request.Status == "Declined" ? "red" : "black")))}}>{request.Status}</span>,
                            <span style={{color: "purple"}}>View</span>
                          ]}

                          onAction={(index) => {
                            const id = request.Id;
                              handleRequestAction(index, id);
                            }}
                          />)
                          })}
                      </tbody>
                  </table>
              </SummaryBox>
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
          <div
              class="modal-dialog modal-lg"
              style={{ maxWidth: "1020px" }}
              role="document"
          >
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
                  <div className="container-fluid" style={{ overflowY: "auto" }}>
                  <table
                      id="example"
                      className="table table-striped display responsive nowrap w-100 table-bordered"
                  ></table>
                  </div>
              </div>
              </div>
          </div>
      </div>
      <div
      class="modal fade"
      id="viewRequest"
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
                      Request Details
                  </h2>
                  <GrayCircleAvatar onClick={() => closeModal("#viewRequest")}>
                      X
                  </GrayCircleAvatar>
                  </section>
                  <React.Fragment>
                  <div className="row mt-3 px-4 pb-5">
                      <div className="col-md-6">
                      <div className="d-flex align-items-center">
                          <div>
                          Request Type
                          <h3 className="font-weight-bold mt-3">
                          {request?.RequestType || "N/A"}
                          </h3>
                          </div>
                      </div>
                      </div>
                      <div className="col-md-6">
                      {
                          request?.DeclineReason &&
                          <>
                          <Header style={{ fontSize: 13, marginTop: 4 }}>
                              Decline Reason
                          </Header>
                          <Label style={{ fontWeight: 400, marginBottom: 4 }}>
                              {(request.DeclineReason.toString().replace(/"([^']+(?='))"/g, '$1'))}
                          </Label>
                          </>
                      }
                      </div>
                  </div>
                  <div className="row mt-3 px-4 pb-5">
                      <div className="col-md-10">
                      <div className="row">
                          {
                          request?.RequestData && (request?.RequestType !== "MerchantUpload" && request?.RequestType !== "BulkUserCreation") && Object.keys(JSON.parse(request?.RequestData)).map(key => {
                              const data = JSON.parse(request.RequestData);
                              return (
                              <div className="col-md-4">
                                  <Label style={{ fontWeight: 400, marginBottom: 4 }}>
                                  {key.toUpperCase()}
                                  </Label>
                                  <Header style={{ fontSize: 13, marginTop: 4 }}>
                                  {typeof data[key] !== "object" ? data[key] : ""}
                                  </Header>
                              </div>
                              );
                          })
                          }
                      </div>
                      </div>
                  </div>
                  <div className="userList mb-5 ml-5">
                      {
                      request.Status === "Pending" &&
                      <>
                          <button
                          className="btn btn-success mr-5"
                          onClick={() => {
                              // show modal

                              // request accepted, post to db
                              startLoading(true);
                              App.approveRequest(request.Id).then(result => {
                                  if (result) {
                                    App.showNotifiction("success", `Request Approved. Successful: ${result?.TotalSuccessful}. Failed: ${result?.TotalFailed}`);
                                  }
                                  else {
                                    App.showNotifiction("success", "Request Approved");
                                  }
                                  
                                  startLoading(false);
                                  closeModal("#viewRequest")
                                  getRequests();
                              }).finally(() => {
                                startLoading(false);
                              });
                          }}
                          >
                          Approve
                          </button>
                      
                      <button
                          className="btn btn-danger"
                          onClick={() => {
                            closeModal("#viewRequest");
                            fixBootstrapModal();
                          // request rejected, collect reason then post
                          const status = showSweetAlertDialog(request.Id);
                          }}
                      >
                          Decline
                      </button>
                      </>
                      }
                      {
                        (request?.RequestType === "MerchantUpload" || request?.RequestType === "BulkUserCreation") &&
                      <>
                          <button
                          className="btn btn-success ml-5"
                          onClick={() => {
                              // show modal

                              // request accepted, post to db
                              startLoading(true);
                              App.downloadBulkFile(request.Id, request?.RequestType).finally(() => {
                                startLoading(false);
                              });
                          }}
                          >
                          Donwload File
                          </button>
                        </>
                      }
                  </div>
                  </React.Fragment>
              </div>
              </div>
          </div>
      </div>
  </Dashboard>
  );
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, actions)(CheckerHome);

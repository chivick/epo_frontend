import React, { useState, useEffect } from 'react';
import Dashboard from "../hoc/Dashboard";
import {
  Header,
  SummaryBox,
  Input,
  Hr,
  Button,
  Select,
  FileSelect,
  ExcelSelect,
  GrayCircleAvatar,
  SecondaryButton,
  Label,
} from "../custom";
// import userIcon from "../assets/images/user.svg";
import MSelect from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import MyDisputeRow from "../components/MyDisputeRow";
import TableRow from "../components/TableRow";
import App from "../services";
import { downloadFile, log, appConstants } from "../services/helpers";
import * as actions from "../actions";
import { connect } from "react-redux";
import Swal from 'sweetalert2';
import { baseURL } from '../Axios';

function MyRequestHistory({ startLoading }) {
  const [requests, setRequests] = useState([]);
  const [originalRequests, setOriginalRequests] = useState([]);
  const [request, setRequest] = useState({});
  
  const closeModal = (id) => {
    window.$(id).modal("hide");
  };
  const onViewDisputeClick = (e) => {
    window.$("#viewUser").modal("show");
  };

  const getRequests = async () => {
    startLoading(true);
    const requests = await App.getMyRequests();
    startLoading(false);
    log("initial", "requests", requests);
    if (requests) {
      setRequests(requests);
      setOriginalRequests(requests);
    }
  }

  const handleRequestAction = (actionIndex, requestId) => {

    window.$("#viewRequest").modal("show");
    setRequest(requests.filter(x => x.Id === requestId)[0]);
    log("initial", "requests[actionIndex]", requests.filter(x => x.Id === requestId)[0]);
  }

  useEffect(() => {
    const getDashboardSetting = async () => {
      try {
        startLoading(true);
        getRequests();
        
      } catch (error) {
        startLoading(false);
        App.logError(error);
      }
    };
    getDashboardSetting();
  }, [startLoading]);

  const myFilter = (source, key, match="id", type="match") => {
    let result = [];
    
    if (Array.isArray(source)) {
      if (type === "match") {
        result = (source.filter(x => x[match] == key));
      }
      else if (type === "includes") {
        
        result = (
          source.filter(x => {
          if (x[match].toString().toUpperCase().includes(key.toUpperCase())) {
            return x;
          }
        }));
      }
    }

    log("initial", "result", result);
    
    return result;
  }

  // filter
  const filterRequests = (value) => {
    log("initial", "value", value, requests, originalRequests);
    if (value) {
      setRequests(myFilter(originalRequests, value, "RequestType", "includes", ["RequestType", "CreatedBy", "Status"]));
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
  
  log("initial", "value requests", requests, originalRequests);
  
  return (
    <Dashboard>
      <div className="container">
        <Header>My Requests</Header>
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
                  <th>Request Type</th>
                  <th>Created By</th>
                  <th>Date Created</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                  {requests.map((request, index) => {
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
                {/* <MyDisputeRow
                  id="01901901"
                  bank="GT BANK"
                  company="Issuing"
                  channel="MasterCom"
                  status="Resolved"
                  date="12/11/2020"
                  onViewUserClick={onViewDisputeClick}
                /> */}
              </tbody>
            </table>
          </SummaryBox>
        </div>
      </div>
      <div
        class="modal fade"
        id="addNewUser"
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
                  Add New User
                </h2>
                <GrayCircleAvatar onClick={() => closeModal("#addNewUser")}>
                  X
                </GrayCircleAvatar>
              </section>
              <Hr />
              <section className="py-3 d-flex align-items-center px-3">
                <h5 style={{ fontSize: 12 }}>
                  Add user via staff ID number or upload excel sheet of multiple
                  ID's
                </h5>
              </section>
              <Hr />
              <div className="row mt-3 px-4 pb-5">
                <div className="col-md-6">
                  <Input placeholder="Staff ID Number" />
                  <Select>
                    <option value="">Channel</option>
                  </Select>
                  <Select>
                    <option value="">Category</option>
                  </Select>
                  <div style={{ width: 170 }}>
                    <Button>Add User</Button>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="d-flex">
                      <FileSelect>Browse files</FileSelect>
                      <ExcelSelect>Choose Excel file</ExcelSelect>
                    </div>
                  </div>
                  <div className="row py-3">
                    <div style={{ width: 160 }}>
                      <Button>Upload</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="viewUser"
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
                  View/Edit Dispute
                </h2>
                <GrayCircleAvatar onClick={() => closeModal("#viewUser")}>
                  X
                </GrayCircleAvatar>
              </section>
              <div className="container-fluid py-4">
                <div className="row">
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-12">
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          John Doe
                        </Header>
                        <span style={{ fontSize: 12 }}>
                          Dispute No.: 0998765
                        </span>
                        <Hr />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          John Doe
                        </Header>
                        <span style={{ fontSize: 12 }}>
                          Dispute No.: 0998765
                        </span>
                        <Hr />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <span style={{ fontSize: 12 }}>Bank</span>
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          FIRST BANK
                        </Header>
                      </div>
                      <div className="col-md-6">
                        <span style={{ fontSize: 12 }}>To</span>
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          GT BANK
                        </Header>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <span style={{ fontSize: 12 }}>Category</span>
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          Issuing
                        </Header>
                      </div>
                      <div className="col-md-6">
                        <span style={{ fontSize: 12 }}>Channel</span>
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          MasterCom
                        </Header>
                      </div>
                    </div>
                    <Hr />
                    <div className="row">
                      <div className="col-md-6">
                        <span style={{ fontSize: 12 }}>Date Added</span>
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          12/11/2020
                        </Header>
                      </div>
                      <div className="col-md-6">
                        <span style={{ fontSize: 12 }}>Expires</span>
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          12/11/2020
                        </Header>
                      </div>
                    </div>
                    <div className="row py-3">
                      <div className="col-md-6">
                        <Button>Verify Transaction</Button>
                      </div>
                      <div className="col-md-6">
                        <SecondaryButton>Resolved</SecondaryButton>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-12">
                        <MSelect
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          style={{ width: "100%" }}
                          placeholder="Assign"
                        >
                          <MenuItem value={""}>Assign</MenuItem>
                        </MSelect>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-12">
                            <Header
                              style={{
                                marginTop: 4,
                                marginBottom: 4,
                                fontSize: 15,
                              }}
                            >
                              Samuel Craig
                            </Header>
                            <span style={{ fontSize: 12 }}>ID No.: 101268</span>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <span style={{ fontSize: 12 }}>Team</span>
                            <Header
                              style={{
                                marginTop: 4,
                                marginBottom: 4,
                                fontSize: 15,
                              }}
                            >
                              Mastercard Issuing
                            </Header>
                          </div>
                          <div className="col-md-6">
                            <span style={{ fontSize: 12 }}>Phone Number</span>
                            <Header
                              style={{
                                marginTop: 4,
                                marginBottom: 4,
                                fontSize: 15,
                              }}
                            >
                              08123456780
                            </Header>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <span style={{ fontSize: 12 }}>Email</span>
                            <Header
                              style={{
                                marginTop: 4,
                                marginBottom: 4,
                                fontSize: 15,
                              }}
                            >
                              samcraig@email.com
                            </Header>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row py-4">
                      <div className="col-md-12">
                        <Button style={{ width: 150 }}>Unassign</Button>
                      </div>
                    </div>
                  </div>
                </div>
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
                                {data[key]}
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
                      (request.Status === "Pending" && [appConstants.admin[1], ...appConstants.teamLead].includes(App.getUserRole()) && request.CreatedBy != App.getStaffId()) &&
                      <>
                          <button
                          className="btn btn-success mr-5"
                          onClick={() => {
                              // show modal
                              
                              // request accepted, post to db
                              startLoading(true);
                              App.approveRequest(request.Id).then(result => {
                                
                                  if (result) {
                                    App.showNotifiction("success", `Request Approved. Successful: ${result?.TotalSuccessful}. Failed: ${result?.TotalFailed} Modified: ${result?.TotalModified}`, false);
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
                    (request?.RequestType === "MerchantUpload" || request?.RequestType === "BulkUserCreation" || request?.RequestType === "InitialLogCode" || request?.RequestType === "AccountToCredit" || request?.RequestType === "AccountToDebit") &&
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

export default connect(mapStateToProps, actions)(MyRequestHistory);
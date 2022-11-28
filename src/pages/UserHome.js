import React, { useState, useEffect, Fragment, useRef } from "react";
import Dashboard from "../hoc/Dashboard";
import {
  Header,
  SummaryBox,
  Button,
  BoxShadow,
  GrayCircleAvatar,
  Hr,
  FileSelect,
  SecondaryButton,
  TextArea,
  Label,
  YellowBox,
  CircleAvatar,
  Select
} from "../custom";
import { Link } from "react-router-dom";
// import DisputeRow from "../components/DisputeRow";
import fbLogo from "../assets/images/fbLogo.png";
import App from "../services";
import eye from "../assets/images/eye.png";
import noImage from "../assets/images/noImg.png";
import * as actions from "../actions";
import { connect } from "react-redux";
import Lightbox from "lightbox-react";
import "lightbox-react/style.css";
import {
  Magnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION,
} from "react-image-magnifiers";
import { appConstants, downloadFile, log } from "../services/helpers";
import moment from "moment";
import { RenderAtmFundsTranferUploader } from "./../components/modals/AtmFundsTransferUpload";
import { DisputeRevalidation } from "./../components/modals/DisputeRevalidation";
import { urls } from "../services/urls";

  

function UserHome({ startLoading }) {
  const [totalAssigned, setTotalAssigned] = useState(0);
  const [weeklyAssigned, setWeeklyAssigned] = useState(0);
  // const [teams, setTeams] = useState([]);
  const [totalResolved, setTotalResolved] = useState(0);
  const [weeklyResolved, setWeeklyResolved] = useState(0);
  const [pendingDispute, setPendingDispute] = useState([]);
  const [dispute, setDispute] = useState({});
  const [reason, setReason] = useState("");
  const [file, setFile] = useState({});
  const [atmFundsTransferFile, setAtmFundsTransferFile] = useState({});
  const [disputeRevalidationFile, setDisputeRevalidationFile] = useState({});
  const [imageSrc, setImageSrc] = useState(null);
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [images, setImages] = useState([]);
  const [openLightBox, setOpenLightBox] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [toggleView, setToggleView] = useState(false);
  const [checkedValue, setCheckedValue] = useState("Yes");
  const [declineReason, setDeclineReason] = useState(false);
  const [alert, setAlert] = useState(false);
  const [resErr, setResErr] = useState(false);
  const [userType, setUserType] = useState("");
  const [resp, setResp] = useState("");
  const [atmFundsTransfer, setAtmFundsTransfer] = useState(false);
  const [showRevalidation, setShowRevalidation] = useState(false);
  const [showUpgradeAgent, setShowUpgradeAgent] = useState(false);

  const download = useRef();

  const closeModal = (id) => {
    window.$(id).modal("hide");
    setReason("");
    setShowUploadButton(false);
    console.log(file);
    setFile(null);
  };

  const getReconPending = async () => {
    try {
      console.log(App.getUserRole());
      startLoading(true);
      let response;
      if (
        App.getUserRole() === "Recon" || App.getUserRole() === "ReconTeamLead") 
      {
        response = await App.getReconDisputes();
      } 
      else if (App.getUserRole() === "Agent") {
        response = await App.getAgentDisputes();
      } 
      else if (App.getUserRole() === "User" || App.getUserRole() === "TeamLead") 
      {
        response = await App.getUserDisputes();
        console.log(response);

        // response = JSON.parse(App.getFromLocalStorage("fb-pendingDispute"));
      }
      
      log("initial", response);
      if (response) {
        const responseDt = response?.slice(0, 10);
        setPendingDispute(responseDt);
      }
      setImages([noImage]);
      startLoading(false);
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };

  useEffect(() => {
    getReconPending();
    setTotalAssigned(App.getFromLocalStorage("fb-totalAssigned"));
    setWeeklyAssigned(App.getFromLocalStorage("fb-weeklyAssigned"));
    // let teamsDt = JSON.parse(App.getFromLocalStorage("fb-teams"));
    // setTeams(teamsDt);
    setTotalResolved(App.getFromLocalStorage("fb-totalResolved"));
    setWeeklyResolved(App.getFromLocalStorage("fb-weeklyResolved"));
    // const disputeDt = JSON.parse(App.getFromLocalStorage("fb-pendingDispute"));
    // setPendingDispute(disputeDt);
  }, [
    setPendingDispute,
    setTotalAssigned,
    setWeeklyAssigned,
    setTotalResolved,
    setWeeklyResolved,
    startLoading,
  ]);
  const onViewUserClick = (item) => {
    window.$("#viewUser").modal("show");
    setDispute(item);
  };
  const viewJorunal = async (e) => {
    try {
      setShowUploadButton(false);
      startLoading(true);
      const response = await App.viewJournal(dispute.UniqueId);
      startLoading(false);

      if (response && response.trim() !== "No Data") {
        setImages([`data:image/png;base64,${response}`]);
        setToggleView(true);
        return setImageSrc(response);
      }
      return setShowUploadButton(true);
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };
  const acceptRefund = async (e) => {
    // e.preventDefault();
    try {
      if (App.getUserRole() === "Recon") {
        startLoading(true);
        await App.acceptRefund(dispute.UniqueId);
      } else if (App.getUserRole() === "Agent") {
        if (Object.keys(file).length === 0 && !file.name) {
          return App.showNotifiction("info", "Please upload a file");
        }
        startLoading(true);
        await App.resolveDisputeAgent(file, dispute.UniqueId);
      } else if (
        App.getUserRole() === "User" ||
        App.getUserRole() === "TeamLead"
      ) {
        startLoading(true);
        await App.userAcceptDispute(dispute.UniqueId, file);
      }
      window.$("#viewUser").modal("hide");
      let response2;
      window.$("#viewUser").modal("hide");
      if (App.getUserRole() === "Recon") {
        response2 = await App.getReconDisputes();
      } else if (App.getUserRole() === "Agent") {
        response2 = await App.getAgentDisputes();
      } else if (
        App.getUserRole() === "User" ||
        App.getUserRole() === "TeamLead"
      ) {
        response2 = await App.getUserDisputes();
      }

      setPendingDispute(response2);
      startLoading(false);
      setFile(null);
      setImages([noImage]);
      App.showNotifiction("success", "Action successful");
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };
  const fileSelectedUser = (e) => {
    console.log(e.target.files[0]);
    const fileDt = e.target.files[0];
    setFile(fileDt);
  };
  const browseFile = (e) => {
    e.preventDefault();
    window.$(".file-uploader").val("");
    window.$(".file-uploader").files = [];

    window.$(".file-uploader").click();
    console.log("BrowseFile");
    //atm-file-uploader
  };

  const merchantBrowseFile = (e) => {
    e.preventDefault();
    window.$("#file-uploader").click();
  };

  const fileSelected = (e) => {
    // console.log("File Selected");
    // console.log(e.target.files[0]);
    const fileDt = e.target.files[0];
    setFile(fileDt);
  };
  const declineRefund = async (e) => {
    try {
      if (App.getUserRole() === "Agent") 
      {
        startLoading(true);
        await App.agentDecline(dispute.UniqueId);
      }
      else if (App.getUserRole() === "Recon") 
      {
        if (reason.trim() === "") {
          return App.showNotifiction("error", "Please provide reason");
        }
        startLoading(true);
        await App.rejectRefund(reason, dispute.UniqueId);
      }
      else if (
        App.getUserRole() === "User" ||
        App.getUserRole() === "TeamLead") 
      {
        startLoading(true);
        await App.userRejectDispute(dispute.UniqueId, file);
      }
      let response2;
      setAlert(false);
      window.$("#viewUser").modal("hide");
      if (App.getUserRole() === "Recon") {
        response2 = await App.getReconDisputes();
      } else if (App.getUserRole() === "Agent") {
        response2 = await App.getAgentDisputes();
      } else if (
        App.getUserRole() === "User" ||
        App.getUserRole() === "TeamLead"
      ) {
        response2 = await App.getUserDisputes();
      }

      setFile(null);
      // setFile((file) => null);
      setPendingDispute(response2);
      startLoading(false);
      App.showNotifiction("success", "Action successful");
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };

  const declineJournal = async (e) => {
    if (!reason) {
      // console.log(reason);
      App.showNotifiction("info", "Please Enter a reason");
      return;
    }
    try {
      startLoading(true);
      // console.log(dispute.UniqueId, reason);
      await App.declineJournal(dispute.UniqueId, reason);
      getReconPending();
      startLoading(false);
      window.$("#viewUser").modal("hide");
      window.$("#RejectionReasons").val("");
      setAlert(false);
      setDeclineReason(false);
      setReason("");
      App.showNotifiction("success", "Action successful");
    } catch (error) {
      startLoading(false);
      // setFile(null);
      App.logError(error);
    }
  };

  const closeRevalidationDispute = (dispute) => {
    startLoading(true);
    App.getRequest(urls.closeRevalidationDispute + dispute).then(result => {
      if (result && result.status) {
        closeModal("#viewUser");
        setImageSrc(null);
        setToggleView(false);
        setPendingDispute(pendingDispute.filter(x => x.UniqueId != dispute));
      }
    }).finally(() => startLoading(false));
  }

  const submitForm = (e) => {
    e.preventDefault();
    if (checkedValue === "Yes") {
      return acceptRefund();
    }
    setAlert(true);
  };

  // close alert functions
  const closeAlert = () => {
    setAlert(false);
  };

  //recon refund call
  const callReconRefund = async () => {
    try {
      startLoading(true);
      console.log(dispute.UniqueId);
      await App.reconRefund(dispute.UniqueId);
      startLoading(false);
      App.showNotifiction("success", "Action successful");
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };
  
  const sendBulk = async  () => {
    // gather bulk
    let pending = [];
    pendingDispute?.map((request) => {
      pending.push(request.UniqueId);
    });

    startLoading(true);
    const response = await App.reconBulkRefund(pending, true);
    startLoading(false);
    if (response && response.status == 200) {
      App.showNotifiction("success", "Action successful");
      getReconPending();
    }
  }

  const addMerchant = (e) => {
    try {
      e.preventDefault();
      window.$("#addMerchant").modal("show");
    } catch (error) {
      App.logError(error);
    }
  };

  const formRef = useRef();
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
      console.log("file", file);
      startLoading(true);
      
      const response = await App.upgradeAgent(userType ,file);
      console.log(response);
      if (response !==null) {
        setFile(null);
        formRef.current.reset();
        App.showNotifiction("success", "Request sent.");
        let file = response.Log.join("\r\n");
        setResp({
          failed: response.TotalFailed,
          success: response.TotalSuccessful,
          modified: response.TotalModified,
        });
        setResErr(true);
        
        downloadFile(file, "text/plain", "logs.txt", download.current);
        
      }
      else {
        App.showNotifiction("success", "Request not sent, some errors occurred.");
      }

     
      startLoading(false);
      App.showNotifiction("success", "Action successful");
      e.target.reset();
      setFile(null);
      // window.$("#addMerchant").modal("show");
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
  
  // atm funds transfer
  const atmFundsTransferformRef = useRef();
  const addAtmFundTransferReport = (e) => {
    setAtmFundsTransfer(true);
    addMerchant(e);
  }

  const atmFundTransferReportFileSelected = (e) => {
    console.log("File Selected");
    console.log(e.target.files[0]);
    const fileDt = e.target.files[0];
    setAtmFundsTransferFile(fileDt);
  };

  const browseATMFundsTransferFile = (e) => {
    e.preventDefault();
    window.$("#atm-file-uploader").val("");
    window.$("#atm-file-uploader").files = [];

    window.$("#atm-file-uploader").click();
    console.log("BrowseFile");
    //
  };

  const uploadATMFundsTransferFile = (e) => {
    e.preventDefault();

    if (atmFundsTransferFile === null) {
      return App.showNotifiction("info", "Please fill upload file");
    }

    let data = new FormData();
    data.append("File", atmFundsTransferFile);
    App.postRequestFile("Dispute/UploadAtmFundsTransferFile", data).then(result => {
      if (result && result.status) {
        App.showNotifiction("success", result.message);
      }
      else if (result && result.status) {
        App.showNotifiction("error", result.message);
      }
      else {
        App.showNotifiction("error", "An error occurred, try again later");
      }
    }).catch(err => App.showNotifiction("error", err.Message)).finally(() => startLoading(false));
    
    closeModal("#addMerchant");
    setAtmFundsTransfer(false);
    setAtmFundsTransferFile(null);
  }

  //revalidation
  const disputeRevalidation = useRef();

  const addDisputeRevalidationFile = (e) => {
    setShowRevalidation(true);
    addMerchant(e);
  }

  const disputeRevalidationFileSelected = (e) => {
    console.log("File Selected");
    console.log(e.target.files[0]);
    const fileDt = e.target.files[0];
    setDisputeRevalidationFile(fileDt);
  };

  const browseRevalidationFile = (e) => {
    e.preventDefault();
    window.$("#revalidation-file-uploader").val("");
    window.$("#revalidation-file-uploader").files = [];

    window.$("#revalidation-file-uploader").click();
    console.log("BrowseFile");
    //
  };
  
  const uploadRevalidationFile = (e) => {
    e.preventDefault();

    if (disputeRevalidationFile === null) {
      return App.showNotifiction("info", "Please fill upload file");
    }

    let data = new FormData();
    data.append("File", disputeRevalidationFile);
    App.postRequestFile("Dispute/UploadRevalidationFile", data).then(result => {
      if (result && result.status) {
        App.showNotifiction("success", result.message);
      }
      else if (result && result.status) {
        App.showNotifiction("error", result.message);
      }
      else {
        App.showNotifiction("error", "An error occurred, try again later");
      }
    }).catch(err => App.showNotifiction("error", err.Message ?? "Please try again later.")).finally(() => startLoading(false));
    
    closeModal("#addMerchant");
    setShowRevalidation(false);
    setDisputeRevalidationFile(null);
  }

  const downloadSampleMerchantExcel = ()=> {
    startLoading(true);
    App.getRequestExcelData(urls.downloadSampleMerchantExcel, "Sample_Merhant_Excel_Template").finally(() => startLoading(false));
  }
  
  return (
    <Dashboard>
      <div className="container-fluid py-3">
        <Header>Overview</Header>
        <div className="row">
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-3">
                <div className="px-2" style={{ height: "100%" }}>
                  <SummaryBox>
                    <div className="d-flex justify-content-between py-2 px-3">
                      <div className="counter-summary">
                        <h4>Total</h4>
                        <h5>In Pool</h5>
                      </div>
                      <div className="d-flex counter-report align-items-center">
                        <h4 style={{ fontSize: 16 }}>{totalAssigned}</h4>
                      </div>
                    </div>
                    <div className="see-more-wrapper py-2">
                      <Link to="/report">see more</Link>
                    </div>
                  </SummaryBox>
                </div>
              </div>
              <div className="col-md-3">
                <div className="px-2">
                  <SummaryBox>
                    <div className="d-flex justify-content-between py-2 px-3">
                      <div className="counter-summary">
                        <h4>Weekly Assigned</h4>
                        <h5>Assigned</h5>
                      </div>
                      <div className="d-flex counter-report align-items-center">
                        <h4 style={{ color: "#000", fontSize: 16 }}>
                          {weeklyAssigned}
                        </h4>
                      </div>
                    </div>
                    <div className="see-more-wrapper py-2">
                      <Link to="/report">see more</Link>
                    </div>
                  </SummaryBox>
                </div>
              </div>
              <div className="col-md-3">
                <div className="px-2">
                  <SummaryBox>
                    <div className="d-flex justify-content-between py-2 px-3">
                      <div className="counter-summary">
                        <h4>Weekly Resolved</h4>
                        <h5>Disputes</h5>
                      </div>
                      <div className="d-flex counter-report align-items-center">
                        <h4 style={{ color: "#000", fontSize: 16 }}>
                          {weeklyResolved}
                        </h4>
                      </div>
                    </div>
                    <div className="see-more-wrapper py-2">
                      <Link to="/report">see more</Link>
                    </div>
                  </SummaryBox>
                </div>
              </div>
              <div className="col-md-3">
                <div className="px-2" style={{ height: "100%" }}>
                  <SummaryBox>
                    <div className="d-flex justify-content-between py-2 px-3">
                      <div className="counter-summary">
                        <h4>Total Resolved</h4>
                        <h5>Disputes</h5>
                      </div>
                      <div className="d-flex counter-report align-items-center">
                        <h4 style={{ color: "#000", fontSize: 16 }}>
                          {totalResolved}
                        </h4>
                      </div>
                    </div>
                    <div className="see-more-wrapper py-2">
                      <Link to="/report">see more</Link>
                    </div>
                  </SummaryBox>
                </div>
              </div>
              {
              ([...appConstants.teamLead].includes(App.getUserRole())) &&
            
              <div className="col-md-3 mt-3">
                <YellowBox className="" style={{ height: 92 }}>
                  <div className="d-flex yellow-box-action justify-content-end">
                    <h5>Add Merchant</h5>
                    <CircleAvatar onClick={(e) => {
                      setShowUpgradeAgent(true);
                      addMerchant(e);
                    }}>
                      <span className="plus-icon">
                        <i className="fas fa-plus"></i>
                      </span>
                    </CircleAvatar>
                  </div>
                </YellowBox>
              </div>
            }
            {
              ([...appConstants.user].includes(App.getUserRole())) &&
            
              <div className="col-md-3 mt-3">
                <YellowBox className="" style={{ height: 92 }}>
                  <div className="d-flex yellow-box-action justify-content-end">
                    <h5>Upload ATM Transfer Report</h5>
                    <CircleAvatar onClick={addAtmFundTransferReport}>
                      <span className="plus-icon">
                        <i className="fas fa-plus"></i>
                      </span>
                    </CircleAvatar>
                  </div>
                </YellowBox>
              </div>
            }
            {
              ([...appConstants.teamLead].includes(App.getUserRole())) &&
            
              <div className="col-md-3 mt-3">
                <YellowBox className="" style={{ height: 92 }}>
                  <div className="d-flex yellow-box-action justify-content-end">
                    <h5>Upload Revlidation Disputes</h5>
                    <CircleAvatar onClick={addDisputeRevalidationFile}>
                      <span className="plus-icon">
                        <i className="fas fa-plus"></i>
                      </span>
                    </CircleAvatar>
                  </div>
                </YellowBox>
              </div>
            }
            </div>
            <Header>Disputes Pool</Header>
            <div className="row">
              <div className="col-md-12">
                <SummaryBox style={{ padding: "10px 16px" }}>
                  <div className="d-flex justify-content-end">
                    {
                      [...appConstants.recon, ...appConstants.reconTeamLead].includes(App.getUserRole()) && pendingDispute?.length > 0 &&
                      <div className={"mr-3"} style={{ width: 100 }}>
                        <Button onClick={() => sendBulk()}>
                          Send Bulk
                        </Button>
                      </div>
                    }

                    <div style={{ width: 150 }}>
                      {App.getUserRole() !== "Recon" ? (
                        <Link to="/m-disputes">
                          <Button>See all disputes</Button>
                        </Link>
                      ) : (
                        <Link to="/m-disputes">
                          <Button>See all disputes</Button>
                        </Link>
                      )}
                    </div>
                    <div style={{ width: 150,marginLeft: 8 }}>
                      {App.getUserRole() !== "Recon" ? (
                        <Link to="/m-revalidation">
                          <Button>See all revalidation</Button>
                        </Link>
                      ) : (
                        <Link to="/m-revalidation">
                          <Button>See all revalidation</Button>
                        </Link>
                      )}
                    </div>

                  </div>

                  <table className="logs-table" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>Dispute Log ID</th>
                        <th>Stan</th>
                        <th>PAN</th>
                        <th>Transaction Amount</th>
                        <th>Transaction Created</th>
                        <th>Type</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingDispute?.map((item, i) => {
                        return (
                          <tr key={i}>
                            <td>{item.DisputeLogId}</td>
                            <td>{item.IssuerStan}</td>
                            <td>{item.PAN}</td>
                            <td>{item.TransAmount}</td>
                            <td>{App.convertToTimeString(item.Transaction_Date)}</td>
                            <td>
                              {
                                item.IsRevalidation ? "Revalidation": "BAU"
                              }
                            </td>
                            <td
                              colSpan="2"
                              onClick={() => {
                                setImageSrc(null);
                                setToggleView(false);
                                onViewUserClick(item);
                              }}
                            >
                              <img
                                src={eye}
                                alt="view"
                                className="table-action"
                                style={{ width: 18, height: 18 }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </SummaryBox>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <BoxShadow
              className="bg-white"
              style={{
                height: 600,
                display: "flex",
                flexDirection: "column",
                borderRadius: 4,
              }}
            >
              <div
                className="w-100 d-flex justify-content-center align-items-center"
                style={{
                  flex: 1,
                }}
              >
                <img
                  src={fbLogo}
                  alt="first bank logo"
                  className="logo"
                  style={{ height: 150, width: 150 }}
                />
              </div>
              <div
                className="align-items-center justify-content-center"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#EAAA00",
                }}
              >
                <h3 style={{ color: "#022E64", textAlign: "center" }}>
                  Total Number of Assigned disputes{" "}
                </h3>
                <h3 style={{ color: "#022E64", textAlign: "center" }}>
                  this week
                </h3>
                <h4
                  className="font-weight-bold"
                  style={{ fontSize: 18, color: "#022E64", marginTop: 6 }}
                >
                  {weeklyAssigned}
                </h4>
              </div>
              <div style={{ flex: 1 }}></div>
              <div
                className="align-items-center justify-content-center"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#022E64",
                }}
              >
                <h3 style={{ color: "#fff", textAlign: "center" }}>
                  Total Number of resolved disputes{" "}
                </h3>
                <h3 style={{ color: "#fff", textAlign: "center" }}>
                  this week
                </h3>
                <h4
                  className="font-weight-bold"
                  style={{ fontSize: 18, color: "#fff", marginTop: 6 }}
                >
                  {weeklyResolved}
                </h4>
              </div>
            </BoxShadow>
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
                  {
                    (dispute.IsRevalidation ? "Revalidation" : "View/Edit") + " Dispute"
                  }
                </h2>
                <GrayCircleAvatar onClick={() => {
                  closeModal("#viewUser");
                  setImageSrc(null);
                  setToggleView(false);
                }}>
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
                          Dispute Log ID: {dispute?.DisputeLogId}
                        </Header>
                        {/* <span style={{ fontSize: 12 }}>
                          Dispute No.: {dispute.DisputeLogID}
                        </span> */}
                        <Hr />
                      </div>
                    </div>
                    <div className="row pt-2">
                      <div className="col-md-12">
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          ACQUIRER
                        </Header>
                        <div className="row mt-3">
                          <div className="col-md-4">
                            <p>Name</p>
                            <p className="pt-2">{dispute.Acquirer}</p>
                          </div>
                          <div className="col-md-4">
                            <p>Stan</p>
                            <p className="pt-2">{dispute.AcquirerStan}</p>
                          </div>
                          <div className="col-md-4">
                            <p>RRN</p>
                            <p className="pt-2">
                              {dispute.AcquirerRRN || "N/A"}
                            </p>
                          </div>
                        </div>
                        {/* <span style={{ fontSize: 12 }}>{dispute.Stan}</span> */}
                        <Hr />
                      </div>
                    </div>
                    <div className="row pt-2">
                      <div className="col-md-12">
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          ISSUER
                        </Header>
                        <div className="row mt-3">
                          <div className="col-md-4">
                            <p>Name</p>
                            <p className="pt-2">{dispute.Issuer}</p>
                          </div>
                          <div className="col-md-4">
                            <p>Stan</p>
                            <p className="pt-2">{dispute.IssuerStan}</p>
                          </div>
                          {
                            dispute && dispute?.Platform?.toLowerCase() == "updm" ?
                            <div className="col-md-4">
                              <p>TextMess</p>
                              <p className="pt-2">{((dispute?.Platform?.toLowerCase() == "updm") ? dispute.TraceNum :dispute.IssuerRRN) || "N/A"}</p>
                            </div>
                          :
                            <div className="col-md-4">
                              <p>RRN</p>
                              <p className="pt-2">{(dispute.IssuerRRN) || "N/A"}</p>
                            </div>
                          }
                        </div>
                        {/* <span style={{ fontSize: 12 }}>{dispute.Stan}</span> */}
                        <Hr />
                      </div>
                    </div>
                    <div className="row pt-2">
                      <div className="col-md-6">
                        {/* <span style={{ fontSize: 12 }}>Bank</span> */}
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          Merchant Name
                        </Header>
                        <span style={{ fontSize: 12 }}>
                          {dispute.MerchantName}
                        </span>
                      </div>
                      {/* <div className="col-md-6">
                        <span style={{ fontSize: 12 }}></span>
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          Issuer RRN
                        </Header>
                        <span style={{ fontSize: 12 }}>
                          {dispute.IssuerRRN}
                        </span>
                      </div> */}
                    </div>
                    <div className="row pt-2">
                      <div className="col-md-6">
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          PAN
                        </Header>
                        <span style={{ fontSize: 12 }}>{dispute.PAN}</span>
                      </div>
                      {/* <div className="col-md-6">
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          Journal
                        </Header>
                        <span style={{ fontSize: 12 }}>{dispute.Jouranl}</span>
                      </div> */}
                    </div>
                    <Hr />
                    <div className="row pt-2">
                      <div className="col-md-6">
                        <span style={{ fontSize: 12 }}>Transaction Date</span>
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          {dispute.Transaction_Date
                            ? App.convertToTimeString(dispute.Transaction_Date)
                            : null}
                        </Header>
                      </div>
                      <div className="col-md-6">
                        <span style={{ fontSize: 12 }}>Amount</span>
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          {dispute.TransAmount}
                        </Header>
                      </div>
                    </div>
                    <div className="row pt-2">
                      <div className="col-md-6">
                        <span style={{ fontSize: 12 }}>Catgeory</span>
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          {dispute.Category}
                        </Header>
                      </div>
                      <div className="col-md-6">
                        <span style={{ fontSize: 12 }}>Platform</span>
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          {dispute?.Platform}
                        </Header>
                      </div>
                    </div>
                    <Hr />
                    <div>
                      <span style={{ fontSize: 12 }}>Dispute Date</span>
                      <Header
                        style={{
                          marginTop: 4,
                          marginBottom: 4,
                          fontSize: 15,
                        }}
                      >
                        {dispute?.DisputeDate
                          ? App.convertToTimeString(dispute.DisputeDate)
                          : "N/A"}
                      </Header>
                      <Hr />
                    </div>
                    <div>
                      <span style={{ fontSize: 12 }}>Expiry Date</span>
                      <Header
                        style={{
                          marginTop: 4,
                          marginBottom: 4,
                          fontSize: 15,
                        }}
                      >
                        {App.convertToTimeString(dispute.ExpiryDate)}
                      </Header>
                      <Hr />
                    </div>
                    <div>
                      <span style={{ fontSize: 12 }}>Last Comment</span>
                      <Header
                        style={{
                          marginTop: 4,
                          marginBottom: 4,
                          fontSize: 15,
                        }}
                      >
                        {(dispute.Reason)}
                        <br/>
                        <a href={"/comment-log?id=" + dispute.UniqueId}>View Full Log</a>
                      </Header>
                      <Hr />
                    </div>
                    <div className="row py-2">
                      {(App.getUserRole() === "User" ||
                        App.getUserRole() === "TeamLead") &&
                      showUploadButton ? (
                        <div className="col-md-6">
                          <FileSelect onClick={browseFile}>
                            Browse files
                          </FileSelect>
                          <span
                            className="pt-2"
                            style={{ fontWeight: 500, fontSize: 14 }}
                          >
                            {file && file?.name}
                          </span>
                          <input
                            accept="image/*"
                            class="file-uploader"
                            type="file"
                            style={{ display: "none" }}
                            onChange={fileSelected}
                          />
                        </div>
                      ) : null}
                    </div>
                    <div className="py-3">
                      {/*
                            Agent flow
                            Was cash given.
                          */}
                      {App.getUserRole() === "Agent" ? (
                        <>
                          <Header>Was cash/value given?</Header>
                          <div class="form-check pb-2">
                            <input
                              class="form-check-input"
                              type="radio"
                              name="exampleRadios"
                              id="exampleRadios1"
                              value="Yes"
                              checked={checkedValue === "Yes"}
                              onChange={(e) => setCheckedValue(e.target.value)}
                            />
                            <label
                              class="form-check-label"
                              for="exampleRadios1"
                            >
                              Yes
                            </label>
                          </div>
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="radio"
                              name="exampleRadios"
                              id="exampleRadios2"
                              value="No"
                              onChange={(e) => {
                                setFile(null);
                                
                                setCheckedValue(e.target.value);
                              }}
                              checked={checkedValue === "No"}
                            />
                            <label
                              class="form-check-label"
                              for="exampleRadios2"
                            >
                              No
                            </label>
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div className="row">
                      {App.getUserRole() === "Agent" &&
                      checkedValue === "Yes" ? (
                        <div className="col-md-6">
                          <Label>Upload evidence of payment</Label>
                          <Label>(jpg,png,gif,jpeg)</Label>
                          <FileSelect onClick={browseFile}>
                            Browse files
                          </FileSelect>
                          <span
                            className="pt-2"
                            style={{ fontWeight: 500, fontSize: 14 }}
                          >
                            {file && file?.name}
                          </span>
                          <input
                            accept="image/*"
                            class="file-uploader"
                            type="file"
                            style={{ display: "none" }}
                            onChange={fileSelected}
                          />
                        </div>
                      ) : null}
                    </div>
                    <div className="row py-3">
                      {(App.getUserRole() !== "Agent" && !dispute.IsRevalidation) ? (
                        <div className="col-md-6">
                          <Button onClick={acceptRefund}>Accept</Button>
                        </div>
                      ) : null}
                      {App.getUserRole() === "Agent" ? (
                        <div className="col-md-12">
                          <Button onClick={submitForm}>Submit</Button>
                        </div>
                      ) : null}
                      {((App.getUserRole() === "User" ||
                      App.getUserRole() === "TeamLead") && !dispute.IsRevalidation) ? (
                        <div className="col-md-6">
                          <SecondaryButton onClick={declineRefund}>
                            Decline
                          </SecondaryButton>
                        </div>
                      ) : null}
                      {App.getUserRole() === "Recon" ||
                      App.getUserRole() === "ReconTeamLead" ? (
                        <div className="col-md-6">
                          <SecondaryButton onClick={callReconRefund}>
                            Fund Confirmation
                          </SecondaryButton>
                        </div>
                      ) : null}
                      {dispute.IsRevalidation && [...appConstants.user].includes(App.getUserRole())? (
                        <div className="col-md-6">
                          <Button onClick={() => closeRevalidationDispute(dispute.UniqueId)}>
                            Close
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-md-6">
                    {App.getUserRole() === "Agent" ||
                    // App.getUserRole() === "User" ||
                    App.getUserRole() === "TeamLead"
                      ? null
                      : declineReason && (
                          <Fragment>
                            <div className="row">
                              <div className="col-md-12">
                                <TextArea
                                  disabled={App.getUserRole() === "Agent"}
                                  placeholder="Rejection Reason"
                                  value={reason}
                                  onChange={(e) => setReason(e.target.value)}
                                />
                              </div>
                            </div>
                            {/* <div className="row mt-3">
                   <div className="col-md-12">
                     <Header
                       style={{
                         marginTop: 4,
                         marginBottom: 4,
                         fontSize: 15,
                       }}
                     >
                       Dispute not assigned yet
                     </Header>
                   </div>
                 </div> */}
                            <div className="row py-4">
                              <div className="col-md-12">
                                <SecondaryButton
                                  style={{ maxWidth: 400 }}
                                  onClick={declineJournal}
                                >
                                  Decline
                                </SecondaryButton>
                              </div>
                            </div>
                          </Fragment>
                        )}

                    {App.getUserRole() === "User" ||
                    App.getUserRole() === "TeamLead" ? (
                      <div>
                        <div className="row">
                          <div className="col-md-6">
                            <Button onClick={viewJorunal}>View Journal</Button>
                          </div>
                          <div className="col-md-6">
                            {dispute.Journal && !declineReason && (
                              <SecondaryButton
                                onClick={() => setDeclineReason(true)}
                              >
                                Decline Journal
                              </SecondaryButton>
                            )}
                          </div>
                        </div>

                        <div className="row py-2">
                          <div className="col-md-12">
                            {imageSrc && (
                              <Magnifier
                                imageSrc={
                                  imageSrc
                                    ? `data:image/png;base64,${imageSrc}`
                                    : noImage
                                }
                                imageAlt="Journal"
                                mouseActivation={MOUSE_ACTIVATION.CLICK}
                                touchActivation={TOUCH_ACTIVATION.TAP}
                              />
                            )}
                          </div>
                        </div>
                        <div className="row">
                          {toggleView && (
                            <div className="col-md-12">
                              <div className="d-flex w-100 justify-content-center py-2">
                                <Button
                                  style={{ width: 120 }}
                                  onClick={() => setOpenLightBox(true)}
                                >
                                  View
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {openLightBox && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setOpenLightBox(false)}
          onMovePrevRequest={() => {
            const index = (photoIndex + images.length - 1) % images.length;
            setPhotoIndex(index);
          }}
          onMoveNextRequest={() => {
            const index = (photoIndex + 1) % images.length;
            setPhotoIndex(index);
          }}
        />
      )}
      {alert && (
        <div className="alert-box">
          <div className="alert-box-wrap shadow bg-white">
            <span className="close-alert" onClick={closeAlert}>
              &times;
            </span>
            <p className="text-center">
              Please note that by selecting No, you are accepting the claim and
              you will be debited for the chargeback
            </p>
            <div>
              <Button onClick={declineRefund}>Proceed</Button>
            </div>
          </div>
        </div>
      )}
      <div
            class="modal fade"
            id="addMerchant"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-lg" role="document">
              <div class="modal-content">
                <div class="modal-body p-0">
                  {
                    showRevalidation && 
                    <DisputeRevalidation 
                        modalTitle="Dispute Revalidation" 
                        modalName="addMerchant"
                        modalContent={"Select File Type"}
                        formRef={disputeRevalidation}
                        // onSubmit={() => {}}
                        selectedItem=""
                        setItemType={(e) => {}}
                        onBrowseFile={browseRevalidationFile}
                        file={disputeRevalidationFile}
                        fileSelected={disputeRevalidationFileSelected}
                        options={[
                          {text: "Dispute Revalidation", value: "disputeRevalidation"}
                        ]}
                        closeModal={() => {
                          closeModal("#addMerchant");
                          setShowRevalidation(false);
                        }}
                        onSubmit={(e) => uploadRevalidationFile(e)}
                      />
                  }
                  {
                    atmFundsTransfer &&
                      <RenderAtmFundsTranferUploader 
                        modalTitle="ATM Funds Transfer Report" 
                        modalName="addMerchant"
                        modalContent={"Select File Type"}
                        formRef={atmFundsTransferformRef}
                        // onSubmit={() => {}}
                        selectedItem=""
                        setItemType={(e) => {}}
                        onBrowseFile={browseATMFundsTransferFile}
                        file={atmFundsTransferFile}
                        fileSelected={atmFundTransferReportFileSelected}
                        options={[
                          {text: "ATM Funds Transfer", value: "atmfundstransfer"}
                        ]}
                        closeModal={() => {
                          closeModal("#addMerchant");
                          setAtmFundsTransfer(false);
                        }}
                        onSubmit={(e) => uploadATMFundsTransferFile(e)}
                      />
                      }
                    {
                      showUpgradeAgent &&
                      <>
                        <section className="py-3 d-flex align-items-center justify-content-between px-3">
                          <h2
                            style={{ color: "#EAAA00", fontSize: 20, fontWeight: "bold" }}
                          >
                            Upgrade Agents
                          </h2>
                          <GrayCircleAvatar onClick={() => closeModal("#addMerchant")}>
                            X
                          </GrayCircleAvatar>
                        </section>
                        <Hr />
                        <form className="container py-3" ref={formRef} onSubmit={upgradeAgent}>
                          <div className="row">
                            <div className="col-md-12">
                              <Header
                                style={{ marginTop: 8, fontSize: 14, marginBottom: 4 }}
                              >
                                Select User Type
                              </Header>
                              <Select
                                value={userType}
                                onChange={(e) => setUserType(e.target.value)}
                              >
                                <option value="">Select type</option>
                                <option value="Merchant">Merchant</option>
                              </Select>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <Header>Upload File</Header>
                              <div className="row">
                                <FileSelect onClick={merchantBrowseFile}>Browse files</FileSelect>
                                <a href={"#"} onClick={downloadSampleMerchantExcel} style={{ fontWeight: 500, fontSize: 14 }} className="mt-3 ml-2">Download Sample</a>
                              </div>
                              
                              <span
                                className="pt-2"
                                style={{ fontWeight: 500, fontSize: 14 }}
                              >
                                {/* {console.log(file)} */}
                                {file && file.name}
                              </span>
                              <input
                                accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                id="file-uploader"
                                // value={merchantValue}
                                type="file"
                                style={{ display: "none" }}
                                onChange={fileSelected}
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <Header style={{ fontSize: 10, marginTop: 4 }}>
                                Allows only Excel files(xlsx)
                              </Header>
                            </div>
                          </div>
                          <div className="row py-2">
                            <table
                              id="result"
                              className="table table-striped display responsive nowrap w-100 table-bordered"
                            ></table>
                          </div>
                          {resp && (
                            <>
                              <p className="text-center">Failed : {resp.failed}</p>
                              <p className="text-center">Successful : {resp.success}</p>
                              <p className="text-center">Modified : {resp.modified}</p>
                            </>
                          )}
                          <div className="row py-2 mt-4">
                            <div className="col-md-6">
                              <Button style={{ width: 170 }}>Save</Button>
                            </div>
                            <div className="col-mdd-6">
                              {resErr && (
                                <a
                                  className="btn-default mb-2 mt-2"
                                  // onClick={processRefund}
                                  href="#"
                                  ref={download}
                                  aria-label="Download files"
                                >
                                  Export logs
                                </a>
                              )}
                            </div>
                          </div>
                        </form>
                      </>
                  
                  }
                </div>
              </div>
            </div>
          </div>
    </Dashboard>
  );
}

export default connect(null, actions)(UserHome);

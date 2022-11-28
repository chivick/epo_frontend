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
import { appConstants, downloadFile, log, getParam } from "../services/helpers";
import { Input } from "../custom";


function BranchHome({ startLoading }) {
  const [totalAssigned, setTotalAssigned] = useState(0);
  const [weeklyAssigned, setWeeklyAssigned] = useState(0);
  // const [teams, setTeams] = useState([]);
  const [totalResolved, setTotalResolved] = useState(0);
  const [weeklyResolved, setWeeklyResolved] = useState(0);
  const [pendingDispute, setPendingDispute] = useState([]);
  const [dispute, setDispute] = useState({});
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showUploadButton, setShowUploadButton] = useState(true);
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
  
  const [staffId, setStaffId] = useState("");
  const [staffPassword, setStaffPassword] = useState("");

  const download = useRef();

  const closeModal = (id) => {
    window.$(id).modal("hide");
    setReason("");
    setShowUploadButton(false);
    
    setFile(null);
  };

  const getReconPending = async () => {
    try {
      log("initial",App.getUserRole());
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
        log("initial",response);

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
    // getReconPending();
    // setTotalAssigned(App.getFromLocalStorage("fb-totalAssigned"));
    // setWeeklyAssigned(App.getFromLocalStorage("fb-weeklyAssigned"));
    // // let teamsDt = JSON.parse(App.getFromLocalStorage("fb-teams"));
    // // setTeams(teamsDt);
    // setTotalResolved(App.getFromLocalStorage("fb-totalResolved"));
    // setWeeklyResolved(App.getFromLocalStorage("fb-weeklyResolved"));
    const param = getParam("item");
    log("initial", param);
    if (param !== undefined && param !== null) {
      const disputeDt = App.branchGetDispute(param).then(result => {
        log("initial", result);
        if (result && Array.isArray(result)) {
          setPendingDispute(result);
        }
      });
      
    }
    
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
      // setShowUploadButton(false);
      // startLoading(true);
      // const response = await App.viewJournal(dispute.UniqueId);
      // startLoading(false);

      // if (response && response.trim() !== "No Data") {
        
      // }
      // return setShowUploadButton(true);
      setImages([`data:image/png;base64,${dispute.Journal}`]);
      setToggleView(true);
      return setImageSrc(dispute.Journal);
    } catch (error) {
      startLoading(false);
      App.log(error);
    }
  };
  const acceptRefund = async (e) => {
    // e.preventDefault();
    try {
      if (staffId == "" && staffPassword == "") {
        return App.showNotifiction("info", "Staff Id and Password required");
      }

      startLoading(true);
      await App.resolveDisputeBranch(dispute.UniqueId, staffId, staffPassword );
      
      window.$("#viewUser").modal("hide");
      let response2;
      window.$("#viewUser").modal("hide");

      startLoading(false);
      setFile(null);
      setImages([noImage]);
      App.showNotifiction("success", "Action successful");
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };

  const browseFile = (e) => {
    e.preventDefault();
    window.$(".file-uploader").val("");
    window.$(".file-uploader").files = [];

    window.$(".file-uploader").click();
    log("initial","BrowseFile");
  };

  const merchantBrowseFile = (e) => {
    e.preventDefault();
    window.$("#file-uploader").click();
  };

  const fileSelected = (e) => {
    log("initial","File Selected");
    log("initial",e.target.files[0]);
    
    let _file = e.target.files[0];
    if (_file && (!_file.name.includes("_"))) {
      App.showNotifiction("error", "Please check file naming is seperated with an underscore.");
      return;
    }
    if (_file && (!_file.name.includes("success") && !_file.name.includes("failed"))) {
      App.showNotifiction("error", "Please upload a file in the format success_filename or failed_filename}.");
      return;
    }
    const fileDt = e.target.files[0];
    setFile(fileDt);
  };
  const declineRefund = async (e) => {
    try {
      if (staffId == "" || staffPassword == "") {
        return App.showNotifiction("info", "Staff Id and Password required");
      }
      if (file == null) {
        return App.showNotifiction("info", "Upload Evidence of Payment.");
      }

      startLoading(true);
      
      log("initial","file",file, dispute.UniqueId, staffId, staffPassword);
      await App.branchDecline(file, dispute.UniqueId, staffId, staffPassword);
        
      let response2;
      setAlert(false);
      window.$("#viewUser").modal("hide");

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
      log("initial", reason);
      return;
    }
    try {
      startLoading(true);
      log("initial",dispute.UniqueId, reason);
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


  // close alert functions
  const closeAlert = () => {
    setAlert(false);
  };

  

  const formRef = useRef();
  
  const upgradeAgent = async (e) => {
    e.preventDefault();
    
    try {
      e.preventDefault();
      if (userType.trim() === "" || file === null) {
        log("initial",e.target);
        return App.showNotifiction(
          "info",
          "Please select user type and upload file"
        );
      }
      log("initial","file", file);
      startLoading(true);
      
      const response = await App.upgradeAgent(userType ,file);
      log("initial",response);
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
  
  return (
    <Dashboard Nav={"branch"}>
      <div className="container-fluid py-3">
        {/* <Header>Overview</Header> */}
        <div className="row">
          <div className="col-md-8">
            <div className="row">
              {/* <div className="col-md-3">
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
                      <Link to="#">see more</Link>
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
                      <Link to="#">see more</Link>
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
                      <Link to="#">see more</Link>
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
                      <Link to="#">see more</Link>
                    </div>
                  </SummaryBox>
                </div>
              </div> */}
              {
              ([...appConstants.teamLead].includes(App.getUserRole())) &&
            
              <div className="col-md-3 mt-3"></div>
            }
            </div>
            <Header>Dispute Pool</Header>
            <div className="row">
              <div className="col-md-12">
                <SummaryBox style={{ padding: "10px 16px" }}>
                  <div className="d-flex justify-content-end">
                    <div style={{ width: 100 }}>
                     
                    </div>
                  </div>

                  <table className="logs-table" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>Dispute Log ID</th>
                        <th>Stan</th>
                        <th>PAN</th>
                        <th>Transaction Amount</th>
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
                            <td
                              colSpan="2"
                              onClick={() => onViewUserClick(item)}
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
                  Total Number of disputes{" "}
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
                  View/Edit Dispute
                </h2>
                <GrayCircleAvatar onClick={() => {
                  setImageSrc(null);
                  setFile(null);
                  setImages([noImage]);
                  setToggleView(false);
                  closeModal("#viewUser");
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
                          <div className="col-md-4">
                            <p>RRN</p>
                            <p className="pt-2">{dispute.IssuerRRN || "N/A"}</p>
                          </div>
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
                          {dispute.Platform}
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
                      <span style={{ fontSize: 12 }}>Settlement Date</span>
                      <Header
                        style={{
                          marginTop: 4,
                          marginBottom: 4,
                          fontSize: 15,
                        }}
                      >
                        {App.convertToTimeString(dispute.SettlementDate)}
                      </Header>
                      <Hr />
                    </div>
                    {
                      dispute.Reason && 
                      <div>
                        <div style={{ fontSize: 14, marginBottom: 5, }}>Journal was Rejected</div>
                        <span style={{ fontSize: 13, fontWeight: 'bold' }}>User's comment: {dispute.Reason}</span>
                        <Hr />
                    </div>
                    }
                    <div>
                      <span style={{ fontSize: 12 }}>Username and Password</span>
                      <Header
                        style={{
                          marginTop: 4,
                          marginBottom: 4,
                          fontSize: 15,
                        }}
                      >
                        <Input
                          type="text"
                          name="username"
                          value={staffId}
                          onChange={(e) => setStaffId(e.target.value)}
                          placeholder="Username"
                        /> 
                        <Input
                          type="password"
                          name="username"
                          value={staffPassword}
                          onChange={(e) => setStaffPassword(e.target.value)}
                          placeholder="Password"
                        /> 
                      </Header>
                      <Hr />
                    </div>
                    <div className="row py-2">
                      {
                       
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
                      }
                    </div>
                    <div className="py-3">
                      {/*
                            Agent flow
                            Was cash given.
                          */}
                      
                        <>
                          <Header>Did your terminal dispense cash?</Header>
                          <div class="form-check pb-2">
                          <div className="col-md-12">
                          <Label>If yes, Upload evidence of payment </Label>
                          <Label>(jpg,png,gif,jpeg)</Label>
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
                          </div>
                        </>
                      
                    </div>
                    
                    <div className="row py-3">
                      
                        <div className="col-md-6">
                          {
                            file == null && <Button onClick={acceptRefund}>Accept</Button>
                          }
                          
                        </div>

                      {
                        <div className="col-md-6">
                          <SecondaryButton onClick={declineRefund}>
                            Decline
                          </SecondaryButton>
                        </div>
                      }
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

                    {dispute.Journal && (
                      <div>
                        <div className="row">
                          <div className="col-md-6">
                            <Button onClick={viewJorunal}>View Journal</Button>
                          </div>
                          <div className="col-md-6">
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
                                  {"View"}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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
                        <FileSelect onClick={merchantBrowseFile}>Browse files</FileSelect>
                        <span
                          className="pt-2"
                          style={{ fontWeight: 500, fontSize: 14 }}
                        >
                          {log("initial",file)}
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
                </div>
              </div>
            </div>
          </div>
    </Dashboard>
  );
}

export default connect(null, actions)(BranchHome);

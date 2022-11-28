import React from 'react';
import { Fragment } from "react";
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
  TextArea,
  SecondaryButton,
  Label,
} from "../custom";
// import userIcon from "../assets/images/user.svg";
// import DisputeRow from "../components/DisputeRow";
// import MSelect from "@material-ui/core/Select";
// import MenuItem from "@material-ui/core/MenuItem";
import { useEffect, useState } from "react";
import App from "../services";
import * as actions from "../actions";
import { connect } from "react-redux";
import eye from "../assets/images/eye.png";
import noImage from "../assets/images/noImg.png";
// import check from "../assets/images/check.svg";
// import Swal from "sweetalert2";
import Lightbox from "lightbox-react";
import "lightbox-react/style.css";
import {
  Magnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION,
} from "react-image-magnifiers";
import { Checkbox } from '@material-ui/core';
import { appConstants } from '../services/helpers';

function ReconDisputes({ startLoading }) {
  const [pendingDispute, setPendingDispute] = useState([]);
  const [dispute, setDispute] = useState({});
  const [reason, setReason] = useState("");
  const [file, setFile] = useState({});
  const [imageSrc, setImageSrc] = useState(null);
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [images, setImages] = useState([]);
  const [openLightBox, setOpenLightBox] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [checkedValue, setCheckedValue] = useState("Yes");
  const [toggleView, setToggleView] = useState(false);
  const [declineReason, setDeclineReason] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState(false);

  const closeModal = (id) => {
    window.$(id).modal("hide");
    setReason("");
    setFile(null);
    setShowUploadButton(false);
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
      App.log(error);
    }
  };

  const searchDisputes = async (e) => {
    try {
      let response;
      if (searchTerm === null && searchTerm === "") {
        return App.showNotifiction("info", "Search field is empty");
      }
      if (App.getUserRole() === "User" || App.getUserRole() === "TeamLead") {
        startLoading(true);
        response = await App.searchUserPendingDispute(searchTerm);
      } else if (
        App.getUserRole() === "Recon" ||
        App.getUserRole() === "ReconTeamLead"
      ) {
        startLoading(true);
        response = await App.searchReconPendingDispute(searchTerm);
      } else if (App.getUserRole() === "Agent") {
        startLoading(true);
        response = await App.searchAgentPendingDispute(searchTerm);
      }

      if (response) {
        setPendingDispute(response);
      }
      startLoading(false);
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };

  const acceptRefund = async (e) => {
    e.preventDefault();
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
      App.showNotifiction("success", "Action successful");
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };
  const browseFile = (e) => {
    e.preventDefault();
    window.$("#file-uploader").val("");
    window.$("#file-uploader").files = [];

    window.$("#file-uploader").click();
  };
  const fileSelected = (e) => {
    console.log(e.target.files[0]);
    const fileDt = e.target.files[0];
    setFile(fileDt);
  };
  const declineRefund = async (e) => {
    try {
      if (App.getUserRole() === "Agent") {
        startLoading(true);
        await App.agentDecline(dispute.UniqueId);
      } else if (App.getUserRole() === "Recon") {
        if (reason.trim() === "") {
          return App.showNotifiction("error", "Please provide reason");
        }
        startLoading(true);
        await App.rejectRefund(reason, dispute.UniqueId);
      } else if (
        App.getUserRole() === "User" ||
        App.getUserRole() === "TeamLead"
      ) {
        startLoading(true);
        await App.userRejectDispute(dispute.UniqueId, file);
      }
      let response2;
      window.$("#viewUser").modal("hide");
      setAlert(false);
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
      setPendingDispute(response2);
      startLoading(false);
      App.showNotifiction("success", "Action successful");
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };

  // refresh disputes onclick on refresh
  const refreshDisputes = async () => {
    getReconPending();
  };

  const onViewUserClick = (item) => {
    console.log(item);
    window.$("#viewUser").modal("show");
    setDispute(item);
  };

  const getReconPending = async () => {
    try {
      startLoading(true);
      let response;
      if (["Recon"].includes(App.getUserRole())) {
        response = await App.getReconDisputes();
      } else if (App.getUserRole() === "Agent") {
        response = await App.getAgentDisputes();
      } else if (
        App.getUserRole() === "User" ||
        App.getUserRole() === "TeamLead"
      ) {
        response = await App.getUserDisputes();
        // response = JSON.parse(App.getFromLocalStorage("fb-pendingDispute"));
        console.log("response : ", response);
      }

      setPendingDispute(response);
      startLoading(false);
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };

  useEffect(() => {
    getReconPending();
  }, [startLoading, setPendingDispute, dispute]);

  const declineJournal = async (e) => {
    if (!reason) {
      console.log(reason);
      return App.showNotifiction("info", "Please provide reason");
    }
    try {
      startLoading(true);
      console.log(dispute.UniqueId, reason);
      await App.declineJournal(dispute.UniqueId, reason);
      if (App.getUserRole() === "User" || App.getUserRole() === "TeamLead") {
        let response = await App.getUserDisputes();
        setPendingDispute(response);
        setImages([noImage]);
      }
      getReconPending();
      startLoading(false);
      window.$("#viewUser").modal("hide");
      window.$("#RejectionReasons").val("");
      setDeclineReason(false);
      setReason("");
      setAlert(false);
      App.showNotifiction("success", "Action successful");
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };

  // show alert before decline dispute
  const declineDispute = () => {};

  const submitForm = (e) => {
    e.preventDefault();
    if (checkedValue === "Yes") {
      return acceptRefund(e);
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

  return (
    <Dashboard>
      <div className="container">
        <Header>Disputes</Header>
        <div className="col-md-12">
          <SummaryBox style={{ padding: "16px" }}>
            <div className="row py-3 pr-3">
              <div className="d-flex w-100 justify-content-end">
                <div className="mr-3">
                  <Input
                    placeholder="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button onClick={searchDisputes} style={{ width: 170 }}>
                    Search
                  </Button>
                  <Button
                    onClick={refreshDisputes}
                    style={{ width: 170, marginLeft: "10px" }}
                  >
                    Refresh
                  </Button>
                  {
                    [...appConstants.recon, ...appConstants.reconTeamLead].includes(App.getUserRole()) && pendingDispute?.length > 0 &&
                    <div className={"mr-3"} style={{ width: 100 }}>
                      <Button onClick={() => sendBulk()}>
                        Send Bulk
                      </Button>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="logs-table table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Dispute Log ID</th>
                    <th>Stan</th>
                    <th>PAN</th>
                    <th>Transaction Amount</th>
                    <th>Trans Date</th>
                    {/* <th>Merchant Name</th> */}
                    <th>Issuer RRN</th>
                    <th>Terminal ID</th>
                    <th></th>
                    {/* <th></th> */}
                  </tr>
                </thead>
                <tbody>
                  {pendingDispute && pendingDispute.filter((item)=>item.IsRevalidation === "False" || item.IsRevalidation === "false" || item.IsRevalidation === false).map((item, i) => {
                      return (
                        <tr key={i}>
                          <td>{item.DisputeLogId}</td>
                          <td>{item.IssuerStan || "N/A"}</td>
                          <td>{item.PAN}</td>
                          <td>{item.TransAmount}</td>
                          <td>
                            {item.Transaction_Date
                              ? App.convertToTimeString(item.Transaction_Date)
                              : "N/A"}
                          </td>
                          {/* <td>{item.MerchantName}</td> */}
                          <td>{item.IssuerRRN}</td>
                          <td>{item.TerminalId}</td>
                          <td colSpan="2" onClick={() => {
                            setImageSrc(null);
                            setToggleView(false);
                            onViewUserClick(item);
                          }}>
                            <img
                              src={eye}
                              alt="view"
                              className="table-action"
                              style={{ width: 18, height: 18 }}
                            />
                          </td>
                        </tr>
                      );
                    }) } 
                </tbody>
              </table>
            </div>
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
                          Dispute Log ID: {dispute?.DisputeLogId}
                        </Header>
                        {/* <span style={{ fontSize: 12 }}>
                          Dispute No: {dispute.DisputeLogID}
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
                            dispute && (dispute.Platform?.toLowerCase() == "updm") ?
                            <div className="col-md-4">
                              <p>TextMess</p>
                              <p className="pt-2">{dispute.TraceNum || "N/A"}</p>
                            </div>
                            :
                            <div className="col-md-4">
                              <p>RRN</p>
                              <p className="pt-2">{dispute.IssuerRRN || "N/A"}</p>
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
                            id="file-uploader"
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
                          <Header>Did you dispense cash?</Header>
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
                              onChange={(e) => setCheckedValue(e.target.value)}
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
                          <Label>Upload evidence of payment.</Label>
                          <Label>(jpg,png,gif,jpeg)</Label>
                          <FileSelect onClick={browseFile}>
                            Browse files
                          </FileSelect>
                          <span
                            className="pt-2"
                            style={{ fontWeight: 500, fontSize: 14 }}
                          >
                            {(file && file?.name) || ""}
                          </span>
                          <input
                            accept="image/*"
                            id="file-uploader"
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
                    </div>
                  </div>

                  <div className="col-md-6">
                    {App.getUserRole() === "Agent" ||
                    // App.getUserRole() === "User" ||
                    App.getUserRole() === "TeamLead" ||
                    App.getUserRole() === "Recon" ||
                    App.getUserRole() === "ReconTeamLead"
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
                                  id="RejectionReasons"
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
                    App.getUserRole() === "Recon" ||
                    App.getUserRole() === "ReconTeamLead" ||
                    App.getUserRole() === "TeamLead" ? (
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-6">
                            {App.getUserRole() === "Recon" ||
                            App.getUserRole() === "ReconTeamLead" ? null : (
                              <Button onClick={viewJorunal}>
                                View Journal
                              </Button>
                            )}
                          </div>
                          <div className="col-md-6">
                            {App.getUserRole() === "User" ||
                            App.getUserRole() === "TeamLead" ||
                            App.getUserRole() === "Recon" ||
                            App.getUserRole() === "ReconTeamLead"
                              ? dispute.Journal &&
                                !declineReason && (
                                  <SecondaryButton
                                    onClick={() => setDeclineReason(true)}
                                  >
                                    Decline Journal
                                  </SecondaryButton>
                                )
                              : !declineReason && (
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
                        {toggleView && (
                          <div className="row">
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
                          </div>
                        )}
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
    </Dashboard>
  );
}

export default connect(null, actions)(ReconDisputes);

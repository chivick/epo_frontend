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

function CrmUserHome({ startLoading }) {
  const [pendingDispute, setPendingDispute] = useState([]);
  const [totalAssigned, setTotalAssigned] = useState(0);
  const [weeklyAssigned, setWeeklyAssigned] = useState(0);
  // const [teams, setTeams] = useState([]);
  const [totalResolved, setTotalResolved] = useState(0);
  const [weeklyResolved, setWeeklyResolved] = useState(0);
  
  
  const [dispute, setDispute] = useState({});
  const [reason, setReason] = useState("");
  const [file, setFile] = useState({});
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

  const download = useRef();

  const closeModal = (id) => {
    window.$(id).modal("hide");
    setReason("");
    setShowUploadButton(false);
    console.log(file);
    setFile(null);
  };


  useEffect(() => {
    if (App.getFromLocalStorage("fb-totalAssigned") && App.getFromLocalStorage("fb-totalAssigned") == 0) {
      setTotalAssigned(App.getFromLocalStorage("fb-totalAssigned"));
      setWeeklyAssigned(App.getFromLocalStorage("fb-weeklyAssigned"));
      // let teamsDt = JSON.parse(App.getFromLocalStorage("fb-teams"));
      // setTeams(teamsDt);
      setTotalResolved(App.getFromLocalStorage("fb-totalResolved"));
      setWeeklyResolved(App.getFromLocalStorage("fb-weeklyResolved"));
      // const disputeDt = JSON.parse(App.getFromLocalStorage("fb-pendingDispute"));
      // setPendingDispute(disputeDt);
    }
    else {
      // fire reques to get these
      // fb-totalAssigned | fb-weeklyAssigned | fb-totalResolved | fb-weeklyResolved
    }

    getPendingCase();
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


  const getPendingCase = async(e) => {
    App.getCRMPending().then(data => {
      if (data && data.status) {
        setPendingDispute(data.data);
      }
    });
  }
  
  const closeCase = async(id) => {
    App.closeCRMCase(id).then(data => {
      if (data && data.status) {
      }
    });
  }

  const reverseCase = async(id) => {
    App.reverseCRMCase(id).then(data => {
      if (data && data.status) {
      }
    });
  }

  const downloadReversalList = async() => {
    App.generateReversalList().then(data => {
      if (data && data.status) {
      }
    });
  }

  
  

  // close alert functions
  const closeAlert = () => {
    setAlert(false);
  };

  const formRef = useRef();
  
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
                        <h5>cases</h5>
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
                        <h5>cases</h5>
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
              </div>
              {
              ([...appConstants.teamLead].includes(App.getUserRole())) &&
            
              <div className="col-md-3 mt-3">
                <YellowBox className="" style={{ height: 92 }}>
                  <div className="d-flex yellow-box-action justify-content-end">
                    <h5>Download Reversal Excel</h5>
                    <CircleAvatar onClick={downloadReversalList}>
                      <span className="plus-icon">
                        <i className="fas fa-plus"></i>
                      </span>
                    </CircleAvatar>
                  </div>
                </YellowBox>
              </div>
            }
            </div>
            <Header>Cases Pool</Header>
            <div className="row">
              <div className="col-md-12">
                <SummaryBox style={{ padding: "10px 16px" }}>
                  <div className="d-flex justify-content-end">
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
                        <th>Unique Id</th>
                        <th>Account Number</th>
                        <th>Sub Category</th>
                        <th>Transaction Amount</th>
                        <th>Date Created</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingDispute?.map((item, i) => {
                        return (
                          <tr key={i}>
                            <td>{item.UniqueIdNumber}</td>
                            <td>{item.AcctNumber}</td>
                            <td>{item.ComplaintSubCategory}</td>
                            <td>{item.AmountInDispute}</td>
                            <td>{moment(item.CreatedAt).format("yyyy-MM-DD") }</td>
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
                  Total Number of cases{" "}
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
                  Total Number of resolved cases{" "}
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
                  View Case
                </h2>
                <GrayCircleAvatar onClick={() => {
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
                          Case Unique ID: {dispute?.UniqueIdNumber}
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
                          Customer Infomation
                        </Header>
                        <div className="row mt-3">
                          <div className="col-md-6">
                            <p>Account Number</p>
                            <p className="pt-2">{dispute.AcctNumber}</p>
                          </div>
                        </div>
                        {/* <span style={{ fontSize: 12 }}>{dispute.Stan}</span> */}
                        <Hr />
                      </div>
                    </div>
                    
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
                          {dispute.TransactionDate
                            ? App.convertToTimeString(dispute.TransactionDate)
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
                          {dispute.AmountInDispute}
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
                          {dispute.ComplaintSubCategory}
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
                          {"CRM"}
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
                        {dispute?.CreatedDate
                          ? App.convertToTimeString(dispute.CreatedDate)
                          : "N/A"}
                      </Header>
                      <Hr />
                    </div>
                    <div className="row py-2">

                    </div>
                    <div className="row ml-3">
                      <div className="row py-4">
                        <div className="col-md-12">
                          <Button
                            style={{ maxWidth: 400 }}
                            onClick={() => closeCase(dispute.UniqueIdNumber)}
                          >
                            Close Case
                          </Button>
                        </div>
                      </div>
                      <div className="row py-4 ml-3">
                        <div className="col-md-12">
                          <SecondaryButton
                            style={{ maxWidth: 400 }}
                            onClick={() => reverseCase(dispute.UniqueIdNumber)}
                          >
                            Add to reversal list
                          </SecondaryButton>
                        </div>
                      </div>
                    </div>
                    <div className="row py-3">
                    </div>
                  </div>
                  <div className="col-md-6">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
                </div>
              </div>
            </div>
          </div>
    </Dashboard>
  );
}

export default connect(null, actions)(CrmUserHome);

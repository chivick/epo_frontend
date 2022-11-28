import React from 'react';
import moment from 'moment';
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

  const searchDisputes = async (e) => {
    try {
      let response;
      if (searchTerm === null && searchTerm === "") {
        return App.showNotifiction("info", "Search field is empty");
      }

      response = await App.searchUserPendingCases(searchTerm);

      if (response) {
        setPendingDispute(response);
      }
      startLoading(false);
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };
  
  // refresh disputes onclick on refresh
  const refreshDisputes = async () => {
    getPendingCase();
  };

  const onViewUserClick = (item) => {
    console.log(item);
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

  useEffect(() => {
    getPendingCase();
  }, [startLoading, setPendingDispute]);


  // show alert before decline dispute
  const declineDispute = () => {};

  // close alert functions
  const closeAlert = () => {
    setAlert(false);
  };


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

  return (
    <Dashboard>
      <div className="container">
        <Header>Dispute Pool</Header>
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
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="logs-table table" style={{ width: "100%" }}>
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
                  {pendingDispute &&
                    pendingDispute.map((item, i) => {
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
    </Dashboard>
  );
}

export default connect(null, actions)(ReconDisputes);

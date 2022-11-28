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
import { urls } from "../services/urls";
import { Input } from "../custom";


function UploadAtmJournalException({ startLoading }) {
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
    const fileDt = e.target.files[0];
    if (!fileDt.name.includes("_")) {
      App.showNotifiction("error", "Please check file naming format.");
      return;
    }
    
    if (!fileDt.name.endsWith(".xlsx")) {
      App.showNotifiction("error", "Only excel files (.xlsx) are allowed.");
      return;
    }
    setFile(fileDt);
  };

  // close alert functions
  const closeAlert = () => {
    setAlert(false);
  };

  const onFileUpload = () => {
    if (staffId == "" || staffPassword == "") {
      return App.showNotifiction("info", "Staff Id and Password required");
    }
    if (file == null) {
      return App.showNotifiction("info", "Please select a file.");
    }
    startLoading(true);
    let formData = new FormData();
    formData.append("file", file);
    App.postRequestFile(urls.ATMUploadExceptionFile(staffId, staffPassword), formData).finally(() => startLoading(false));
    
  }

  

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
              
              {
              ([...appConstants.teamLead].includes(App.getUserRole())) &&
            
              <div className="col-md-3 mt-3"></div>
            }
            </div>
            <Header>Upload ATM Exception Journal</Header>
            <div className="row">
              <div className="col-md-12">
                <SummaryBox style={{ padding: "10px 16px" }}>
                  <div className="">
                    <div>
                    <div className="py-4">
                        <div className="row">
                          <div className="col-md-8">
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
                                  disabled={file ? false : true}
                                  value={staffId}
                                  onChange={(e) => setStaffId(e.target.value)}
                                  placeholder="Username"
                                /> 
                                <Input
                                  type="password"
                                  name="username"
                                  disabled={file ? false : true}
                                  value={staffPassword}
                                  onChange={(e) => setStaffPassword(e.target.value)}
                                  placeholder="Password"
                                /> 
                              </Header>
                              <Hr />
                            </div>
                            <Header>Please select file</Header>
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
                                    accept=".xlsx"
                                    class="file-uploader"
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={fileSelected}
                                  />
                                </div>
                              }
                            </div>
                            <div className="row py-3">
                              
                                <div className="col-md-6">
                                  {
                                    <Button onClick={() => onFileUpload()}>Submit</Button>
                                  }
                                  
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  
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
                  {/* Total Number of disputes{" "} */}
                </h3>
                <h3 style={{ color: "#022E64", textAlign: "center" }}>
                  {/* this week */}
                </h3>
                <h4
                  className="font-weight-bold"
                  style={{ fontSize: 18, color: "#022E64", marginTop: 6 }}
                >
                  {/* {weeklyAssigned} */}
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
                  {/* Total Number of resolved disputes{" "} */}
                </h3>
                <h3 style={{ color: "#fff", textAlign: "center" }}>
                  {/* this week */}
                </h3>
                <h4
                  className="font-weight-bold"
                  style={{ fontSize: 18, color: "#fff", marginTop: 6 }}
                >
                  {/* {weeklyResolved} */}
                </h4>
              </div>
            </BoxShadow>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default connect(null, actions)(UploadAtmJournalException);

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
  BoxShadow,
  Label,
} from "../custom";
import { Link } from "react-router-dom";
// import LogRow from "../components/LogsRow";
import Swal from "sweetalert2";
import Chart from "chart.js";
// import DisputeReport from "../components/DisputeReport";
import App from "../services";
import * as actions from "../actions";
import { downloadFile, log, appConstants } from "../services/helpers";
import { connect } from "react-redux";
import { LinearProgress } from "@material-ui/core";
import fbLogo from "../assets/images/fbLogo.png";
import moment from "moment";

function MakerHome({ startLoading }) {
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
  const [staffDetails, setStaffDetails] = useState({});
  const [workingHours, setWorkingHours] = useState([]);
  const [fromTime, setFromTime] = useState("07");
  const [toTime, setToTime] = useState("19");
  const [expiryDate, setExpiryDate] = useState("");

  // ref elements
  const download = useRef();

  useEffect(() => {
    const getDashboardSetting = async () => {
      try {
        let _hours = [];
        
        for(let i = 0; i < 24; i++) {
          _hours.push(i.toLocaleString('en-US', {minimumIntegerDigits: 2}));
        }
        setWorkingHours(_hours);
        
        startLoading(true);
        const response = await App.getDashboardSettings();
        const {
          TotalAssigned,
          TotalResolvedCount,
          TotalUnresolved,
          UserCount,
        } = response;
        startLoading(false);
        setUserCount(UserCount);
        var ctx = window.$("#myChart");
        new Chart(ctx, {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: [TotalAssigned, TotalResolvedCount, TotalUnresolved],
                backgroundColor: ["#022E64", "#EAAA00", "#0093c9"],
                borderWidth: 1,
              },
            ],
            labels: ["Assigned", "Resolved", "Unresolved"],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            // labels: [
            //     'Red',
            //     'Yellow',
            //     'Blue'
            // ],
          },
          options: {
            legend: {
              display: false,
            },
            scales: {
              yAxes: [
                {
                  gridLines: {
                    display: false,
                    color: "rgba(0, 0, 0, 0)",
                  },
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false,
                    color: "rgba(0, 0, 0, 0)",
                  },
                },
              ],
            },
          },
        });
      } catch (error) {
        startLoading(false);
        App.logError(error);
      }
    };
    getDashboardSetting();
    loadPicker();
  }, [setLogs, setUserCount, startLoading]);
  
  const loadPicker = () => {
    window.$('input[name="daterange"]').daterangepicker(
      {
        opens: "right",
        singleDatePicker: true,
        startDate: moment(),
        endDate: moment(),
      },
      function (start, end, label) {
        setExpiryDate(start);
      }
    );
  }

  const fileSelected = (e) => {
    console.log(e.target.files[0]);
    const fileDt = e.target.files[0];
    setFile(fileDt);
  };
  const handlePlusIconOnClick = async (e) => {
    try {
      startLoading(true);
      const response = await App.getTeams();
      setTeam(() => [...response]);
      startLoading(false);
      window.$("#addNewUser").modal("show");
    } catch (error) {
      // console.error(error.response);
      startLoading(false);
      App.logError(error);
    }
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
    // console.log(e.target.files[0]);
    const fileDt = e.target.files[0];
    setFile(fileDt);
  };
  const addUser = async (e) => {
    e.preventDefault();
    if ([...appConstants.maker].includes(App.getUserRole())) {
      if (
        staffId.trim() === "" ||
        staffRole.trim() === "" ||
        (staffTeam.trim() === "" && ![appConstants.admin[1], appConstants.recon[0], appConstants.reconTeamLead[0], appConstants.audit[0]].includes(staffRole))
      ) {
        App.showNotifiction(
          "error",
          "Please fill all fields. Staff ID, Staff Role is required"
        );
        return;
      }

      try {
        startLoading(true);
        // staffId={staffId}&role={role}
        let response = undefined;
        let _time = fromTime + "-" + toTime;
        
        if ([appConstants.admin[1], appConstants.recon[0], appConstants.reconTeamLead[0], appConstants.audit[0]].includes(staffRole)) {
          response = await App.createRequest("UserCreation", {staffId: staffId, role: staffRole, LoginTime: _time, ExpiryDate: expiryDate});
        }
        else {
            response = await App.createRequest("UserCreation", {staffId: staffId, role: staffRole, team: staffTeam, LoginTime: _time, ExpiryDate: expiryDate});
        }
        
        startLoading(false);
        App.showNotifiction("success", "User creation request sent successfully");
        setStaffId("");
        setStaffRole("");
        setStaffTeam("");
        // console.log(response);
      } catch (error) {
        startLoading(false);
        App.logError(error);
      }
    }
    else {
      if (
        staffId.trim() === "" ||
        staffRole.trim() === "" ||
        staffTeam.trim() === ""
      ) {
        App.showNotifiction(
          "error",
          "Please fill all fields. Staff ID, Staff Role and Team is required"
        );
        return;
      }
      try {
        startLoading(true);
        const response = await App.addUser(staffId, staffTeam, staffRole);
        startLoading(false);
        App.showNotifiction("success", "User created successfully");
        setStaffId("");
        setStaffRole("");
        setStaffTeam("");
        console.log(response);
      } catch (error) {
        startLoading(false);
        App.logError(error);
      }
    }
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

  const addMerchant = (e) => {
    try {
      e.preventDefault();
      window.$("#addMerchant").modal("show");
    } catch (error) {
      App.logError(error);
    }
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
      // console.log("file", file);
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

  const createTeam = (e) => {
    e.preventDefault();
    
    Swal.fire({
      title: `<span style="font-family: Lato, sans-serif;"> Create Team</span>`,
      icon: "info",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
        placeholder: "Team name",
      },
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: '<i class="fa fa-thumbs-up"></i> Create',
      confirmButtonAriaLabel: "Create",
      cancelButtonText: "Cancel",
      cancelButtonAriaLabel: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (result.value.trim() !== "") {
          try {
            startLoading(true);
            const response = await App.createTeam(result.value);
            startLoading(false);
            App.showNotifiction("success", "Team creation request successfully");
            console.log(response);
          } catch (error) {
            startLoading(false);
            App.logError(error);
          }
        }
      }
    });
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

  const validateUser = () => {
    startLoading(true);
    App.validateStaffId(staffId).then(response => {
      if (response) {
        // do sth
        setStaffDetails(response);
      }
    }).finally(() => startLoading(false))
  }

  const formRef = useRef();

  return (
    <Dashboard>
      <div className="container-fluid py-3">
        <Header>Overview</Header>
        <div className="row">
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-3">
              <div className="px-2">
                <SummaryBox>
                  <div className="d-flex justify-content-between py-2 px-3">
                    <div className="counter-summary">
                      <h4>Total</h4>
                      <h5>Users</h5>
                    </div>
                    <div className="d-flex counter-report align-items-center">
                      <h4>{userCount}</h4>
                    </div>
                  </div>
                  <div className="see-more-wrapper py-2">
                    <Link to="/users/manage">see more</Link>
                  </div>
                </SummaryBox>
              </div>
            </div>
            {
              ([...appConstants.admin, "Admin"].includes(App.getUserRole())) &&
              <div className="col-md-3">
                <YellowBox className="" style={{ height: 92 }}>
                  <div className="d-flex yellow-box-action justify-content-end">
                    <h5>Profile a new user</h5>
                    <CircleAvatar onClick={handlePlusIconOnClick}>
                      <span className="plus-icon">
                        <i className="fas fa-plus"></i>
                      </span>
                    </CircleAvatar>
                  </div>
                </YellowBox>
              </div>
            }
            {
              ([...appConstants.maker, "Maker"].includes(App.getUserRole())) &&
              <div className="col-md-3">
                <YellowBox className="" style={{ height: 92 }}>
                  <div className="d-flex yellow-box-action justify-content-end">
                    <h5 style={{color: "#022E64"}}>Profile a new user</h5>
                    <CircleAvatar onClick={handlePlusIconOnClick}>
                      <span className="plus-icon">
                        <i className="fas fa-plus"></i>
                      </span>
                    </CircleAvatar>
                  </div>
                </YellowBox>
              </div>
            }
            {
              ([...appConstants.maker, "Maker"].includes(App.getUserRole())) &&
              <div className="col-md-3">
                <YellowBox className="" style={{ height: 92 }}>
                  <div className="d-flex yellow-box-action justify-content-end" style={{color: "#022E64"}}>
                    <h5 style={{color: "#022E64"}}>Create Team</h5>
                    <CircleAvatar onClick={createTeam}>
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
            
              <div className="col-md-3">
                <YellowBox className="" style={{ height: 92 }}>
                  <div className="d-flex yellow-box-action justify-content-end">
                    <h5>Add Merchant</h5>
                    <CircleAvatar onClick={addMerchant}>
                      <span className="plus-icon">
                        <i className="fas fa-plus"></i>
                      </span>
                    </CircleAvatar>
                  </div>
                </YellowBox>
              </div>
            }
          </div>
          {
            [...appConstants.checker, "Checker"].includes(App.getUserRole()) &&
              <>
              <Header>Recent Logs</Header>
              <div className="row">
                <div className="col-md-8">
                  <SummaryBox
                    style={{
                      padding: "10px 16px",
                      height: "fit-content",
                      justifyContent: "initial",
                    }}
                  >
                    <div className="d-flex justify-content-end">
                      <div style={{ width: 100 }}>
                        <Link to="/logs">
                          <Button>see all</Button>
                        </Link>
                      </div>
                    </div>

                    <table className="logs-table" style={{ width: "100%" }}>
                      <thead>
                        <tr>
                          <th>Batch</th>
                          <th>Title</th>
                          {/* <th>Date</th> */}
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log, i) => (
                          <tr key={i}>
                            <td style={{ fontSize: 11 }}>{log.id}</td>
                            <td style={{ fontSize: 11 }}>{log.title}</td>
                            <td>
                              <Button
                                onClick={() => viewLogs(log)}
                                style={{ maxWidth: 130 }}
                              >
                                View All
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </SummaryBox>
                </div>
                <div className="col-md-4">
                  <SummaryBox
                    className="dispute-report"
                    style={{
                      padding: "10px 8px",
                      // height: "400px",
                      position: "relative",
                      justifyContent: "initial",
                    }}
                  >
                    <h4>Disputes</h4>
                    <h5 className="mb-2">Status</h5>
                    <canvas
                      id="myChart"
                      style={{ width: "100%", maxWidth: 400 }}
                      height="400"
                    ></canvas>
                    <div
                      className="d-flex justify-content-center"
                      style={
                        {
                          // position: "absolute",
                          // bottom: 0,
                          // left: 0,
                          // width: "100%",
                        }
                      }
                    >
                      <ul>
                        <li className="assigned">
                          <span className="assigned-circle"></span>Assigned
                        </li>
                        <li className="resolved">
                          <span className="resolved-circle"></span>Resolved
                        </li>
                        <li className="unresolved">
                          <span className="unresolved-circle"></span>Unresolved
                        </li>
                      </ul>
                    </div>
                  </SummaryBox>
                </div>
              </div>
              </>
          }
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
              <h3 style={{ color: "#fff", textAlign: "center" }}>
                {/* Total Number of disputes{" "} */}
              </h3>
              <h3 style={{ color: "#fff", textAlign: "center" }}>
                {/* this week */}
              </h3>
              <h4
                className="font-weight-bold"
                style={{ fontSize: 18, color: "#fff", marginTop: 6 }}
              >
                {/* {0} */}
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
                {/* {0} */}
              </h4>
            </div>
          </BoxShadow>
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
                    style={{ color: "#EAAA00", fontSize: 18, fontWeight: "bold" }}
                  >
                    Add New User
                  </h2>
                  <GrayCircleAvatar onClick={() => closeModal("#addNewUser")}>
                    X
                  </GrayCircleAvatar>
                </section>
                <Hr />
                <section className="py-1 d-flex align-items-center px-3">
                  <h5 style={{ fontSize: 12 }}>
                    Add user via staff ID number or upload excel sheet of multiple
                    ID's
                  </h5>
                </section>
                <Hr />
                {
                  staffDetails?.FullName && 
                  <>
                      <div className={"align-items-center px-3"}>
                        <h3 style={{ fontSize: 18 }}>
                          User Details
                        </h3>
                      </div>
                      <section className="py-3 d-flex align-items-center px-3">
                        <div>
                          <div className={"row"}>
                            <div className="col-md-8 mr-2 p-2">
                              Full name: {staffDetails.FullName || "N/A"}
                            </div>
                            <div className="col-md-6 mr-2 p-2">
                              Email: {staffDetails.Email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </section>
                      <Hr />
                  </>
                }
                <div className="row mt-3 px-4 pb-5">
                  <div className="col-md-6">
                    <div className={"row"}>
                      <Input
                        value={staffId}
                        onChange={(e) => setStaffId(e.target.value)}
                        placeholder="Staff ID Number"
                      />
                      <div style={{ width: 170 }}>
                        <Button onClick={validateUser}>Validate User</Button>
                      </div>
                    </div>
                    <Select
                      value={staffRole}
                      onChange={(e) => setStaffRole(e.target.value)}
                    >
                      <option value="">Select Role</option>
                      {
                        ([...appConstants.maker,"Maker"].includes(App.getUserRole())) &&
                          <>
                            <option value={appConstants.audit[0]}>Audit</option>
                            <option value={appConstants.admin[1]}>Unit head</option>
                            <option value={appConstants.teamLead[0]}>Team Lead</option>
                            <option value={appConstants.recon[0]}>Recon</option>
                            <option value={appConstants.user[0]}>User</option>
                            <option value={appConstants.reconTeamLead[0]}>Recon Team Lead</option>
                          </>
                      }
                      
                    </Select>
                    {
                        ([...appConstants.maker].includes(App.getUserRole())) && ![appConstants.admin[1], appConstants.recon[0], appConstants.reconTeamLead[0], appConstants.audit[0]].includes(staffRole) &&
                        <Select
                          value={staffTeam}
                          onChange={(e) => setStaffTeam(e.target.value)}
                        >
                          <option value="">Select Team</option>
                          {teams.map((item, i) => (
                            <option key={i} value={item.Teams}>
                              {item.Teams}
                            </option>
                          ))}
                        </Select>
                    }
                      <Label>User Account Expiry Date</Label>
                      <Input type="text" id="daterange" name="daterange" />
                      <Label>From (Working Hours)</Label>
                      <Select
                        defaultValue={"07"}
                        value={fromTime}
                        onChange={(e) => setFromTime(e.target.value)}
                        >
                          <option value="">User Working Hours (From)</option>
                          {workingHours.map((item, i) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                      </Select>
                      <Label>To (Working Hours)</Label>
                      <Select
                        defaultValue={"19"}
                        value={toTime}
                        onChange={(e) => setToTime(e.target.value)}
                        >
                          <option value="">User Working Hours (To)</option>
                          {workingHours.map((item, i) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                      </Select>
                    <div style={{ width: 170 }}>
                      <Button onClick={addUser}>Add User</Button>
                    </div>
                  </div>
                  <div className="col-md-6">
                    { [...appConstants.maker].includes(App.getUserRole()) &&
                      <form onSubmit={uploadMultipleUserFile}>
                        <div className="row">
                          <div className="d-flex">
                            <FileSelect onClick={browseFileUser}>
                              Browse files
                            </FileSelect>
                            <span
                              className="pt-2"
                              style={{ fontWeight: 500, fontSize: 14 }}
                            >
                              {/* {console.log(file)} */}
                              {file && file.name}
                            </span>
                            <input
                              accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                              id="file-uploader2"
                              type="file"
                              style={{ display: "none" }}
                              onChange={fileSelectedUser}
                            />
                          </div>
                        </div>
                        <div className="row py-3">
                          <div style={{ width: 160 }}>
                            <Button>Upload</Button>
                          </div>
                        </div>
                      </form>
                    }
                  </div>
                </div>
              </div>
            </div>
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
                        <FileSelect onClick={browseFile}>Browse files</FileSelect>
                        <span
                          className="pt-2"
                          style={{ fontWeight: 500, fontSize: 14 }}
                        >
                          {console.log(file)}
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
        </div>
      </div>
    </Dashboard>
  );
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, actions)(MakerHome);

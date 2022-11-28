import React from 'react';
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
  Label,
} from "../custom";
import UserTableRow from "../components/UserTableRow";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import App from "../services";
import setting from "../assets/images/settings.svg";
import chain from "../assets/images/chain.png";
import { appConstants } from '../services/helpers';
import deleteicon from "../assets/images/delete.svg";
import eye from "../assets/images/eye.png";

function Proceses({ startLoading }) {
  // const handlePlusIconOnClick = async (e) => {};
  const closeModal = (id) => {
    window.$(id).modal("hide");
  };
  const onViewUserClick = () => {};
  const [teams, setTeam] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [staffTeam, setStaffTeam] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [processes, setProcess] = useState([]);
  const [process, setEditProcess] = useState({});
  const [reconProcess, setReconProcess] = useState({});
  const [reconUsers, setReconUsers] = useState([]);
  const [recon, setReconUser] = useState("");
  const addUser = async (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    async function getUsers() {
      try {
        startLoading(true);
        let response2 = [];
        let response = [];
        if (App.getUserRole() === "Admin") {
          response = await App.getTeams();

          response2 = await App.getAllProcesses();
        } else if (App.getUserRole() === "ReconTeamLead") {
          response2 = await App.getReconProcesses();
          console.log(response2);
        }
        setProcess(response2);
        
        setTeam(() => [...response]);
        startLoading(false);
        
      } catch (error) {
        startLoading(false);
        App.logError(error);
      }
    }
    getUsers();
  }, [startLoading]);
  const changeUserRole = (item) => {
    setEditProcess(item);
    window.$("#changeRole").modal("show");
  };
  const assignProcessToTime = async () => {
    if (staffRole.trim() === "") {
      return App.showNotifiction("info", "Process must be assigned to a team");
    }
    try {
      startLoading(true);
      await App.assignSingleProcess(staffRole, process.Id);
      window.$("#changeRole").modal("hide");
      startLoading(false);
      App.showNotifiction("success", "Process successfully assigned");
    } catch (error) {
      App.logError(error);
    }
  };
  const assignUserToProces = async (process) => {
    try {
      startLoading(true);
      const response = await App.getAllUsers();
      startLoading(false);
      console.log(response);
      setReconUsers(response);
      console.log(process);
      setReconProcess(process);
      window.$("#assignUserToProcess").modal("show");
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };
  const assignUserToProcess = async (e) => {
    try {
      if (recon.trim() === "")
        return App.showNotifiction("info", "Please select a user");
      startLoading(true);
      await App.assignReconUserToProcess(reconProcess.Id, recon);
      startLoading(false);
      window.$("#assignUserToProcess").modal("hide");
      App.showNotifiction("success", "Process successfully assigned");
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };
  const removeUserFromProcess = async (item) => {
    try {
      startLoading(true);
      await App.unAssignReconProcesses(item.Id);
      startLoading(false);
      App.showNotifiction("success", "Process unassigned successfully");
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };
  return (
    <Dashboard>
      <div className="container pb-4">
        <Header>Manage Processes</Header>
        <div className="col-md-12">
          <SummaryBox style={{ padding: "16px" }}>
            {/* <div className="row py-3 pr-3">
              <div className="d-flex w-100 justify-content-end">
                <div className="mr-3">
                  <Input placeholder="search" />
                </div>
                <CircleAvatar onClick={handlePlusIconOnClick}>
                  <span className="plus-icon">
                    <i className="fas fa-plus"></i>
                  </span>
                </CircleAvatar>
              </div>
            </div> */}
            {App.getUserRole() !== "ReconTeamLead" ? (
              <table className="logs-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Process Name</th>
                    <th>Category</th>
                    <th>Resolution Platform</th>
                    <th>Active Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {/* {processes?.map((item) => (
                    <UserTableRow
                      pageType="process"
                      className="resolution-table-row"
                      key={item.Id}
                      userId={item.Platform}
                      fullName={item.ProcessName}
                      email={item.Category}
                      phoneNumber={item.ResolutionPlatform}
                      city={item.IsActive ? "Active" : "InActive"}
                      onViewUserClick={() => onViewUserClick(item)}
                      changeUserRole={() => changeUserRole(item)}
                    />
                  ))} */}
                  {
                    processes?.map((item) => {
                      const pageType="process"
                      const className="resolution-table-row"
                      const key=item.Id
                      const userId=item.Platform
                      const fullName=item.ProcessName
                      const email=item.Category
                      const phoneNumber=item.ResolutionPlatform
                      const city=item.IsActive ? "Active" : "InActive"
                      
                      return (
                        <tr className={`${className}`}>
                          <td>{userId}</td>
                          <td>{fullName}</td>
                          <td>{email}</td>
                          <td>{phoneNumber}</td>
                          {className !== "resolution-table-row" ? (
                            <>
                              <td>{city}</td>
                              <td></td>
                            </>
                          ) : null}
                          <td className="mr-1" colSpan="2">
                            {
                              <img
                                src={setting}
                                onClick={() => changeUserRole(item)}
                                alt="settings"
                                className="table-action"
                              />
                            }
                          </td>
                          {/* <>
                            {showControl &&  (
                              <td className="mr-1" colSpan="2" onClick={onViewUserClick}>
                                <img src={eye} alt="view" className="table-action" />
                              </td>
                            )}
                          </> */}
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            ) : (
              <table className="logs-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Process Name</th>
                    <th></th>
                    {App.getUserRole() === "ReconTeamLead" && <th></th>}
                  </tr>
                </thead>
                <tbody>
                  {processes?.map((item) => (
                    <tr>
                      <td>{item.Platform}</td>
                      <td>{item.ProcessName}</td>
                      <td>
                        <img
                          src={setting}
                          onClick={() => assignUserToProces(item)}
                          alt="settings"
                          className="table-action"
                        />
                      </td>
                      {App.getUserRole() === "ReconTeamLead" && (
                        <td>
                          <img
                            title="Unassign Process"
                            src={chain}
                            onClick={() => removeUserFromProcess(item)}
                            alt="settings"
                            className="table-action"
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </SummaryBox>
        </div>
      </div>
      <div
        class="modal fade"
        id="changeRole"
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
                  Assign{" "}
                  <span style={{ color: "#000" }}>{process.ProcessName}</span>{" "}
                </h2>
                <GrayCircleAvatar onClick={() => closeModal("#changeRole")}>
                  X
                </GrayCircleAvatar>
              </section>

              <Hr />
              <div className="row mt-3 px-4 pb-5">
                <div className="col-md-6">
                  <Label>Select Team</Label>
                  <Select
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                  >
                    <option value="">Select Team</option>
                    {teams?.map((team) => (
                      <option value={team.Id}>{team.Teams}</option>
                    ))}
                  </Select>
                  <div style={{ width: 170 }}>
                    <Button onClick={assignProcessToTime}>Save</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="assignUserToProcess"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-body p-0">
              <section className="py-3 d-flex align-items-center justify-content-between px-3">
                <h2 style={{ fontSize: 20, fontWeight: "bold" }}>
                  Assign user to
                  <span className="ml-2" style={{ color: "#000" }}>
                    {reconProcess.ProcessName}
                  </span>{" "}
                </h2>
                <GrayCircleAvatar
                  onClick={() => closeModal("#assignUserToProcess")}
                >
                  X
                </GrayCircleAvatar>
              </section>

              <Hr />
              <div className="row mt-3 px-4 pb-5">
                <div className="col-md-6">
                  <Label>Select User</Label>
                  <Select
                    value={recon}
                    onChange={(e) => setReconUser(e.target.value)}
                  >
                    <option value="">Select User</option>
                    {reconUsers?.map((item) => (
                      <option value={item.Id}>{item.Email}</option>
                    ))}
                  </Select>
                  <div style={{ width: 170 }}>
                    <Button onClick={assignUserToProcess}>Assign</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                  <Input
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    placeholder="Staff ID Number"
                  />
                  <Select
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                  >
                    <option value="">Select Role</option>
                    <option value="">Select Role</option>
                    <option value="TeamLead">Team Lead</option>
                    <option value="Recon">Recon</option>
                    <option value="User">User</option>
                    <option value="ReconTeamLead">Recon Team Lead</option>
                    <option value="Agent">Agent</option>
                  </Select>
                  <Select
                    value={staffTeam}
                    onChange={(e) => setStaffTeam(e.target.value)}
                  >
                    <option value="">Select Team</option>
                    {teams?.map((item, i) => (
                      <option key={i} value={item.Teams}>
                        {item.Teams}
                      </option>
                    ))}
                  </Select>
                  <div style={{ width: 170 }}>
                    <Button onClick={addUser}>Add User</Button>
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
    </Dashboard>
  );
}

export default connect(null, actions)(Proceses);

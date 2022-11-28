import React from 'react';
import Dashboard from "../hoc/Dashboard";
import {
  Header,
  SummaryBox,
  Input,
  CircleAvatar,
  Hr,
  Button,
  Select,
  FileSelect,
  ExcelSelect,
  GrayCircleAvatar,
} from "../custom";
// import UserTableRow from "../components/UserTableRow";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import App from "../services";
import Swal from "sweetalert2";
import setting from "../assets/images/settings.svg";
import { appConstants } from '../services/helpers';

function Team({ startLoading }) {
  const closeModal = (id) => {
    window.$(id).modal("hide");
  };
  // const onViewUserClick = () => {};
  const [teams, setTeam] = useState([]);
  const [team, setEditTeam] = useState({});
  const [staffId, setStaffId] = useState("");
  const [staffTeam, setStaffTeam] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [processesStatus, setProcesseStatus] = useState({});
  const [processes, setProcesses] = useState([]);
  const addUser = async (e) => {
    e.preventDefault();
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
            const teams = await App.getTeams();
            setTeam(() => [...teams]);
            startLoading(false);
            App.showNotifiction("success", ([...appConstants.maker].includes(App.getUserRole())) ? "Team creation request sent successfully" :"Team created successfully");
            console.log(response);
          } catch (error) {
            startLoading(false);
            App.logError(error);
          }
        }
      }
    });
  };
  useEffect(() => {
    async function getUsers() {
      try {
        startLoading(true);
        const response = await App.getTeams();
        // console.log(response);
        setTeam(() => [...response]);

        startLoading(false);
      } catch (error) {
        startLoading(false);
        App.logError(error);
      }
    }
    getUsers();
  }, [startLoading]);
  const viewTeam = async (team) => {
    try {
      startLoading(true);
      const response = await App.getProcessByTeam(team.Teams);
      startLoading(false);
      const status = {};
      response.forEach((item) => (status[item.Id] = true));
      setProcesseStatus(status);
      setProcesses(response);
      setEditTeam(team);
      window.$("#viewTeams").modal("show");
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };
  const unassignProcess = async (e) => {
    try {
      const ProcessIds = [];
      Object.keys(processesStatus).forEach((key) => {
        if (!processesStatus[key]) {
          ProcessIds.push(key);
        }
      });
      if (ProcessIds.length > 0) {
        startLoading(true);
        await App.unAssignProcesses(team.Id, ProcessIds);
        const response = await App.getProcessByTeam(team.Teams);
        startLoading(false);
        const status = {};
        response.forEach((item) => (status[item.Id] = true));
        setProcesseStatus(status);
        setProcesses(response);
        setEditTeam(team);
        App.showNotifiction("success", "Action successful");
      }
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };
  // const changeUserRole = (user) => {};
  return (
    <Dashboard>
      <div className="container pb-4">
        <Header>Manage Teams</Header>
        <div className="col-md-12">
          <SummaryBox style={{ padding: "16px" }}>
            <div className="row py-3 pr-3">
              <div className="d-flex w-100 justify-content-end">
                <div className="mr-3">
                  <Input disabled placeholder="search" />
                </div>
                {
                  ![appConstants.admin[1]].includes(App.getUserRole()) &&
                  <CircleAvatar onClick={createTeam}>
                    <span className="plus-icon">
                      <i className="fas fa-plus"></i>
                    </span>
                  </CircleAvatar>
                }
              </div>
            </div>
            <table className="logs-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Team</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, i) => (
                  <tr key={i}>
                    <td>{team.Teams}</td>
                    {
                      (![...appConstants.maker].includes(App.getUserRole())) &&
                    
                      <td className="mr-1" colSpan="2">
                        <img
                          src={setting}
                          onClick={() => viewTeam(team)}
                          alt="settings"
                          className="table-action"
                        />
                      </td>
                    }
                  </tr>
                  // <UserTableRow
                  //   key={team.Id}
                  //   userId={team.Teams}
                  //   onViewUserClick={() => onViewUserClick(team)}
                  //   changeUserRole={() => changeUserRole(team)}
                  // />
                ))}
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
                    {teams.map((item, i) => (
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

      <div
        class="modal fade"
        id="viewTeams"
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
                  {team.Teams} Processes
                </h2>
                <GrayCircleAvatar onClick={() => closeModal("#viewTeams")}>
                  X
                </GrayCircleAvatar>
              </section>
              <Hr />
              <div className="row py-2 px-4">
                <div className="col-md-12">
                  <div className="d-flex justify-content-end">
                    <Button onClick={unassignProcess} style={{ width: 150 }}>
                      Unassign
                    </Button>
                  </div>
                </div>
              </div>
              <div className="row mt-3 px-4 pb-5">
                <div className="col-md-12">
                  <table className="logs-table" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>Process Name</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {processes.map((team, i) => (
                        <tr key={i}>
                          <td>{team.ProcessName}</td>
                          <td className="mr-1" colSpan="2">
                            <label class="switch">
                              <input
                                onChange={() => {
                                  setProcesseStatus((status) => ({
                                    ...status,
                                    [team.Id]: !status[team.Id],
                                  }));
                                }}
                                type="checkbox"
                                checked={processesStatus[team.Id]}
                              />
                              <span class="slider round"></span>
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default connect(null, actions)(Team);

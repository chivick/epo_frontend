import Dashboard from "../hoc/Dashboard";
import React from "react";
import {
  Header,
  SummaryBox,
  Input,
  Hr,
  Button,
  Select,
  FileSelect,
  GrayCircleAvatar,
  BoxShadow,
  CircleAvatar,
  Label,
} from "../custom";
import userIcon from "../assets/images/user.svg";
import UserTableRow from "../components/UserTableRow";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import App from "../services";
import Swal from "sweetalert2";
import { appConstants, log, myFilter } from "../services/helpers";

function ISOCSuperAdminManageUsers({ startLoading }) {
  const [file, setFile] = useState(null);
  const [control, setControl] = useState(true);

  const handlePlusIconOnClick = async (e) => {
    try {
      startLoading(true);
      if (![appConstants.admin[0]] === App.getUserRole()) {
        const response = await App.getTeams();
        setTeam(() => [...response]);
      }

      startLoading(false);
      window.$("#addNewUser").modal("show");
    } catch (error) {
      // console.error(error.response);
      startLoading(false);
      App.logError(error);
    }
  };
  const browseFile = (e) => {
    e.preventDefault();
    window.$("#file-uploader").click();
  };
  const fileSelected = (e) => {
    console.log(e.target.files[0]);
    const fileDt = e.target.files[0];
    setFile(fileDt);
  };
  const closeModal = (id) => {
    window.$(id).modal("hide");
  };

  const onViewUserClick = async (user) => {
    console.log("user: ", user);
    setEditUser(user);
    setUserActive(user.IsAvaliable);
    window.$("#viewUser").modal("show");
    try {
      const response = await App.getUserFullProfile(user.Id);
      setProfile(response);
    } catch (error) {
      console.log(error);
    }
  };

  const [teams, setTeam] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [staffTeam, setStaffTeam] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [users, setUser] = useState([]);
  const [user, setEditUser] = useState({});
  const [isUserActive, setUserActive] = useState(false);
  const [allTeams, setAllTeams] = useState([]);
  const [profile, setProfile] = useState(null);
  const [orignalUsers, setOriginalUsers] = useState([]);
  const [staffDetails, setStaffDetails] = useState({});

  

  const addUser = async (e) => {
    e.preventDefault();
    if (
      staffId.trim() === "" ||
      staffRole.trim() === ""
    ) {
      App.showNotifiction(
        "error",
        "Please fill all fields. Staff ID, Staff Role and Team is required"
      );
      return;
    }
    try {
      startLoading(true);
      const response = await App.ISOCaddUser(staffId, staffRole);

      const userDt = await App.getAllUsers();
      setUser(userDt);
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
  };
  const uploadFile = async () => {
    try {
      startLoading(true);
      await App.uploadMultiplUsers(file);
      startLoading(false);
      window.$("#file-uploader").val(null);
      App.showNotifiction("success", "Action successful");
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };
  const updateUserRole = async (e) => {
    e.preventDefault();
    if (staffRole.trim() === "") {
      return App.showNotifiction("info", "Must assign user to a role");
    }
    try {
      startLoading(true);
      await App.updateUserRole(user.StaffId, staffRole);
      const userDt = await App.getAllUsers();
      setUser(userDt);
      startLoading(false);
      App.showNotifiction("success", ([...appConstants.maker].includes(App.getUserRole())) ? "Role update request sent." : "Role updated successfully");
      window.$("#changeRole").modal("hide");
    } catch (error) {
      App.logError(error);
    }
  };
  const changeUserStatus = async (user, status) => {
    try {
      startLoading(true);
      await App.changeUserAvailiability(user.Id, status);
      // window.$("#viewUser").modal("hide");
      const userDt = await App.getAllUsers();
      setUser(userDt);
      startLoading(false);
      if (appConstants.maker.includes(App.getUserRole())) {
        App.showNotifiction("success", "Request sent successful");
      }
      else {
        App.showNotifiction("success", "Action successful");
      }
      
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };

  useEffect(() => {
    startLoading(true);
    getRoles();
    async function getUsers() {
      try {
        // startLoading(true);
        const userDt = await App.getAllUsers();
        console.log(userDt);
        // getAllTeams();
        startLoading(false);
        setUser(userDt);
        setOriginalUsers(userDt);
      } catch (error) {
        startLoading(false);
        App.logError(error);
      }
      finally {
        startLoading(false);
      }
    }
    getUsers();
  }, [setUser, startLoading]);

  const changeUserRole = (user) => {
    window.$("#changeRole").modal("show");
    setEditUser(user);
    console.log(user.Role);
    setStaffRole(user.Role);
  };

  const deleteUserClick = async (user) => {
    try {
      Swal.fire({
        icon: "info",
        title: `Delete User`,
        text: `Do you want to delete user - ${user.StaffId}?`,
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: `Yes`,
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          // const isConfirmed = window.confirm(`Delete ${user.StaffId}?`);
          startLoading(true);
          await App.deleteUser(user.StaffId, user.Role).finally(() => {startLoading(false)});
          const userDt = await App.getAllUsers();
          setUser(userDt);
          startLoading(false);
          App.showNotifiction("success", "Delete request sent.");
        }
      });
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
    finally {
      startLoading(false);
    }
  };

  //function to getRole and show controls
  const getRoles = () => {
    if (App.getUserRole() === "TeamLead") {
      setControl(false);
    }
  };

  //get available user teams
  const getAllTeams = async () => {
    try {
      const response = await App.getTeams();
      setAllTeams(response);
    } catch (error) {
      console.log("An error occured");
    }
  };

  //update user team
  /**
   *
   * @param {e} event object
   */
  const updateUserTeam = async (e) => {
    e.preventDefault();
    if (staffTeam.trim() === "" || staffTeam === "Select team") {
      return App.showNotifiction("info", "Must assign user to a team");
    }
    try {
      startLoading(true);
      await App.addUserToTeam({ StaffId: user.StaffId, Team: staffTeam });
      const userDt = await App.getAllUsers();
      setUser(userDt);
      startLoading(false);
      App.showNotifiction("success", ([...appConstants.maker].includes(App.getUserRole())) ? "Team update request sent" : "Team updated successfully");
      window.$("#changeRole").modal("hide");
    } catch (error) {
      App.logError(error);
    }
  };

  // function to remove user from a team
  /**
   *
   * @param {team} user team parameter to remove user from a team
   */
  const removeUser = async (team) => {
    try {
      startLoading(true);
      await App.removeUserFromTeam(user.Id, team);
      const userDt = await App.getAllUsers();
      setUser(userDt);
      startLoading(false);
      App.showNotifiction("success", "User removed from team");
      // window.$("#changeRole").modal("hide");
    } catch (error) {
      console.log(error);
      App.logError(error);
      startLoading(false);
    }
  };

  const filterUsers = (value) => {
    if (value) {
      setUser(myFilter(orignalUsers, value, "Role", "includes", ["FullName", "Email", "Role"]));
    }
    else {
      setUser(orignalUsers);
    }
  }

  const validateUser = () => {
    startLoading(true);
    App.validateStaffId(staffId).then(response => {
      if (response) {
        // do sth
        setStaffDetails(response);
      }
    }).finally(() => startLoading(false))
  }

  return (
    <Dashboard>
      <div className="container pb-4">
        <Header>Manage Users</Header>
        <div className="col-md-12">
          <SummaryBox style={{ padding: "16px" }}>
            <div className="row py-3 pr-3">
              <div className="d-flex w-100 justify-content-end">
                <div className="mr-3">
                  <Input placeholder="search" onChange={(e) => filterUsers(e.target.value)} />
                </div>
                {
                  ![appConstants.admin[1]].includes(App.getUserRole()) &&
                  <CircleAvatar onClick={handlePlusIconOnClick}>
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
                  <th>User ID</th>
                  <th>Full name</th>
                  <th>EMail</th>
                  <th>Role</th>
                  <th>Active Status</th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  
                  if ([appConstants.admin[0], appConstants.maker[0], appConstants.checker[0], appConstants.audit[0]].includes(user.Role)) {
                  return ( <UserTableRow
                    key={user.Id}
                    userId={user.StaffId}
                    fullName={`${user.FullName}`}
                    email={user.Email}
                    phoneNumber={user.Role}
                    showControl={control}
                    city={user.IsAvaliable ? "Active" : "InActive"}
                    onViewUserClick={() => onViewUserClick(user)}
                    changeUserRole={() => changeUserRole(user)}
                    deleteUserClick={[appConstants.admin[0]].includes(App.getUserRole()) ? () => deleteUserClick(user) : undefined}
                  />)
                }})}
              </tbody>
            </table>
            <div className="pagination"></div>
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
                  Reassign{" "}
                  <span style={{ color: "#000" }}>
                    {user.FirstName} {user.LastName}
                  </span>{" "}
                  Role
                </h2>
                <GrayCircleAvatar onClick={() => closeModal("#changeRole")}>
                  X
                </GrayCircleAvatar>
              </section>

              <Hr />
              <div className="row mt-3 px-4 pb-5">
                <div className="col-md-6">
                  <Select
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                  >
                    <option value="">Select Role</option>
                    {
                      [...appConstants.admin].includes(App.getUserRole()) &&
                      <>
                        <option value={appConstants.checker[0]}>ISOD Checker</option>
                        <option value={appConstants.maker[0]}>ISOD Maker</option>
                        {/* <option value={appConstants.audit[0]}>Audit</option> */}
                      </>
                    }
                  </Select>
                  <div style={{ width: 170 }}>
                    <Button onClick={updateUserRole}>Update</Button>
                  </div>
                </div>
                {
                  [...appConstants.maker].includes(App.getUserRole()) &&
                  <div className="col-md-6">
                    <Select
                      value={staffTeam}
                      onChange={(e) => setStaffTeam(e.target.value)}
                    >
                      {[{ Teams: "Select team" }, ...allTeams].map((e, i) => (
                        <option value={e.Teams}>{e.Teams}</option>
                      ))}
                      {/* <option value="">Select User</option>
                      <option value="TeamLead">Team Lead</option>
                      <option value="Recon">Recon</option>
                      <option value="User">User</option>
                      <option value="ReconTeamLead">Recon Team Lead</option> */}
                      {/* <option value="Agent">Agent</option> */}
                      {/* <option value="Admin">Admin</option> */}
                    </Select>
                    <div style={{ width: 170 }}>
                      <Button onClick={updateUserTeam}>Update User</Button>
                    </div>
                  </div>
                }
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
                    {/* <option value="">Select Role</option> */}
                    {
                      [...appConstants.admin].includes(App.getUserRole()) &&
                      <>
                      
                        <option value={appConstants.maker[0]}>ISOD Maker</option>
                        <option value={appConstants.checker[0]}>ISOD Checker</option>
                        {/* <option value={appConstants.audit[0]}>Audit</option> */}
                      </>
                    }
                    {/* <option value="Agent">Agent</option> */}
                  </Select>
                  {
                    
                    [appConstants.maker[0]].includes(App.getUserRole()) &&
                  
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
                  <div style={{ width: 170 }}>
                    <Button onClick={addUser}>Add User</Button>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    {/* <div className="d-flex">
                      <FileSelect onClick={browseFile}>Browse files</FileSelect>
                      <span
                        className="pt-2"
                        style={{ fontWeight: 500, fontSize: 14 }}
                      >
                        {file && file.name}
                      </span>
                      <input
                        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        id="file-uploader"
                        type="file"
                        style={{ display: "none" }}
                        onChange={fileSelected}
                      /> */}
                      {/* <ExcelSelect>Choose Excel file</ExcelSelect> */}
                    {/* </div> */}
                  </div>
                  <div className="row py-3">
                    {/* <div style={{ width: 160 }}>
                      <Button onClick={uploadFile}>Upload</Button>
                    </div> */}
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
                  User Details
                </h2>
                <GrayCircleAvatar onClick={() => closeModal("#viewUser")}>
                  X
                </GrayCircleAvatar>
              </section>
              {profile ? (
                <React.Fragment>
                  <div className="row mt-3 px-4 pb-5">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <img
                          src={userIcon}
                          alt="user-icon"
                          className="user-photo mr-3"
                        />
                        <div>
                          <h3 className="font-weight-bold">
                            {user?.FullName || "N/A"}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row">
                        <div className="col-md-6">
                          <BoxShadow
                            className="py-2 px-2"
                            style={{
                              backgroundColor: "#EAAA00",
                              borderTopRightRadius: 4,
                              color: "#fff",
                              borderTopLeftRadius: 4,
                            }}
                          >
                            <div className="d-flex justify-content-between py-2 px-3">
                              <div className="counter-summary">
                                <h4 style={{ fontSize: 12, color: "#fff" }}>
                                  Resolved
                                </h4>
                                <h5 style={{ fontSize: 12, color: "#fff" }}>
                                  Disputes
                                </h5>
                              </div>
                              <div className="d-flex counter-report align-items-center">
                                <h4 style={{ fontSize: 12, color: "#fff" }}>
                                  {profile?.ResolvedCount}
                                </h4>
                              </div>
                            </div>
                          </BoxShadow>
                        </div>
                        <div className="col-md-6">
                          <BoxShadow
                            className="py-2 px-2"
                            style={{
                              backgroundColor: "#022E64",
                              color: "#fff",
                              borderTopRightRadius: 4,
                              borderTopLeftRadius: 4,
                            }}
                          >
                            <div className="d-flex justify-content-between py-2 px-3">
                              <div className="counter-summary">
                                <h4 style={{ fontSize: 12, color: "#fff" }}>
                                  Unresolved
                                </h4>
                                <h5 style={{ fontSize: 12, color: "#fff" }}>
                                  Disputes
                                </h5>
                              </div>
                              <div className="d-flex counter-report align-items-center">
                                <h4 style={{ fontSize: 12, color: "#fff" }}>
                                  {profile?.UnresolvedCount}
                                </h4>
                              </div>
                            </div>
                          </BoxShadow>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3 px-4 pb-5">
                    <div className="col-md-6">
                      <div className="row">
                        <div className="col-md-6">
                          <Label style={{ fontWeight: 400, marginBottom: 4 }}>
                            Staff Id
                          </Label>
                          <Header style={{ fontSize: 13, marginTop: 4 }}>
                            {profile?.User?.StaffId || "N/A"}
                          </Header>
                        </div>
                        <div className="col-md-6">
                          <Label style={{ fontWeight: 400, marginBottom: 4 }}>
                            Email
                          </Label>
                          <Header style={{ fontSize: 13, marginTop: 4 }}>
                            {profile.User.Email}
                          </Header>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <Label style={{ fontWeight: 400, marginBottom: 4 }}>
                            Team
                          </Label>
                          <Header style={{ fontSize: 13, marginTop: 4 }}>
                            {profile?.Team?.join() || "N/A"}
                          </Header>
                        </div>
                        <div className="col-md-6">
                          <Label style={{ fontWeight: 400, marginBottom: 4 }}>
                            Role
                          </Label>
                          <Header style={{ fontSize: 13, marginTop: 4 }}>
                            {profile.User.Role}
                          </Header>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="userList">
                    {
                      [appConstants.maker[0], "Admin"].includes(App.getUserRole()) &&
                      profile?.Team.map((e, i) => (
                        <div
                          key={i}
                          className="d-flex justify-content-between p-3"
                        >
                          <p>{e}</p>
                          <button
                            className="btn btn-danger"
                            onClick={() => removeUser(e)}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    }
                  </div>
                </React.Fragment>
              ) : (
                <p className="text-center">
                  Could not get user profile try again
                </p>
              )}
              <div className="user-teams"></div>
              <div className="row mt-3 px-4 pb-5">
                <div className="ml-2" style={{ width: 150 }}>
                  {/* <Button>Edit</Button> */}
                  {/* <Header
                    style={{ fontSize: 13, marginBottom: 0, marginTop: 0 }}
                  >
                    Active
                  </Header> */}

                  {/* <div className="pt-2">
                    <label class="switch">
                      <input
                      disabled={![...appConstants.maker].includes(App.getUserRole())}
                        onChange={() => {
                          if (
                            [...appConstants.maker, "TeamLead", "Admin", "ReconTeamLead"].includes(App.getUserRole())
                          ) {
                            changeUserStatus(user, !isUserActive);
                            // setUserActive((isActive) => !isActive);
                          }
                        }}
                        type="checkbox"
                        checked={isUserActive}
                      />
                      <span class="slider round"></span>
                    </label>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default connect(null, actions)(ISOCSuperAdminManageUsers);

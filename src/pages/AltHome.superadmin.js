import React from "react";
import Dashboard from "../hoc/Dashboard";
import { Header, SummaryBox, Button, YellowBox, CircleAvatar, GrayCircleAvatar, Hr, Input, Select, FileSelect } from "../custom";
import { Link } from "react-router-dom";
import LogRow from "../components/LogsRow";
import * as actions from "../actions";
import App from "../services";

const {startLoading,} = actions;

export default class AltHomeSuperAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      users: [
        {
          firstName: "James", lastName: "Ade", date: new Date().toDateString(),
        },
        {
          firstName: "Chukwudi", lastName: "Obi", date: new Date().toDateString(),
        },
        {
          firstName: "Micheal", lastName: "Austine", date: new Date().toDateString(),
        },
        {
          firstName: "Musa", lastName: "Garba", date: new Date().toDateString(),
        }
      ],
      teams: [],
      resp: false,
      file: false,
      staffId: "",
      staffRole: "",
      staffTeam: "",
    }
  }

  componentDidMount() {
    this.init();
    this.download = React.createRef();
  }

  init = async () => {
    startLoading(true);
    const logDt = JSON.parse(App.getFromLocalStorage("fb-logs"));
    const logTrx = [];
    Object.keys(logDt).forEach((key) => {
      logTrx.push({ id: key, logs: logDt[key], title: "Logs Report" });
    });
    const recentLogs = logTrx.splice(0, 10);

    const response = await App.getDashboardSettings();
    const {
      TotalAssigned,
      TotalResolvedCount,
      TotalUnresolved,
      UserCount,
    } = response;

    this.setState({
      userCount: UserCount,
      totalAssigned: TotalAssigned,
      totalResolvedCount: TotalResolvedCount,
      totalUnresolved: TotalUnresolved,
    });

    startLoading(false);
  }

  handlePlusIconOnClick = async (e) => {
    try {
      startLoading(true);
      const response = await App.getTeams();
      this.setState({teams: [...response]});
      startLoading(false);
      window.$("#addNewUser").modal("show");
    } catch (error) {
      // console.error(error.response);
      startLoading(false);
      App.logError(error);
    }
  };

  closeModal = (id) => {
    this.setState({file: null});
    this.setState({resp: ""});
    if (this.state.resErr) {
      console.log(true);
      window.URL.revokeObjectURL(this.download.current.href);
    }
    this.setState({resErr: false});
    window.$(id).modal("hide");
    window.$("#example").DataTable().destroy();
    // document.getElementById("file-uploader").value = "";
  };

  addUser = async (e) => {
    e.preventDefault();
    if (
      this.staffId.trim() === "" ||
      this.staffRole.trim() === "" ||
      this.staffTeam.trim() === ""
    ) {
      App.showNotifiction(
        "error",
        "Please fill all fields. Staff ID, Staff Role and Team is required"
      );
      return;
    }
    try {
      const { staffId, staffTeam, staffRole } = this.state;
      startLoading(true);
      const response = await App.addUser(staffId, staffTeam, staffRole);
      startLoading(false);
      App.showNotifiction("success", "User created successfully");
      this.setState({staffId: ""});
      this.setState({staffRole: ""});
      this.setState({staffTeam: ""});
      console.log(response);
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };

  uploadMultipleUserFile = async (e) => {
    e.preventDefault();
    try {
      startLoading(true);
      await App.uploadMultiplUsers(this.state.file);
      startLoading(false);
      window.$("#file-uploader").val(null);
      App.showNotifiction("success", "Action successful");
      e.target.reset();
      this.setState({file: null});
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };

  browseFileUser = (e) => {
    e.preventDefault();
    window.$("#file-uploader2").click();
  };

  fileSelectedUser = (e) => {
    console.log(e.target.files[0]);
    const fileDt = e.target.files[0];
    this.setState({file: fileDt});
  };

  render () {
    const {
      userCount, totalResolvedCount, totalAssigned, totalUnresolved,
      staffId, staffRole, staffTeam, teams
    } = this.state;
    return (
      <Dashboard>
        <div className="container py-3">
          <Header>Overview</Header>
          <div className="row">
            <div className="col-md-4"> 
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
                    <Link to="#">see more</Link>
                  </div>
                </SummaryBox>
              </div>
            </div>
            <div className="col-md-3 px-2">
              <YellowBox className="" style={{ height: 92 }}>
                <div className="d-flex yellow-box-action justify-content-end py-2 px-3">
                  <div className="counter-summary">
                    <h5>Profile a new user</h5>
                  </div>
                  <CircleAvatar onClick={(e) => this.handlePlusIconOnClick(e)}>
                    <span className="plus-icon">
                      <i className="fas fa-plus"></i>
                    </span>
                  </CircleAvatar>
                </div>
              </YellowBox>
            </div>
          </div>
          <Header>ISODs</Header>
          <div className="row">
            <div className="col-md-6">
              <SummaryBox style={{ padding: "10px 16px" }}>
                <div className="d-flex justify-content-end">
                  <div style={{ width: 100 }}>
                    <Button>see all</Button>
                  </div>
                </div>

                <table className="logs-table" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Second Name</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.users.map((user, index) => {
                        return (
                          <LogRow
                            key={index}
                            status={user.firstName}
                            type={user.lastName}
                            date={user.date}
                          />
                        );
                      })
                    }
                    
                  </tbody>
                </table>
              </SummaryBox>
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
                      <GrayCircleAvatar onClick={() => this.closeModal("#addNewUser")}>
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
                          onChange={(e) => this.setState({staffId: e.target.value})}
                          placeholder="Staff ID Number"
                        />
                        <Select
                          value={staffRole}
                          onChange={(e) => this.set({staffRole: e.target.value})}
                        >
                          <option value="">Select Role</option>
                          <option value="Checker">Checker</option>
                          <option value="Maker">Recon</option>
                        </Select>
                        {/* <Select
                          value={staffTeam}
                          onChange={(e) => this.set({staffTeam: e.target.value})}
                        >
                          <option value="">Select Team</option>
                          {teams.map((item, i) => (
                            <option key={i} value={item.Teams}>
                              {item.Teams}
                            </option>
                          ))}
                        </Select> */}
                        <div style={{ width: 170 }}>
                          <Button onClick={this.addUser}>Add User</Button>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <form onSubmit={this.uploadMultipleUserFile}>
                          <div className="row">
                            <div className="d-flex">
                              <FileSelect onClick={this.browseFileUser}>
                                Browse files
                              </FileSelect>
                              <span
                                className="pt-2"
                                style={{ fontWeight: 500, fontSize: 14 }}
                              >
                                {console.log(this.state.file)}
                                {this.state.file && this.state.file.name}
                              </span>
                              <input
                                accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                id="file-uploader2"
                                type="file"
                                style={{ display: "none" }}
                                onChange={this.fileSelectedUser}
                              />
                            </div>
                          </div>
                          <div className="row py-3">
                            <div style={{ width: 160 }}>
                              <Button>Upload</Button>
                            </div>
                          </div>
                        </form>
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
}

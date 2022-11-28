import React, { useEffect, useState } from "react";
import Dashboard from "../hoc/Dashboard";
import { SummaryBox, BoxShadow, Header, Label, Input, Button } from "../custom";
import { Link } from "react-router-dom";
import App from "../services";
import { connect } from "react-redux";
import * as actions from "../actions";

function Settings({ startLoading }) {
  const [arbiterUsername, setArbiterUsername] = useState("");
  const [arbirterPassword, setArbiterPassword] = useState("");
  const [backgroundService, setBackgroundService] = useState(false);
  const [udpmPassword, setUdpmPassword] = useState("");
  const [udpmUsername, setUdpUsername] = useState("");
  const [smtpUsername, setSmtpUsername] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [masterComPassword, setMasterComPassword] = useState("");
  const [masterComUsername, setMasterComUsername] = useState("");
  const [systemResolve, setSystemResolve] = useState(false);
  const [LoginExpiry, setLoginExpiry] = useState("");
  const [FailedAttempts, setFailedAttempts] = useState(3);
  const [MaximumInactiveDuration, setMaximumInactiveDuration] = useState(3);

  
  useEffect(() => {
    const getAllSettings = async () => {
      try {
        startLoading(true);
        const response = await App.getAllSettings();
        startLoading(false);
        const udpmValues = atob(response.UPDMCredentials).split(":");
        const artberValues = atob(response.ArbiterCredentials).split(":");
        const smtpValues = response.SmtpCrendtials
          ? atob(response.SmtpCrendtials).split(":")
          : ["", ""];
        const masterComValues = response.MastercomCredentials
          ? atob(response.MastercomCredentials).split(":")
          : ["", ""];
        setBackgroundService(response.BackgroundService);
        setArbiterUsername(artberValues[0]);
        setArbiterPassword(artberValues[1]);
        setUdpUsername(udpmValues[0]);
        setUdpmPassword(udpmValues[1]);
        setSmtpUsername(smtpValues[0]);
        setSmtpPassword(smtpValues[1]);
        setMasterComUsername(masterComValues[0]);
        setMasterComPassword(masterComValues[1]);
        setSystemResolve(response.SystemResolve);
        setLoginExpiry(response.LoginExpiry);
        
        if (response.FailedAttempts) {
          setFailedAttempts(response.FailedAttempts);
        }

        if (response.MaximumInactiveDuration) {
          setMaximumInactiveDuration(response.MaximumInactiveDuration);
        }
        
        // console.log(response.LoginExpiry);
        
      } catch (error) {
        startLoading(false);
        App.logError(error);
      }
    };
    getAllSettings();
  }, [startLoading]);
  const handleFormSubmit = async (e) => {
    try {
      startLoading(true);
      await App.updateSettings(
        "ArbiterCredentials",
        btoa(`${arbiterUsername}:${arbirterPassword}`)
      );
      await App.updateSettings("BackgroundService", backgroundService);
      await App.updateSettings(
        "UPDMCredentials",
        btoa(`${udpmUsername}:${udpmPassword}`)
      );
      await App.updateSettings(
        "SmtpCrendtials",
        btoa(`${smtpUsername}:${smtpPassword}`)
      );
      await App.updateSettings(
        "MastercomCredentials",
        btoa(`${masterComUsername}:${masterComPassword}`)
      );
      await App.updateSettings("SystemResolve", systemResolve);
      await App.updateSettings("LoginExpiry", LoginExpiry);
      await App.updateSettings("FailedAttempts", FailedAttempts);
      await App.updateSettings("MaximumInactiveDuration", MaximumInactiveDuration);
      startLoading(false);
      App.showNotifiction("success", "Settings updated successfully");
    } catch (error) {
      startLoading(false);
      console.log(error.response);
      App.logError(error);
      // App.showNotifiction("error", "some erros were encountered");
    }
  };
  return (
    <Dashboard>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-12">
            <SummaryBox
              className=""
              style={{ maxHeight: "75vh", height: "75vh", overflowX: "hidden" }}
            >
              <div className="row h-100">
                <div className="col-md-2 h-100">
                  <BoxShadow className="bg-white h-100 py-5 d-flex align-items-center logs-menu">
                    <ul>
                      {App.getUserRole() === "Admin" && (
                        <>
                          <li>
                            <Link style={{ color: "#000" }} to="/logs">
                              Logs
                            </Link>
                          </li>

                          <li>
                            <Link style={{ color: "#000" }} to="/audit-trail">
                              Audit Trail
                            </Link>
                          </li>

                          {/* <li>Reports</li> */}
                          {/* <li>Notification</li> */}
                          <li className="active">
                            <Link style={{ color: "#000" }} to="#">
                              Settings
                            </Link>
                          </li>
                          <li>
                            <Link style={{ color: "#000" }} to="/report">
                              Report
                            </Link>
                          </li>
                          <li>
                            <Link style={{ color: "#000" }} to="/mail-logs">
                              Mail Logs
                            </Link>
                          </li>
                          <li>
                            <Link style={{ color: "#000" }} to="/expired-queue">
                              Expired queue
                            </Link>
                          </li>
                          <li>
                            <Link
                              style={{ color: "#000" }}
                              to="/mastercom-setting"
                            >
                              Mastercom setting
                            </Link>
                          </li>
                        </>
                      )}
                      {App.getUserRole() === "ReconTeamLead" && (
                        <li>
                          <Link style={{ color: "#000" }} to="/ftp-settings">
                            FTP Settings
                          </Link>
                        </li>
                      )}
                      {App.getUserRole() === "ReconTeamLead" && (
                        <li>
                          <Link style={{ color: "#000" }} to="/view-exceptions">
                            View Exceptions
                          </Link>
                        </li>
                      )}
                    </ul>
                  </BoxShadow>
                </div>
                <div
                  className="col-md-10"
                  style={{ height: "100%", overflowY: "scroll" }}
                >
                  <div className="px-1 py-2">
                    <Header className="mb-2">Settings</Header>
                  </div>
                  <div className="row px-3">
                    <div className="col-md-6">
                      <Label>Arbiter Username</Label>
                      <Input
                        placeholder="Username"
                        value={arbiterUsername}
                        onChange={(e) => setArbiterUsername(e.target.value)}
                      />
                      {/* <Input />
                      <Input /> */}
                    </div>
                    <div className="col-md-6">
                      <Label>Arbiter Password</Label>
                      <Input
                        value={arbirterPassword}
                        onChange={(e) => setArbiterPassword(e.target.value)}
                        type="password"
                      />
                      {/* <Input type="password" />
                      <Input type="password" /> */}
                    </div>
                  </div>
                  <div className="row px-3">
                    <div className="col-md-6">
                      <Label>UDPM Username</Label>
                      <Input
                        placeholder="Username"
                        value={udpmUsername}
                        onChange={(e) => setUdpUsername(e.target.value)}
                      />
                      {/* <Input />
                      <Input /> */}
                    </div>
                    <div className="col-md-6">
                      <Label>UDPM Password</Label>
                      <Input
                        value={udpmPassword}
                        onChange={(e) => setUdpmPassword(e.target.value)}
                        type="password"
                      />
                      {/* <Input type="password" />
                      <Input type="password" /> */}
                    </div>
                  </div>

                  <div className="row px-3">
                    <div className="col-md-6">
                      <Label>SMTP Username</Label>
                      <Input
                        placeholder="Username"
                        value={smtpUsername}
                        onChange={(e) => setSmtpUsername(e.target.value)}
                      />
                      {/* <Input />
                      <Input /> */}
                    </div>
                    <div className="col-md-6">
                      <Label>SMTP Password</Label>
                      <Input
                        value={smtpPassword}
                        onChange={(e) => setSmtpPassword(e.target.value)}
                        type="password"
                      />
                      {/* <Input type="password" />
                      <Input type="password" /> */}
                    </div>
                  </div>

                  <div className="row px-3">
                    <div className="col-md-6">
                      <Label>MasterCom Username</Label>
                      <Input
                        placeholder="Username"
                        value={masterComUsername}
                        onChange={(e) => setMasterComUsername(e.target.value)}
                      />
                      {/* <Input />
                      <Input /> */}
                    </div>
                    <div className="col-md-6">
                      <Label>MasterCom Password</Label>
                      <Input
                        value={masterComPassword}
                        onChange={(e) => setMasterComPassword(e.target.value)}
                        type="password"
                      />
                      {/* <Input type="password" />
                      <Input type="password" /> */}
                    </div>
                  </div>

                   <div className="row my-2 px-3">
                    <div className="col-md-6">
                      <Label>Session Parameters</Label>
                      <div className="d-flex ">
                        <Input
                          value={LoginExpiry}
                          style={{ flex: 1 }}
                          className="mr-3"
                          onChange={(e) => setLoginExpiry(e.target.value)}
                        />
                        <span style={{ flex: 3, fontSize: 13, marginTop: 12 }}>
                          minutes until login session expires
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <Label>Failed Attempts</Label>
                      <div className="d-flex ">
                        <Input
                          value={FailedAttempts}
                          style={{ flex: 1 }}
                          className="mr-3"
                          onChange={(e) => setFailedAttempts(e.target.value)}
                        />
                        <span style={{ flex: 3, fontSize: 13, marginTop: 12 }}>
                          how many failed attempts before locking account
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="row my-2 px-3">
                    <div className="col-md-6">
                      <Label>Inactive Period</Label>
                      <div className="d-flex ">
                        <Input
                          value={MaximumInactiveDuration}
                          style={{ flex: 1 }}
                          className="mr-3"
                          onChange={(e) => setMaximumInactiveDuration(e.target.value)}
                        />
                        <span style={{ flex: 3, fontSize: 13, marginTop: 12 }}>
                          Maximum duration (days) for inactive accounts
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                    </div>
                  </div> 
                  <div className="row my-2 px-3">
                    <div className="col-md-6">
                      <Label>Background Service</Label>

                      <div>
                        <label class="switch">
                          <input
                            type="checkbox"
                            checked={backgroundService}
                            onChange={(e) =>
                              setBackgroundService((state) => !state)
                            }
                          />
                          <span class="slider round"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row my-2 px-3">
                    <div className="col-md-6">
                      <Label>System Resolve</Label>

                      <div>
                        <label class="switch">
                          <input
                            type="checkbox"
                            checked={systemResolve}
                            onChange={(e) =>
                              setSystemResolve((state) => !state)
                            }
                          />
                          <span class="slider round"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row my-4 px-4">
                    <div style={{ width: 120 }}>
                      <Button onClick={handleFormSubmit}>Save</Button>
                    </div>
                  </div>
                </div>
              </div>
            </SummaryBox>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default connect(null, actions)(Settings);

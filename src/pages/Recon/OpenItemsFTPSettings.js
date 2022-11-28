import React, { useState } from "react";
import Dashboard from "../../hoc/Dashboard";
import {
  SummaryBox,
  BoxShadow,
  Header,
  Label,
  Input,
  Button,
  Select,
} from "../../custom";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions";

import App from "../../services";
import FTPNav from "./../FTPNav";

function OpenItemsFTPSettings({ startLoading }) {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [source, setSource] = useState("");
  const [process, setProcess] = useState("");

  const saveForm = async (e) => {
    try {
      e.preventDefault();
      if (
        (userName.trim() === "" ||
          password.trim() === "" ||
          ipAddress.trim() === "" ||
          source.trim() === "" ||
          process.trim() === "")
      ) {
        return App.showNotifiction("info", "Please fill all fields");
      }

      startLoading(true);
      await App.registerFTPSettings(
        userName,
        password,
        ipAddress,
        source,
        process,
        "n/a"
      );
      startLoading(false);
      setIpAddress("");
      setUsername("");
      setPassword("");
      setSource("");
      setProcess("");
      startLoading(false);
      App.showNotifiction("success", "Settings saved successfully");
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };

  console.log("role", App.getUserRole());

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
                    <FTPNav />
                  </BoxShadow>
                </div>
                <div
                  className="col-md-10 pr-5"
                  style={{ height: "100%", overflowY: "scroll" }}
                >
                  <div className="px-1 py-2">
                    <Header className="mb-2">Open Items FTP Settings</Header>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <Label>process</Label>
                      <Select
                        value={process}
                        onChange={(e) => setProcess(e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="FailedAgencyBanking">Agency Banking</option>
                        <option value="FailedATM">ATM</option>
                        <option value="FailedPOS">Web/Pos</option>
                      </Select>
                    </div>
                    <div className="col-md-6">
                      <Label>Username</Label>
                      <Input
                        value={userName}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <Label>IP Address</Label>
                      <Input
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        placeholder="Ip address"
                      />
                    </div>
                    <div className="col-md-6">
                      <Label>Password</Label>
                      <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password"
                        type="password"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <Label>Remote Source Path</Label>
                      <Input
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        placeholder="Remote Source Path"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <Button onClick={saveForm} style={{ maxWidth: 170 }}>
                      Save
                    </Button>
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

export default connect(null, actions)(OpenItemsFTPSettings);

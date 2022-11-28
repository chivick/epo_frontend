import React, { useState, useEffect } from "react";
import Dashboard from "../hoc/Dashboard";
import {
  SummaryBox,
  BoxShadow,
  Header,
  Label,
  FileSelect,
  Button,
  Select,
} from "../custom";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";

import App from "../services";
import FTPNav from "./FTPNav";

function UploadSettleFIle({ startLoading }) {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState([]);
  const [processName, setProcessName] = useState("");
  const [userProcesses, setUserProcesses] = useState("");

  useEffect(() => {
    const getSettlements = async () => {
      try {
        startLoading(true);
        const response2 = await App.getReconUserProcesses();
        console.log("response2: ", response2);
        setFileType(response2);
        setProcessName(response2[0].ProcessName);
        startLoading(false);
      } catch (error) {
        startLoading(false);
        App.logError(error);
      }
    };
    getSettlements();
  }, []);

  const saveForm = async (e) => {
    e.preventDefault();
    try {
      e.preventDefault();
      if (!file || processName.trim() === "" || userProcesses.trim() === "") {
        return App.showNotifiction(
          "info",
          "please select file type and upload file"
        );
      }
      startLoading(true);
      await App.uploadSettlmentFile(userProcesses, file, processName);
      App.showNotifiction("success", "Settings saved successfully");
      e.target.reset();
      setFile(null);
      startLoading(false);
    } catch (error) {
      startLoading(false);
      console.log(error);
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
                  <form onSubmit={saveForm}>
                    <div className="px-1 py-2">
                      <Header className="mb-2">Upload Settlement File</Header>
                    </div>
                    <div className="row px-3">
                      <div className="col-md-12">
                        <Label>Process Name</Label>
                        <Select
                          value={userProcesses}
                          onChange={(e) => setUserProcesses(e.target.value)}
                        >
                          <option value=""> Select Process</option>
                          <option value="SettlementReport">
                            SettlementReport
                          </option>
                          {/* <option value="FailedReport">FailedReport</option> */}
                        </Select>
                      </div>
                      <div className="col-md-12">
                        <Label>File Type</Label>
                        <Select
                          value={processName}
                          onChange={(e) => setProcessName(e.target.value)}
                        >
                          <option value=""> Select Process</option>
                          {fileType.length > 0 &&
                            fileType.map((item, i) => (
                              <option value={item.ProcessName} key={i}>
                                {item.ProcessName}
                              </option>
                            ))}
                        </Select>
                      </div>
                    </div>
                    <div className="row px-3 pb-2">
                      <div className="col-md-12">
                        <Header>Upload File</Header>
                        <FileSelect onClick={browseFile}>
                          Browse files
                        </FileSelect>
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
                        />
                      </div>
                    </div>
                    <div className="row px-3 pt-2">
                      <div className="col-md-6">
                        <Button style={{ maxWidth: 170 }}>Save</Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </SummaryBox>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default connect(null, actions)(UploadSettleFIle);

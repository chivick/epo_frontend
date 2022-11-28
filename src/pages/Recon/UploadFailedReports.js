import React, { useState, useEffect } from "react";
import Dashboard from "../../hoc/Dashboard";
import {
  SummaryBox,
  BoxShadow,
  Header,
  Label,
  Input,
  Button,
  Select,
  FileSelect,
} from "../../custom";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions";

import App from "../../services";
import GRUNav from "../../navbars/GRUNav";
import { dataTableItem } from "../../services/helpers";
import moment from 'moment';

function UploadFailedReports({ startLoading }) {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [itemFetched, setitemFetched] = useState(false);
  const [source, setSource] = useState([]);

  const [process, setProcess] = useState("");
  const [ssh, setSSH] = useState("");
  const [file, setFile] = useState({});


  const browseFile = (e) => {
    e.preventDefault();
    window.$("#file-uploader").val("");
    window.$("#file-uploader").files = [];

    window.$("#file-uploader").click();
    console.log("BrowseFile");
    //atm-file-uploader
  };
  
  const submitForm = async (e) => {
    try {
      e.preventDefault();
      if (process.trim() === "") {
        return App.showNotifiction("info", "Please fill all fields");
      }

      if (file === null) {
        return App.showNotifiction("info", "Please fill all fields");
      }

      startLoading(true);

      let data = new FormData();
      data.append("File", file);

      App.postRequestFile("Recon/UploadFailedReportFile?process=" + process , data).then(result => {
        if (result && result.status) {
          App.showNotifiction("success", result.message);
        }
        else if (result && !result.status) {
          App.showNotifiction("error", result.message);
        }
        else {
          App.showNotifiction("error", "An error occurred, try again later");
        }
      }).catch(err => {
        console.log(err);
        err = JSON.parse(err.Message);
        
        App.showNotifiction("error", err.Message);
      }).finally(() => startLoading(false));
      
      // setProcess("");
      
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };

  const fileSelected = (e) => {
    console.log("File Selected");
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
                    <GRUNav />
                  </BoxShadow>
                </div>
                <div
                  className="col-md-10 pr-5"
                  style={{ height: "100%", overflowY: "scroll" }}
                >
                  <div className="px-1 py-2">
                    <Header className="mb-2">Failed Items Report</Header>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <Label>Select Process</Label>
                      <Select
                        value={process}
                        onChange={(e) => setProcess(e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="FailedReportFailedAgency">Agency Banking</option>
                        <option value="FailedReportExtraSwitch">ExtraSwitch</option>
                        <option value="FailedReportMastercard">NREC</option>
                        <option value="FailedReportVisa">Visa NOU</option>
                        {/* <option value="FailedReportVisa">Visa NOU</option> */}
                        
                      </Select>
                    </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <FileSelect onClick={browseFile}>Browse files</FileSelect>
                            <span
                                className="pt-2"
                                style={{ fontWeight: 500, fontSize: 14 }}
                            >
                                {console.log(file)}
                                {file && file.name}
                            </span>
                            <input
                                accept=".xlsx"
                                id="file-uploader"
                                // value={merchantValue}
                                type="file"
                                style={{ display: "none" }}
                                onChange={fileSelected}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mt-4">
                      <Button onClick={submitForm} style={{ maxWidth: 170 }}>
                        Upload
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

export default connect(null, actions)(UploadFailedReports);

import React, { useEffect, useState } from "react";
import Dashboard from "../../hoc/Dashboard";
import { Link } from "react-router-dom";
import {
  SummaryBox,
  BoxShadow,
  Header,
  GrayCircleAvatar,
  Select,
  Label,
  Button,
  Input,
  Hr,
} from "../../custom";
// import "react-date-range/dist/styles.css"; // main style file
// import "react-date-range/dist/theme/default.css";
// import { DateRangePicker } from "react-date-range";
// import CusotmLogRow from "../components/CusotmLogRow";
// import App from "../services";
import * as actions from "../../actions";
import { connect } from "react-redux";
import App from "../../services";
import AuditorNav from "../AuditorNav";
import { log } from "../../services/helpers";
import { urls } from "../../services/urls";
import AdjustmentSideNav from "../../navbars/AdjustmentSideNav";
function AdjustmentUploadTreatedItems({ startLoading }) {
  //   const [logs, setLog] = useState([]);
  //   const handleLogRowClick = (e) => {
  //     window.$("#logModal").modal("show");
  //   };
  const [report, setReport] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [title, setTitle] = useState("");
  const moment = window.moment;

  const closeModal = (id) => {
    window.$(id).modal("hide");
  };
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [_type, set_Type] = useState("");
  const [file, setFile] = useState(null);

  // function to show journal
  /**
   *
   * @param {id} id of journal to be viewed
   */

  // close journal popup
  /**
   *
   * @param {e} event
   */
  const closePopUp = (e) => {
    // if (e.target.id !== "popup") {
    setPopUp(false);
    setImgSrc("");
    // }
  };

  useEffect(() => {

  }, [report, moment]);
  

  const onStatusChanged = (e) => {
    const _type = e.target.value;
    set_Type(_type); 
  }

  const submitForm = (e) => {
    try {
      e.preventDefault();
      if (_type.trim() === "") {
        return App.showNotifiction("info", "Please fill all fields");
      }

      if (file === null) {
        return App.showNotifiction("info", "Please fill all fields");
      }

      if (!staffId || !password) {
        return App.showNotifiction("info", "Please fill all fields");
      }

      startLoading(true);

      let data = new FormData();
      data.append("File", file);
      data.append("staffId", staffId);
      //Buffer.from(`${password}`, "utf8").toString("base64");
      data.append("password", Buffer.from(`${password}`, "utf8").toString("base64"));

      App.postRequestFile(urls.adjustmentFileUploadTreatedFiles + _type , data).then(result => {
        if (result && result.Status) {
          App.showNotifiction("success", result.Message);
        }
        else if (result && !result.Status) {
          App.showNotifiction("error", result.Message);
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
  }

  return(
    <Dashboard>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-12">
            <SummaryBox
              className=""
              style={{ maxHeight: "70vh", height: "70vh", overflowX: "hidden" }}
            >
              <div className="row h-100">
                <div className="col-md-2 h-100">
                  <AdjustmentSideNav />
                </div>
                <div
                  className="col-md-10"
                  style={{ height: "100%", overflowY: "scroll" }}
                >
                  <div className="px-1 py-2">
                    <Hr/>
                    <Label>Upload neccesary files</Label>
                    <Hr/>
                    <div className="row px-4 mb-2">
                      <div className="col-md-6">
                        <Label>Item Type</Label>
                        <Select
                          value={_type}
                          onChange={(e) => set_Type(e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="InitialLogCode">Initial LogCode</option>
                          <option value="AccountToCredit">Account To Credit</option>
                          <option value="AccountToDebit">Account To Debit</option>
                        </Select>
                      </div>
                      <div className="col-md-6">
                        <Label>File</Label>
                        <Input 
                          accept=".xlsx,.xls"
                          type="file" 
                          onChange={(e) => {
                            const _file = e.target.files[0];
                            if (!_file.name.endsWith(".xls") && !_file.name.endsWith(".xlsx")) {
                              App.showNotifiction("error", "Please select an excel (.xlsx,.xls) file");
                              return;
                            }
                            setFile(_file);
                          }} 
                        />
                      </div>
                    </div>
                    <div className="row px-4 mb-2"></div>
                    <div className="row px-4 mb-2">
                      <div className="col-md-6">
                        <Label>Staff Id</Label>
                        <Input 
                          type="text" 
                          onChange={(e) => {
                            setStaffId(e.target.value);
                          }} 
                        />
                      </div>
                      <div className="col-md-6">
                        <Label>Password</Label>
                        <Input 
                          type="password" 
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }} 
                        />
                      </div>
                    </div>
                    <div>
                      <div className="col-md-4 pt-4">
                          <Button onClick={(e) => submitForm(e)} style={{ width: 170 }}>
                            Submit
                          </Button>
                      </div>
                    </div>
                    <div className="row px-4 mb-2">
                      <div className="col-md-12"></div>
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

export default connect(null, actions)(AdjustmentUploadTreatedItems);

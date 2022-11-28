import React, { useEffect, useState } from "react";
import Dashboard from "../../hoc/Dashboard";
import { Link } from "react-router-dom";
import { SummaryBox, BoxShadow, Header, GrayCircleAvatar, Label, Select, Input, Button, Hr } from "../../custom";
// import CusotmLogRow from "../components/CusotmLogRow";
import AuditorNavigation from "../AuditorNav";
import moment from "moment";
import { urls } from "../../services/urls";
import App from "../../services";
import * as actions from "../../actions";
import { connect } from "react-redux";
import AdjustmentSideNav from "../../navbars/AdjustmentSideNav";

function AdjustmentfileItems({startLoading}) {
  const [_type, set_Type] = useState("");
  const [reportType, setReportType] = useState("All");
  const [reportTypes, setReportTypes] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const [staffId, setStaffId] = useState("");
  const [file, setFile] = useState(null);
  // const handleLogRowClick = (e) => {
  //   window.$("#logModal").modal("show");
  // };
  const closeModal = (id) => {
    window.$(id).modal("hide");
  };
  useEffect(() => {
    // const logDt = JSON.parse(App.getFromLocalStorage("fb-logs"));
    
  }, []);

  const submitForm = async (e) => {
    try {
      e.preventDefault();
      if (_type.trim() === "") {
        return App.showNotifiction("info", "Please fill all fields");
      }

      if (file === null) {
        return App.showNotifiction("info", "Please fill all fields");
      }

      startLoading(true);

      let data = new FormData();
      data.append("File", file);

      App.postRequestFile(urls.AdjustmentFile + _type , data).then(result => {
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


  return (
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
                        <Label>File Type</Label>
                        <Select
                          value={_type}
                          onChange={(e) => set_Type(e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="AdjustmentFile">Raw Adjustment File</option>
                          <option value="MerchantExcel">Merchant Excel Log Code</option>
                        </Select>
                      </div>
                    </div>
                    <div className="row px-4 mb-2">
                      <div className="col-md-6">
                        <Label>File Type</Label>
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

export default connect(null, actions)(AdjustmentfileItems);

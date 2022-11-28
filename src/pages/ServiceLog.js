import React, { useState, useEffect } from "react";
import Dashboard from "../hoc/Dashboard";
import {
  SummaryBox,
  BoxShadow,
  Header,
  Label,
  Input,
  Button,
  Select,
} from "../custom";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";

import App from "../services";
import FTPNav from "./FTPNav";
import { appConstants, log } from "../services/helpers";
import Lightbox from "lightbox-react";
import "lightbox-react/style.css";

function ServiceLog({ startLoading }) {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [source, setSource] = useState("");
  const [platform, setPlatform] = useState("");
  const [ssh, setSSH] = useState("");
  const [serviceLog, setServiceLog] = useState([]);
  const [openLightBox, setOpenLightBox] = useState(false);
  const [images, setImages] = useState([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [alert, setAlert] = useState(false);
  const [date, setDate] = useState({});
  const [ids, setIds] = useState([]);
  const [showButton, setshowButton] = useState(false);
  
  const getServiceLogs = async () => {
    startLoading(true);
    const response = await App.getServiceLog().finally(() => startLoading(false));
    log("initial", "response", response);
    if (response) {
      setServiceLog(response);
    }
  }

  useEffect(() => {
    
    getServiceLogs();
    
  }, [startLoading, setServiceLog]);

  const sendBulk = async () => {
    try {
      startLoading(true);
      await App.sendServiceLog(ids);
      setIds([]);
      getServiceLogs().finally(() => startLoading(false));
    }
    catch(ex) {
      startLoading(false);
      App.logError(ex);
    }
    finally {
      startLoading(false);
    }
  }

  // close alert functions
  const closeAlert = () => {
    setAlert(false);
  };

  const declineRefund = async (e) => {
    try {
    } catch (error) {
    }
  };

  console.log("role", App.getUserRole(), ids.length, ids, serviceLog);

  return (
    <Dashboard>
      <div className="container">
        <Header>Service Logs</Header>
        <div className="col-md-12">
          <SummaryBox style={{ padding: "16px" }}>
            <div className="row py-3 pr-3">
              <div className="d-flex w-100 justify-content-end">
                <div className="mr-3">
                  {
                    // [appConstants.admin[1]].includes(App.getUserRole()) && ids.length > 0 &&
                    showButton > 0 &&
                    <div className={"mr-3"} style={{ width: 200 }}>
                      <Button onClick={() => sendBulk()}>
                        Send Resolved 
                      </Button>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="logs-table table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Select</th>
                    {/* <th>Cleared By</th> */}
                    <th>Error Date</th>
                    <th>Error Message</th>
                    <th>Error Description</th>
                    <th>Resolution Date</th>
                    <th>Service Name</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceLog &&
                    serviceLog?.map((item, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            <Input
                              type="checkbox"
                              placeholder="resolved"
                              checked={ids.includes(item.Id)}
                              onChange={(e) => {
                                console.log(e.target,);
                                // setDate(e.target.value);
                                const idsTemp = ids;
                                if (ids.includes(item.Id)) {
                                  //remove
                                  idsTemp.splice(idsTemp.indexOf(item.Id), 1);
                                }
                                else {
                                  //add
                                  idsTemp.push(item.Id);
                                }

                                if (idsTemp.length > 0) {
                                  setshowButton(true);
                                }
                                else {
                                  setshowButton(false);
                                }

                                setIds(idsTemp);
                                console.log("ids", ids);
                              }}
                            />
                          </td>
                          {/* <td>{item.ClearedBy}</td> */}
                          <td>{App.convertToTimeString(item.ErrorDate)}</td>
                          <td>{item.ErrorMessage}</td>
                          <td>{item.ErrorDescription}</td>
                          <td>{App.convertToTimeString(item.ResolutionDate)}</td>
                          <td>
                            {item.ServiceName}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </SummaryBox>
        </div>
      </div>
      {
      openLightBox && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setOpenLightBox(false)}
          onMovePrevRequest={() => {
            const index = (photoIndex + images.length - 1) % images.length;
            setPhotoIndex(index);
          }}
          onMoveNextRequest={() => {
            const index = (photoIndex + 1) % images.length;
            setPhotoIndex(index);
          }}
        />
      )}
      {alert && (
        <div className="alert-box">
          <div className="alert-box-wrap shadow bg-white">
            <span className="close-alert" onClick={closeAlert}>
              &times;
            </span>
            <p className="text-center">
              Please note that by selecting No, you are accepting the claim and
              you will be debited for the chargeback
            </p>
            <div>
              <Button onClick={declineRefund}>Proceed</Button>
            </div>
          </div>
        </div>
      )}
    </Dashboard>
  );
}

export default connect(null, actions)(ServiceLog);

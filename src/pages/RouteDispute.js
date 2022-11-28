import React, { useEffect, useState, useRef } from "react";
import Dashboard from "../hoc/Dashboard";
import {
  SummaryBox,
  GrayCircleAvatar,
  BoxShadow,
  Header,
  Input,
  Select,
  Button,
  Label,
} from "../custom";
import { Link } from "react-router-dom";
import App from "../services";
import { downloadFile, log, appConstants } from "../services/helpers";
import * as actions from "../actions";
import { connect } from "react-redux";
import Pagination from "react-pagination-library";
import "react-pagination-library/build/css/index.css";
import moment from "moment";
import { urls } from "../services/urls";

function RouteDispute({ startLoading }) {
  const individualKey = "individual";
  const team = "team";

  
  const [ids, setIds] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [resp, setResp] = useState("");
  const [resErr, setResErr] = useState(false);
  const [disputes, setDisputes] = useState([]);
  let [disputesList, setDisputesList] = useState([]);
  
  const [individual, setIndividual] = useState(individualKey);
  const [fromUserId, setFromUserId] = useState(undefined);
  const [userId, setUserId] = useState(undefined);
  const [users, setUsers] = useState([]);
  const [teams, setTeam] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(undefined);
  const [selectedDisputes, setSelectedDisputes] = useState([]);

  // ref element
  const download = useRef();

  const effectfunc = async () => {
    
    const response = await App.getAllUsers()

    if(response) {
      setUsers(response.filter(item => item !== null))
    }
    // loadDisputes();
    
  }

  useEffect(() => {
    try {
      startLoading(true);
      effectfunc()
    } finally{
      startLoading(false);
    }
    // App.getTeamsForReRoute().then(response => {
    //   if (response) {
    //     setTeam(() => [...response])
    //   }
    // });
    
  }, []);

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      startLoading(true);

      startLoading(false);
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };



  const addUserId = (eve) => {
    // let copyRecords = [...records];
    let copyRecords = [...users];

    copyRecords.forEach((e) => {
      // console.log("e", eve.target.value, e.Id);
      
      if (e.Id === eve.target.value) {
        e.checked = !e.checked;
        // console.log(e.checked);
        if (e.checked) {
          setUserId(e.Id);
        }
        if (e.checked === false) {
          setUserId(undefined);
        }
      }else {
        
      }
    });
  };


  // close journal popup
  /**
   *
   * @param {e} event
   */
  const closePopUp = (e) => {
    // if (e.target.id !== "popup") {
    handleFormSubmit(e);
    setPopUp(false);
    window.URL.revokeObjectURL(download.current.href);
    setResp("");
    // }
  };

  const submitForReRouting = (e) => {
    e.preventDefault();
    startLoading(true);
    
    if (disputesList.length == 0) {
      App.showNotifiction('error', "Please select dispute to reroute");
      return;
    }
    
    if (!userId) {
      App.showNotifiction('error', "Please select user to reroute dispute");
      return;
    }

    const data = {
      "DisputeId": disputesList,
      "ToIndividual": true,
      "UserId":  userId,
    };
    App.reRouteDispute(data).then(d => {
      if (d) {
        setDisputes([]);
        setDisputesList([]);
        setUserId(undefined);
        setFromUserId(undefined);
        document.getElementById("selectAllDisputes").checked = false;
      }
    }).finally(() => startLoading(false));
    App.showNotifiction("success", "Action successful");
    
    log("initial", "tbr", data);
  }

  const submitForNext = (e) => {
    e.preventDefault();

    startLoading(true);
    if (!fromUserId) {
      App.showNotifiction('error', "Please select user to fetch dispute from");
      return;
    }

    App.getRequest(urls.getUserPending + fromUserId).then(result => {
      if (result) {
        
        loadDisuteinArray(result);
        setDisputes(result);
      }
    }).finally(() => startLoading(false));

  }

  const loadDisputes = (e) => {
    startLoading(true);
    App.getAllTeamDispute().then(response => {
      if (response) {
        setDisputes(response.data);
        console.log("response", response);
      }
    }).finally(() => startLoading(false));
  }

  const loadDisuteinArray = (data) => {
    let _tmp = {};
    data.map(dispute => {
      dispute['current'] = "Add"
      _tmp[dispute.DisputeLogId] = dispute;
    });

    log("initial", _tmp);
    setSelectedDisputes(_tmp);
  }

  const addToList = (UniqueId) => {
    let tmpDisputeList = disputesList;
    
    log("initial", "UniqueId " ,UniqueId, "TOtal count", tmpDisputeList.length);
    
    if (tmpDisputeList.includes(UniqueId)) {
      // delete tmpDisputeList[tmpDisputeList.indexOf(UniqueId)]; 
      // log("initial", "tmpDisputeList I" ,tmpDisputeList);
      if (tmpDisputeList.length == 1) {
        tmpDisputeList = [];
      }
      else {
          const index = tmpDisputeList.indexOf(UniqueId);
          if (index > -1) {
            tmpDisputeList.splice(index, 1);
          }
      }
      // log("initial", "Remove tmpDisputeList" ,tmpDisputeList);
      setDisputesList(tmpDisputeList);
      disputesList = tmpDisputeList;
      log("initial", "Remove disputesList" ,disputesList);
      return false;
    }
    else {
      tmpDisputeList.push(UniqueId);
      setDisputesList(tmpDisputeList);
      log("initial", "Adding disputesList I" ,disputesList);
      return true;
    }

    
  }

  const selectAllDisputes = () => {
    let tmpDisputeList = disputes;

    // toggle adding to list
    tmpDisputeList.map(dispute => {
      addToList(dispute.UniqueId);
    });
    // update UI
    var elements = document.getElementsByClassName("dispute-select");
    for(let i = 0; i < elements.length; i++) {
      elements[i].checked = !elements[i].checked;
    }

    log("initial", "disputesList" ,disputesList);
  }

  // log("initial", "ids", individual, ids, userId);

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
                <div
                  className="col-md-12 px-5"
                  style={{ height: "100%", overflowY: "scroll" }}
                >
                  <div className="px-1 py-2">
                    <Header className="mb-2">Re-route Dispute</Header>
                  </div>
                  <form className="py-3">
                    <div className="row">
                      {/* <div className="col-md-6">
                        <Select
                          value={individual}
                          onChange={(e) => {
                            setIndividual(e.target.value);
                            setSelectedTeam(undefined);
                          }}
                        >
                          <option value={individualKey}> To Individual</option>
                          <option value={team}> By Team</option>
                        </Select>
                      </div> */}
                      <div className="col-md-6">
                        <Select
                          value={fromUserId}
                          onChange={(e) => {
                            setUserId(undefined);
                            setDisputes([]);
                            setFromUserId(e.target.value);
                          }}
                        >
                          <option value=""> From User</option>
                          {users && users.map((item, i) => { 
                            if (!item.IsAvaliable) {
                              return;
                            }
                            if (appConstants.teamLead.includes(item.Role)) {
                              return;
                            }
                            return(
                            <option key={i} value={item.Id}>
                              {item.FullName} - {item.StaffId}
                            </option>
                          )})}
                        </Select>
                      </div>
                      
                      {
                        <div className="col-md-6">
                          <Button type="button" onClick={(e) => submitForNext(e)}>Fetch Disputes</Button>
                        </div>
                      }
                      
                    </div>
                    <div className="row">
                        {
                          <div className="col-md-6">
                            <Select
                              value={userId}
                              onChange={(e) => {
                                setUserId(e.target.value);
                              }}
                            >
                              <option value="">To User</option>
                              {users && users.map((item, i) => { 
                                if (!item.IsAvaliable) {
                                  return;
                                }
                                if (appConstants.teamLead.includes(item.Role)) {
                                  return;
                                }
                                return(
                                <option key={i} value={item.Id}>
                                  {item.FullName} - {item.StaffId}
                                </option>
                              )})}
                            </Select>
                          </div>
                        }
                        {
                          disputes.length > 0 &&
                          <div className="col-md-6">
                            <Button type="button" onClick={(e) => submitForReRouting(e)}>Reassign</Button>
                          </div>
                        }
                    </div>
                  </form>
                  <div className="row">
                    <div className="col-md-12" style={{ minHeight: "150px" }}>
                      {
                        <table
                          className="logs-table failedtrans"
                          style={{ width: "100%" }}
                        >
                          <thead>
                            <tr>
                              <th>
                              <div className=" pt-4">
                                {/* <Label>Select All</Label> */}
                                <Input 
                                  type={"checkbox"} 
                                  id={"selectAllDisputes"}
                                  defaultChecked={false} 
                                  onClick={(e) => {
                                    selectAllDisputes();
                                  }} 
                                />
                              </div>
                                
                              </th>
                              <th>Dispute Log ID</th>
                              <th>Assigned To</th>
                              <th>Stan</th>
                              <th>PAN</th>
                              <th>Transaction Amount</th>
                              <th>Transaction Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {disputes.length > 0 &&
                              disputes.map((item, i) => {
                                const logId = item.DisputeLogId;
                                
                                return (
                                <tr key={item.UniqueId}>
                                  <td>
                                    <div className="col-md-6"> 
                                      {  
                                      <>
                                          <Input 
                                            type={"checkbox"} 
                                            className={"dispute-select"}
                                            defaultChecked={false} 
                                            onClick={(e) => {
                                              
                                              let currentDispute = selectedDisputes[logId]
                                              
                                              
                                              if (currentDispute['current'] == "Add") {
                                                currentDispute['current'] = "Remove";
                                              }
                                              else {
                                                currentDispute['current'] = "Add";
                                              }
  
                                              const target = e.target || e.srcElement;
                                              target.checked = addToList(currentDispute.UniqueId);
                                              // currentDispute['current'] == "Add" ? false: true;
  
                                              // currentDispute['current'] == "Add" ?  "Remove": "Add";
                                              selectedDisputes[logId] = currentDispute;
                                              setSelectedDisputes(selectedDisputes);
                                            }} 
                                          />
                                        </>
                                      }
                                    </div>
                                  </td>
                                  <td>{item.DisputeLogId || "N/A"}</td>
                                  <td>{item.StaffId || "N/A"}</td>
                                  <td>{item.Stan || "N/A"}</td>
                                  <td>{item.PAN || "N/A"}</td>
                                  <td>{item.TransAmount || "N/A"}</td>
                                  <td>{moment(new Date(item.Transaction_Date)).format('YYYY-MM-DD') || "N/A"}</td>
                                </tr>
                              )})}
                          </tbody>
                        </table> 
                      }
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="d-flex flex-row-reverse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </SummaryBox>
          </div>
        </div>
      </div>
      {popUp && (
        <div
          className="popup"
          id="popup"
          tabindex="-1"
          role="dialog"
          aria-labelledby="ViewJournalModal"
          aria-hidden="true"
        >
          <div className="p-4">
            <div className="mr-auto">
              <GrayCircleAvatar
                onClick={closePopUp}
                style={{ marginLeft: "auto" }}
              >
                X
              </GrayCircleAvatar>
            </div>
            <div className="box-wrap">
              <div className="info-box">
                <p className="text-center">{resp}</p>

                {resErr && (
                  <a
                    className="btn-default mb-2 mt-2"
                    // onClick={processRefund}
                    ref={download}
                    aria-label="Download files"
                  >
                    Export logs
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Dashboard>
  );
}


const RenderButton = (props) => {
  console.log("props", props);
  return (
    <Button type="button" onClick={props.onClick}>
      {
        props.text
      }
    </Button>
  );
}

export default connect(null, actions)(RouteDispute);

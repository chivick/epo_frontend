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
import ReversalsNav from "./../navbars/ReversalNav";
import { dataTableItem } from "../services/helpers";
import moment from 'moment';

function ReconReversals({ startLoading }) {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [itemFetched, setitemFetched] = useState(false);
  const [source, setSource] = useState([]);

  const [process, setProcess] = useState("");
  const [ssh, setSSH] = useState("");

  // const FailedAgencyMDB = "FailedAgencyMDB";
  const FailedAgencyMDB = "FailedAgency";

  const generateExcel = async (e) => {
    e.preventDefault();
    
    try {
      if (process.trim() === "") {
        return App.showNotifiction("info", "Please select a process.");
      }
      startLoading(true);
      App.generateTransactionReversalList(process).then(() => {
        setSource([]);
        setitemFetched(false);
      }).catch(err => {
        console.log(JSON.stringify(err));
        App.showNotifiction("error", "Reversal Items could not be generated");
      });
      startLoading(false);
    }
    catch(e) {
      startLoading(false);
    }
    finally{
      startLoading(false);
    }
  };
  
  const submitForm = async (e) => {
    try {
      e.preventDefault();
      
      if (process.trim() === "") {
        return App.showNotifiction("info", "Please fill all fields");
      }

      startLoading(true);
      App.getPendingReversalItems(process).then(result => {
        
        startLoading(false);
        if (result && result.status) {
          setSource(result.data);
          if (result.data.length > 0) {
            setitemFetched(true);
          }
          
          App.showNotifiction("success", result.message);
        }
        else if (result && !result.status) {
          App.showNotifiction("error", result.message);
        }
        else {
          // console.log(result);
          App.showNotifiction("error", result.message);
          setitemFetched(false);
        }
      }).catch(err => {
        // console.log(err);
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
              style={{ maxHeight: "75vh", height: "75vh", overflowX: "hidden" }}
            >
              <div className="row h-100">
                {/* <div className="col-md-2 h-100">
                  <BoxShadow className="bg-white h-100 py-5 d-flex align-items-center logs-menu">
                    <ReversalsNav />
                  </BoxShadow>
                </div> */}
                <div
                  className="col-md-10 pr-5"
                  style={{ height: "100%", overflowY: "scroll" }}
                >
                  <div className="px-1 py-2">
                    <Header className="mb-2">Transaction Reversal</Header>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <Label>Select Process</Label>
                      <Select
                        value={process}
                        onChange={(e) => {
                          setProcess(e.target.value);
                          setitemFetched(false);
                          setSource([]);
                        }}
                      >
                        <option value="">Select</option>
                        <option value="Failed ATM Cash Withdrawal">Failed ATM</option>
                        <option value="Unimpacted Transaction">Unimpacted ATM</option>
                        <option value={FailedAgencyMDB}>Failed Agency MDB</option>
                        <option value={"Failed POS Cash Withdrawal"}>Failed POS/WEB</option>
                      </Select>
                    </div>
                    {
                      <div className="col-md-6 mt-4">
                        <Button onClick={submitForm} style={{ maxWidth: 170 }}>
                          Submit
                        </Button>
                      </div>
                    }
                  </div>
                  {itemFetched  &&
                    <div className="row">
                      <div className="col-md-6">
                        <Label>Selected Process</Label>
                        <Header className="mb-2" style={{fontSize: 18}}>{process}</Header>
                      </div>
                    
                      <div className="col-md-6 mt-4">
                        <Button onClick={generateExcel} style={{ maxWidth: 170 }}>
                          Generate Excel
                        </Button>
                      </div>
                    </div>
                  }
                  {/* {process == FailedAgencyMDB &&
                    <div className="row">
                      <div className="col-md-6">
                        <Label>Selected Process</Label>
                        <Header className="mb-2" style={{fontSize: 18}}>{process}</Header>
                      </div>
                    
                      <div className="col-md-6 mt-4">
                        <Button onClick={generateExcel} style={{ maxWidth: 170 }}>
                          Generate Excel
                        </Button>
                      </div>
                    </div>
                  } */}
                  <div className="col-md-12">
                    <SummaryBox style={{ padding: "16px" }}>
                      <div className="row py-3 pr-3">
                        <div className="col-md-12" style={{ overflowX: "scroll" }}>
                          <table
                            id="example"
                            className="logs-table"
                            style={{ width: "100%" }}
                          >
                            <thead>
                              <tr>
                                <th>Debit Account</th>
                                <th>Credit Account</th>
                                <th>Amount</th>
                                <th>RRN</th>
                                <th>Terminal Id</th>
                                <th>Narration</th>
                                <th>Captured Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              { 
                                source?.map(x => {
                                  return (
                                    <tr className={`resolution-table-row`}>
                                      <td>{x.DebitAccount}</td>
                                      <td>{x.CreditAccount}</td>
                                      <td>{x.Amount}</td>
                                      <td>{x.RRN}</td>
                                      <td>{x.TerminalId}</td>
                                      <td>{x.Narration}</td>
                                      <td>{moment(x.CapturedDate).format("yyyy-MM-DD hh:mm")}</td>
                                    </tr>
                                  )
                                })
                              }
                              
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </SummaryBox>
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

export default connect(null, actions)(ReconReversals);

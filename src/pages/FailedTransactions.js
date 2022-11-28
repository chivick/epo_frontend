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
} from "../custom";
import { Link } from "react-router-dom";
import App from "../services";
import { downloadFile, log } from "../services/helpers";
import * as actions from "../actions";
import { connect } from "react-redux";
import Pagination from "react-pagination-library";
import "react-pagination-library/build/css/index.css";
import FTPNav from "./FTPNav";

function FailedTransactions({ startLoading }) {
  const [pageCount, setPageCount] = useState(200);
  const [currentPage, setCurrentPage] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [processName, setProcessName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fileType, setFileType] = useState("Switch");
  const [records, setRecords] = useState([]);
  const [ids, setIds] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [userProcesses, setUserProcesses] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [resp, setResp] = useState("");
  const [resErr, setResErr] = useState(false);
  const [ttumProcessed, setTtumProcessed] = useState(false);

  // ref elements
  const download = useRef();

  useEffect(() => {
    const getSettlements = async () => {
      try {
        startLoading(true);
        const response2 = await App.getReconUserProcesses();
        console.log("response2: ", response2);
        setUserProcesses(response2);
        setProcessName(response2[0].ProcessName);
        const response = await App.getFailedTransactions(date);
        const pageCount = Math.ceil(response.RecordCount / 100);
        console.log(response);
        startLoading(false);
        setPageCount(pageCount);
        setRecords(response.Data);
      } catch (error) {
        startLoading(false);
        App.logError(error);
      }
    };
    getSettlements();
  }, [setPageCount, setRecords, startLoading]);

  const changeCurrentPage = async (pageNumber) => {
    try {
      startLoading(true);
      setCurrentPage(pageNumber);
      const response = await App.getFailedTransactions(
        date,
        searchTerm,
        processName,
        pageNumber,
        fileType
      );
      console.log(response);
      const pageCount = Math.ceil(response.RecordCount / 100);
      console.log("records returned: ", response.Data.length);
      setPageCount(pageCount);
      setRecords(response.Data);
      startLoading(false);
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      startLoading(true);
      const response = await App.getFailedTransactions(
        date,
        searchTerm,
        processName,
        currentPage,
        fileType
      );
      const pageCount = Math.ceil(response.RecordCount / 100);
      setPageCount(pageCount);
      const copyData = response.Data.map((e, i) => {
        return (e = { ...e, checked: false });
      });
      setRecords(copyData);
      console.log(response.Data);
      startLoading(false);
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };

  // check transaction field status
  /**
   *
   * @param {eve} event
   */
  const updateTran = (eve) => {
    let copyRecords = [...records];

    copyRecords.forEach((e) => {
      // console.log(e);
      if (e.Id === eve.target.value) {
        e.checked = !e.checked;
        console.log(e.checked);
        if (e.checked) {
          let idsCopy = [...ids];
          idsCopy.push(e.Id);
          setIds(idsCopy);
          console.log("idsCopy",idsCopy);
        }
        if (e.checked === false) {
          let idsCopy = [...ids];
          const newSet = idsCopy.filter((elem, i) => {
            return elem !== eve.target.value;
          });
          console.log(newSet);
          setIds(newSet);
        }
      }
    });
    setRecords(copyRecords);
  };

  // check all failed transaction field
  /**
   *
   * @param {eve} event
   */
  const checkAll = (e) => {
    setAllChecked(!allChecked);

    let copyRecords = [...records];

    copyRecords.forEach((elem) => {
      elem.checked = !allChecked;
      
      if (elem.checked) {
        // add 
        ids.push(elem.Id);
      }
      else {
        //remove
        ids.splice(ids.indexOf(elem.Id), 1);
      }
      
    });

    setRecords(copyRecords);
  };

  // process refund for failed transactions selected
  const processRefund = async () => {
    try {
      startLoading(true);
      const response = await App.processReconTeamLeadRefund(
        processName,
        date,
        ids,
        allChecked
      );
      console.log("response", response);

      if (response && response.status == 200) {
        setTtumProcessed(true);
        setTimeout(() => {
          setTtumProcessed(false);
        }, 2000);
        
        checkAll();
      }

      setIds([]);
      setAllChecked(!allChecked);
      
      startLoading(false);
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
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

  // function to download excel files
  const downloadExcel = async () => {
    try {
      startLoading(true);
      const response = await App.downloadExcelFile("Failed", fileType,date,processName);
      console.log(response);
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };

  log("initial", "ids", ids, allChecked);

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
                  className="col-md-10 px-5"
                  style={{ height: "100%", overflowY: "scroll" }}
                >
                  <div className="px-1 py-2">
                    <Header className="mb-2">Failed Exceptions</Header>
                  </div>
                  <form className="py-3" onSubmit={handleFormSubmit}>
                    <div className="row">
                      <div className="col-md-12">
                        <Select
                          value={processName}
                          onChange={(e) => setProcessName(e.target.value)}
                        >
                          <option value=""> Select Process</option>
                          {userProcesses.length > 0 &&
                            userProcesses.map((item, i) => (
                              <option value={item.ProcessName} key={i}>
                                {item.ProcessName}
                              </option>
                            ))}
                        </Select>
                      </div>
                      <div className="col-md-6">
                        <Input
                          placeholder="Search Term"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <Select
                          value={fileType}
                          onChange={(e) => setFileType(e.target.value)}
                        >
                          <option value=""> Select File type</option>
                          {/* <option value="Switch">Switch</option> */}
                          <option value="CoreBanking">Core Banking</option>
                        </Select>
                      </div>
                      <div className="col-md-6">
                        <Input
                          type="date"
                          placeholder="Date"
                          value={date}
                          onChange={(e) => {
                            console.log(e.target.value);
                            setDate(e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-md-6">
                        <Button type="submit">Submit</Button>
                      </div>
                    </div>
                  </form>
                  {/* <Button
                    style={{
                      marginLeft: "auto",
                      display: "block",
                      width: "fit-content",
                    }}
                    onClick={downloadExcel}
                  >
                    Download File
                  </Button> */}
                  <div className="row">
                    <div className="col-md-12" style={{ minHeight: "150px" }}>
                      {(records.length > 0 && ids.length > 0) && (
                        <button
                          stye={{ color: "red" }}
                          className="btn-default ml-auto d-block mb-2"
                          onClick={processRefund}
                        >
                          {(!ttumProcessed) ?"Prepare TTUM" :  "TTUM Processed"}
                        </button>
                      )}
                      <table
                        className="logs-table failedtrans"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr>
                            <th>
                              <label>
                                {records.length > 0 && (
                                  <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={checkAll}
                                  />
                                )}{" "}
                                Select all
                              </label>
                            </th>
                            <th>Transaction Amount</th>
                            <th>Trans Id</th>
                            <th>RRN</th>
                            <th>Stan</th>
                            <th>Terminal Id</th>
                            <th>Transaction Date</th>
                            <th>Value Date</th>
                            <th>Tran Particulars 1</th>
                            {/* <th>Settlement Date</th> */}
                            <th>Tran Type</th>
                            <th>Tran Particular 2</th>
                          </tr>
                        </thead>
                        <tbody>
                          {records.length > 0 &&
                            records.map((item, i) => (
                              <tr key={i}>
                                <td>
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={item.checked}
                                      value={item.Id}
                                      onChange={updateTran}
                                    />{" "}
                                  </label>
                                </td>
                                <td>{item.TransactionAmount || "N/A"}</td>
                                <td>{item.TransId || "N/A"}</td>
                                <td>{item.RRN || "N/A"}</td>
                                <td>{item.Stan || "N/A"}</td>
                                <td>{item.TerminalId || "N/A"}</td>
                                <td>
                                  {App.convertToTimeString(
                                    item.TransactionDate
                                  )}
                                </td>
                                <td>
                                  {App.convertToTimeString(item.ValueDate)}
                                </td>
                                <td>{item.TransParticular || "N/A"}</td>
                                <td>{item.Part_Tran_Type || "N/A"}</td>
                                <td>{item.TransParticular2 || "N/A"}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="d-flex flex-row-reverse">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={pageCount}
                          changeCurrentPage={changeCurrentPage}
                          theme="bottom-border"
                        />
                      </div>
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

export default connect(null, actions)(FailedTransactions);

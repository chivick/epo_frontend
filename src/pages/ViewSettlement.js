import React, { useEffect, useState } from "react";
import Dashboard from "../hoc/Dashboard";
import {
  SummaryBox,
  BoxShadow,
  Header,
  Input,
  Select,
  Button,
} from "../custom";
import { Link } from "react-router-dom";
import App from "../services";
import * as actions from "../actions";
import { connect } from "react-redux";
import Pagination from "react-pagination-library";
import "react-pagination-library/build/css/index.css";
import FTPNav from "./FTPNav";

function ViewSettlement({ startLoading }) {
  const [pageCount, setPageCount] = useState(200);
  const [currentPage, setCurrentPage] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [processName, setProcessName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fileType, setFileType] = useState("Switch");
  const [records, setRecords] = useState([]);
  const [userProcesses, setUserProcesses] = useState([]);
  useEffect(() => {
    const getSettlements = async () => {
      try {
        startLoading(true);
        const response2 = await App.getReconUserProcesses();
        console.log("response2: ", response2);
        setUserProcesses(response2);
        setProcessName(response2[0].ProcessName);
        const response = await App.viewSettlement(date);
        console.log(response);
        // const response = await App.getSettlements();
        const pageCount = Math.ceil(response.RecordCount / 100);

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
      const response = await App.getSettlements(
        date,
        searchTerm,
        processName,
        pageNumber,
        fileType
      );
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

  // function to download excel files
  const downloadExcel = async () => {
    try {
      startLoading(true);
      // const response = await App.downloadExcelFile("Settlement", fileType,date,processName);
      const response = await App.downloadExceptionExcelFile("Settlement", fileType,date,processName);
      console.log(response);
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      startLoading(true);
      const response = await App.viewSettlement(
        date,
        searchTerm,
        processName,
        currentPage,
        fileType
      );
      const pageCount = Math.ceil(response.RecordCount / 100);
      setPageCount(pageCount);
      setRecords(response.Data);
      console.log(response.Data);
      startLoading(false);
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
                    <Header className="mb-2">View Settlements</Header>
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
                          <option value="Switch">Switch</option>
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
                  <Button
                    style={{
                      marginLeft: "auto",
                      display: "block",
                      width: "fit-content",
                    }}
                    onClick={downloadExcel}
                  >
                    Download File
                  </Button>
                  <div className="row">
                    <div className="col-md-12" style={{ minHeight: "150px" }}>
                      <table
                        className="logs-table failedtrans"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr>
                            <th>Transaction Amount</th>
                            <th>Trans Id</th>
                            <th>RRN</th>
                            <th>Stan</th>
                            <th>Terminal Id</th>
                            <th>Transaction Date</th>
                            {fileType === "Switch" && <th>Settlement Date</th>}
                            {fileType === "CoreBanking" && <th>Tran Type</th>}
                            {fileType === "CoreBanking" && (
                              <th>Tran Particular</th>
                            )}
                            {fileType === "CoreBanking" && (
                              <th>Tran Particular 2</th>
                            )}
                            {fileType === "CoreBanking" && (
                              <th>Tran Value Date</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {records.length &&
                            records.map((item, i) => (
                              <tr key={i}>
                                <td>{item.TransactionAmount || "N/A"}</td>
                                <td>{item.TransId || "N/A"}</td>
                                {fileType === "Switch" && (
                                  <td>{item.IssuerRRN || "N/A"}</td>
                                )}
                                {fileType === "CoreBanking" && (
                                  <td>{item.RRN || "N/A"}</td>
                                )}
                                {fileType === "Switch" && (
                                  <td>{item.IssuerStan || "N/A"}</td>
                                )}
                                {fileType === "CoreBanking" && (
                                  <td>{item.Stan || "N/A"}</td>
                                )}
                                <td>{item.TerminalId || "N/A"}</td>
                                <td>
                                  {App.convertToTimeString(
                                    item.TransactionDate
                                  )}
                                </td>
                                {fileType === "Switch" && (
                                  <td>
                                    {App.convertToTimeString(
                                      item.SettlementDate
                                    )}
                                  </td>
                                )}
                                {fileType === "CoreBanking" && (
                                  <td>{item.Part_Tran_Type || "N/A"}</td>
                                )}
                                {fileType === "CoreBanking" && (
                                  <td>{item.TransParticular || "N/A"}</td>
                                )}

                                {fileType === "CoreBanking" && (
                                  <td>{item.TransParticular2 || "N/A"}</td>
                                )}

                                {fileType === "CoreBanking" && (
                                  <td>
                                    {App.convertToTimeString(item.ValueDate) ||
                                      "N/A"}
                                  </td>
                                )}
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
    </Dashboard>
  );
}

export default connect(null, actions)(ViewSettlement);

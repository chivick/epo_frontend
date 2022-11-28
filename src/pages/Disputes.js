import React, { useState } from 'react';
import Dashboard from "../hoc/Dashboard";
import {
  Header,
  SummaryBox,
  Input,
  Hr,
  Button,
  Select,
  FileSelect,
  ExcelSelect,
  GrayCircleAvatar,
  SecondaryButton,
} from "../custom";
// import userIcon from "../assets/images/user.svg";
import DisputeRow from "../components/DisputeRow";
import MSelect from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

function Disputes() {
  const closeModal = (id) => {
    window.$(id).modal("hide");
  };
  const onViewDisputeClick = (e) => {
    window.$("#viewUser").modal("show");
  };
  return (
    <Dashboard>
      <div className="container">
        <Header>Dispute Pool</Header>
        <div className="col-md-12">
          <SummaryBox style={{ padding: "16px" }}>
            <div className="row py-3 pr-3">
              <div className="d-flex w-100 justify-content-end">
                <div className="mr-3">
                  <Input placeholder="search" />
                </div>
              </div>
            </div>
            <table className="logs-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Dispute ID</th>
                  <th>Bank</th>
                  <th>Company</th>
                  <th>Channel</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <DisputeRow
                  id="01901901"
                  bank="GT BANK"
                  company="Issuing"
                  channel="MasterCom"
                  onViewUserClick={onViewDisputeClick}
                />
                <DisputeRow
                  id="01901901"
                  bank="GT BANK"
                  company="Issuing"
                  channel="MasterCom"
                  onViewUserClick={onViewDisputeClick}
                />
                <DisputeRow
                  id="01901901"
                  bank="GT BANK"
                  company="Issuing"
                  channel="MasterCom"
                  onViewUserClick={onViewDisputeClick}
                />
                <DisputeRow
                  id="01901901"
                  bank="GT BANK"
                  company="Issuing"
                  channel="MasterCom"
                  onViewUserClick={onViewDisputeClick}
                />
              </tbody>
            </table>
          </SummaryBox>
        </div>
      </div>
      <div
        class="modal fade"
        id="addNewUser"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-body p-0">
              <section className="py-3 d-flex align-items-center justify-content-between px-3">
                <h2
                  style={{ color: "#EAAA00", fontSize: 20, fontWeight: "bold" }}
                >
                  Add New User
                </h2>
                <GrayCircleAvatar onClick={() => closeModal("#addNewUser")}>
                  X
                </GrayCircleAvatar>
              </section>
              <Hr />
              <section className="py-3 d-flex align-items-center px-3">
                <h5 style={{ fontSize: 12 }}>
                  Add user via staff ID number or upload excel sheet of multiple
                  ID's
                </h5>
              </section>
              <Hr />
              <div className="row mt-3 px-4 pb-5">
                <div className="col-md-6">
                  <Input placeholder="Staff ID Number" />
                  <Select>
                    <option value="">Channel</option>
                  </Select>
                  <Select>
                    <option value="">Category</option>
                  </Select>
                  <div style={{ width: 170 }}>
                    <Button>Add User</Button>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="d-flex">
                      <FileSelect>Browse files</FileSelect>
                      <ExcelSelect>Choose Excel file</ExcelSelect>
                    </div>
                  </div>
                  <div className="row py-3">
                    <div style={{ width: 160 }}>
                      <Button>Upload</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="viewUser"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-body p-0">
              <section className="py-3 d-flex align-items-center justify-content-between px-3">
                <h2
                  style={{ color: "#EAAA00", fontSize: 20, fontWeight: "bold" }}
                >
                  View/Edit Dispute
                </h2>
                <GrayCircleAvatar onClick={() => closeModal("#viewUser")}>
                  X
                </GrayCircleAvatar>
              </section>
              <div className="container-fluid py-4">
                <div className="row">
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-12">
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          John Doe
                        </Header>
                        <span style={{ fontSize: 12 }}>
                          Dispute No.: 0998765
                        </span>
                        <Hr />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          John Doe
                        </Header>
                        <span style={{ fontSize: 12 }}>
                          Dispute No.: 0998765
                        </span>
                        <Hr />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <span style={{ fontSize: 12 }}>Bank</span>
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          FIRST BANK
                        </Header>
                      </div>
                      <div className="col-md-6">
                        <span style={{ fontSize: 12 }}>To</span>
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          GT BANK
                        </Header>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <span style={{ fontSize: 12 }}>Category</span>
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          Issuing
                        </Header>
                      </div>
                      <div className="col-md-6">
                        <span style={{ fontSize: 12 }}>Channel</span>
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          MasterCom
                        </Header>
                      </div>
                    </div>
                    <Hr />
                    <div className="row">
                      <div className="col-md-6">
                        <span style={{ fontSize: 12 }}>Date Added</span>
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          12/11/2020
                        </Header>
                      </div>
                      <div className="col-md-6">
                        <span style={{ fontSize: 12 }}>Expires</span>
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          12/11/2020
                        </Header>
                      </div>
                    </div>
                    <div className="row py-3">
                      <div className="col-md-6">
                        <Button>Verify Transaction</Button>
                      </div>
                      <div className="col-md-6">
                        <SecondaryButton>Resolved</SecondaryButton>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-12">
                        <MSelect
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          style={{ width: "100%" }}
                          placeholder="Assign"
                        >
                          <MenuItem value={""}>Assign</MenuItem>
                        </MSelect>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          Dispute not assigned yet
                        </Header>
                      </div>
                    </div>
                    <div className="row py-4">
                      <div className="col-md-12">
                        <Button style={{ width: 150 }}>Assign</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default Disputes;

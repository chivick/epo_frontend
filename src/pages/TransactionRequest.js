import React from "react";
import Dashboard from "../hoc/Dashboard";
import {
  BoxShadow,
  SummaryBox,
  Input,
  Header,
  Button,
  SecondaryButton,
  Hr,
  GrayCircleAvatar,
} from "../custom";
import fbLogo from "../assets/images/fbLogo.png";
import DisputeRow from "../components/DisputeRow";

function TransactionRequest() {
  const closeModal = (id) => {
    window.$(id).modal("hide");
  };
  const onViewDisputeClick = (e) => {
    window.$("#viewUser").modal("show");
  };
  return (
    <Dashboard>
      <div className="container py-4">
        <div className="row">
          <div className="col-md-8">
            <Header>Transaction Evidence Requests</Header>
            <div className="row">
              <div className="col-md-12">
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
            </div>
          </div>
          <div className="col-md-4">
            <BoxShadow
              className="bg-white"
              style={{
                height: 600,
                display: "flex",
                flexDirection: "column",
                borderRadius: 4,
              }}
            >
              <div
                className="w-100 d-flex justify-content-center align-items-center"
                style={{
                  flex: 1,
                }}
              >
                <img
                  src={fbLogo}
                  alt="first bank logo"
                  className="logo"
                  style={{ height: 150, width: 150 }}
                />
              </div>
              <div
                className="align-items-center justify-content-center"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#EAAA00",
                }}
              >
                <h3 style={{ color: "#022E64", textAlign: "center" }}>
                  Total Number of disputes{" "}
                </h3>
                <h3 style={{ color: "#022E64", textAlign: "center" }}>
                  this week
                </h3>
                <h4
                  className="font-weight-bold"
                  style={{ fontSize: 18, color: "#022E64", marginTop: 6 }}
                >
                  97
                </h4>
              </div>
              <div style={{ flex: 1 }}></div>
              <div
                className="align-items-center justify-content-center"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#022E64",
                }}
              >
                <h3 style={{ color: "#fff", textAlign: "center" }}>
                  Total Number of resolved disputes{" "}
                </h3>
                <h3 style={{ color: "#fff", textAlign: "center" }}>
                  this week
                </h3>
                <h4
                  className="font-weight-bold"
                  style={{ fontSize: 18, color: "#fff", marginTop: 6 }}
                >
                  97
                </h4>
              </div>
            </BoxShadow>
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
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <Header
                          style={{
                            marginTop: 4,
                            marginBottom: 4,
                            fontSize: 15,
                          }}
                        >
                          Please attach an evidence of transaction
                        </Header>
                      </div>
                    </div>
                    <div className="row py-4">
                      <div className="col-md-12">
                        <Button style={{ width: 150 }}>Upload</Button>
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

export default TransactionRequest;

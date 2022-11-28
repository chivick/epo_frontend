import React from "react";
import profile from "../assets/images/profile.png";
import user from "../assets/images/user.svg";
import AltDashboard from "../hoc/AltDashboard";
// const { default: Dashboard } = require("../hoc/Dashboard");
const {
  Header,
  BoxShadow,
  SummaryBox,
  Label,
  Input,
  Hr,
  Button,
} = require("../custom");

function AccountSetting() {
  return (
    <AltDashboard>
      <div className="container">
        <Header>Account Setting</Header>
        <div className="row mt-2">
          <div className="col-md-4">
            <BoxShadow
              className="account-profile-section py-4 d-flex justify-content-center align-items-center"
              style={{ backgroundImage: `url(${profile})` }}
            >
              <div>
                <div>
                  <img src={user} alt="user" className="user-photo" />
                </div>
                <h2
                  className="my-2 font-weight-bold"
                  style={{ textAlign: "center", fontSize: 16 }}
                >
                  Joshua Brown
                </h2>
                <span
                  style={{
                    textAlign: "center",
                    display: "block",
                    fontSize: 12,
                  }}
                >
                  ID NO: 101901
                </span>
                <h6
                  className="my-2 font-weight-bold"
                  style={{ textAlign: "center", fontSize: 14 }}
                >
                  SYSTEM ADMIN
                </h6>
              </div>
            </BoxShadow>
          </div>
          <div className="col-md-8">
            <SummaryBox className="py-4 px-2">
              <div className="col-md-8">
                <div className="row mt-2">
                  <div className="col-md-6">
                    <Label>First name</Label>
                    <Input />
                  </div>
                  <div className="col-md-6">
                    <Label>Last name</Label>
                    <Input />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <Label>Email</Label>
                    <Input />
                  </div>
                  <div className="col-md-6">
                    <Label>City</Label>
                    <Input />
                  </div>
                </div>
              </div>
              <Hr />
              <section className="px-3 my-3">
                <div className="row mt-2">
                  <div className="col-md-4">
                    <Label>Change password</Label>
                    <Input />
                    <Input />
                  </div>
                </div>
                <div style={{ width: 120 }}>
                  <Button>Save</Button>
                </div>
              </section>
            </SummaryBox>
          </div>
        </div>
      </div>
    </AltDashboard>
  );
}

export default AccountSetting;

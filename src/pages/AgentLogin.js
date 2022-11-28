import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { LoginContainer, Input, Button, Header } from "../custom";
import fbLogo from "../assets/images/fbLogo.png";
import * as actions from "../actions";
import { connect } from "react-redux";
import App from "../services";
import Swal from "sweetalert2";
import { log } from "../services/helpers";
import { baseURL } from "../Axios";

let validatedTokenResponse = {};

function AgentLogin({ startLoading, history }) {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [stage, setStage] = useState(0);
  const loginUser = async (e) => {
    e.preventDefault();
    try {
      startLoading(true);
      if (email.trim() === "" || otp.trim() === "") {
        App.showNotifiction("info", "Incomplete request");
        setStage(0);
        return;
      }
      // const response = await App.login(email, otp);
      App.setLocalStorage(email, "fb-username");

      // if (response.status === 200) {
        
        fetch(`${baseURL}/Account/ValidateToken/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf8",
          },
          body: JSON.stringify({
            "Token": otp,
            "UserId": email,
            }),
        })
          .then(async tokenResponse => {
            if (!tokenResponse.ok) {
              App.showNotifiction("error", "An error occured. Please verify Token.");
              throw new Error(tokenResponse.statusText)
            }
            // redirectUserIfOK()
            return await tokenResponse.json();
          }).then(data => {
            App.showNotifiction("success", "Token Verified");
            return redirectUserIfOK(data);
          })
          .catch(error => {
            App.showNotifiction("error", error);
          }).finally(() => {
            startLoading(false);
          });
      // }

    } catch (error) {
      startLoading(false);
      console.error(error);
      if (error.response) {
        const respponse = error.response.data.Message;

        const errorDt = JSON.parse(respponse);
        App.showNotifiction("error", errorDt.Message);

        console.error(errorDt.ExceptionMessage);
      }
    }
  };
  
  const redirectUserIfOK = (response) => {
    // redirect only after successful otp validation
    console.log("initial","res", response);
      App.showNotifiction("success", "Login Successful. Redirecting...");
      const {
        Role,
        Token,
        TotalAssigned,
        TotalResolved,
        WeeklyAssigned,
        WeeklyResolved,
        Teams,
        PendingDispute,
        Logs,
        Audit,
        Notification,
        UserCount,
      } = response;
      console.log(Role);
      switch (Role) {
        case "Agent":
          App.setLocalStorage(Token, "fb-token");
          App.setLocalStorage(`${TotalAssigned}`, "fb-totalAssigned");
          App.setLocalStorage(JSON.stringify(Teams), "fb-teams");
          App.setLocalStorage(`${WeeklyAssigned}`, "fb-weeklyAssigned");
          App.setLocalStorage(`${TotalResolved}`, "fb-totalResolved");
          App.setLocalStorage(`${WeeklyResolved}`, "fb-weeklyResolved");
          App.setLocalStorage(
            JSON.stringify(PendingDispute),
            "fb-pendingDispute"
          );
          App.setLocalStorage(Role, "fb-role");
          setTimeout(() => App.disMissToast(), 1300);
          return history.push("/user/dashboard");
        default:
          return;
      }
  }
  
  const getOtp = async (e) => {
    try {
      e.preventDefault();
      if (email.trim() === "")
        return App.showNotifiction("info", "Please provide email address");
      startLoading(true);
      await App.sendOtp(email);
      startLoading(false);
      App.showNotifiction(
        "success",
        "OTP sent successfully, please check your email"
      );
      setStage(1);
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };
  const loginAgent = (e) => {
    try {
      e.preventDefault();
      if (otp.trim() === "") {
        return App.showNotifiction("info", "Please provide OTP");
      }
      loginUser(e);
    } catch (error) {
      App.logError(error);
    }
  };
  return (
    <div className="lg-bg-cover">
      <LoginContainer className="login-container">
        <form onSubmit="return false;" noValidate>
          <legend>
            <img src={fbLogo} alt="logo" />
          </legend>
          <fieldset>
            {stage === 0 && (
              <Input
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            )}
            <Header style={{ fontSize: 14 }}>
              <span style={{ marginRight: 4 }}>I am not an agent.</span>
              <Link to="/login">Back to Login</Link>
            </Header>
            {stage === 1 && (
              <Input
                type="number"
                name="otp"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                placeholder="One Time Password(OTP)"
              />
            )}
            {stage === 0 && (
              <Button onClick={getOtp} type="submit">
                Get OTP
              </Button>
            )}
            {stage === 1 && (
              <Button onClick={loginAgent} type="submit">
                Login
              </Button>
            )}
          </fieldset>
        </form>
      </LoginContainer>
    </div>
  );
}

export default withRouter(connect(null, actions)(AgentLogin));

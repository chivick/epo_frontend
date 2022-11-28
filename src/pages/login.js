import React, { useRef, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { LoginContainer, Input, Button, TextButton, Header } from "../custom";
import fbLogo from "../assets/images/fbLogo.png";
import * as actions from "../actions";
import { connect } from "react-redux";
import App from "../services";
import Swal from "sweetalert2";
import { log, appConstants, arraySome } from "../services/helpers";
import { baseURL, mayJunebaseURL, sprint2Axios } from "../Axios";

let validatedTokenResponse = {};

function Login({ startLoading, history }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  let [asteriskPassword, setAsteriskPassword] = useState("");
  // const [passwordToken, setPasswordToken] = useState("");
  let passwordToken = "";
  
  const loginUser = async (e) => {
    e.preventDefault();
    
    try {
      startLoading(true);
      if (userName.trim() === "" || password.trim() === "") {
        
      startLoading(false);
      App.showNotifiction("Info", "UserName or Password cannot be empty");
        return;
      }
      
      // setAsteriskPassword("");
      asteriskPassword = "";
      const response = await App.login(userName, password);
      log("initial","response", response);

      
      log("initial","Role", response);
      
      App.setLocalStorage(userName, "fb-username");
      startLoading(false);
      if (response.status === 200) {
        startLoading(false);
        // return redirectUserIfOK(response.data);
        
        Swal.fire({
          icon: "info",
          title: `Token`,
          text: `Enter Token`,
          html: '<input id="swal-input1" class="swal2-input" autofocus type="tel">',
          inputValue: asteriskPassword,
          inputAttributes: {
            autocapitalize: 'off',
            type: 'number'
          },
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: `Submit`,
          didOpen: () => {
            document.getElementById("swal-input1").onkeyup = function (ev) {
              // const e = parseInt(e.which)
              let value = ev.target.value;
                
              // if value < password dont substring
              if (!(value.length < asteriskPassword.length)) {
                if (value.length > 1) value = passwordToken + value[value.length-1]
              }
              
                if (value.length > 0) {
                if (ev.which === 8 || (ev.which >= 48 && ev.which <= 57) || (ev.which >= 1776 && ev.which <= 1785)) {

                // if ((ev.which <= 90 && ev.which >= 48) || (ev.which >= 96 && ev.which <= 105)) {
                  // alert('keycode ' + ev.which + '  triggered this event');
                  //do whatever
                  
                  if (value.length < asteriskPassword.length) {
                    asteriskPassword = asteriskPassword.substr(0, asteriskPassword.length-1)
                    setAsteriskPassword(asteriskPassword);
                    passwordToken = passwordToken.substr(0, passwordToken.length-1);
                  }
                  else {
                    asteriskPassword = asteriskPassword + "*"
                    setAsteriskPassword(asteriskPassword);
                    passwordToken = value;
                  }

                  document.getElementById("swal-input1").value = asteriskPassword;
                }
                else {
                  document.getElementById("swal-input1").value = asteriskPassword;
                  return;
                }
              }
              else {
                passwordToken = "";
                asteriskPassword = "";
                setAsteriskPassword(asteriskPassword);
              }

            }
          },
          preConfirm: (value) => {
            if (passwordToken.toString().length != 8) {
              Swal.showValidationMessage(
                `Token length must be 8.`
              );
              return;
            }
            startLoading(true);
            return fetch(`${baseURL}/Account/ValidateToken/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json; charset=utf8",
              },
              body: JSON.stringify({
                "Token": passwordToken,
                "UserId": response.data,
                }),
            })
              .then(async tokenResponse => {
                if (!tokenResponse.ok) {
                  throw new Error(tokenResponse.statusText)
                }
                // redirectUserIfOK()
                validatedTokenResponse = tokenResponse.json();
                return validatedTokenResponse
              })
              .catch(error => {
                log("initial", error);
                Swal.showValidationMessage(
                  `Request failed: ${error}`
                )
              }).finally(() => startLoading(false))
          },
        }).then(async (result) => {
          log("initial", "res", result);
          if (result.isConfirmed) {
            // const isConfirmed = window.confirm(`Delete ${user.StaffId}?`);
            startLoading(true);
            startLoading(false);
            // log("initial", "res2", await validatedTokenResponse);
            if (validatedTokenResponse) {
              App.showNotifiction("success", "Token Verified");
              return redirectUserIfOK(await validatedTokenResponse);
            }
            
          }
        });
      }

      
    } catch (error) {
      startLoading(false);
      console.error("error Login: ", error);
      App.logError(error);
      // if (error.response) {
      //   const respponse = error.response.data.Message;

      //   const errorDt = JSON.parse(respponse);
      //   App.showNotifiction("error", errorDt.Message);

      //   console.error(errorDt.ExceptionMessage);
      // }
    }
  };

  const redirectUserIfOK = (response) => {
    // redirect only after successful otp validation
      // App.showNotifiction("success", "Login Successful. Redirecting...");
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
        AllUsers,
        AllRequest,
        TotalResolvedCount,
        TotalUnresolved,
      } = response;
      App.setLocalStorage(userName, "fb-staffId");
      log("initial", "data", TotalAssigned, TotalUnresolved, TotalResolvedCount, Role);
      switch (Role) {
        case appConstants.admin[0]:
          App.setLocalStorage(Token, "fb-token");
          // App.setLocalStorage(JSON.stringify(Logs), "fb-logs");
          App.setLocalStorage(JSON.stringify(Notification), "fb-notification");
          App.setLocalStorage(`${UserCount}`, "fb-user-count");
          App.setLocalStorage(JSON.stringify(Audit), "fb-audit");
          App.setLocalStorage(Role, "fb-role");
          setTimeout(() => App.disMissToast(), 1300);
          return history.push("/s-manage-users");
        case appConstants.maker[0]:
          App.setLocalStorage(Token, "fb-token");
          App.setLocalStorage(JSON.stringify(Logs), "fb-logs");
          App.setLocalStorage(JSON.stringify(Notification), "fb-notification");
          App.setLocalStorage(`${UserCount}`, "fb-user-count");
          App.setLocalStorage(JSON.stringify(Audit), "fb-audit");
          App.setLocalStorage(Role, "fb-role");
          setTimeout(() => App.disMissToast(), 1300);
          return history.push("/maker");
        case appConstants.checker[0]:
          App.setLocalStorage(Token, "fb-token");
          App.setLocalStorage(JSON.stringify(Logs), "fb-logs");
          App.setLocalStorage(JSON.stringify(Notification), "fb-notification");
          App.setLocalStorage(`${UserCount}`, "fb-user-count");
          App.setLocalStorage(JSON.stringify(Audit), "fb-audit");
          App.setLocalStorage(Role, "fb-role");
          setTimeout(() => App.disMissToast(), 1300);
          return history.push("/checker");
        case appConstants.audit[0]:
          App.setLocalStorage(Token, "fb-token");
          App.setLocalStorage(JSON.stringify(Logs), "fb-logs");
          App.setLocalStorage(JSON.stringify(Audit), "fb-audit");
          App.setLocalStorage(`${WeeklyAssigned}`, "fb-allUsers");
          App.setLocalStorage(Role, "fb-role");
          App.setLocalStorage(`${TotalAssigned}`, "fb-allRequest");
          
          App.setLocalStorage(JSON.stringify(Teams), "fb-teams");
          App.setLocalStorage(`${TotalResolved}`, "fb-totalResolved");
          App.setLocalStorage(`${WeeklyResolved}`, "fb-weeklyResolved");
          App.setLocalStorage(
            JSON.stringify(PendingDispute),
            "fb-pendingDispute"
          );
          
          setTimeout(() => App.disMissToast(), 1300);
          return history.push("/logs");
        case appConstants.admin[1]:
          App.setLocalStorage(Token, "fb-token");
          App.setLocalStorage(JSON.stringify(Logs), "fb-logs");
          App.setLocalStorage(JSON.stringify(Notification), "fb-notification");
          App.setLocalStorage(`${UserCount}`, "fb-user-count");
          App.setLocalStorage(JSON.stringify(Audit), "fb-audit");
          App.setLocalStorage(Role, "fb-role");
          
          App.setLocalStorage(`${TotalResolvedCount}`, "fb-totalResolvedCount");
          App.setLocalStorage(`${TotalUnresolved}`, "fb-totalUnresolved");
          App.setLocalStorage(`${TotalAssigned}`, "fb-totalAssigned");
          setTimeout(() => App.disMissToast(), 1300);
          return history.push("/admin");
        case appConstants.teamLead[0]:
          log("initial", "data Role", Role);
          
          
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
          if (Teams.includes("ProductRegister")) {
            return history.push("/user/form");
          }
          
          return history.push("/user/dashboard");
          break;
        case appConstants.user[0]:
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
          
          if (arraySome(appConstants.ussdTeams, Teams)) {
            return history.push("/user/crm/dashboard");
          }

          if (Teams.includes("ProductRegister")) {
            return history.push("/user/form");
          }

          return history.push("/user/dashboard");
        case appConstants.agent[0]:
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
        case appConstants.reconTeamLead[0]:
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
        case appConstants.recon[0]:
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

  const usernameRef = useRef();
  const passwordRef = useRef();

  return (
    <div className="lg-bg-cover">
      <LoginContainer className="login-container">
        <form onSubmit="return false;" noValidate>
          <legend>
            <img src={fbLogo} alt="logo" />
          </legend>
          <fieldset>
            <Input
              ref={usernameRef}
              type={"text"}
              name="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Username"
              autoComplete="off"
              readonly 
              onFocus={(e) => {
                usernameRef.current.removeAttribute('readonly');
                // this.removeAttribute('readonly');
              }}
            />
            <Input type="password" style={{display: 'none'}} />
            <Input
              ref={passwordRef}
              type="text"
              defaultValue={""}
              value={asteriskPassword}
              onChange={(e) => {
                let value = e.target.value;
                
                // if value < password dont substring
                if (!(value.length < asteriskPassword.length)) {
                  if (value.length > 1) value = password + value[value.length-1]
                }
                
                if (value == "") {
                  setAsteriskPassword("");
                }
                else {
                  if (value.length < asteriskPassword.length) {
                    setAsteriskPassword(asteriskPassword.substr(0, asteriskPassword.length-1));
                    setPassword(password.substr(0, password.length-1));
                  }
                  else {
                    setAsteriskPassword(asteriskPassword + "*");
                    setPassword(value);
                  }
                }
                
              }}
              placeholder="Password"
              autoComplete="off"
              readonly 
            />

            <Button onClick={loginUser} type="submit">
              Login
            </Button>
            <Header style={{ fontSize: 14 }}>
              Are you an Agent/Merchant? <Link to="/agent/login">Login</Link>
            </Header>
            {/* <div className="d-flex justify-content-center mb-2">
              <Link to="#">
                <TextButton>Forgot password?</TextButton>
              </Link>
            </div> */}
          </fieldset>
        </form>
      </LoginContainer>
    </div>
  );
}

export default withRouter(connect(null, actions)(Login));

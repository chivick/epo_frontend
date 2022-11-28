import React from "react";
import { NavContainer, NavIconWrapper } from "../custom";
import { Link, withRouter } from "react-router-dom";
import fbLogo from "../assets/images/fbLogo.png";
import profile from "../assets/images/profile.svg";
import bell from "../assets/images/bell.png";
import NotificationPanel from "./NotifcationPanel";
import App from "../services";
import logout from "../assets/images/logout.svg";
import { appConstants } from "../services/helpers";
import { startLoading } from "../actions";
import UpdateISODRole from "./updateISODRole.popup";

function NavBarT({ history }) {
  const logOutUser = async () => {
    try {
      startLoading(true);
      await App.logOut();
      
      App.clearAllFromLocalStorage();
      App.showNotifiction("success", "Logout successful");
      setTimeout(() => {
        // startLoading(false);
        history.push("/login");
    }, 1300);
    
    setTimeout(() => {
      startLoading(false);
  }, 2000);
    } catch (error) {
      startLoading(false);
      App.logError(error);
      startLoading(false);
      // if (error.response) {
      //   const respponse = error.response.data.Message;

      //   const errorDt = JSON.parse(respponse);
      //   App.showNotifiction("error", errorDt.Message);

      //   console.error(errorDt.ExceptionMessage);
      // }
    }
    finally {
      startLoading(false);
    }
    
  };

  const homeURL = () => {
    const Role = App.getUserRole();
    if (Role) {
      switch (Role) {
        case appConstants.admin[0]:
          return "/s-manage-users";
        case appConstants.maker[0]:
          return "/maker";
        case appConstants.checker[0]:
          return "/checker";
        case appConstants.audit[0]:
          return "/logs";
        case appConstants.admin[1]:
          return "/admin";
        case appConstants.user[0]:
          return "/user/dashboard";
        case appConstants.agent[0]:
          return "/user/dashboard";
        case appConstants.reconTeamLead[0]:
          return "/user/dashboard";
        case appConstants.teamLead[0]:
          return "/user/dashboard";
        default:
          return "/login";
      }
    }
    
    return "/login";
  }
  
  const getUserTeams = App.getUserTeams();
  const getUserRole = App.getUserRole();

  return (
    <NavContainer>
      <section className="nav-bar-section1">
        <Link to={homeURL}>
          <img src={fbLogo} alt="logo" className="logo" />
        </Link>
      </section>
      {
        (getUserTeams && getUserTeams.includes("ProductRegister")) 
        ?
          <section className="nav-bar-section2" >
            <ul style={{paddingTop: 0, paddingRight: 2, paddingBottom: 0, paddingLeft: 2}}>
              {
                //App.approveRole() &&
                getUserRole && getUserRole == appConstants.teamLead[0] && 
                <>
                    <li>
                    <Link to="/user/entity">New Entity</Link>
                  </li>
                  <li>
                    <Link to="/user/business-group">Business Groups</Link>
                  </li>
                  <li>
                    <Link to="/user/directorates">Directorates</Link>
                  </li>
                  <li>
                    <Link to="/user/departments">Departments</Link>
                  </li>
                </>
              }
              
              <li>
                <Link to="/user/form">New Product Paper</Link>
              </li>
              <li>
                <Link to="/form/search">Search Product Paper</Link>
              </li>


              
            </ul>
          </section>
        :
        <section className="nav-bar-section2" >
          <ul style={{paddingTop: 0, paddingRight: 2, paddingBottom: 0, paddingLeft: 2}}>
            {[appConstants.admin[0]].includes(App.getUserRole()) ? (
              <li>
                <Link to="/">Dashboard</Link>
              </li>
            ) : null}
            {App.getUserRole() === appConstants.admin[1] ? (
              <li>
                <Link to="/admin">Dashboard</Link>
              </li>
            ) : null}
            {["User", "TeamLead", appConstants.recon[0], appConstants.reconTeamLead[0]].includes(App.getUserRole())? (
              <li>
                <Link to="/user/dashboard">Dashboard</Link>
              </li>
            ) : null}
            {App.getUserRole() === "Agent" ? (
              <li>
                <Link to="/user/dashboard">Dashboard</Link>
              </li>
            ) : null}
            {[...appConstants.recon,"TeamLead", "Agent", "User", appConstants.reconTeamLead[0]].includes(App.getUserRole()) ? (
              <li>
                <Link to="/m-disputes">Disputes</Link>
              </li>
            ) : null}
            {[...appConstants.recon,"TeamLead", "Agent", "User", appConstants.reconTeamLead[0]].includes(App.getUserRole()) ? (
              <li>
                <Link to="/m-revalidation">Revalidation</Link>
              </li>
            ) : null}
            {/* {[].includes(App.getUserRole()) ? (
              <li>
                <Link to="/m-disputes">Dispute</Link>
              </li>
            ) : null} */}
            {/* {["Admin"].includes(App.getUserRole()) ? null : (
              <li>
                <Link to="/user/disputes">Assigned</Link>
              </li>
            )} */}
            {/* {App.getUserRole() === "Admin" ||
            App.getUserRole() === "TeamLead" ||
            App.getUserRole() === "ReconTeamLead" ? (
              <li>
                <Link to="/users/manage">Users</Link>
              </li>
            ) : null} */}

            {[appConstants.maker[0], appConstants.admin[1],"TeamLead"].includes(App.getUserRole()) &&
              <li>
                <Link to="/users/manage">Users</Link>
              </li>
            }
            {[appConstants.maker[0], appConstants.admin[1]].includes(App.getUserRole()) ? (
              <li>
                <Link to="/agents/manage">Agents&amp;Merchants</Link>
              </li>
            ) : null}

            {/* {["Maker", "Admin"].includes(App.getUserRole()) ? (
              <li>
                <Link to="/agents/manage">Agents &amp; Merchants</Link>
              </li>
            ) : null} */}

            {/* {App.getUserRole() === "Admin" ? (
              <li>
                <Link to="/teams">Teams</Link>
              </li>
            ) : null} */}
            {["Maker", appConstants.admin[1]].includes(App.getUserRole()) &&
              <li>
                <Link to="/teams">Teams</Link>
              </li>
            }
            {[appConstants.maker[0], appConstants.checker[0]].includes(App.getUserRole()) &&
              <li onClick={() => window.$("#updateISODRole").modal("show")}>
                <Link to="#">Change Role</Link>
              </li>
            }
            {/* {["Admin"].includes(App.getUserRole()) ? null : (
              <li>
                <Link to="/agent/sent-evidences">Resolved</Link>
              </li>
            )} */}
            {/* {App.getUserRole() === "Admin" ? (
              <li>
                <Link to="/logs">Setting</Link>
              </li>
            ) : null} */}
            {[ appConstants.admin[1], appConstants.audit[0]].includes(App.getUserRole()) && (
              <li>
                <Link to="/logs">Logs</Link>
              </li>
            )}
            {[appConstants.teamLead[0]].includes(App.getUserRole()) && (
              <li>
                <Link to="/route-dispute">Route dispute</Link>
              </li>
            )}
            {[appConstants.teamLead[0]].includes(App.getUserRole()) && (
              <li>
                <Link to="/audit-trail">Audit Trail</Link>
              </li>
            )}
            {/* {[appConstants.checker[0]].includes(App.getUserRole()) && (
              <li>
                <Link to="/action">Requests</Link>
              </li>
            )} */}
            {/* , ...appConstants.maker */}
            {
            [appConstants.admin[1]].includes(App.getUserRole()) && (
              <li>
                <Link to="/settings">Settings</Link>
              </li>
            ) 
            }
            {/* {[appConstants.admin[1]].includes(App.getUserRole()) && (
              <li>
                <Link to="/service-logs">Service Logs</Link>
              </li>
            )} */}
            {[appConstants.reconTeamLead[0], appConstants.recon[0]].includes(App.getUserRole()) ? (
              <li>
                <Link to="/ftp-settings">FTP Setting</Link>
              </li>
            ) : null}
            {[appConstants.reconTeamLead[0], appConstants.recon[0]].includes(App.getUserRole()) ? (
              <li>
                <Link to="/recon/reversals">Reversals</Link>
              </li>
            ) : null}
            {[appConstants.reconTeamLead[0], appConstants.recon[0]].includes(App.getUserRole()) ? (
              <>
                <li>
                  <Link to="/recon/gru-open-items">GRU</Link>
                </li>
              </>
            ) : null}
            {/* {App.getUserRole() === "Recon" ? (
              <li>
                <Link to="/view-exceptions">Setting</Link>
              </li>
            ) : null} */}
            {[appConstants.admin[1], appConstants.reconTeamLead[0]].includes(App.getUserRole()) ? (
              <li>
                <Link to="/processes">Processes</Link>
              </li>
            ) : null}
            {/* {App.getUserRole() ===  ? (
              <li>
                <Link to="/processes">Processes</Link>
              </li>
            ) : null} */}
            {App.getUserRole() === appConstants.admin[1] ? (
              <li>
                <Link to="/draft-email">Email</Link>
              </li>
            ) : null}
            
            {[...appConstants.maker, ...appConstants.checker, appConstants.admin[1], ...appConstants.teamLead].includes(App.getUserRole()) ? (
              <li>
                <Link to="/m-requests">My Requests</Link>
              </li>
            ) : null}

            {[...appConstants.teamLead, appConstants.admin[1], ...appConstants.user].includes(App.getUserRole()) ? (
              <li>
                <Link to="/report">Report</Link>
              </li>
            ) : null}

            <li>
              <Link to="/m-login">My Login</Link>
            </li>
            {[...appConstants.user].includes(App.getUserRole()) ? (
              <li>
                <Link to="/adjustment/treat-pending">Arbiter Adjustment</Link>
              </li>
            ) : null}


            

            
          </ul>
        </section>
      }
      <section className="nav-bar-section3">
        {App.getUserRole() === appConstants.admin[1] ? (
          <NavIconWrapper
            className="notif-icon-bell"
            style={{ position: "relative" }}
          >
            <img src={bell} alt="bell" className="nav-icons" />
            <NotificationPanel></NotificationPanel>
          </NavIconWrapper>
        ) : null}

        <NavIconWrapper onClick={logOutUser}>
          <img src={logout} alt="settings" className="nav-icons" />
        </NavIconWrapper>
        <div className="d-flex align-items-center">
          <NavIconWrapper style={{ marginRight: "4px" }}>
            {/* <Link to="/user/account/setting" style={{ display: "flex" }}>
              <img src={profile} alt="profile" className="nav-icons mr-1" />
            </Link> */}
            <Link to="#" style={{ display: "flex" }}>
              <img src={profile} alt="profile" className="nav-icons mr-1" />
            </Link>
          </NavIconWrapper>
          <span>{App.getUserRole()}</span>
        </div>
      </section>
      <section>
        <UpdateISODRole />
      </section>
    </NavContainer>
  );
}

export default withRouter(NavBarT);

import React, { useState } from "react";
import { Button, GrayCircleAvatar, Hr, Select } from "../custom";
import { appConstants, log } from "../services/helpers";
import * as actions from "../actions";
import App from "../services";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
// import { startLoading } from "../actions";

const closeModal = (id) => {
    window.$(id).modal("hide");
};

function UpdateISODRole({ startLoading, history }) {
    const [staffRole ,setStaffRole] = useState();
    const role = App.getUserRole();

    const updateUserRole = async (e) => {
        e.preventDefault();
        if (staffRole.trim() === "") {
          return App.showNotifiction("info", "Must assign user to a role");
        }
        try {
          startLoading(true);
          await App.ISODupdateUserRole(App.getFromLocalStorage('fb-staffId'), staffRole);
          // update localstorage with recent data
          const response = await App.getDashboardSettings();
          if (response) {
            updateLocalStorage(response);
            window.location.reload();
          }else {
            return history.push("/login");
          }
          
          startLoading(false);
          App.showNotifiction("success", "Role updated successfully");
          window.$("#updateISODRole").modal("hide");
        } catch (error) {
          App.logError(error);
          startLoading(false);
        }
        finally{
            startLoading(false);
        }
    };

    const updateLocalStorage = (response) => {
        const {
            Role,
            Token,
            Logs,
            Audit,
            Notification,
            UserCount,
          } = response;

          log("initial", Role, );
        
          switch (Role) {
            case appConstants.checker[0]:
                App.setLocalStorage(Token, "fb-token");
                App.setLocalStorage(JSON.stringify(Logs), "fb-logs");
                App.setLocalStorage(JSON.stringify(Notification), "fb-notification");
                App.setLocalStorage(`${UserCount}`, "fb-user-count");
                App.setLocalStorage(JSON.stringify(Audit), "fb-audit");
                App.setLocalStorage(Role, "fb-role");
                setTimeout(() => App.disMissToast(), 1300);
                return history.push("/checker");
            case appConstants.maker[0]:
              App.setLocalStorage(Token, "fb-token");
              App.setLocalStorage(JSON.stringify(Logs || []), "fb-logs");
              App.setLocalStorage(JSON.stringify(Notification || []), "fb-notification");
              App.setLocalStorage(`${UserCount}`, "fb-user-count");
              App.setLocalStorage(JSON.stringify(Audit || []), "fb-audit");
              App.setLocalStorage(Role, "fb-role");
              setTimeout(() => App.disMissToast(), 1300);
              return history.push("/maker");
            default:
                return;
        }
    }
    
    
    return (
        <div
          class="modal fade"
          id="updateISODRole"
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
                    Change My Role
                  </h2>
                  <GrayCircleAvatar onClick={() => closeModal("#updateISODRole")}>
                    X
                  </GrayCircleAvatar>
                </section>
                <Hr />
                <section className="py-3 d-flex align-items-center px-3">
                  <h5 style={{ fontSize: 12 }}>
                    Select My Role
                  </h5>
                </section>
                <Hr />
                <div className="row mt-3 px-4 pb-5">
                  <div className="col-md-6">
                    <Select
                        value={staffRole}
                        onChange={(e) => setStaffRole(e.target.value)}
                    >
                        <option value="">Select Role</option>
                        {
                        [appConstants.maker[0],appConstants.checker[0]].includes(role) &&
                        <>
                            {
                                role ==appConstants.maker[0] ?
                                    <option value={appConstants.checker[0]}>ISOD Checker</option>
                                :
                                    <option value={appConstants.maker[0]}>ISOD Maker</option>
                            }
                        </>
                        }
                    </Select>
                    <div style={{ width: 170 }}>
                      <Button onClick={(e) => updateUserRole(e)}>Change Role</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
}

export default withRouter(connect(null, actions)(UpdateISODRole));
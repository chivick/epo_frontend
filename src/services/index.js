import axios, { baseURL, sprint2Axios } from "../Axios";

import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import localIpUrl from "local-ip-url";
import { appConstants, log } from "./helpers";
import App from "../App";
import { startLoading } from "../actions";

let isShowingErrorNotification = false;

class AppService {
  constructor() {
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.login = this.login.bind(this);
  }
  isAuthenticated() {
    if (localStorage.getItem("fb-token")) return true;
    return false;
  }
  getUserRole() {
    if (this.isAuthenticated()) {
      return this.getFromLocalStorage("fb-role");
    }
    return null;
  }
  getUserTeams() {
    if (this.isAuthenticated()) {
      return this.getFromLocalStorage("fb-teams");
    }
    return null;
  }
  approveRole() {
    return true;
  }
  getToken() {
    if (this.isAuthenticated()) {
      return this.getFromLocalStorage("fb-token");
    }
    return null;
  }
  getStaffId() {
    if (this.isAuthenticated()) {
      return this.getFromLocalStorage("fb-staffId");
    }
    return null;
  }
  login(username = "", password = "") {
    return new Promise(async (resolve, reject) => {
      // console.log(localIpUrl());
      try {
        if (username.trim() === "" || password.trim() === "") {
          return;
        }
        const token = Buffer.from(`${username}:${password}`, "utf8").toString(
          "base64"
        );
        const response = await axios.post(
          "/Account/Login",
          { IpAddress: localIpUrl() },
          {
            headers: {
              Authorization: `Basic ${token}`,
            },
          }
        );
        
        return resolve(response);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }
  registerFTPSettings(userName, password, ipAddress, source, platform, ssh) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const payload = Buffer.from(
          `${userName}{Data}${password}{Data}${ssh}{Data}${ipAddress}{Data}${source}`,
          "utf8"
        ).toString("base64");
        const response = await axios.post(
          `/Recon/FTPSetting?platform=${platform}`,
          { 
            // IpAddress: "10.10.10.10" 
            IpAddress:  localIpUrl()
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-FTP-Credentials": `${payload}`,
            },
          }
        );
        return resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }

  registerMasterComSetting(userName, password, ipAddress) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const payload = Buffer.from(
          `${userName}{Data}${password}{Data}${null}{Data}${ipAddress}{Data}${null}`,
          "utf8"
        ).toString("base64");
        const response = await axios.post(
          `/Recon/FTPSetting?platform=MastercomChargebackFTPCredentials`,
          { IpAddress: ipAddress },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-FTP-Credentials": `${payload}`,
            },
          }
        );
        return resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }

  showNotifiction(
    type = "info",
    message = "",
    autoClose = true,
    timeout = 1000,
    cb
  ) {
    // auto sty
    switch (type) {
      case "info":
        toast.info(message, {
          onClose: cb,
          autoClose: autoClose,
          delay: timeout,
          style: {backgroundColor: "#0093c9", color: "#fff"}
        });
        break;
      case "error":
        if (!isShowingErrorNotification) {
          isShowingErrorNotification = true;  
          setTimeout(() => {
            isShowingErrorNotification = false;
          }, timeout);
          
          toast.error(message, {
            onClose: cb,
            autoClose: autoClose,
            delay: timeout,
            style: {backgroundColor: "#d0122d", color: "#fff"}
          });
        }

        break;
      case "warining":
        toast.warning(message, {
          onClose: cb,
          autoClose: autoClose,
          delay: timeout,
          style: {backgroundColor: "#edaa00", color: "#fff"}
          
        });
        break;
      case "success":
        toast.success(message, {
          onClose: cb,
          autoClose: autoClose,
          delay: timeout,
          style: {backgroundColor: "#7cbb4c", color: "#fff"}
        });
        break;
      default:
        toast.info(message, {
          onClose: cb,
          autoClose: autoClose,
          delay: timeout,
          style: {backgroundColor: "#0093c9", color: "#fff"}
        });
    }
  }
  encryptData(data = "") {
    const KEY = "DISPUTEMANAGE@BEHDUE@";
    return CryptoJS.AES.encrypt(data, KEY);
  }
  decryptData(encryptedData = "") {
    const KEY = "DISPUTEMANAGE@BEHDUE@";
    const decrypted = CryptoJS.AES.decrypt(encryptedData, KEY);

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
  setLocalStorage(data = "", key) {
    const encryptedData = this.encryptData(data);
    localStorage.setItem(key, encryptedData);
  }
  getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    if (data) {
      return this.decryptData(data);
    }
    return null;
  }

  clearAllFromLocalStorage() {
    return localStorage.clear();
  }
  disMissToast() {
    toast.dismiss();
  }
  convertToTimeString(timeStamp) {
    const date = new Date(timeStamp).toLocaleDateString();
    const hours = new Date(timeStamp).getHours();
    const minutes = new Date(timeStamp).getMinutes();
    const appendZero = (time) => (time < 10 ? `0${time}` : time);
    return `${date} at ${appendZero(hours)}:${appendZero(minutes)}`;
  }
  sendOtp(email = "") {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(
          `/Agent/GenerateToken?email=${email}`
        );
        return resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }
  logOut() {
    return new Promise(async (resolve, reject) => {
      const token = this.getFromLocalStorage("fb-token");

      try {
        const response = await axios.post(
          "/Account/LogOut",
          {
            // IpAddress: "192.168.32.1",
            IpAddress: localIpUrl()
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }
  saveEmail(Type = "", Subject = "", Body = "") {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(
          `Admin/SaveMail`,
          {
            Subject,
            Type,
            Body,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }
  getSavedEmail(type) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get(`/Admin/GetMail?model=${type}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }
  getEmails(Type = "", Subject = "", Body = "") {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(
          `Admin/SaveMail`,
          {
            Subject,
            Type,
            Body,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }
  viewJournal(disputeId = "") {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(
          `/Dispute/VerifyTransaction?disputeId=${disputeId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }

  searchUserPendingDispute(dispute) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get(
          `/Dispute/SearchPending?dispute=${dispute}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }

  searchReconPendingDispute(dispute) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get(
          `/Recon/SearchPending?dispute=${dispute}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }
  searchAgentPendingDispute(dispute) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get(
          `/Agent/SearchPending?dispute=${dispute}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }
  
  
  
  createTeam(teamName = "") {
    if ([...appConstants.maker].includes(this.getUserRole())) {
      return this.createRequest("TeamCreation", {team: teamName})
    }

    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
       let response = {};
       response = await axios.post(
          `/Admin/CreateTeam?team=${teamName}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );        
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  logError(error = {}) {
    if (error.response && error.response.data.Message) {
      log("initial",error.response);
      log("initial",typeof error.response.data);
      const respponse = error.response.data.Message;
      log("initial",typeof respponse);
      const errorDt =
        typeof error.response.data === "string"
          ? JSON.parse(respponse)
          : respponse;
      //Message
      log("initial",typeof errorDt);
      let erroDtstringified;

      try {
        erroDtstringified = JSON.parse(errorDt);
      } catch (error) {
        erroDtstringified = errorDt;
      }

      this.showNotifiction(
        "error",
        erroDtstringified.Message
          ? erroDtstringified.Message
          : "Some errors were encountered"
      );

      
      log("initial",errorDt.ExceptionMessage);
    } else if (error && error.response) {
      
      log("initial","error is: ", error.response);
      if (error.response.status === 401) {
        log("initial",error);
        log("initial",error.response);
        this.showNotifiction("error", "Unauthorized User");
        this.clearAllFromLocalStorage();
        return setTimeout(
          () => (window.location = window.origin + "/login"),
          2000
        );
      }
      this.showNotifiction("error", "Some errors were encountered");
    } else {
      log("initial",error);
      log("initial",error.response);
    }
  }

  redirectToLogin() {
    this.showNotifiction("error", "Unauthorized User");
        this.clearAllFromLocalStorage();
        return setTimeout(
          () => (window.location = window.origin + "/login"),
          2000
        );
  }

  getAuditTrail() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post("/Admin/GetAuditTrail", 
        {
          PageNumber: 0,
        }, {
          
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }
  
  async getTeamsForReRoute() {
    try {
      const token = this.getToken();
      return await axios.get("/Admin/GetAllTeams", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => response.data)
      ;
      // resolve();
    } catch (error) {
      // reject(error);
      this.logError(error);
      return;
    }
  }

  getTeams() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get("/Admin/GetAllTeams", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  getReconDisputes() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get("/Recon/GetAllPending", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }
  async getAllTeamDispute() {
    try {
      const token = this.getToken();
      return await axios.get("/Dispute/GetAllTeamDispute", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => response)
      .catch(error => {
        this.logError(error);
      });
    } catch (error) {
      // reject(error);
      this.logError(error);
    }
  }
  async reRouteDispute(data) {
    try {
      const token = this.getToken();
      return await axios.post("/Dispute/RerouteDispute", data ,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => response)
      .catch(error => {
        this.logError(error);
      });
    } catch (error) {
      // reject(error);
      this.logError(error);
    }
  }
  
  getDashboardSettings() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get(`/Account/Dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }
  
  async getMyRequests() {
    const token = this.getToken();
    try {
      return await fetch(`${baseURL}/ISOC/ViewAllRequest`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async tokenResponse => {
        if (!tokenResponse.ok) {
          if (tokenResponse.status == 401) {
            return this.redirectToLogin();
          }

          throw new Error(tokenResponse.statusText)
        }
        return await tokenResponse.json()
      })
      .catch(error => {
        console.log("Error", error);
        this.logError(error);
      });
    }
    catch(error) {
      this.logError(error);
    }
  }
  
  getAllRequests() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get(`/ISOC/ViewAllRequest`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("resonse", response.status);
        
        if (response.status == 401) {
          return this.redirectToLogin();
        }
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }

  getLoginReport() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get(`ISOC/LoginReport`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }

  declineJournal(disputeId, reason) {
    console.table({ disputeId, reason });
    if (!disputeId || !reason) {
      throw new Error("Pass all paramter");
    }
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(
          `/Dispute/DeclineAgentRecipt?disputeId=${disputeId}&reason=${reason}	
        `,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  getUserDisputes() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get("/Dispute/GetAllPending", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  getAgentDisputes() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get("/Agent/GetAllPending", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  getAllLog() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get("/Admin/GetAllLogs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }
  getAllAgents() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get("/Admin/GetAllAgents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  unAssignReconProcesses(processId) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(
          `/Recon/RemoveReconUser?processId=${processId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  agentDecline(disputeId) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(
          `/Agent/FailedTransaction?disputeId=${disputeId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  
  
  
  userAcceptDispute(disputeId, file) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const formData = new FormData();
        formData.append("image", file);
        const response = await axios.post(
          `/Dispute/CloseDispute?disputeId=${disputeId}&accepted=${true}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  upgradeAgent(userType, file) {
    if ([...appConstants.maker, ...appConstants.teamLead].includes(this.getUserRole())) {
      return this.createRequest("MerchantUpload", {fileType: userType}, file);
    }

    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const formData = new FormData();
        formData.append("image", file);
        const response = await axios.post(
          `/Admin/UpdateAgents?fileType=${userType}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  resolveDisputeAgent(file, disputeId) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const formData = new FormData();
        formData.append("image", file);
        console.log("file to upload: ", file);
        const response = await axios.post(
          `/Agent/ReceiptUpload?disputeId=${disputeId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  
  uploadSettlmentFile(processName, file, fileType) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const formData = new FormData();
        formData.append("image", file);
        console.log("file to upload: ", file);
        const response = await axios.post(
          `/Recon/UploadSettlement?type=${processName}&processName=${fileType}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }

  uploadMultiplUsers(file) {
    if ([...appConstants.maker].includes(this.getUserRole())) {
      return this.createRequest("BulkUserCreation", {fileType: "BulkUserCreation"}, file);
    }
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const formData = new FormData();
        formData.append("image", file);
        console.log("file to upload: ", file);
        const response = await axios.post(
          `/Account/AddMultipleUsers`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  userRejectDispute(disputeId, file) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const formData = new FormData();
        formData.append("image", file);
        const response = await axios.post(
          `/Dispute/CloseDispute?disputeId=${disputeId}&accepted=${false}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  getProcessByTeam(teamName) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(
          `/Admin/GetTeamProcesses?teamName=${teamName}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response);
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  changeUserAvailiability(userId, status) {
    if ([...appConstants.maker].includes(this.getUserRole())) {
      if (status) {
        return this.createRequest("UserEnable", {StaffId: userId});
      }
      return this.createRequest("UserDisable", {StaffId: userId});
    }

    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        // console.log(token);
        const response = await axios.post(
          `/Account/UserAvailability?userId=${userId}&status=${status}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  rejectRefund(reason = "", disputeId = "") {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(
          `/Recon/ApproveRequest?disputeId=${disputeId}&reason=${reason}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  acceptRefund(disputeId = "") {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        // console.log("token: ", token);
        const response = await axios.post(
          `/Recon/ApproveRequest?disputeId=${disputeId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  addUser(staffId, team, role) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(
          "/Account/AddUser",
          {
            staffId,
            team,
            role,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }

  ISOCaddUser(staffId, role) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get(
          `ISOC/CreateUser?staffId=${staffId}&role=${role}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }

  //api to add user to team
  /**
   *
   * @param {staffId} staff id to be added
   * @param { Team}  Team to add staff to
   */
  addUserToTeam({ StaffId, Team }) {
    if ([...appConstants.maker].includes(this.getUserRole())) {
      return this.createRequest("UserTeamChange", {StaffId: StaffId, Team: Team});
    }

    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(
          "/Account/AddUserToTeam",
          {
            StaffId,
            Team,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
        return error;
      }
    });
  }

  //api to get user details
  /**
   *
   * @param {id} user id to get user profile
   */
  getUserFullProfile(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get(
          `/Account/getUserDetails?userId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log(response);
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }

  getAllUsers() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get("/Admin/GetAllUsers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  getAllProcesses() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get("/Admin/GetAllProcesses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  getReconProcesses() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get("/Recon/GetReconProcesses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  getReconUserProcesses() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get("/Recon/GetUserReconProcesses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  getAllSettings() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get("/Admin/RetrieveSettings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  updateSettings(name = "", value = "") {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(
          `/Admin/SystemSetting?name=${name}&value=${value}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  viewSettlement(
    Date = "12/8/2020",
    SearchKeyword = "",
    ReconProcess = "Fund Transfer Verve and Mastercard",
    PageNumber = 0,
    FileType = "Switch"
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        console.log(token);

        const response = await axios.post(
          `/Recon/ViewSettlement`,
          {
            Date,
            SearchKeyword,
            ReconProcess,
            PageNumber,
            FileType,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        // console.log(error);
        this.logError(error);
        reject(error);
        
      }
    });
  }

  getSettlements(
    Date = "12/8/2020",
    SearchKeyword = "",
    ReconProcess = "Fund Transfer Verve and Mastercard",
    PageNumber = 0,
    FileType = "Switch"
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        // console.log(token);

        const response = await axios.post(
          `/Recon/ViewExceptions`,
          {
            Date,
            SearchKeyword,
            ReconProcess,
            PageNumber,
            FileType,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        // console.log(error);
        this.logError(error);
        reject(error);
        
      }
    });
  }

  downloadBulkFile(id, requestType) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get(`/ISOC/DownloadFileRequest?id=${id}`, 
         {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: 'arraybuffer',
          }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${requestType}${new Date().toISOString()}.xlsx`); //or any other extension
            document.body.appendChild(link);
            link.click();
        })
        .catch((error) => {
          // console.log(error)
          this.logError(error);
        });

        resolve("Ok");
      } catch (error) {
        // console.log(error);
        this.logError(error);
        reject(error);
        
      }
    });
  }
  
  downloadExceptionExcelFile(Status, FileType ,sentDate,ReconProcess) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(`/Recon/DownloadExcel`, 
        {
          Status,
          FileType,
          Date: sentDate,
          ReconProcess
        }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: 'arraybuffer',
          }).then((response) => {
            console.log("a", "here");
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${Status}${new Date().toISOString()}.xlsx`); //or any other extension
            document.body.appendChild(link);
            link.click();
        })
        .catch((error) => console.log(error));

        resolve(response.data);
      } catch (error) {
        // console.log(error);
        this.logError(error);
        reject(error);
        
      }
    });
  }

  downloadExcelFile(Status, FileType ,Date,ReconProcess) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        console.log(token);

        const response = await axios.post(
          `/Recon/DownloadExcel`,
          {
            Status,
            FileType,
            Date,
            ReconProcess
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        // console.log(error);
        this.logError(error);
        reject(error);
        
      }
    });
  }

  getFailedTransactions(
    Date = "12/8/2020",
    SearchKeyword = "",
    ReconProcess = "Fund Transfer Verve and Mastercard",
    PageNumber = 0,
    FileType = "Switch"
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        console.log(token);

        const response = await axios.post(
          `/Recon/ViewFailedTransactions`,
          {
            Date,
            SearchKeyword,
            ReconProcess,
            PageNumber,
            FileType,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        // console.log(error);
        this.logError(error);
        reject(error);
        
      }
    });
  }
  assignReconUserToProcess(processId, userID) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(
          `/Recon/AssignReconUser?processId=${processId}&userId=${userID}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  assignSingleProcess(teamId, processId) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(
          "/Admin/AssignProcess",
          {
            TeamId: teamId,
            ProcessIds: [processId],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  updateUserRole(StaffId, Role) {
    let response;
    
    if ([...appConstants.maker].includes(this.getUserRole())) {
      response = this.createRequest("UserRoleChange", {StaffId: StaffId, Role: Role});
      return response;
    }
    
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        
        if ([appConstants.admin[0]].includes(this.getUserRole())) {
          response = await axios.get(
            `ISOC/ModifyRole?staffId=${StaffId}&newRole=${Role}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
        else {
          response = await axios.post(
            "/Account/AddUserRole",
            {
              StaffId,
              Role,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }

  ISODupdateUserRole(StaffId, Role) {
    let response;
    
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        
        response = await axios.get(
          `ISOC/ModifyRole?staffId=${StaffId}&newRole=${Role}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }

  unAssignProcesses(TeamId, ProcessIds) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(
          "/Admin/UnAssignProcess",
          {
            TeamId,
            ProcessIds,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }
  getReport(reportType, dateFrom = "", dateTo = "", decisionType) {
    console.log(dateFrom, dateTo);
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get(
          `/Admin/GetReport?dateFrom=${dateFrom.trim()}&dateTo=${dateTo.trim()}&ReportType=${reportType}&DecisionType=${decisionType}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }

  //api to call expired report
  /**
   *
   * @param {date} date of expired dispute
   */
  expiredQueue(date = "") {
    console.log(date);
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(
          `Admin/GetExpiredQueue`,
          {
            date,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }

  validateStaffId(staffId) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get(
          `Account/ValidateStaffID?staffId=${staffId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }

  createRequest(requestType, postData, file=undefined) {  
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        let url = "ISOC/CreateRequest";
        
        let data = {
          RequestType: requestType,
          RequestData: JSON.stringify(postData),
        };
        
        if (file !== undefined) {
          data = new FormData();
          data.append("File", file);
          data.append("RequestType", requestType);
          data.append("RequestData", JSON.stringify(postData));
        }

        if (requestType === "MerchantUpload" || requestType == "BulkUserCreation") {
          url = `ISOC/CreateRequest?requestType=${requestType}`;
        }
        

        if ([...appConstants.admin,...appConstants.maker,...appConstants.teamLead,].includes(this.getUserRole())) {
          const response = await axios.post(
            `${url}`,
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          resolve(response.data);
        }

        reject("Not Authorized");
      } catch (error) {
        // console.log("reject error", error);
        this.logError(error);
        reject(error);
      }
    });
  }

  // --Added--
  sendComment(uniqueId, reason) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(
          `/dispute/SendComment`,
          {
            UniqueId: uniqueId,
            Reason: reason,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }

  // Added
  deleteProductRegister(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(
          `/deleteProductRegister?id=`+id,
          {
            id
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }

  // Get Dispute comments --Added--
  getDisputeComments(disputeId) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get(`/dispute/GetChat?disputeId=${disputeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }


  approveRequest(requestId) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();

        if ([...appConstants.checker, appConstants.admin[1], ...appConstants.teamLead].includes(this.getUserRole())) {
          const response = await axios.get(
            `ISOC/ApproveRequest?requestId=${requestId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          resolve(response.data);
        }

        reject("Not Authorized");
      } catch (error) {
        // console.log("reject error", error);
        startLoading(false);
        this.logError(error);
        reject(error);
        
        
      }
    });
  }

  deleteUser(StaffId, Role) {
    if ([...appConstants.maker].includes(this.getUserRole())) {
      return this.createRequest("UserDelete", {staffId: StaffId, Role: Role});
    }

    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        if ([appConstants.admin[0]].includes(this.getUserRole())) {
          const response = await axios.get(
            `ISOC/DeleteUser?staffId=${StaffId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          resolve(response.data);
        }
        // else if ([...appConstants.checker ,"Checker"].includes(this.getUserRole())) {
        //   const response = await axios.get(
        //     `/ISOC/DeleteUser?staffId=${StaffId}`,
        //     {
        //       headers: {
        //         Authorization: `Bearer ${token}`,
        //       },
        //     }
        //   );
        //   resolve(response.data);
        // }
        else {
          const response = await axios.post(
            "/Account/RemoveUser",
            {
              StaffId,
              Role,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          resolve(response.data);
        }
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }

  //remove user from a team
  /**
   *
   * @param {user} user Id's to remove from a team
   * @param {team} The team a user is been removed from.
   */
  removeUserFromTeam(user, team) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(
          `Account/RemoveUserFromTeam?userId=${user}&teamName=${team}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }

  //recon fund confirmation
  /**
   *
   * @param {disputeId} dispute id for reconcilation
   */
  reconRefund(disputeId) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        console.log(token);
        const response = await axios.post(
          `Recon/FundsConfirmation`,
          {
            DisputeId: disputeId,
            IsBulk: false,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }

  //recon fund confirmation
  /**
   *
   * @param {disputeId} dispute id for reconcilation
   */
  reconBulkRefund(disputeIds, isBulk) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        console.log(token);
        const response = await axios.post(
          `Recon/FundsConfirmation`,
          {
            DisputeId: disputeIds,
            IsBulk: isBulk,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response);
      } catch (error) {
        startLoading(false);
        this.logError(error);
        reject(error);
      }
    });
  }

  //Process reconcilaton team lead refund
  /**
   *
   * @param {ProcessName} ProcessName of feiled transactions
   * @param {date} SelectedDate of failed transaction to be resolved
   * @param {Ids} Ids of failed transaction to be resolved if SelectAll is false
   * @param {SelectAll} SelectAll transaction to resolve all transactions at once
   */
  processReconTeamLeadRefund(ProcessName, SelectedDate, Ids, SelectAll) {
    return new Promise(async (resolve, reject) => {
      try {
        const request = !SelectAll
          ? {
              ProcessName,
              Date: SelectedDate,
              SelectAll,
            }
          : {
              ProcessName,
              Date: SelectedDate,
              Ids,
            };
        const token = this.getToken();
        const response = await axios.post(`Recon/ProcessRefund`, request, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'arraybuffer',
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `TTUM${new Date().toISOString()}.xlsx`); //or any other extension
          document.body.appendChild(link);
          link.click();
          resolve(response);
      })
      .catch((error) => reject(error));
        resolve(response);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }

  
  
  /**
   *
   * @param {Ids} Ids id for resolved
   */
  sendServiceLog(Ids) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.post(
          `Admin/ClearServiceErrors`,
          Ids,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response);
      } catch (error) {
        startLoading(false);
        this.logError(error);
        reject(error);
      }
    });
  }
  
  /**
   *
   * 
   */
  getServiceLog() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get(
          `Admin/GetAllServiceErrors`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        startLoading(false);
        this.logError(error);
        reject(error);
      }
    });
  }

  // sprint II
  getCRMPending() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await sprint2Axios.get(
          `CRM/GetPending`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        startLoading(false);
        this.logError(error);
        reject(error);
      }
    });
  }

  reverseCRMCase(uniqueId) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await sprint2Axios.get(
          `CRM/Reverse?UniqueIdNumber=${uniqueId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        startLoading(false);
        this.logError(error);
        reject(error);
      }
    });
  }

  closeCRMCase(uniqueId) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await sprint2Axios.get(
          `CRM/Close?UniqueIdNumber=${uniqueId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        startLoading(false);
        this.logError(error);
        reject(error);
      }
    });
  }

  generateReversalList() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await sprint2Axios.get(`CRM/GenerateReversalList`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'arraybuffer',
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `CRM_Reversal_${new Date().toISOString()}.xlsx`); //or any other extension
          document.body.appendChild(link);
          link.click();
          resolve(response);
      })
      .catch((error) => {
        this.logError(error);
        reject(error);
      });
        resolve(response);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }

  searchUserPendingCases(searchQuery) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await sprint2Axios.get(
          `/CRM/SearchPendingCases?searchQuery=${searchQuery}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }

  getPendingReversalItems(processName) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await sprint2Axios.get(
          `/Recon/GetPendingReversalItems?process=${processName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }


  generateTransactionReversalList(processName) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await sprint2Axios.get(`Recon/GenerateTransactionReversalList?process=${processName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'arraybuffer',
        }).then((response) => {
          
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${processName}_${new Date().toISOString()}.xlsx`); //or any other extension
          document.body.appendChild(link);
          link.click();
          resolve(response);
      }).catch((error) => reject(error));
      } 
      catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }

  branchGetDispute(dispute) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await sprint2Axios.get(
          `/Branch/SearchPending?dispute=${dispute}`,
          {}
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }

  resolveDisputeBranch(disputeId, staffId, staffPassword ) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await sprint2Axios.post(
          `/Branch/FailedTransaction`,
          {
			  disputeId: disputeId,
			  staffId: staffId,
			  staffPassword: staffPassword,
		  },
          {}
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }

  //file, dispute.UniqueId, staffId, staffPassword
  branchDecline(file, disputeId, staffId, staffPassword) {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append("image", file);
        
        const response = await sprint2Axios.post(
          `/Branch/ReceiptUpload?disputeId=${disputeId}&staffId=${staffId}&staffPassword=${staffPassword}`,
          formData,
          {}
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
      }
    });
  }

  // generic get & post

  async getRequest(url, _axios=sprint2Axios, token=undefined){
      try {
        if(token == undefined) token = this.getToken();
        const response = await _axios.get(
          url,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response && response.data) {
          if (response.data.status) {
            this.showNotifiction("success", response.data.message);
          }
        }

        if (response && response.Status) {
          if (response.Status) {
            this.showNotifiction("success", response.Message);
          }
        }

        return response.data;
      } catch (error) {
        log("initial", error);
        if (error && error.response && error.response.status === 401) {
          // redirect to login
          window.location.href = "/login";
        }
        else {
          if (error && error.response) {
            this.logError(error);
            return error.response.data;
          }
          else {
            this.logError(error);
            return error;
          }
        }
      }
  }

  // Get product papers by date
  getProductPapersByDate(dateFrom = "", dateTo = "") {
    
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.getToken();
        const response = await axios.get(
          `/ExportProductRegisters?startdate=${dateFrom.trim()}&enddate=${dateTo.trim()}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        this.logError(error);
        reject(error);
        
      }
    });
  }

  postRequest(url, data, _axios=sprint2Axios, token=undefined) {
    return new Promise(async (resolve, reject) => {
      try {
        if (token == undefined) token = this.getToken();
        const response = await _axios.post(
          url,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response && response.data) {
          if (response.data.status) {
            this.showNotifiction("success", response.data.message);
          }
        }
        resolve(response.data);
      } catch (error) {
        startLoading(false);
        this.logError(error);
        log("initial", error);
        if (error && error.response && error.response.status === 401) {
          // redirect to login
          window.location.href = "/login";
        }
        else {
          if (error && error.response) {
            this.logError(error);
            reject(error.response.data)
          }
          else {
            this.logError(error);
            reject(error);
          }
        }
      }
    });
  }

  postRequestFile(url, data, _axios=sprint2Axios, token=undefined) {
    return new Promise(async (resolve, reject) => {
      let response = undefined;
      try {
        if (token == undefined) token = this.getToken();

        response = await axios.post(
          `${url}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response && response.data) {
          if (response.data.status) {
            this.showNotifiction("success", response.data.message);
          }
        }
        resolve(response.data);
        
      } catch (error) {
        log("initial", error);
        if (error && error.response && error.response.status === 401) {
          // redirect to login
          window.location.href = "/login";
        }
        else {
          if (error && error.response) {
            this.logError(error);
            reject(error.response.data)
          }
          else {
            this.logError(error);
            reject(error);
          }
        }
      }
    });
  }
  
  async getRequestExcelData(url, fileName, _axios=sprint2Axios, token=undefined){
    
    //return new Promise(async (resolve, reject) => {
      try {
        if (token == undefined) token = this.getToken();
        const response = await _axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'arraybuffer',
        }).then((response) => {
          try {
            const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${fileName}${new Date().toISOString()}.xlsx`); //or any other extension
          document.body.appendChild(link);
          link.click();
          return response;
          //resolve(response);
          }
          catch(err) {
            return err;
            //reject (err);
          }
          
        });
      } 
      catch (error) {
        log("initial", error);
        if (error && error.response && error.response.status === 401) {
          // redirect to login
          window.location.href = "/login";
        }
        else {
          if (error && error.response) {
            error = error.length > 0 ? error[0] : error
            //this.logError(error);
            this.showNotifiction("error", "Report could not be generated");
            return error.response.data;
            //reject(error.response.data)
          
          }
          else {
            this.showNotifiction("error", "Report could not be generated");
            //this.logError(error);
            return error;
            //reject(error);
          }
        }
        
      }
    //});
  }
}
export default new AppService();

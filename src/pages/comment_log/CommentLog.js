import React, { useState, useEffect } from "react";
import profile from "../../assets/images/profile.png";
import user from "../../assets/images/user.svg";
import AltDashboard from "../../hoc/AltDashboard";
import Dashboard from "../../hoc/Dashboard";
import { getParam } from "../../services/helpers";
import { urls } from "../../services/urls";
import * as actions from "../../actions";
import App from "../../services";
// const { default: Dashboard } = require("../hoc/Dashboard");
const {
  Header,
  BoxShadow,
  SummaryBox,
  Label,
  Input,
  Hr,
  Button,
} = require("../../custom");

function CommentLog() {
    const [agentId, setAgentId]  = useState("");
    const [staffId, setStaffId]  = useState("");
    const [commentLog, setCommentLog]  = useState("");
    const [currentComment, setCurrentComment]  = useState("");
    const [newCurrentComment, setNewCurrentComment]  = useState("");
    const [newComment, setNewComment]  = useState("");
    const [id, setId]  = useState(0);
  

    useEffect(() => {
        // startLoading(true);
        
        getDispute();
      }, []);

    const getDispute = () => {
        const _id = getParam("id");
        setId(_id);
        App.getRequest(urls.getDispute + _id).then(result => {
            if (result.Status) {
                setCommentLog(result.CommentLog);
                setCurrentComment(result.Reason);
            }
        })
    }
    
    const onSend = () => {
        const _comment = newCurrentComment;
        setNewCurrentComment("");
        App.postRequest(urls.sendComment, {Reason: _comment, UniqueId: id}).then(result => {
            if (result.Status) {
                setCommentLog(result.Result.CommentLog);
                setCurrentComment(result.Result.Reason);
            }
        })
    }

    return (
    <Dashboard>
      <div className="container">
        <Header>Comment Log</Header>
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
                  Bank User
                </h2>
                <span
                  style={{
                    textAlign: "center",
                    display: "block",
                    fontSize: 12,
                  }}
                >
                  {/* ID NO:  */}
                </span>
                <h6
                  className="my-2 font-weight-bold"
                  style={{ textAlign: "center", fontSize: 14 }}
                >
                  {/* Bank User */}
                </h6>
              </div>
            </BoxShadow>
            <BoxShadow
              className="account-profile-section py-4 d-flex justify-content-center align-items-center mt-5"
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
                  {/* Agent */}
                </h2>
                <span
                  style={{
                    textAlign: "center",
                    display: "block",
                    fontSize: 12,
                  }}
                >
                  {/* ID NO:  */}
                </span>
                <h6
                  className="my-2 font-weight-bold"
                  style={{ textAlign: "center", fontSize: 14 }}
                >
                  Agent
                </h6>
              </div>
              </BoxShadow>
          </div>
          <div className="col-md-8">
            <SummaryBox className="py-4 px-2">
                <div className="mb-5 pb-5" >
                    <section className="px-3 my-3">
                        <div className="mt-2" style={{whiteSpace: "pre-wrap"}}>
                            {commentLog}
                            <div>
                                {currentComment}
                            </div>
                        </div>
                    </section>
                </div>
              <Hr  className="mb-5"  />
              <div >
                <section className="px-3">
                    <div className="row col-md-12">
                    <div className="col-md-12">
                        <Label>New Comment</Label>
                        <Input 
                            value={newCurrentComment}
                            multiple={true} 
                            onChange={(e) => {
                                e.preventDefault();
                                setNewCurrentComment(e.target.value)
                            }} 
                        />
                    </div>
                    </div>
                    <div style={{ width: 120 }}>
                    <Button onClick={() => onSend()}>Send</Button>
                    </div>
                </section>
              </div>
            </SummaryBox>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default CommentLog;

import React, { useState } from "react";
import Dashboard from "../hoc/Dashboard";
import { SummaryBox, BoxShadow, Label, Input, Button, Select } from "../custom";
import { Link } from "react-router-dom";
// import { Editor } from "react-draft-wysiwyg";
import { Editor } from "@tinymce/tinymce-react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState } from "draft-js";
import App from "../services";
import * as actions from "../actions";
import { connect } from "react-redux";

function DraftEmail({ startLoading }) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [subject, setSubject] = useState("");
  const [mailType, setMailType] = useState("");
  const onEditorStateChange = (state) => {
    console.log(state);
    setEditorState(state);
  };

  const getHtml = () => {
    // const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    return editorState;
  };
  const saveEmail = async () => {
    const emailContent = getHtml();
    if (mailType.trim() === "") {
      return App.showNotifiction("info", "Please select email type");
    }
    if (subject.trim() === "") {
      return App.showNotifiction("info", "Subject is requred");
    }
    if (emailContent.trim() === "") {
      return App.showNotifiction("info", "Email content is requred");
    }

    try {
      startLoading(true);
      await App.saveEmail(mailType, subject, emailContent);
      startLoading(false);
      App.showNotifiction("success", "Email Template saved successfully");
      setMailType("");
      setSubject("");
      setEditorState(EditorState.createEmpty());
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };
  return (
    <Dashboard>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-12">
            <SummaryBox
              className=""
              style={{ maxHeight: "75vh", height: "75vh", overflowX: "hidden" }}
            >
              <div className="row h-100">
                <div className="col-md-2 h-100">
                  <BoxShadow className="bg-white h-100 py-5 d-flex align-items-center logs-menu">
                    <ul>
                      <li className="active">
                        <Link style={{ color: "#000" }} to="/draft-email">
                          Email Template
                        </Link>
                      </li>

                      <li>
                        <Link style={{ color: "#000" }} to="/emails">
                          Emails
                        </Link>
                      </li>

                      {/* <li>Reports</li> */}
                      {/* <li>Notification</li> */}
                    </ul>
                  </BoxShadow>
                </div>
                <div
                  className="col-md-10 py-3 px-5"
                  style={{ height: "100%", overflowY: "scroll" }}
                >
                  <div className="row">
                    <div className="col-md-12">
                      {mailType === "AgentToken" && (
                        <div class="alert alert-primary" role="alert">
                          <p>
                            <strong>Required Placeholders</strong>
                          </p>
                          <br />
                          {`{FirstName} & {token}`}
                        </div>
                      )}
                      {mailType === "User Available" && (
                        <div class="alert alert-primary" role="alert">
                          <p>
                            <strong>Required Placeholders</strong>
                          </p>
                          <br />
                          {`{FirstName} {Supervisor}`}
                        </div>
                      )}
                      {mailType === "User Not Available" && (
                        <div class="alert alert-primary" role="alert">
                          <p>
                            <strong>Required Placeholders</strong>
                          </p>
                          <br />
                          {`{FirstName} {Supervisor}`}
                        </div>
                      )}
                      {mailType === "SettlementReminder" && (
                        <div class="alert alert-primary" role="alert">
                          <p>
                            <strong>Required Placeholders</strong>
                          </p>
                          <br />
                          {`{FirstName}{Process}{LoginURL}`}
                        </div>
                      )}
                      {mailType === "NotifyAgent" && (
                        <div class="alert alert-primary" role="alert">
                          <p>
                            <strong>Required Placeholders</strong>
                          </p>
                          <br />
                          {`{FirstName},{Agent Account Number},{Agent Account Name},{Dispute Amount},{Date},{Transaction Reference},{Card Pan}&{Expiry Date},{DisputeLog},{RRR},{AgentId}`}
                        </div>
                      )}
                      {mailType === "AgentJournalDecline" && (
                        <div class="alert alert-primary" role="alert">
                          <p>
                            <strong>Required Placeholders</strong>
                          </p>
                          <br />
                          {` {FullName}{Account Number},{Amount},{Account Name},{PAN},{Reference},{Reason},
                          {ExpiryDate},{Date},{DisputeLog},{RRR},{LoginURL}&{AgentId}`}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <Label>Type</Label>
                      <Select
                        value={mailType}
                        onChange={(e) => setMailType(e.target.value)}
                      >
                        <option value="">Select type</option>
                        <option value="AgentToken">Agent Token</option>
                        <option value="User Available">User Available</option>
                        <option value="User Not Available">
                          User Not Available
                        </option>
                        <option value="NotifyAgent">Notify Agent</option>
                        <option value="AgentJournalDecline">
                          Agent Journal Decline
                        </option>
                        <option value="SettlementReminder">
                          Settlement Reminder
                        </option>
                      </Select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <Label>Subject</Label>
                      <Input
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <Label>Content</Label>
                      <div
                        style={{
                          height: 300,
                          overflowY: "scroll",
                          border: "1px solid #f3f3f3",

                          borderRadius: 4,
                        }}
                      >
                        <Editor
                          apiKey="k90umtx3945eb9gcxyq39jifjvi1xbn7hiycvor65cu6vdew"
                          init={{
                            height: 500,
                            menubar: false,
                            plugins: [
                              "advlist autolink lists link image charmap print preview anchor",
                              "searchreplace visualblocks code fullscreen",
                              "insertdatetime media table paste code help wordcount",
                            ],
                            toolbar: `undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | 
             bullist numlist outdent indent | removeformat | help`,
                          }}
                          onEditorChange={onEditorStateChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row py-3">
                    <div className="col-md-12">
                      <div className="d-flex w-100 justify-content-end">
                        <Button onClick={saveEmail} style={{ width: 170 }}>
                          Save
                        </Button>
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

export default connect(null, actions)(DraftEmail);

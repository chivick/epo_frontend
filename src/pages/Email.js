import React, { useState } from "react";
import Dashboard from "../hoc/Dashboard";
import { SummaryBox, BoxShadow, Button, Select, Label } from "../custom";
import { Link } from "react-router-dom";

import App from "../services";
import * as actions from "../actions";
import { connect } from "react-redux";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import draftToHtml from "draftjs-to-html";
import { EditorState, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";

function Email({ startLoading }) {
  const [mailType, setMailType] = useState("");
  const [mail, setMail] = useState(null);
  const getMails = async (e) => {
    try {
      startLoading(true);
      if (mailType.trim() === "")
        return App.showNotifiction("info", "Please select the Email type");
      const response = await App.getSavedEmail(mailType);
      console.log(response);
      setMail({
        Type: response.Type,
        Subject: response.Subject,
        Body: response.Body,
      });
      const blocksFromHtml = htmlToDraft(response.Body);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      const editorState = EditorState.createWithContent(contentState);

      setEditorState(editorState);

      // window.$("#content").load(response.Body);
      console.log(mail.Body);
      startLoading(false);
    } catch (error) {
      startLoading(false);
      App.logError(error);
    }
  };
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (state) => {
    setEditorState(state);
  };

  // const getHtml = () => {
  //   const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
  //   return html;
  // };
  return (
    <Dashboard>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-12">
            <SummaryBox
              className=""
              style={{
                // backgroundColor: "#f3f3f3",
                maxHeight: "75vh",
                height: "75vh",
                overflowX: "hidden",
              }}
            >
              <div className="row h-100">
                <div className="col-md-2 h-100">
                  <BoxShadow className="bg-white h-100 py-5 d-flex align-items-center logs-menu">
                    <ul>
                      <li className="">
                        <Link style={{ color: "#000" }} to="/draft-email">
                          Email Template
                        </Link>
                      </li>

                      <li className="active">
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
                    <div className="col-md-8">
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
                      </Select>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex h-100 align-items-center">
                        <Button
                          style={{ maxWidth: 170, height: 40 }}
                          onClick={getMails}
                        >
                          Get Mail
                        </Button>
                      </div>
                    </div>
                  </div>
                  {mail && (
                    <div className="row py-3">
                      <div className="col-md-10">
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
                            editorState={editorState}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={onEditorStateChange}
                            placeholder="Type content..."
                          />
                        </div>
                      </div>
                    </div>

                    // <div className="row py-3">
                    //   <div className="col-md-10">
                    //     <SummaryBox
                    //       style={{
                    //         padding: "16px 8px",
                    //         maxHeight: 400,
                    //         overflowY: "scroll",
                    //         // height: "400px",
                    //         position: "relative",
                    //         justifyContent: "initial",
                    //       }}
                    //     >
                    //       <Header
                    //         style={{
                    //           fontSize: 10,
                    //           marginTop: 4,
                    //           marginBottom: 8,
                    //         }}
                    //       >
                    //         Email Suject
                    //       </Header>
                    //       <span
                    //         className="my-2"
                    //         style={{
                    //           fontSize: 14,
                    //           color: "#aebac9",
                    //         }}
                    //       >
                    //         {mail.Subject}
                    //       </span>
                    //       <Header
                    //         style={{
                    //           fontSize: 10,
                    //           marginTop: 4,
                    //           marginBottom: 8,
                    //         }}
                    //       >
                    //         Email Type
                    //       </Header>
                    //       <span
                    //         className="my-2"
                    //         style={{
                    //           fontSize: 14,
                    //           color: "#aebac9",
                    //         }}
                    //       >
                    //         {mail.Type}
                    //       </span>
                    //       <Header
                    //         style={{
                    //           fontSize: 10,
                    //           marginTop: 4,
                    //           marginBottom: 8,
                    //         }}
                    //       >
                    //         Email Content
                    //       </Header>
                    //       <div
                    //         id="content"
                    //         className="py-2"
                    //         dangerouslySetInnerHTML={{ __html: mail.Body }}
                    //       ></div>
                    //     </SummaryBox>
                    //   </div>
                    // </div>
                  )}
                </div>
              </div>
            </SummaryBox>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default connect(null, actions)(Email);

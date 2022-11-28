import React, { useEffect } from "react";
import Dashboard from "../hoc/Dashboard";
import { SummaryBox, BoxShadow, Header } from "../custom";
import { Link } from "react-router-dom";
import App from "../services";
import { connect } from "react-redux";
import * as actions from "../actions";
import FTPNav from "./FTPNav";

function MailLog({ startLoading }) {
  //   const [mailLog, setMailLog] = useState([]);
  useEffect(() => {
    const getAllSettings = async () => {
      try {
        startLoading(true);
        const response = await App.getAllLog();
        console.log(response);
        // setMailLog(response.MailLog);
        startLoading(false);
        window.$("#example").DataTable({
          data: response.MailLog,
          columns: [
            {
              title: "Email Address",
              render: (data, type, row, meta) => {
                if (type === "display") {
                  return row.EmailAddress;
                }
                return row.EmailAddress;
              },
              responsivePriority: 1000,
            },
            {
              title: "Message",
              render: (data, type, row, meta) => {
                if (type === "display") {
                  return row.Message;
                }
                return row.Message;
              },
              responsivePriority: 2,
            },
            {
              title: "Date Sent",
              render: (data, type, row, meta) => {
                if (type === "display") {
                  return App.convertToTimeString(row.DateSent);
                }
                return App.convertToTimeString(row.DateSent);
              },
              responsivePriority: 5,
            },
          ],
          dom: "Bfrtip",
          buttons: [
            "copy",
            "csv",
            "excel",
            {
              extend: "pdfHtml5",
              orientation: "landscape",
              pageSize: "LEGAL",
            },
            {
              extend: "print",
              orientation: "landscape",
              pageSize: "LEGAL",
            },
          ],
          responsive: true,
          bDestroy: true,
        });
      } catch (error) {
        startLoading(false);
        App.logError(error);
      }
    };
    getAllSettings();
  }, [startLoading]);

  return (
    <Dashboard>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-12">
            <SummaryBox
              className=""
              style={{ maxHeight: "75vh", height: "75vh", overflowX: "hidden" }}
            >
              <div className="row h-100">
                <div className="col-md-2 h-100">
                  <BoxShadow className="bg-white h-100 py-5 d-flex align-items-center logs-menu">
                    <FTPNav />
                  </BoxShadow>
                </div>
                <div
                  className="col-md-10"
                  style={{ height: "100%", overflowY: "scroll" }}
                >
                  <div className="px-1 py-2">
                    <Header className="mb-2">Mail Logs</Header>
                  </div>
                  <div className="row px-2 py-2">
                    <div className="col-md-12">
                      <table
                        id="example"
                        className="table table-striped display responsive nowrap w-100 table-bordered"
                      ></table>
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

export default connect(null, actions)(MailLog);

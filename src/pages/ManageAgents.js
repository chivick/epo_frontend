import React, { useEffect } from "react";
import Dashboard from "../hoc/Dashboard";
import { Header, SummaryBox } from "../custom";
import { connect } from "react-redux";
import * as actions from "../actions";
import App from "../services";

function ManageAgents({ startLoading }) {
  useEffect(() => {
    async function getUsers() {
      try {
        startLoading(true);
        const response = await App.getAllAgents();
        console.log(response);
        startLoading(false);
        window.$("#example").DataTable({
          data: response,
          columns: [
            {
              title: "Agent ID",
              render: (data, type, row, meta) => {
                if (type === "display") {
                  return `<span style="width: 90%; display:block; line-break:anywhere">${row.AgentId}</span>`;
                }
                return `<span style="width: 90%; display:block;line-break:anywhere">${row.AgentId}</span>`;
              },
              responsivePriority: 1000,
            },
            {
              title: "Email",
              render: (data, type, row, meta) => {
                if (type === "display") {
                  return row.Email;
                }
                return row.Email;
              },
              responsivePriority: 2,
            },

            {
              title: "Account Name",
              render: (data, type, row, meta) => {
                if (type === "display") {
                  return `<span style="width:80%;display:block;">${row.AccountName}</span>`;
                }
                return `<span style="width:80%; display:block">${row.AccountName}</span>`;
              },
              responsivePriority: 5,
            },
            {
              title: "Account Number",
              render: (data, type, row, meta) => {
                if (type === "display") {
                  return row.AccountNumber;
                }
                return row.AccountNumber;
              },
              responsivePriority: 5,
            },
            {
              title: "Phone Number",
              render: (data, type, row, meta) => {
                if (type === "display") {
                  return row.PhoneNumber;
                }
                return row.PhoneNumber;
              },
              responsivePriority: 5,
            },
            // {
            //   title: "Relationship Email",
            //   render: (data, type, row, meta) => {
            //     if (type === "display") {
            //       return row.RelationshipEmail;
            //     }
            //     return row.RelationshipEmail;
            //   },
            //   responsivePriority: 5,
            // },

            {
              title: "Role",
              render: (data, type, row, meta) => {
                if (type === "display") {
                  return row.Role;
                }
                return row.Role;
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
    }
    getUsers();
  }, [startLoading]);

  return (
    <Dashboard>
      <div className="container-fluid pb-4">
        <Header>Agents &amp; Mechants</Header>
        <div className="col-md-12">
          <SummaryBox style={{ padding: "16px" }}>
            <div className="row py-3 pr-3">
              <div className="col-md-12" style={{ overflowX: "scroll" }}>
                <table
                  id="example"
                  className="logs-table"
                  style={{ width: "100%" }}
                ></table>
              </div>
            </div>
          </SummaryBox>
        </div>
      </div>
    </Dashboard>
  );
}

export default connect(null, actions)(ManageAgents);

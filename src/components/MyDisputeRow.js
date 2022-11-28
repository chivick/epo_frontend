import React from "react";
import eye from "../assets/images/eye.png";
import { BlueIndicator, RedIndicator } from "../custom";

function MyDisputeRow({
  id,
  bank,
  company,
  channel,
  status = "",
  date,
  onViewUserClick,
}) {
  return (
    <tr>
      <td>{id}</td>
      <td>{bank}</td>
      <td>{company}</td>
      <td>{channel}</td>
      <td>
        {status.trim().toLowerCase() === "resolved" ? (
          <span className="d-flex">
            <BlueIndicator />
            <span className="ml-1"> {status}</span>
          </span>
        ) : (
          <span className="d-flex">
            <RedIndicator />
            <span className="ml-1"> {status}</span>
          </span>
        )}
      </td>
      <td>{date}</td>
      <td colSpan="2" onClick={onViewUserClick}>
        <img src={eye} alt="view" className="table-action" />
      </td>
    </tr>
  );
}

export default MyDisputeRow;

import React from "react";
import eye from "../assets/images/eye.png";
import check from "../assets/images/check.svg";

function DisputeRow({ id, bank, company, channel, onViewUserClick }) {
  return (
    <tr>
      <td>{id}</td>
      <td>{bank}</td>
      <td>{company}</td>
      <td>{channel}</td>
      <td colSpan="2" onClick={onViewUserClick}>
        <img src={eye} alt="view" className="table-action" />
      </td>
      <td colSpan="2">
        <img src={check} alt="view" className="table-action" />
      </td>
    </tr>
  );
}

export default DisputeRow;

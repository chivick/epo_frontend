import React from "react";

function LogRow({ status, type, date }) {
  return (
    <tr>
      <td style={{ fontSize: 11 }}>{status}</td>
      <td style={{ fontSize: 11 }}>{type}</td>
      <td style={{ fontSize: 11 }}>{date}</td>
    </tr>
  );
}

export default LogRow;

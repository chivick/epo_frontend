import React from "react";

function CusotmLogRow({ status, type, details, date, onClick }) {
  return (
    <tr style={{ cursor: "pointer" }} onClick={onClick}>
      <td>{status}</td>
      <td>{type}</td>
      <td>{details}</td>
      <td>{date}</td>
    </tr>
  );
}

export default CusotmLogRow;

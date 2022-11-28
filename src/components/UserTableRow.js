import React from "react";
import deleteicon from "../assets/images/delete.svg";
import eye from "../assets/images/eye.png";
import setting from "../assets/images/settings.svg";
import App from "../services";
import { appConstants } from "../services/helpers";

function UserTableRow({
  userId,
  fullName,
  email,
  phoneNumber,
  city,
  teamLead,
  onViewUserClick,
  changeUserRole,
  showControl = true,
  className,
  deleteUserClick,
}) {
  return (
    <tr className={`${className}`}>
      <td>{userId}</td>
      <td>{fullName}</td>
      <td>{email}</td>
      <td>{phoneNumber}</td>
      {className !== "resolution-table-row" ? (
        <>
          <td>{city}</td>
          <td>{teamLead}</td>
        </>
      ) : null}
      <td className="mr-1" colSpan="2">
        {
          [...appConstants.maker].includes(App.getUserRole()) &&
          <img
            src={setting}
            onClick={changeUserRole}
            alt="settings"
            className="table-action"
          />
        }
      </td>
      {className !== `resolution-table-row` ? (
        <>
          {showControl &&  (
            <td className="mr-1" colSpan="2" onClick={onViewUserClick}>
              <img src={eye} alt="view" className="table-action" />
            </td>
          )}
          {showControl && [...appConstants.maker, appConstants.admin[0]].includes(App.getUserRole()) && (
            <td onClick={deleteUserClick} className="mr-1" colSpan="2">
              <img src={deleteicon} alt="delete" className="table-action" />
            </td>
          )}
        </>
      ) : null}
    </tr>
  );
}

export default UserTableRow;

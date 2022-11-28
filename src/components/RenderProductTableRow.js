import React from "react";
import deleteicon from "../assets/images/delete.svg";
import eye from "../assets/images/eye.png";
import setting from "../assets/images/settings.svg";
import App from "../services";
import { appConstants } from "../services/helpers";

function RenderProductTableRow(props) {
  const {
    ProductPaperName,
    DigitalChannel,
    ProductLaunchDate,
    ProductExpiryDate,
    OperationalStatus,
  } = props.item;
  
  return (
    <tr className={`resolution-table-row`}>
      <td>{ProductPaperName}</td>
      <td>{DigitalChannel}</td>
      <td>{ProductLaunchDate}</td>
      <td>{ProductExpiryDate}</td>
      <td>{OperationalStatus}</td>
      {(
        <>
          {(
            <td className="mr-1" colSpan="2" onClick={props.onViewUserClick}>
              <img src={eye} alt="view" className="table-action" />
            </td>
          )}
          {/* <td onClick={props.onDelete} className="mr-1" colSpan="2">
            <img src={deleteicon} alt="delete" className="table-action" />
          </td> */}
        </>
      )}
    </tr>
  );
}

export default RenderProductTableRow;

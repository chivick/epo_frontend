import React from "react";
import deleteicon from "../assets/images/delete.svg";
import eye from "../assets/images/eye.png";
import setting from "../assets/images/settings.svg";
import App from "../services";
import { appConstants } from "../services/helpers";

function RenderEntityItem(props) {
  const {
    Name,
    DigitalChannel,
    Desc,
  } = props.item;
  
  return (
    <tr className={`resolution-table-row`}>
      <td>{Name ?? "n/a"}</td>
      <td>{Desc ?? "n/a"}</td>
      {(
        <>
          <td onClick={props.onDelete} className="mr-1" colSpan="2">
            <img src={deleteicon} alt="delete" className="table-action" />
          </td>
        </>
      )}
    </tr>
  );
}

export default RenderEntityItem;

import React from "react";
import deleteicon from "../assets/images/delete.svg";
import eye from "../assets/images/eye.png";
import setting from "../assets/images/settings.svg";
import App from "../services";
import { log } from "../services/helpers";

export default function TableRow({
  opts,
  className,
  action=[],
  onAction=undefined,
}) {
  // onaction returns value for use by parent
  return (
    <tr className={`${className}`}>
       {
         opts.map((row, index) => {
          return <td>{row}</td>
         })
       }
       {
         action.map((row, index) => {
          return (<td onClick={() => {
            onAction && onAction(index);
          }}>{row}</td>)
         })
       }
    </tr>
  );
}

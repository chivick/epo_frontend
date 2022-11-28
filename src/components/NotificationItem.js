import React from "react";

function NotificationItem({ title, details, time, isRead }) {
  return (
    <li
      className={`d-flex justify-content-between px-2 mb-2 ${
        isRead ? "" : "unread-notification"
      }`}
    >
      <div>
        <h3 className="notfi-title">{title}</h3>
        <h5 className="notfi-details">{details}</h5>
      </div>
      <div className="d-flex align-items-center">
        <span className="notfi-time">{time}</span>
      </div>
    </li>
  );
}

export default NotificationItem;

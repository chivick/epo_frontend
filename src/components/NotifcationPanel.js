import React, { useState, useEffect } from "react";
import { ListShadowed } from "../custom";
import NotificationItem from "./NotificationItem";
import App from "../services";

function NotificationPanel() {
  const [notifications, setNotifications] = useState([
    {
      title: "Lorem ipsum dolor sit amet",
      details: "Lorem ipsum dolor sit amet consetetur",
      time: "12 minutes ago",
    },
  ]);
  useEffect(() => {
    const notificationDt = JSON.parse(
      App.getFromLocalStorage("fb-notification")
    );
    setNotifications(() => [...notificationDt]);
  }, [setNotifications]);
  return (
    <div className="notification-wrapper">
      <ListShadowed className="notification-panel">
        <li className="d-flex justify-content-between px-3 py-2">
          <span className="color-gray">Notifications</span>
          <span className="color-black">Mark all as read</span>
        </li>
        {notifications.map((item, i) => (
          <NotificationItem
            title={item.title}
            details={item.details}
            time="12 minutes ago"
            isRead={item.isRead}
          />
        ))}
      </ListShadowed>
    </div>
  );
}

export default NotificationPanel;

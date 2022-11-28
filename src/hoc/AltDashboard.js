import React from "react";
import NavBar from "../components/NavBar";
import { DasboardSection, NavIconWrapper } from "../custom";
import logout from "../assets/images/logout.svg";
import settings from "../assets/images/settings.svg";
import { Link } from "react-router-dom";

function AltDashboard({ children }) {
  return (
    <DasboardSection>
      <NavBar />
      {children}
      <section
        style={{ position: "absolute", bottom: 16, left: 10, zIndex: 20 }}
      >
        <div className="d-flex">
          <div
            className="d-flex align-items-center mr-3"
            style={{ cursor: "pointer" }}
          >
            <NavIconWrapper>
              <img src={logout} alt="logout" className="nav-icons" />
            </NavIconWrapper>
            <span style={{ color: "#022E64" }}>Logout</span>
          </div>
          <Link to="/settings">
            <div
              className="d-flex align-items-center "
              style={{ cursor: "pointer" }}
            >
              <NavIconWrapper>
                <img src={settings} alt="settings" className="nav-icons" />
              </NavIconWrapper>
              <span style={{ color: "#022E64" }}>Settings</span>
            </div>
          </Link>
        </div>
      </section>
    </DasboardSection>
  );
}

export default AltDashboard;

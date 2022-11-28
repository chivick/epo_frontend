import React from "react";
import NavBar from "../components/NavBar";
import { DasboardSection } from "../custom";
import BranchNavBar from "../components/BranchNavBar";

function Dashboard(props) {
  return (
    <DasboardSection style={{ position: "relative" }}>
      {
         props && props.Nav && props.Nav.toLowerCase() == "branch" ?
        <BranchNavBar />
        :
        <NavBar />
      }
      {props.children}
    </DasboardSection>
  );
}

export default Dashboard;

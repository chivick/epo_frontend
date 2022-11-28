import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./hoc/layout";
import Root from "./Root";

function AppRoot() {
  return (
    <div>
      <Router>
        {/* <Navbar /> */}
        <Layout>
          <Root />
        </Layout>
      </Router>
    </div>
  );
}

export default AppRoot;

import React from "react";

import { Route, Redirect } from "react-router-dom";
import App from "../services";
import { log } from "../services/helpers";

// const AuthRoute = ({ component: Component, userLevel, ...rest }) => {
//   log("initial", "userlel", userLevel, App.isAuthenticated(), App.getUserRole())
//   if (!Array.isArray(userLevel)) {
//     userLevel = [userLevel]
//   }
//   return (<Route
//     {...rest}
//     render={(props) =>
//       App.isAuthenticated() ? (
//         userLevel ? (
//           userLevel.includes(App.getUserRole()) ? (
//             <Component {...props} />
//           ) : (
//             <Redirect to="/login" {...props} />
//           )
//         ) : (
//           <Component {...props} />
//         )
//       ) : (
//         <Redirect to="/login" {...props} />
//       )
//     }
//   />)
//   };


const AuthRoute = ({ component: Component, userLevel, ...rest }) => {
  log("initial", "userlel", userLevel, App.isAuthenticated(), App.getUserRole())
  if (!Array.isArray(userLevel)) {
    userLevel = [userLevel]
  }
  return (<Route
    {...rest}
    render={(props) => (<Component {...props} />)
    }
  />)
  };

export default AuthRoute;
